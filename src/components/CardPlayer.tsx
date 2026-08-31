"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen,
  X,
  Trophy,
  Brain,
  Check,
  Stethoscope,
  Wand2,
  Heart,
  ShieldAlert,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitCardAnswerAction, completeLessonAction } from "@/app/actions/game";
import MindmapViewer from "@/components/MindmapViewer";
import MedicalGlossaryModal from "@/components/MedicalGlossaryModal";
import { ManaBar, HealthBar } from "@/components/rpg/ManaBar";
import RetroAudioToggle from "@/components/rpg/RetroAudioToggle";
import PixelSprite from "@/components/rpg/PixelSprite";
import { playRetroSound } from "@/lib/rpg/audio";
import { RPG_SPELLS } from "@/lib/rpg/spells";

export interface CardData {
  id: string;
  type_question: string;
  question_fr: string;
  contexte_clinique?: string | null;
  options_json: string;
  reponse_correcte: string;
  feedback_fr: string;
  points_xp?: number;
}

interface CardPlayerProps {
  lessonId: string;
  lessonTitle: string;
  cards: CardData[];
  isReviewMode?: boolean;
  lessonCourse?: any;
}

export default function CardPlayer({
  lessonId,
  lessonTitle,
  cards,
  isReviewMode = false,
  lessonCourse,
}: CardPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [associationPairs, setAssociationPairs] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);

  // État RPG : Mana et Cœurs (Points de Vie)
  const [mana, setMana] = useState(50);
  const [hearts, setHearts] = useState(3);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [showSpellMnemonic, setShowSpellMnemonic] = useState(false);

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex) / cards.length) * 100;

  // Réinitialiser les états locaux à chaque changement de carte
  useEffect(() => {
    if (!currentCard) return;
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setEliminatedOptions([]);
    setShowSpellMnemonic(false);

    let parsed: any = null;
    try {
      parsed = JSON.parse(currentCard.options_json);
    } catch {
      parsed = null;
    }

    if (currentCard.type_question === "ORDRE" && Array.isArray(parsed)) {
      setOrderedItems([...parsed].sort(() => Math.random() - 0.5));
    } else {
      setOrderedItems([]);
    }

    setAssociationPairs({});
    setSelectedLeft(null);
  }, [currentIndex, currentCard]);

  if (!currentCard && !isFinished) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        Chargement des arcanes sémiologiques...
      </div>
    );
  }

  let parsedOptions: any = null;
  if (currentCard) {
    try {
      parsedOptions = JSON.parse(currentCard.options_json);
    } catch {
      parsedOptions = null;
    }
  }

  let parsedMindmap: any = null;
  if (lessonCourse?.carte_mentale_json) {
    try {
      parsedMindmap = JSON.parse(lessonCourse.carte_mentale_json);
    } catch {
      parsedMindmap = null;
    }
  }

  // Lancement d'un Sort Arcanique
  const handleCastSpell = (spellId: string) => {
    const spell = RPG_SPELLS[spellId];
    if (!spell || mana < spell.manaCost) return;

    playRetroSound("spell_cast");
    setMana((prev) => Math.max(0, prev - spell.manaCost));

    if (spellId === "clarity") {
      if (Array.isArray(parsedOptions)) {
        const wrongOpts = parsedOptions.filter(
          (o: any) => !o.is_correct && !eliminatedOptions.includes(o.id)
        );
        if (wrongOpts.length > 0) {
          const toEliminate = wrongOpts[Math.floor(Math.random() * wrongOpts.length)].id;
          setEliminatedOptions((prev) => [...prev, toEliminate]);
        }
      }
    } else if (spellId === "grimoire") {
      setShowSpellMnemonic(true);
    } else if (spellId === "vital_boost") {
      setHearts((prev) => Math.min(3, prev + 1));
    }
  };

  // Validation de la réponse
  const handleCheckAnswer = async () => {
    if (isAnswerSubmitted || isSubmitting) return;

    let userVal = "";
    let correct = false;

    if (currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") {
      if (!selectedOption) return;
      userVal = selectedOption;
      if (Array.isArray(parsedOptions)) {
        const matched = parsedOptions.find((o: any) => o.id === selectedOption);
        correct = matched ? !!matched.is_correct : false;
      }
    } else if (currentCard.type_question === "VRAI_FAUX") {
      if (!selectedOption) return;
      userVal = selectedOption;
      correct = currentCard.reponse_correcte.toLowerCase() === selectedOption.toLowerCase();
    } else if (currentCard.type_question === "ORDRE") {
      userVal = JSON.stringify(orderedItems);
      correct = JSON.stringify(orderedItems) === currentCard.reponse_correcte;
    } else if (currentCard.type_question === "ASSOCIATION") {
      userVal = JSON.stringify(associationPairs);
      let targetObj: any = {};
      try {
        targetObj = JSON.parse(currentCard.reponse_correcte);
      } catch {}
      correct = JSON.stringify(associationPairs) === JSON.stringify(targetObj);
    }

    setIsAnswerSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setMana((prev) => Math.min(100, prev + 20));
      playRetroSound("correct");
    } else {
      setHearts((prev) => Math.max(1, prev - 1));
      playRetroSound("wrong");
    }

    setIsSubmitting(true);
    try {
      await submitCardAnswerAction(currentCard.id, correct);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Passer à la carte suivante ou terminer la session
  const handleNext = async () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      playRetroSound("click");
    } else {
      setIsSubmitting(true);
      const total = cards.length;
      const finalScore = isCorrect ? correctCount : correctCount;
      const res = await completeLessonAction(lessonId, finalScore, total);
      setCompletionResult(res);
      setIsFinished(true);
      setIsSubmitting(false);
      playRetroSound("victory");

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  };

  // Association
  const handleAssociationClick = (side: "left" | "right", value: string) => {
    if (isAnswerSubmitted) return;
    playRetroSound("click");

    if (side === "left") {
      setSelectedLeft(value);
    } else if (side === "right" && selectedLeft) {
      setAssociationPairs((prev) => ({
        ...prev,
        [selectedLeft]: value,
      }));
      setSelectedLeft(null);
    }
  };

  // Ordre
  const moveOrderItem = (index: number, direction: "up" | "down") => {
    if (isAnswerSubmitted) return;
    playRetroSound("click");
    const newItems = [...orderedItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setOrderedItems(newItems);
  };

  // Écran de fin de session
  if (isFinished) {
    return (
      <div className="max-w-md mx-auto min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-bounce-short">
        <div className="flex items-center justify-center gap-4 mb-6">
          <PixelSprite
            type="knight"
            animation="run"
            size="lg"
            glow={true}
            className="shadow-xl"
          />
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-400/40 border-2 border-amber-300">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <PixelSprite
            type="wizzard"
            animation="run"
            size="lg"
            glow={true}
            className="shadow-xl"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quête Sémiologique Accomplie</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
          {isReviewMode ? "Rituel Quotidien Validé !" : "Donjon Sémiologique Triomphé !"}
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          Score du combat : <strong className="text-amber-400">{correctCount}</strong> / {cards.length} diagnostics exacts
        </p>

        {/* Butin & Récompenses RPG */}
        <div className="w-full card-rpg mb-6 divide-y divide-slate-800">
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> XP Gagnés
            </span>
            <span className="font-black text-amber-400 text-base">
              +{completionResult?.xpEarned || 20} XP
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Rang de Maîtrise
            </span>
            <span className="font-black text-amber-400 text-base flex items-center gap-1">
              {"★".repeat(completionResult?.newMastery || 1)}
              <span className="text-slate-700">
                {"☆".repeat(5 - (completionResult?.newMastery || 1))}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playRetroSound("click");
            router.push("/");
          }}
          className="btn-rpg-gold w-full py-4 text-sm font-black shadow-amber-500/25"
        >
          <span>Continuer l&apos;Aventure</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-between p-4 pb-40">
      {/* En-tête de session HUD RPG */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-white text-xs font-black p-1 flex items-center gap-1 uppercase tracking-wider"
          >
            ✕ Quitter
          </button>

          {/* HUD : Cœurs & Audio */}
          <div className="flex items-center gap-3">
            <HealthBar currentHearts={hearts} maxHearts={3} />
            <RetroAudioToggle />
          </div>

          {/* Boutons d'aide rapide */}
          <div className="flex items-center gap-1.5">
            {lessonCourse && (
              <button
                onClick={() => setIsCourseDrawerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors shadow-xs"
                title="Consulter la fiche mémo"
              >
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Mémo</span>
              </button>
            )}

            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-black text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-2.5 py-1 rounded-full transition-colors shadow-xs"
              title="Consulter le Grimoire"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Grimoire</span>
            </button>
          </div>
        </div>

        {/* Barre de Progression & Jauge de Mana */}
        <div className="space-y-2 mb-6">
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <ManaBar currentMana={mana} maxMana={100} showText={true} />
        </div>

        {/* Barre de Sortilèges Arcaniques */}
        {!isAnswerSubmitted && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-indigo-400" />
              <span>Sorts :</span>
            </span>

            {/* Sort de Clarté */}
            {(currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") && (
              <button
                type="button"
                onClick={() => handleCastSpell("clarity")}
                disabled={mana < 30 || eliminatedOptions.length > 0}
                className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-700/80 text-indigo-200 hover:bg-indigo-900 disabled:opacity-40 transition-all shadow-xs"
                title="Élimine 1 option incorrecte (Coût : 30 MP)"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Clarté 50/50 (30 MP)</span>
              </button>
            )}

            {/* Sort du Grimoire */}
            {lessonCourse?.mnemonique && (
              <button
                type="button"
                onClick={() => handleCastSpell("grimoire")}
                disabled={mana < 45 || showSpellMnemonic}
                className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-700/80 text-amber-200 hover:bg-amber-900 disabled:opacity-40 transition-all shadow-xs"
                title="Révèle le moyen mnémotechnique (Coût : 45 MP)"
              >
                <Brain className="w-3 h-3 text-amber-400" />
                <span>Mnémotechnique (45 MP)</span>
              </button>
            )}

            {/* Regain Vital */}
            {hearts < 3 && (
              <button
                type="button"
                onClick={() => handleCastSpell("vital_boost")}
                disabled={mana < 60}
                className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-950 border border-rose-700/80 text-rose-200 hover:bg-rose-900 disabled:opacity-40 transition-all shadow-xs"
                title="Restaure 1 Cœur de vie (Coût : 60 MP)"
              >
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Soin Vital +1 ❤️ (60 MP)</span>
              </button>
            )}
          </div>
        )}

        {/* Affichage du sortilège mnémotechnique si activé */}
        {showSpellMnemonic && lessonCourse?.mnemonique && (
          <div className="mb-4 bg-amber-950/30 border border-amber-500/50 rounded-2xl p-3.5 text-xs text-amber-200 flex items-start gap-2.5 animate-bounce-short">
            <Brain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-black uppercase text-[10px] text-amber-400">
                Incantation Mnémotechnique Révélée
              </div>
              <div className="font-bold text-amber-100 mt-0.5">{lessonCourse.mnemonique}</div>
            </div>
          </div>
        )}

        {/* Contexte clinique si présent */}
        {currentCard.contexte_clinique && (
          <div className="mb-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 text-xs md:text-sm text-slate-300 font-medium flex items-start gap-2.5 shadow-sm">
            <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="italic leading-relaxed">{currentCard.contexte_clinique}</div>
          </div>
        )}

        {/* Intitulé de la question */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2.5">
            <HelpCircle className="w-3 h-3" />
            <span>{currentCard.type_question.replace("_", " ")}</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white leading-snug">
            {currentCard.question_fr}
          </h2>
        </div>

        {/* Options selon le type de question */}
        <div className="space-y-3">
          {/* TYPE : QCM ou CAS CLINIQUE */}
          {(currentCard.type_question === "QCM" || currentCard.type_question === "CAS_CLINIQUE") &&
            Array.isArray(parsedOptions) && (
              <div className="space-y-2.5">
                {parsedOptions.map((opt: any) => {
                  const isSelected = selectedOption === opt.id;
                  const isEliminated = eliminatedOptions.includes(opt.id);

                  if (isEliminated) {
                    return (
                      <div
                        key={opt.id}
                        className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-600 line-through text-xs font-medium flex items-center gap-3 opacity-40 cursor-not-allowed select-none"
                      >
                        <span className="w-6 h-6 rounded-md bg-slate-900 text-slate-600 text-[11px] font-black flex items-center justify-center">
                          ✕
                        </span>
                        <span>{opt.text} (Éliminé par Sort de Clarté)</span>
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
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border-2 font-medium text-sm md:text-base flex items-center justify-between transition-all shadow-xs",
                        isSelected
                          ? "border-amber-400 bg-amber-500/15 text-amber-300 font-bold scale-[1.01]"
                          : "border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700 hover:bg-slate-800",
                        isAnswerSubmitted &&
                          opt.is_correct &&
                          "border-emerald-500 bg-emerald-950/60 text-emerald-300 font-black",
                        isAnswerSubmitted &&
                          isSelected &&
                          !opt.is_correct &&
                          "border-rose-500 bg-rose-950/60 text-rose-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center border",
                            isSelected
                              ? "bg-amber-400 text-slate-950 border-amber-300"
                              : "bg-slate-950 text-slate-400 border-slate-800"
                          )}
                        >
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isAnswerSubmitted && opt.is_correct && (
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          {/* TYPE : VRAI / FAUX */}
          {currentCard.type_question === "VRAI_FAUX" && (
            <div className="grid grid-cols-2 gap-3 pt-3">
              {["true", "false"].map((val) => {
                const label = val === "true" ? "Vrai" : "Faux";
                const isSelected = selectedOption === val;
                return (
                  <button
                    key={val}
                    disabled={isAnswerSubmitted}
                    onClick={() => {
                      setSelectedOption(val);
                      playRetroSound("click");
                    }}
                    className={cn(
                      "py-6 px-4 rounded-2xl border-2 font-black text-lg flex flex-col items-center justify-center gap-2 transition-all shadow-xs",
                      isSelected
                        ? "border-amber-400 bg-amber-500/15 text-amber-300 scale-[1.02]"
                        : "border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700",
                      isAnswerSubmitted &&
                        currentCard.reponse_correcte === val &&
                        "border-emerald-500 bg-emerald-950/60 text-emerald-300",
                      isAnswerSubmitted &&
                        isSelected &&
                        currentCard.reponse_correcte !== val &&
                        "border-rose-500 bg-rose-950/60 text-rose-300"
                    )}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE : ASSOCIATION */}
          {currentCard.type_question === "ASSOCIATION" && parsedOptions?.pairs && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-slate-400 font-medium">
                Clique sur un élément de gauche puis sur son équivalent à droite :
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Colonne gauche */}
                <div className="space-y-2">
                  {parsedOptions.pairs.map((p: any) => {
                    const isMatched = !!associationPairs[p.item];
                    const isLeftSelected = selectedLeft === p.item;
                    return (
                      <button
                        key={p.item}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleAssociationClick("left", p.item)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs md:text-sm font-medium transition-all",
                          isLeftSelected
                            ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400"
                            : isMatched
                            ? "border-slate-700 bg-slate-800 text-slate-300"
                            : "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                        )}
                      >
                        {p.item}
                      </button>
                    );
                  })}
                </div>

                {/* Colonne droite */}
                <div className="space-y-2">
                  {parsedOptions.pairs.map((p: any) => {
                    const isMatchedWithLeft = Object.values(associationPairs).includes(p.match);
                    return (
                      <button
                        key={p.match}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleAssociationClick("right", p.match)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs md:text-sm font-medium transition-all",
                          isMatchedWithLeft
                            ? "border-indigo-400 bg-indigo-950 text-indigo-200 font-bold"
                            : "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                        )}
                      >
                        {p.match}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TYPE : ORDRE */}
          {currentCard.type_question === "ORDRE" && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-400 font-medium">
                Classe les étapes dans l&apos;ordre chronologique de la démarche clinique :
              </p>
              <div className="space-y-2">
                {orderedItems.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 font-medium text-xs md:text-sm shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>

                    {!isAnswerSubmitted && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveOrderItem(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800 text-xs font-bold"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveOrderItem(idx, "down")}
                          disabled={idx === orderedItems.length - 1}
                          className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800 text-xs font-bold"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Fiche Mémo Latéral */}
      {isCourseDrawerOpen && lessonCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-bounce-short text-slate-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Fiche Mémo : {lessonTitle}</span>
                </div>
                <button
                  onClick={() => setIsCourseDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {lessonCourse.mnemonique && (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3.5 text-xs text-amber-200 space-y-1">
                  <div className="font-black text-amber-400 flex items-center gap-1.5 uppercase text-[10px]">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Moyen Mnémotechnique</span>
                  </div>
                  <div className="font-semibold text-white">{lessonCourse.mnemonique}</div>
                </div>
              )}

              {lessonCourse.cours_points_cles_fr && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Points Clés & Pièges
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {lessonCourse.cours_points_cles_fr}
                  </div>
                </div>
              )}

              {parsedMindmap && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Arbre Décisionnel
                  </div>
                  <MindmapViewer data={parsedMindmap} />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCourseDrawerOpen(false)}
              className="w-full py-3 bg-slate-950 border border-slate-800 text-amber-400 font-black rounded-xl text-xs mt-6 hover:bg-slate-800 transition-colors"
            >
              Fermer et reprendre le combat
            </button>
          </div>
        </div>
      )}

      {/* Modal du Glossaire */}
      <MedicalGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Barre d'action et Feedback en bas */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
        <div className="max-w-xl mx-auto">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={
                (!selectedOption &&
                  currentCard.type_question !== "ORDRE" &&
                  Object.keys(associationPairs).length === 0) ||
                isSubmitting
              }
              className="btn-rpg-gold w-full py-4 text-sm uppercase tracking-wider disabled:opacity-40"
            >
              <Swords className="w-4 h-4" />
              <span>Vérifier le diagnostic</span>
            </button>
          ) : (
            <div className="space-y-3 animate-bounce-short">
              <div
                className={cn(
                  "p-4 rounded-2xl flex items-start gap-3 border shadow-md",
                  isCorrect
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-100"
                    : "bg-rose-950/60 border-rose-800 text-rose-100"
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="font-black text-sm md:text-base">
                    {isCorrect ? "Diagnostic exact ! (+20 Mana)" : "Attention au piège sémiologique (-1 ❤️)"}
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-300">
                    {currentCard.feedback_fr}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="btn-rpg-gold w-full py-4 text-sm uppercase tracking-wider"
              >
                <span>{currentIndex + 1 < cards.length ? "Défi Suivant" : "Terminer la Quête"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
