"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Heart,
  Zap,
  Sparkles,
  Shield,
  Lightbulb,
  BookOpen,
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
  Wand2,
  Skull,
  MessageSquare,
  Volume2,
} from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";
import { UNIVERSAL_SPELLS } from "@/lib/rpg/spells";
import { getClassConfig } from "@/lib/rpg/classes";
import { submitDungeonRoomAnswerAction, completeDungeonAction, useSpellAction } from "@/app/actions/game";
import PixelSprite, { SpriteCharacterType } from "./PixelSprite";
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

interface FloatingText {
  id: number;
  text: string;
  type: "damage" | "heal" | "mana" | "shield" | "crit";
  x: "hero" | "monster";
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
  bossName = "Spectre de l'Erreur Médicale",
  bossAvatar = "💀",
}: DungeonRoomPlayerProps) {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [hp, setHp] = useState(userHp);
  const [mana, setMana] = useState(userMana);
  const [gems, setGems] = useState(userGems);

  // État de santé du Monstre (100% au début du donjon)
  const totalRooms = cards.length;
  const [monsterHp, setMonsterHp] = useState(100);

  // Animations d'Arène
  const [heroAction, setHeroAction] = useState<"idle" | "attack" | "hurt">("idle");
  const [monsterAction, setMonsterAction] = useState<"idle" | "attack" | "hurt">("idle");
  const [isFiringBeam, setIsFiringBeam] = useState(false);
  const [isHealingAura, setIsHealingAura] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Événements de combat
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctRoomsCount, setCorrectRoomsCount] = useState(0);
  const [isDoorTransition, setIsDoorTransition] = useState(false);

  // Machine à écrire (Typewriter) pour les dialogues interactifs
  const [displayedDialogue, setDisplayedDialogue] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

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
  const isLastRoom = currentRoomIndex === totalRooms - 1;

  // Déterminer le type de monstre pour cette salle
  const getMonsterSpriteType = (): SpriteCharacterType => {
    if (isLastRoom || isBossDungeon) return "skeleton_mage";
    const types: SpriteCharacterType[] = ["skeleton_warrior", "skeleton_rogue", "orc_shaman", "peasant"];
    return types[currentRoomIndex % types.length];
  };

  // Parser les options JSON
  let parsedOptions: any = [];
  try {
    parsedOptions = JSON.parse(currentCard.options_json || "[]");
  } catch {
    parsedOptions = [];
  }

  // Texte complet du dialogue (Contexte clinique + Question)
  const fullDialogueText = currentCard.contexte_clinique
    ? `${currentCard.contexte_clinique}\n\n❓ ${currentCard.question_fr}`
    : currentCard.question_fr;

  // Effet de machine à écrire progressive (Typewriter RPG)
  useEffect(() => {
    setDisplayedDialogue("");
    setIsTypingComplete(false);
    let charIndex = 0;
    const text = fullDialogueText;

    const timer = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedDialogue(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 18); // Vitesse fluide 18ms

    return () => clearInterval(timer);
  }, [currentRoomIndex, currentCard, fullDialogueText]);

  const handleSkipTyping = () => {
    setDisplayedDialogue(fullDialogueText);
    setIsTypingComplete(true);
  };

  // Initialisation par salle
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
    setHeroAction("idle");
    setMonsterAction("idle");
    setIsFiringBeam(false);
  }, [currentRoomIndex, currentCard]);

  // Ajouter un texte flottant de combat
  const addFloatingText = (text: string, type: FloatingText["type"], x: FloatingText["x"]) => {
    const newId = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id: newId, text, type, x }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== newId));
    }, 1200);
  };

  // Lancer un sort universel
  const handleCastUniversalSpell = async (spellId: string) => {
    const spell = UNIVERSAL_SPELLS[spellId];
    if (!spell) return;

    if (mana < spell.manaCost) {
      playRetroSound("wrong");
      addFloatingText("MANA INSUFFISANT !", "damage", "hero");
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
          addFloatingText("✨ 50/50 ACTIVÉ !", "crit", "monster");
        }
      }
    } else if (spell.effectType === "hint_light") {
      setRevealedHint(currentCard.tags || "Règle clé : Vérifie la sémiologie fondamentale au lit du patient.");
      addFloatingText("💡 INDICE DÉVOILÉ", "shield", "hero");
    } else if (spell.effectType === "show_mnemonic") {
      setRevealedHint(currentCard.mnemonique_rappel || "Mnémonique : P-I-E-D / A-P-T-M");
      addFloatingText("📖 MNÉMO RÉVÉLÉ", "shield", "hero");
    } else if (spell.effectType === "restore_hp") {
      setIsHealingAura(true);
      setHp((prev) => Math.min(100, prev + 25));
      addFloatingText("+25 PV SOIN", "heal", "hero");
      setTimeout(() => setIsHealingAura(false), 800);
    }
  };

  // Lancer le sort spécial de classe
  const handleCastClassSpell = () => {
    if (classSpellUsed) return;
    setClassSpellUsed(true);
    playRetroSound("victory");

    if (userClass === "clerc" || userClass === "alchimiste") {
      if (Array.isArray(parsedOptions)) {
        const wrongOpt = parsedOptions.find((o: any) => !o.is_correct && !eliminatedOptions.includes(o.id));
        if (wrongOpt) {
          setEliminatedOptions((prev) => [...prev, wrongOpt.id]);
          addFloatingText(`⚔️ ${classConfig.classSpellName}`, "crit", "monster");
        }
      }
    } else if (userClass === "moine" || userClass === "gardien") {
      setDamageImmunity(true);
      addFloatingText("🛡️ POSTURE DE FER", "shield", "hero");
    } else if (userClass === "enchanteuse") {
      setIsHealingAura(true);
      setHp((prev) => Math.min(100, prev + 30));
      addFloatingText("+30 PV CLARTÉ", "heal", "hero");
      setTimeout(() => setIsHealingAura(false), 800);
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

    if (correct) {
      // 1. Animation Attaque Héros -> Dégâts Monstre
      setHeroAction("attack");
      setIsFiringBeam(true);
      playRetroSound("correct");

      setTimeout(() => {
        setMonsterAction("hurt");
        const damageToMonster = Math.ceil(100 / totalRooms);
        setMonsterHp((prev) => Math.max(0, prev - damageToMonster));
        addFloatingText(`-${damageToMonster}% PV`, "crit", "monster");
        addFloatingText("+20 MANA", "mana", "hero");
      }, 250);

      setTimeout(() => {
        setHeroAction("idle");
        setMonsterAction("idle");
        setIsFiringBeam(false);
      }, 600);

      setCorrectRoomsCount((prev) => prev + 1);
      setMana((prev) => Math.min(200, prev + 20));
    } else {
      // 2. Animation Attaque Monstre -> Dégâts Héros
      setMonsterAction("attack");
      playRetroSound("wrong");

      setTimeout(() => {
        setHeroAction("hurt");
        setIsScreenShaking(true);

        if (!damageImmunity) {
          const hpDelta = currentCard.niveau_difficulte >= 3 ? 25 : 15;
          setHp((prev) => Math.max(0, prev - hpDelta));
          addFloatingText(`-${hpDelta} PV`, "damage", "hero");
        } else {
          setDamageImmunity(false);
          addFloatingText("🛡️ ABSORBÉ !", "shield", "hero");
        }
      }, 250);

      setTimeout(() => {
        setHeroAction("idle");
        setMonsterAction("idle");
        setIsScreenShaking(false);
      }, 650);
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
        setTimeout(() => setIsGameOver(true), 800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Passer à la salle suivante avec animation de porte lourde
  const handleNextRoom = async () => {
    if (isLastRoom) {
      setIsSubmitting(true);
      const res = await completeDungeonAction(lessonId, correctRoomsCount + (isCorrect ? 1 : 0), totalRooms);
      setCompletionResult(res);
      setIsFinished(true);
      setIsSubmitting(false);
      playRetroSound("victory");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setIsDoorTransition(true);
      playRetroSound("click");
      setTimeout(() => {
        setCurrentRoomIndex((prev) => prev + 1);
        setIsDoorTransition(false);
      }, 800);
    }
  };

  // Écran Game Over (PV = 0)
  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-bounce-short">
        <div className="w-24 h-24 rounded-3xl bg-rose-950/90 border-3 border-rose-500 flex items-center justify-center text-5xl shadow-2xl shadow-rose-950 ring-8 ring-rose-500/20 animate-pulse">
          💀
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800 inline-block">
            Échec du Donjon
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">Épuisement Clinique !</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Tes points de vie sont tombés à zéro face aux pièges de ce donjon. Prends une potion de réveil ou entraîne-toi au sanctuaire.
          </p>
        </div>

        <div className="w-full space-y-3 pt-2">
          <button
            onClick={() => {
              setHp(100);
              setIsGameOver(false);
              playRetroSound("correct");
            }}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider shadow-amber-500/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Boire une Potion de Réveil (100 PV)</span>
          </button>

          <Link
            href="/"
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-2xl flex items-center justify-center text-xs transition-colors"
          >
            Retourner aux Donjons
          </Link>
        </div>
      </div>
    );
  }

  // Écran de Victoire Finale
  if (isFinished) {
    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-bounce-short">
        <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border-3 border-amber-400 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/40 ring-8 ring-amber-400/20 animate-bounce">
          🏆
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3.5 py-1 rounded-full">
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
            <div className="text-xl font-black text-indigo-400 flex items-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 fill-indigo-400" />
              <span>+{completionResult?.xpEarned || 25} XP</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Gemmes Récoltées</span>
            <div className="text-xl font-black text-amber-400 flex items-center gap-1 mt-0.5">
              <Gem className="w-4 h-4 fill-amber-400" />
              <span>+{completionResult?.gemsEarned || 10}</span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider shadow-amber-500/30"
        >
          <Crown className="w-4 h-4" />
          <span>Continuer l&apos;Aventure</span>
        </Link>
      </div>
    );
  }

  // Déterminer le locuteur et son identité
  const isPatientSpeaking = !!currentCard.contexte_clinique;
  const speakerName = isPatientSpeaking
    ? "M. Robert (Patient en consultation)"
    : isLastRoom
    ? bossName
    : `Gardien de la Salle ${currentRoomIndex + 1}`;
  const speakerAvatar = isPatientSpeaking ? "🧔🩺" : isLastRoom ? "💀⚡" : "⚔️🛡️";

  return (
    <div className={`max-w-2xl mx-auto px-4 py-3 space-y-4 relative ${isScreenShaking ? "animate-screen-shake" : ""}`}>
      {/* 1. BARRE SUPÉRIEURE DE COMBAT RPG */}
      <div className="bg-slate-950/95 border border-slate-800 rounded-3xl p-3.5 shadow-xl backdrop-blur space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Jauge de PV Héros */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black">
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>{hp} / 100 PV</span>
              </span>
              {damageImmunity && (
                <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/30">
                  🛡️ Bouclier
                </span>
              )}
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
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
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(mana / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Gemmes */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-2xl text-xs font-black text-amber-400 shrink-0">
            <Gem className="w-3.5 h-3.5 fill-amber-400" />
            <span>{gems}</span>
          </div>

          {/* Quitter */}
          <Link
            href="/"
            className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
          >
            ✕
          </Link>
        </div>

        {/* Indicateur de Salle & Monstre */}
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-800/80 pt-1.5">
          <span>Salle {currentRoomIndex + 1} / {totalRooms}</span>
          <span className="text-amber-400">
            {isLastRoom ? "💀 Défi du Gardien" : "⚔️ Épreuve Clinique"}
          </span>
        </div>
      </div>

      {/* 2. ARÈNE DE COMBAT 2D ANIMÉE (HÉROS VS MONSTRE) */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden min-h-[175px] flex flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pixel-rendering pointer-events-none"
          style={{ backgroundImage: "url('/pixel-crawler/tilesets/Dungeon_Tiles.png')" }}
        />
        <div className="absolute top-2 left-4 opacity-40 pointer-events-none">
          <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
        </div>
        <div className="absolute top-2 right-4 opacity-40 pointer-events-none">
          <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
        </div>

        {/* Faisceau Magique d'Attaque Héros -> Monstre */}
        {isFiringBeam && (
          <div className="absolute top-1/2 left-1/4 right-1/4 h-2 bg-gradient-to-r from-indigo-400 via-cyan-300 to-amber-300 rounded-full animate-magic-beam z-30 shadow-lg shadow-indigo-500" />
        )}

        {/* Aura de Soin Héros */}
        {isHealingAura && (
          <div className="absolute left-8 bottom-4 w-20 h-20 rounded-full bg-emerald-500/40 animate-heal-aura z-20 pointer-events-none" />
        )}

        {/* Textes Flottants de Combat */}
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className={`absolute z-40 text-xs md:text-sm font-black px-2 py-0.5 rounded-lg animate-combat-text pointer-events-none ${
              f.x === "hero" ? "left-12 top-8" : "right-12 top-8"
            } ${
              f.type === "damage"
                ? "bg-rose-950 border border-rose-600 text-rose-300 shadow-rose-900"
                : f.type === "heal"
                ? "bg-emerald-950 border border-emerald-600 text-emerald-300 shadow-emerald-900"
                : f.type === "mana"
                ? "bg-indigo-950 border border-indigo-600 text-indigo-300 shadow-indigo-900"
                : "bg-amber-950 border border-amber-600 text-amber-300 shadow-amber-900"
            }`}
          >
            {f.text}
          </div>
        ))}

        {/* Scène de Duel (Héros à Gauche vs Monstre à Droite) */}
        <div className="relative z-10 flex items-center justify-between px-2 md:px-6">
          {/* CÔTÉ HÉROS */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-black uppercase text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-indigo-500/30">
              {classConfig.name.split(" ")[0]} (Toi)
            </div>
            <div
              className={`transition-transform duration-300 ${
                heroAction === "attack"
                  ? "animate-hero-attack"
                  : heroAction === "hurt"
                  ? "animate-hurt"
                  : "animate-bounce-short"
              }`}
            >
              <PixelSprite
                classId={userClass}
                size="md"
                animation="idle"
                glow={true}
              />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-400">
              <Heart className="w-3 h-3 fill-rose-400" />
              <span>{hp} PV</span>
            </div>
          </div>

          {/* VS ICON */}
          <div className="w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-400 shadow-md">
            ⚔️
          </div>

          {/* CÔTÉ MONSTRE / GARDIEN */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-black uppercase text-rose-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">
              {isLastRoom ? bossName : `Gardien S.${currentRoomIndex + 1}`}
            </div>
            <div
              className={`transition-transform duration-300 ${
                monsterAction === "attack"
                  ? "animate-monster-attack"
                  : monsterAction === "hurt"
                  ? "animate-hurt"
                  : "animate-bounce-short"
              }`}
            >
              <PixelSprite
                type={getMonsterSpriteType()}
                size="md"
                animation="idle"
                glow={true}
              />
            </div>
            <div className="w-14 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-rose-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${monsterHp}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full h-2 bg-slate-800/80 border-t border-slate-700 rounded-full mt-1 shadow-inner" />
      </div>

      {/* 3. TRANSITION DE PORTE LOURDE */}
      {isDoorTransition && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center space-y-4 animate-fadeIn backdrop-blur-md">
          <div className="text-6xl animate-bounce">🚪</div>
          <div className="text-center space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Donjon d&apos;Aethelgard
            </div>
            <h3 className="text-xl font-black text-white">
              Entrée dans la Salle {currentRoomIndex + 2}...
            </h3>
          </div>
        </div>
      )}

      {/* 4. BOÎTE DE DIALOGUE RPG INTERACTIVE (VISUAL NOVEL / JRPG TYPEWRITER) */}
      <div
        onClick={handleSkipTyping}
        className="relative bg-slate-950/95 border-2 border-indigo-500/40 rounded-3xl p-4 md:p-5 shadow-2xl space-y-3 cursor-pointer group hover:border-amber-400/50 transition-colors"
      >
        {/* En-tête du Locuteur avec Portrait */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-lg shadow-sm">
              {speakerAvatar}
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                {isPatientSpeaking ? "Interrogatoire Clinique" : "Défi du Donjon"}
              </span>
              <h4 className="text-xs md:text-sm font-black text-white">{speakerName}</h4>
            </div>
          </div>

          <span className="text-[9px] font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
            {!isTypingComplete ? "Cliquer pour passer ▶" : "Dialogue complet"}
          </span>
        </div>

        {/* Texte du Dialogue défilant façon RPG */}
        <div className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed min-h-[55px] relative whitespace-pre-line">
          {displayedDialogue}
          {!isTypingComplete && (
            <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />
          )}
          {isTypingComplete && (
            <span className="inline-block ml-1 text-amber-400 font-black animate-bounce text-xs">
              ▼
            </span>
          )}
        </div>

        {/* Indice révélé via sort */}
        {revealedHint && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2 animate-bounce-short">
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{revealedHint}</span>
          </div>
        )}
      </div>

      {/* 5. RÉPLIQUES DU JOUEUR / CHOIX DE CONDUITE DIAGNOSTIQUE */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Ta Réplique & Conduite Médicale :</span>
          </div>
          {!isTypingComplete && (
            <span className="text-[9px] text-amber-400/80 italic animate-pulse">
              Écoute du patient en cours...
            </span>
          )}
        </div>

        {/* Si le dialogue est encore en train de s'écrire */}
        {!isTypingComplete && (
          <button
            onClick={handleSkipTyping}
            className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-white hover:border-amber-400/40 transition-all flex flex-col items-center justify-center gap-1 text-xs"
          >
            <span className="animate-bounce">💬</span>
            <span className="font-bold text-[11px]">Le patient termine d&apos;expliquer ses symptômes... (Cliquer pour répondre)</span>
          </button>
        )}

        {/* QCM & CAS CLINIQUE (Apparaissent au fur et à mesure) */}
        {isTypingComplete && (currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") && (
          <div className="space-y-2.5 animate-bounce-short">
            {parsedOptions.map((opt: any, optIdx: number) => {
              const isEliminated = eliminatedOptions.includes(opt.id);
              const isSelected = selectedOption === opt.id;
              const runeLetters = ["᚛ A", "᚜ B", "ᚠ C", "ᚢ D", "ᚦ E"];

              if (isEliminated) {
                return (
                  <div
                    key={opt.id}
                    className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900 text-slate-600 line-through text-xs font-medium cursor-not-allowed relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-rose-500/10 animate-laser-slash pointer-events-none" />
                    <span>{opt.text}</span>
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
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-xs md:text-sm transition-all flex items-center justify-between transform active:scale-98 animate-bounce-short ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/15 text-white shadow-xl shadow-amber-500/15 scale-[1.01]"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                  style={{ animationDelay: `${optIdx * 80}ms` }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                      isSelected ? "bg-amber-400 text-slate-950 border-amber-300" : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}>
                      {runeLetters[optIdx] || opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
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

        {/* VRAI / FAUX */}
        {isTypingComplete && currentCard.type_question === "VRAI_FAUX" && (
          <div className="grid grid-cols-2 gap-3 animate-bounce-short">
            {["VRAI", "FAUX"].map((val, vIdx) => {
              const isSelected = selectedOption === val;
              return (
                <button
                  key={val}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    setSelectedOption(val);
                    playRetroSound("click");
                  }}
                  className={`py-5 rounded-2xl border-2 text-center font-black text-sm md:text-base transition-all transform active:scale-98 ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-xl shadow-amber-500/20 scale-[1.02]"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                  style={{ animationDelay: `${vIdx * 100}ms` }}
                >
                  {val === "VRAI" ? "🛡️ VRAI" : "⚔️ FAUX"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. TIROIR DU GRIMOIRE DE SORTS */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Grimoire des Sortilèges</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            Mana dispo : <strong className="text-indigo-300">{mana}</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            disabled={mana < 40 || isAnswerSubmitted}
            onClick={() => handleCastUniversalSpell("fifty_fifty")}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          >
            <span>✨ 50/50</span>
            <span className="text-[9px] text-indigo-400 font-bold">40 Mana</span>
          </button>

          <button
            disabled={mana < 30 || isAnswerSubmitted}
            onClick={() => handleCastUniversalSpell("hint_light")}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          >
            <span>💡 Indice</span>
            <span className="text-[9px] text-amber-400 font-bold">30 Mana</span>
          </button>

          <button
            disabled={classSpellUsed || isAnswerSubmitted}
            onClick={handleCastClassSpell}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-950 to-indigo-950 hover:brightness-125 border border-rose-700/60 text-rose-200 text-[11px] font-black flex flex-col items-center gap-1 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          >
            <span>⚔️ Sort Classe</span>
            <span className="text-[9px] text-rose-400 font-bold">
              {classSpellUsed ? "Utilisé" : "Gratuit"}
            </span>
          </button>
        </div>
      </div>

      {/* 7. BANNIÈRE DE DÉBRIEFING CLINIQUE EN CAS DE VALIDATION */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 md:p-5 rounded-3xl border-2 space-y-2.5 animate-bounce-short ${
            isCorrect
              ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/60 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Frappe Critique Réussie ! (+20 Mana)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span className="text-white">Riposte du Monstre ! (-15 PV)</span>
              </>
            )}
          </div>

          <p className="text-xs leading-relaxed text-slate-200 font-medium">
            {currentCard.feedback_fr}
          </p>

          <div className="text-[10px] text-slate-400 font-bold border-t border-slate-800 pt-2">
            📚 Traité de référence : {currentCard.reference}
          </div>
        </div>
      )}

      {/* 8. BOUTON D'ACTION PRINCIPAL */}
      <div className="pt-1">
        {!isAnswerSubmitted ? (
          <button
            disabled={!selectedOption || isSubmitting}
            onClick={handleCheckAnswer}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-amber-500/30"
          >
            <Swords className="w-4 h-4" />
            <span>Porter le Diagnostic (Attaquer)</span>
          </button>
        ) : (
          <button
            onClick={handleNextRoom}
            className="btn-rpg-indigo w-full py-4 text-xs font-black uppercase tracking-wider shadow-indigo-500/30"
          >
            <span>{isLastRoom ? "Terrasser le Gardien & Réclamer le Butin" : "Franchir la Porte Suivante"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
