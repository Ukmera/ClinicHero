"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Brain,
  Lightbulb,
  Play,
  RotateCcw,
  BookOpen,
  Swords,
  MessageSquare,
  Wand2,
} from "lucide-react";
import MindmapViewer from "./MindmapViewer";
import InteractiveChestDiagram from "./InteractiveChestDiagram";
import MarkdownViewer from "./MarkdownViewer";
import { playRetroSound } from "@/lib/rpg/audio";
import PixelSprite from "./rpg/PixelSprite";

interface GuidedLessonFlowProps {
  lesson: any;
}

export default function GuidedLessonFlow({ lesson }: GuidedLessonFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Machine à écrire pour le dialogue d'enseignement
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  // État du mini-test interactif de l'étape
  const [selectedMiniAnswer, setSelectedMiniAnswer] = useState<string | null>(null);
  const [isMiniSubmitted, setIsMiniSubmitted] = useState(false);
  const [isMiniCorrect, setIsMiniCorrect] = useState(false);

  // Parsing de la carte mentale
  let mindmapData: any = null;
  if (lesson.carte_mentale_json) {
    try {
      mindmapData = JSON.parse(lesson.carte_mentale_json);
    } catch {
      mindmapData = null;
    }
  }

  const isAuscultationLesson = lesson.slug.includes("auscultation");
  const totalSteps = 4;

  // Définition des 4 étapes d'enseignement dialogué avec La Grande Blouse
  const stepTeachings = [
    {
      title: "Enseignement 1 : Le Réflexe Sémiologique Fondamental",
      dialogue: `Salutations ! Aujourd'hui nous étudions : "${lesson.nom_fr}".\n\n${lesson.cours_intro_fr || lesson.description_fr}`,
      mnemonic: lesson.mnemonique,
      miniQuestion: {
        question: "Quelle est la priorité absolue au lit du malade devant ces symptômes ?",
        options: [
          { id: "A", text: "Analyser méthodiquement le terrain, l'interrogatoire et les signes physiques", isCorrect: true },
          { id: "B", text: "Donner un traitement au hasard sans examiner le patient", isCorrect: false },
        ],
        feedback: "Exactement ! En sémiologie, l'examen méthodique prime sur tout le reste."
      }
    },
    {
      title: "Enseignement 2 : Mécanismes & Repères Anatomiques",
      dialogue: isAuscultationLesson
        ? "Positionne ton stéthoscope sur les 4 foyers cardiovasculaires (Aortique, Pulmonaire, Tricuspide, Mitral) pour discerner chaque vibration sonore."
        : `Voici les mécanismes physiopathologiques détaillés qu'un bon clinicien doit maîtriser :\n\n${lesson.cours_points_cles_fr || lesson.cours_detaille_fr || ""}`,
      hasDiagram: isAuscultationLesson,
      miniQuestion: {
        question: isAuscultationLesson
          ? "Quel foyer anatomique écoute principalement la pointe du cœur (Apex) ?"
          : "Sur quoi repose le diagnostic de certitude ?",
        options: isAuscultationLesson
          ? [
              { id: "A", text: "Le foyer mitral (5e espace intercostal gauche)", isCorrect: true },
              { id: "B", text: "Le foyer aortique (2e espace intercostal droit)", isCorrect: false },
            ]
          : [
              { id: "A", text: "La concordance entre signes fonctionnels et examen physique", isCorrect: true },
              { id: "B", text: "Une simple supposition sans preuve clinique", isCorrect: false },
            ],
        feedback: "Parfait ! Tu as assimilé le repère sémiologique clé."
      }
    },
    {
      title: "Enseignement 3 : Les Drapeaux Rouges & Pièges à Éviter",
      dialogue: `Attention jeune soignant ! Dans notre royaume, l'erreur médicale rôde. Voici les présentations cliniques trompeuses et drapeaux rouges à ne jamais manquer :\n\n${lesson.pieges_cliniques_fr || "Ne jamais négliger les formes atypiques chez les patients âgés ou diabétiques."}`,
      miniQuestion: {
        question: "Face à un drapeau rouge (ex: douleur constrictive prolongée, syncope), que fais-tu ?",
        options: [
          { id: "A", text: "Prise en charge urgente et examens complémentaires immédiats (ECG, biomarqueurs)", isCorrect: true },
          { id: "B", text: "Rassurer sans faire d'examen et renvoyer le patient chez lui", isCorrect: false },
        ],
        feedback: "Vital ! Les drapeaux rouges imposent un réflexe d'urgence sans délai."
      }
    },
    {
      title: "Enseignement 4 : L'Arbre Décisionnel & Synthèse",
      dialogue: "Félicitations ! Tu as débloqué l'arbre décisionnel complet de cette pathologie. Mémorise les embranchements avant d'entrer dans l'arène de combat !",
      hasMindmap: true,
    }
  ];

  const currentTeaching = stepTeachings[currentStep];

  // Effet machine à écrire pour le dialogue pédagogique
  useEffect(() => {
    setDisplayedText("");
    setIsTypingDone(false);
    setSelectedMiniAnswer(null);
    setIsMiniSubmitted(false);
    setIsMiniCorrect(false);

    let idx = 0;
    const text = currentTeaching.dialogue;
    const timer = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(text.slice(0, idx + 1));
        idx++;
      } else {
        setIsTypingDone(true);
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [currentStep]);

  const handleSkipTyping = () => {
    setDisplayedText(currentTeaching.dialogue);
    setIsTypingDone(true);
  };

  const handleMiniAnswer = (opt: any) => {
    if (isMiniSubmitted) return;
    setSelectedMiniAnswer(opt.id);
    setIsMiniSubmitted(true);
    setIsMiniCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      playRetroSound("correct");
    } else {
      playRetroSound("wrong");
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      playRetroSound("click");
    }
  };

  return (
    <div className="card-rpg space-y-6 animate-bounce-short">
      {/* 1. BARRE DE PROGRESSION DU MICRO-COURS INTERACTIF */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 fill-amber-400" />
            Enseignement du Mentor (Micro-Learning)
          </span>
          <span className="text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3 py-0.5 rounded-full">
            Étape {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 h-full rounded-full transition-all duration-300 shadow-md shadow-amber-500/20"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. BOÎTE DE DIALOGUE INTERACTIVE AVEC LE MENTOR "LA GRANDE BLOUSE" */}
      <div
        onClick={handleSkipTyping}
        className="relative bg-slate-950/95 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl space-y-3.5 cursor-pointer group hover:border-amber-400/50 transition-colors"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 border border-amber-300 flex items-center justify-center text-2xl shadow-md ring-2 ring-indigo-400/30">
              🧙‍♂️🩺
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                La Grande Blouse enseigne
              </span>
              <h4 className="text-sm font-black text-white">{currentTeaching.title}</h4>
            </div>
          </div>

          <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
            {!isTypingDone ? "Cliquer pour passer ▶" : "Enseignement complet"}
          </span>
        </div>

        {/* Texte défilant de la leçon */}
        <div className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed min-h-[60px] relative whitespace-pre-line">
          {displayedText}
          {!isTypingDone && (
            <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />
          )}
          {isTypingDone && (
            <span className="inline-block ml-1 text-amber-400 font-black animate-bounce text-xs">
              ▼
            </span>
          )}
        </div>

        {/* Mnémonique / Astuce magique intégrée */}
        {currentTeaching.mnemonic && isTypingDone && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3.5 text-xs text-amber-300 flex items-center gap-2.5 animate-bounce-short">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <div>
              <strong className="text-amber-300 uppercase tracking-wider block text-[10px]">Formule Mnémotechnique :</strong>
              <span>{currentTeaching.mnemonic}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. SCHÉMA ANATOMIQUE OU CARTE MENTALE INTÉGRÉE SI APPLICABLE */}
      {currentTeaching.hasDiagram && (
        <div className="pt-2 animate-bounce-short">
          <InteractiveChestDiagram mode="auscultation" />
        </div>
      )}

      {currentTeaching.hasMindmap && mindmapData && (
        <div className="space-y-3 pt-2 animate-bounce-short">
          <div className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>Arbre Décisionnel Interactif Débloqué</span>
          </div>
          <MindmapViewer data={mindmapData} />
        </div>
      )}

      {/* 4. MINI-ÉPREUVE INTERACTIVE INTÉGRÉE DANS LE COURS (DUOLINGO CHECK) */}
      {currentTeaching.miniQuestion && isTypingDone && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 space-y-3.5 animate-bounce-short">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Mini-Test d&apos;Assimilation Immédiat :</span>
          </div>

          <p className="text-xs md:text-sm font-bold text-white">
            {currentTeaching.miniQuestion.question}
          </p>

          <div className="space-y-2">
            {currentTeaching.miniQuestion.options.map((opt) => {
              const isSelected = selectedMiniAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={isMiniSubmitted}
                  onClick={() => handleMiniAnswer(opt)}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.isCorrect
                        ? "border-emerald-400 bg-emerald-950/80 text-emerald-200"
                        : "border-rose-400 bg-rose-950/80 text-rose-200"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    <span>{opt.isCorrect ? "✓ Bravo !" : "✗ Erreur"}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback immédiat du mini-test */}
          {isMiniSubmitted && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              isMiniCorrect ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
            }`}>
              {currentTeaching.miniQuestion.feedback}
            </div>
          )}
        </div>
      )}

      {/* 5. BOUTON DE NAVIGATION DU COURS INTERACTIF */}
      <div className="pt-2">
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNextStep}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider shadow-amber-500/25"
          >
            <span>Passer à l&apos;Enseignement Suivant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={`/session/${lesson.id}`}
            onClick={() => playRetroSound("victory")}
            className="btn-rpg-gold w-full py-4 text-sm font-black shadow-amber-500/30 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            <span>Entrer dans l&apos;Arène du Donjon (+{lesson.xp_reward} XP)</span>
          </Link>
        )}
      </div>
    </div>
  );
}
