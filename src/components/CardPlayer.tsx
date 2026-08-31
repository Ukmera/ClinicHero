"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Zap,
  RotateCcw,
  HelpCircle,
  Check,
  Flame,
  Brain,
  Lightbulb,
  X,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitCardAnswerAction, completeLessonAction } from "@/app/actions/game";
import MindmapViewer from "@/components/MindmapViewer";
import MedicalGlossaryModal from "@/components/MedicalGlossaryModal";

export interface CardData {
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
}

interface CardPlayerProps {
  lessonId: string;
  lessonTitle: string;
  cards: CardData[];
  lessonCourse?: {
    cours_intro_fr?: string | null;
    cours_points_cles_fr?: string | null;
    mnemonique?: string | null;
    carte_mentale_json?: string | null;
  };
  isReviewMode?: boolean;
}

export default function CardPlayer({
  lessonId,
  lessonTitle,
  cards,
  lessonCourse,
  isReviewMode = false,
}: CardPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modales d'aide en cours de session
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Pour les questions d'association
  const [associationPairs, setAssociationPairs] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Pour les questions d'ordre
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  const currentCard = cards[currentIndex];
  const currentCardId = currentCard?.id;
  const progressPercent = ((currentIndex) / cards.length) * 100;

  // Initialisation UNIQUEMENT lors du changement effectif de carte
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setSelectedLeft(null);

    if (currentCard?.type_question === "ORDRE") {
      try {
        const parsed = JSON.parse(currentCard.options_json);
        const items = parsed.items || [];
        setOrderedItems([...items].sort(() => Math.random() - 0.5));
      } catch {
        setOrderedItems([]);
      }
    } else if (currentCard?.type_question === "ASSOCIATION") {
      setAssociationPairs({});
    }
  }, [currentCardId]);

  // Parsing des options selon le type
  let parsedOptions: any = null;
  try {
    parsedOptions = currentCard ? JSON.parse(currentCard.options_json) : null;
  } catch {
    parsedOptions = null;
  }

  // Parsing de la carte mentale
  let parsedMindmap: any = null;
  if (lessonCourse?.carte_mentale_json) {
    try {
      parsedMindmap = JSON.parse(lessonCourse.carte_mentale_json);
    } catch {
      parsedMindmap = null;
    }
  }

  // Gestion de la validation de la réponse
  const handleCheckAnswer = async () => {
    if (isAnswerSubmitted || isSubmitting) return;

    let correct = false;

    if (
      currentCard.type_question === "QCM" ||
      currentCard.type_question === "VRAI_FAUX" ||
      currentCard.type_question === "CAS_CLINIQUE"
    ) {
      correct = selectedOption === currentCard.reponse_correcte;
    } else if (currentCard.type_question === "ORDRE") {
      try {
        const correctOrder = JSON.parse(currentCard.reponse_correcte);
        correct = JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
      } catch {
        correct = false;
      }
    } else if (currentCard.type_question === "ASSOCIATION") {
      try {
        const correctMatches = JSON.parse(currentCard.reponse_correcte);
        correct = Object.keys(correctMatches).every(
          (key) => associationPairs[key] === correctMatches[key]
        );
      } catch {
        correct = false;
      }
    }

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    if (correct) setCorrectCount((c) => c + 1);

    // Envoi du résultat SRS
    setIsSubmitting(true);
    try {
      await submitCardAnswerAction(currentCard.id, correct, lessonId);
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
    } else {
      setIsSubmitting(true);
      const total = cards.length;
      const finalScore = isCorrect ? correctCount : correctCount;
      const res = await completeLessonAction(lessonId, finalScore, total);
      setCompletionResult(res);
      setIsFinished(true);
      setIsSubmitting(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Gestion de l'association d'éléments
  const handleAssociationClick = (side: "left" | "right", value: string) => {
    if (isAnswerSubmitted) return;

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

  // Déplacement pour l'ordre
  const moveOrderItem = (index: number, direction: "up" | "down") => {
    if (isAnswerSubmitted) return;
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
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-amber-900 shadow-xl shadow-amber-300/40 mb-6">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          {isReviewMode ? "Révision du jour terminée !" : "Leçon validée !"}
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Excellente régularité. Chaque répétition ancre durablement ta sémiologie clinique.
        </p>

        {/* Tableau des récompenses */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" /> XP Gagnés
            </span>
            <span className="font-extrabold text-indigo-600 text-base">
              +{completionResult?.xpEarned || 25} XP
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Précision
            </span>
            <span className="font-extrabold text-emerald-600 text-base">
              {completionResult?.accuracy ?? 100}%
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Niveau de maîtrise
            </span>
            <span className="font-extrabold text-amber-600 text-base flex items-center gap-1">
              {"★".repeat(completionResult?.newMastery || 1)}
              <span className="text-slate-300">
                {"☆".repeat(5 - (completionResult?.newMastery || 1))}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Continuer le parcours</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-between p-4 pb-36">
      {/* En-tête de session & Boutons d'aide */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
          >
            ✕ Quitter
          </button>

          {/* Boutons d'aide rapide (Cours & Glossaire) */}
          <div className="flex items-center gap-2">
            {lessonCourse && (
              <button
                onClick={() => setIsCourseDrawerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors shadow-2xs"
                title="Consulter la fiche de cours"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Fiche Mémo</span>
              </button>
            )}

            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
              title="Rechercher un terme médical"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glossaire</span>
            </button>
          </div>

          <div className="text-xs font-bold text-indigo-600">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Contexte clinique si présent (Cas clinique) */}
        {currentCard.contexte_clinique && (
          <div className="mb-4 bg-slate-100/90 border border-slate-200/80 rounded-2xl p-3.5 text-xs md:text-sm text-slate-800 font-medium flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="italic">{currentCard.contexte_clinique}</div>
          </div>
        )}

        {/* Intitulé de la question */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2.5">
            <HelpCircle className="w-3 h-3" />
            <span>{currentCard.type_question.replace("_", " ")}</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
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
                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(opt.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 font-medium text-sm md:text-base flex items-center justify-between transition-all",
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
                        isAnswerSubmitted &&
                          opt.is_correct &&
                          "border-emerald-500 bg-emerald-50 text-emerald-950",
                        isAnswerSubmitted &&
                          isSelected &&
                          !opt.is_correct &&
                          "border-rose-500 bg-rose-50 text-rose-950"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border",
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          )}
                        >
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isAnswerSubmitted && opt.is_correct && (
                        <Check className="w-5 h-5 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          {/* TYPE : VRAI / FAUX */}
          {currentCard.type_question === "VRAI_FAUX" && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              {["true", "false"].map((val) => {
                const label = val === "true" ? "Vrai" : "Faux";
                const isSelected = selectedOption === val;
                return (
                  <button
                    key={val}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(val)}
                    className={cn(
                      "py-6 px-4 rounded-2xl border-2 font-bold text-lg flex flex-col items-center justify-center gap-2 transition-all",
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md scale-[1.02]"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300",
                      isAnswerSubmitted &&
                        currentCard.reponse_correcte === val &&
                        "border-emerald-500 bg-emerald-50 text-emerald-950",
                      isAnswerSubmitted &&
                        isSelected &&
                        currentCard.reponse_correcte !== val &&
                        "border-rose-500 bg-rose-50 text-rose-950"
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
              <p className="text-xs text-slate-500 font-medium">
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
                            ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-400"
                            : isMatched
                            ? "border-slate-300 bg-slate-100 text-slate-700"
                            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
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
                            ? "border-indigo-400 bg-indigo-50/50 text-indigo-900 font-semibold"
                            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        )}
                      >
                        {p.match}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paires déjà formées */}
              {Object.keys(associationPairs).length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Paires reliées ({Object.keys(associationPairs).length}/
                    {parsedOptions.pairs.length}) :
                  </div>
                  {Object.entries(associationPairs).map(([left, right]) => (
                    <div
                      key={left}
                      className="text-xs text-slate-700 flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-slate-900">{left}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-indigo-600 font-medium">{right}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TYPE : ORDRE */}
          {currentCard.type_question === "ORDRE" && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-500 font-medium mb-2">
                Utilise les flèches pour réordonner les étapes du début à la fin :
              </p>
              {orderedItems.map((item, idx) => (
                <div
                  key={item}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-slate-800">
                      {item}
                    </span>
                  </div>
                  {!isAnswerSubmitted && (
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveOrderItem(idx, "up")}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === orderedItems.length - 1}
                        onClick={() => moveOrderItem(idx, "down")}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Volet Tiroir du Cours pendant la session */}
      {isCourseDrawerOpen && lessonCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-bounce-short">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Fiche Mémo : {lessonTitle}</span>
                </div>
                <button
                  onClick={() => setIsCourseDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {lessonCourse.mnemonique && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[10px]">
                    <Brain className="w-3.5 h-3.5 text-amber-600" />
                    <span>Moyen Mnémotechnique</span>
                  </div>
                  <div className="font-semibold text-slate-900">{lessonCourse.mnemonique}</div>
                </div>
              )}

              {lessonCourse.cours_points_cles_fr && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">
                    Points Clés
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                    {lessonCourse.cours_points_cles_fr}
                  </div>
                </div>
              )}

              {parsedMindmap && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">
                    Arbre Décisionnel
                  </div>
                  <MindmapViewer data={parsedMindmap} />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCourseDrawerOpen(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-xs mt-6"
            >
              Fermer et reprendre l&apos;exercice
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 shadow-xl">
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
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Vérifier la réponse
            </button>
          ) : (
            <div className="space-y-3 animate-bounce-short">
              <div
                className={cn(
                  "p-4 rounded-2xl flex items-start gap-3 border",
                  isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="font-extrabold text-sm md:text-base">
                    {isCorrect ? "Excellent ! Réponse exacte." : "Pas tout à fait..."}
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-700">
                    {currentCard.feedback_fr}
                  </p>

                  {/* Mnémotechnique de rappel */}
                  {currentCard.mnemonique_rappel && (
                    <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-amber-950">
                      <Brain className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{currentCard.mnemonique_rappel}</span>
                    </div>
                  )}

                  {/* Référence médicale exacte */}
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Source : {currentCard.reference}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className={cn(
                  "w-full py-3.5 font-bold rounded-xl text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                  isCorrect ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
