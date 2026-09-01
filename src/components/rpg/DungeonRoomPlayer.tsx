"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Heart,
  Zap,
  Sparkles,
  Shield,
  Lightbulb,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Swords,
  Crown,
  Trophy,
  Hourglass,
  Gem,
  Flame,
} from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";
import { UNIVERSAL_SPELLS, CLASS_SPELLS } from "@/lib/rpg/spells";
import { getClassConfig } from "@/lib/rpg/classes";
import { submitDungeonRoomAnswerAction, completeDungeonAction, useSpellAction } from "@/app/actions/game";
import PixelSprite from "./PixelSprite";
import MentorDialogue from "./MentorDialogue";

interface CardData {
  id: string;
  type_question: string;
  question_fr: string;
  contexte_clinique?: string | null;
  options_json: string;
  reponse_correcte: string;
  feedback_fr: string;
  mnemonique_rappel?: string | null;
  reference: string;
  niveau_difficulte: number;
  tags?: string | null;
  room_number?: number;
  room_type?: string | null;
}

interface DungeonRoomPlayerProps {
  lessonId: string;
  lessonTitle: string;
  cards: CardData[];
  userClass?: string;
  userHp?: number;
  userMana?: number;
  userGems?: number;
  isBossDungeon?: boolean;
  bossName?: string | null;
  bossAvatar?: string | null;
}

export default function DungeonRoomPlayer({
  lessonId,
  lessonTitle,
  cards,
  userClass = "clerc",
  userHp = 100,
  userMana = 100,
  userGems = 50,
  isBossDungeon = false,
  bossName = "Gardien de l'Ignorance",
  bossAvatar = "💀",
}: DungeonRoomPlayerProps) {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [hp, setHp] = useState(userHp);
  const [mana, setMana] = useState(userMana);
  const [gems, setGems] = useState(userGems);

  // Événements de combat
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctRoomsCount, setCorrectRoomsCount] = useState(0);
  const [isDoorTransition, setIsDoorTransition] = useState(false);

  // Association & Ordre
  const [associationPairs, setAssociationPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  // Sorts
  const [isSpellDrawerOpen, setIsSpellDrawerOpen] = useState(false);
  const [classSpellUsed, setClassSpellUsed] = useState(false);
  const [damageImmunity, setDamageImmunity] = useState(false);

  // Fin de donjon
  const [isFinished, setIsFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);

  const currentCard = cards[currentRoomIndex] || cards[0];
  const classConfig = getClassConfig(userClass);
  const totalRooms = cards.length;
  const isLastRoom = currentRoomIndex === totalRooms - 1;

  // Parser les options JSON
  let parsedOptions: any = [];
  try {
    parsedOptions = JSON.parse(currentCard.options_json || "[]");
  } catch {
    parsedOptions = [];
  }

  // Initialisation de l'ordre pour les questions de type ORDRE
  useEffect(() => {
    if (currentCard?.type_question === "ORDRE" && Array.isArray(parsedOptions)) {
      setOrderedItems([...parsedOptions]);
    } else {
      setOrderedItems([]);
    }
    setSelectedOption(null);
    setEliminatedOptions([]);
    setRevealedHint(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setAssociationPairs({});
    setSelectedLeft(null);
  }, [currentRoomIndex, currentCard]);

  // Lancer un sort universel
  const handleCastUniversalSpell = async (spellId: string) => {
    const spell = UNIVERSAL_SPELLS[spellId];
    if (!spell) return;

    if (mana < spell.manaCost) {
      playRetroSound("wrong");
      return;
    }

    playRetroSound("correct");
    setMana((prev) => Math.max(0, prev - spell.manaCost));
    await useSpellAction(spellId, spell.manaCost);

    if (spell.effectType === "fifty_fifty") {
      if (Array.isArray(parsedOptions) && parsedOptions.length > 2) {
        const wrongOpts = parsedOptions.filter((o: any) => !o.is_correct && !eliminatedOptions.includes(o.id));
        if (wrongOpts.length > 0) {
          const toEliminate = wrongOpts.slice(0, 2).map((o: any) => o.id);
          setEliminatedOptions((prev) => [...prev, ...toEliminate]);
        }
      }
    } else if (spell.effectType === "hint_light") {
      setRevealedHint(currentCard.tags || "Règle clé : Vérifie la sémiologie fondamentale au lit du patient.");
    } else if (spell.effectType === "show_mnemonic") {
      setRevealedHint(currentCard.mnemonique_rappel || "Mnémonique : P-I-E-D / A-P-T-M");
    } else if (spell.effectType === "restore_hp") {
      setHp((prev) => Math.min(100, prev + 25));
    }
  };

  // Lancer le sort spécial de classe
  const handleCastClassSpell = () => {
    if (classSpellUsed) return;
    setClassSpellUsed(true);
    playRetroSound("victory");

    if (userClass === "clerc" || userClass === "alchimiste") {
      // Élimine une mauvaise option
      if (Array.isArray(parsedOptions)) {
        const wrongOpt = parsedOptions.find((o: any) => !o.is_correct && !eliminatedOptions.includes(o.id));
        if (wrongOpt) setEliminatedOptions((prev) => [...prev, wrongOpt.id]);
      }
    } else if (userClass === "moine" || userClass === "gardien") {
      setDamageImmunity(true);
    } else if (userClass === "enchanteuse") {
      setHp((prev) => Math.min(100, prev + 30));
    }
  };

  // Valider la réponse de la salle
  const handleCheckAnswer = async () => {
    if (isAnswerSubmitted || isSubmitting) return;

    let correct = false;

    if (currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") {
      if (!selectedOption) return;
      if (Array.isArray(parsedOptions)) {
        const matched = parsedOptions.find((o: any) => o.id === selectedOption);
        correct = matched ? !!matched.is_correct : false;
      }
    } else if (currentCard.type_question === "VRAI_FAUX") {
      if (!selectedOption) return;
      correct = currentCard.reponse_correcte.toLowerCase() === selectedOption.toLowerCase();
    } else if (currentCard.type_question === "ORDRE") {
      correct = JSON.stringify(orderedItems) === currentCard.reponse_correcte;
    } else if (currentCard.type_question === "ASSOCIATION") {
      let targetObj: any = {};
      try {
        targetObj = JSON.parse(currentCard.reponse_correcte);
      } catch {}
      correct = JSON.stringify(associationPairs) === JSON.stringify(targetObj);
    }

    setIsAnswerSubmitted(true);
    setIsCorrect(correct);

    // Calcul des dégâts et gains
    let hpDelta = 0;
    if (correct) {
      setCorrectRoomsCount((prev) => prev + 1);
      setMana((prev) => Math.min(200, prev + 20));
      playRetroSound("correct");
    } else {
      if (!damageImmunity) {
        hpDelta = currentCard.niveau_difficulte >= 3 ? 25 : 15;
        setHp((prev) => Math.max(0, prev - hpDelta));
      } else {
        setDamageImmunity(false); // Immunité consommée
      }
      playRetroSound("wrong");
    }

    setIsSubmitting(true);
    try {
      const res = await submitDungeonRoomAnswerAction({
        cardId: currentCard.id,
        isSuccess: correct,
        difficulty: currentCard.niveau_difficulte,
        lessonId,
        roomNumber: currentRoomIndex + 1,
      });

      if (res.isDead && !damageImmunity) {
        setIsGameOver(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Passer à la salle suivante avec animation de porte
  const handleNextRoom = async () => {
    if (isLastRoom) {
      // Fin du donjon
      setIsSubmitting(true);
      const res = await completeDungeonAction(lessonId, correctRoomsCount + (isCorrect ? 1 : 0), totalRooms);
      setCompletionResult(res);
      setIsFinished(true);
      setIsSubmitting(false);
      playRetroSound("victory");
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } else {
      // Transition de porte
      setIsDoorTransition(true);
      playRetroSound("click");
      setTimeout(() => {
        setCurrentRoomIndex((prev) => prev + 1);
        setIsDoorTransition(false);
      }, 500);
    }
  };

  // Écran Game Over (PV = 0)
  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-bounce-short">
        <div className="w-20 h-20 rounded-3xl bg-rose-950/80 border-2 border-rose-600 flex items-center justify-center text-4xl shadow-2xl shadow-rose-950/80 ring-4 ring-rose-500/20">
          💀
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-rose-400">Épuisement Clinique !</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Tes points de vie sont tombés à zéro face aux pièges de ce donjon. Prends une potion ou repose-toi avant de retenter ta chance.
          </p>
        </div>

        <div className="w-full space-y-3 pt-2">
          <button
            onClick={() => {
              setHp(100);
              setIsGameOver(false);
              playRetroSound("correct");
            }}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Boire une Potion de Réveil (100 PV)</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-2xl flex items-center justify-center text-xs transition-colors"
          >
            Retourner au Sanctuaire
          </Link>
        </div>
      </div>
    );
  }

  // Écran de Victoire Finale
  if (isFinished) {
    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-bounce-short">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/30 ring-4 ring-amber-400/20">
          🏆
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
            <Crown className="w-3.5 h-3.5" />
            <span>Donjon Purifié</span>
          </div>
          <h2 className="text-2xl font-black text-white">{lessonTitle}</h2>
          <p className="text-xs text-slate-400">
            Toutes les salles ont été franchies avec une précision de{" "}
            <strong className="text-amber-400">{completionResult?.accuracy || 100}%</strong> !
          </p>
        </div>

        {/* Butin récolté */}
        <div className="grid grid-cols-2 gap-3 w-full bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">XP Gagnés</span>
            <div className="text-lg font-black text-indigo-400 flex items-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 fill-indigo-400" />
              <span>+{completionResult?.xpEarned || 25} XP</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Gemmes Récoltées</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1 mt-0.5">
              <Gem className="w-4 h-4 fill-amber-400" />
              <span>+{completionResult?.gemsEarned || 10}</span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider"
        >
          <Crown className="w-4 h-4" />
          <span>Continuer l&apos;Aventure</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 relative">
      {/* 1. BARRE SUPÉRIEURE DE COMBAT RPG (PV, MANA, GEMMES, SALLE) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-4 shadow-xl backdrop-blur space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Jauge de PV */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black">
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>{hp} / 100 PV</span>
              </span>
              {damageImmunity && (
                <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                  🛡️ Bouclier
                </span>
              )}
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${hp}%` }}
              />
            </div>
          </div>

          {/* Jauge de Mana */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black">
              <span className="text-indigo-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-indigo-400" />
                <span>{mana} / 200 Mana</span>
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(mana / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Gemmes */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-400 shrink-0">
            <Gem className="w-3.5 h-3.5 fill-amber-400" />
            <span>{gems}</span>
          </div>

          {/* Quitter */}
          <Link
            href="/"
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
          >
            ✕
          </Link>
        </div>

        {/* Indicateur de Salle */}
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-800/80 pt-2">
          <span>
            Salle {currentRoomIndex + 1} sur {totalRooms}
          </span>
          <span className="text-amber-400">
            {isLastRoom ? "💀 Gardien du Donjon" : "🚪 Couloir Sémiologique"}
          </span>
        </div>
      </div>

      {/* 2. TRANSITION ANIMÉE DE PORTE */}
      {isDoorTransition && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center space-y-3 rounded-3xl animate-pulse">
          <div className="text-5xl animate-bounce">🚪</div>
          <div className="text-xs font-black uppercase tracking-widest text-amber-400">
            Ouverture de la porte suivante...
          </div>
        </div>
      )}

      {/* 3. VIGNETTE CLINIQUE OU CONTEXTE DE LA SALLE */}
      {currentCard.contexte_clinique && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1.5 shadow-md">
          <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cas Clinique au Lit du Malade</span>
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            {currentCard.contexte_clinique}
          </p>
        </div>
      )}

      {/* 4. QUESTION & OPTIONS DE LA SALLE */}
      <div className="card-rpg space-y-5">
        <h3 className="text-base md:text-lg font-black text-white leading-snug">
          {currentCard.question_fr}
        </h3>

        {/* Indice révélé via sort */}
        {revealedHint && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{revealedHint}</span>
          </div>
        )}

        {/* Rendu des Questions : QCM & CAS CLINIQUE */}
        {(currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") && (
          <div className="space-y-2.5">
            {parsedOptions.map((opt: any) => {
              const isEliminated = eliminatedOptions.includes(opt.id);
              const isSelected = selectedOption === opt.id;

              if (isEliminated) {
                return (
                  <div
                    key={opt.id}
                    className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900 text-slate-600 line-through text-xs font-medium cursor-not-allowed"
                  >
                    {opt.text}
                  </div>
                );
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    setSelectedOption(opt.id);
                    playRetroSound("click");
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-xs md:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/10 text-white shadow-lg shadow-amber-500/10"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span>{opt.text}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected
                        ? "border-amber-400 bg-amber-400 text-slate-950 font-black"
                        : "border-slate-700 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Rendu des Questions : VRAI / FAUX */}
        {currentCard.type_question === "VRAI_FAUX" && (
          <div className="grid grid-cols-2 gap-3">
            {["VRAI", "FAUX"].map((val) => {
              const isSelected = selectedOption === val;
              return (
                <button
                  key={val}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    setSelectedOption(val);
                    playRetroSound("click");
                  }}
                  className={`py-5 rounded-2xl border-2 text-center font-black text-sm transition-all ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/15 text-amber-300 shadow-lg"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. TIROIR DU GRIMOIRE DE SORTS (ACTION BAR RPG) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grimoire des Sortilèges</span>
          </span>
          <button
            onClick={() => setIsSpellDrawerOpen(!isSpellDrawerOpen)}
            className="text-[10px] font-black text-slate-400 hover:text-white uppercase"
          >
            {isSpellDrawerOpen ? "Masquer ▲" : "Ouvrir ▼"}
          </button>
        </div>

        {/* Raccourcis Rapides de Sorts */}
        <div className="grid grid-cols-3 gap-2">
          <button
            disabled={mana < 40 || isAnswerSubmitted}
            onClick={() => handleCastUniversalSpell("fifty_fifty")}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40"
          >
            <span>✨ 50/50</span>
            <span className="text-[9px] text-indigo-400">40 Mana</span>
          </button>

          <button
            disabled={mana < 30 || isAnswerSubmitted}
            onClick={() => handleCastUniversalSpell("hint_light")}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40"
          >
            <span>💡 Indice</span>
            <span className="text-[9px] text-amber-400">30 Mana</span>
          </button>

          <button
            disabled={classSpellUsed || isAnswerSubmitted}
            onClick={handleCastClassSpell}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-950 to-indigo-950 hover:brightness-125 border border-rose-700/60 text-rose-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40"
          >
            <span>⚔️ Sort Classe</span>
            <span className="text-[9px] text-rose-400">
              {classSpellUsed ? "Utilisé" : "Gratuit"}
            </span>
          </button>
        </div>
      </div>

      {/* 6. BANNIÈRE DE VALIDATION & EXPLICATION */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 md:p-5 rounded-3xl border-2 space-y-3 animate-bounce-short ${
            isCorrect
              ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/60 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Réponse Exacte ! (+20 Mana)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span className="text-white">Erreur Médicale ! (-15 PV)</span>
              </>
            )}
          </div>

          <p className="text-xs leading-relaxed text-slate-200 font-medium">
            {currentCard.feedback_fr}
          </p>

          <div className="text-[10px] text-slate-400 font-bold border-t border-slate-800 pt-2">
            📚 Source : {currentCard.reference}
          </div>
        </div>
      )}

      {/* 7. BOUTON D'ACTION PRINCIPAL */}
      <div className="pt-2">
        {!isAnswerSubmitted ? (
          <button
            disabled={!selectedOption || isSubmitting}
            onClick={handleCheckAnswer}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Swords className="w-4 h-4" />
            <span>Valider ma Conduite Diagnostique</span>
          </button>
        ) : (
          <button
            onClick={handleNextRoom}
            className="btn-rpg-indigo w-full py-4 text-xs font-black uppercase tracking-wider"
          >
            <span>{isLastRoom ? "Réclamer le Butin du Donjon" : "Passer à la Salle Suivante"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
