"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Brain,
  Lightbulb,
  Swords,
  BookOpen,
  Wand2,
  Stethoscope,
  Volume2,
} from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";
import InteractiveChestDiagram from "@/components/InteractiveChestDiagram";
import MindmapViewer from "@/components/MindmapViewer";
import PixelSprite from "./PixelSprite";
import GrandBlouseAvatar from "./GrandBlouseAvatar";

interface MiniOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface StepTeaching {
  title: string;
  dialogue: string;
  mnemonic?: string | null;
  hasDiagram?: boolean;
  hasMindmap?: boolean;
  miniQuestion?: {
    question: string;
    options: MiniOption[];
    feedback: string;
  };
}

interface MentorClassroomStageProps {
  lesson: any;
}

export default function MentorClassroomStage({ lesson }: MentorClassroomStageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Machine à écrire
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  // État émotionnel et gestuel du mentor
  const [mentorEmotion, setMentorEmotion] = useState<"speaking" | "thinking" | "happy" | "alert">("speaking");

  // État du mini-test interactif
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

  const stepTeachings: StepTeaching[] = [
    {
      title: "Enseignement 1 : Le Réflexe Sémiologique Fondamental",
      dialogue: `Bienvenue à toi, jeune soignant ! Je suis La Grande Blouse, ton mentor.\n\nPour la leçon "${lesson.nom_fr}", écoute bien ce premier principe :\n${lesson.cours_intro_fr || lesson.description_fr}`,
      mnemonic: lesson.mnemonique,
      miniQuestion: {
        question: "Quelle est la priorité absolue au lit du malade devant ces symptômes ?",
        options: [
          { id: "A", text: "Analyser méthodiquement le terrain, l'interrogatoire et les signes physiques", isCorrect: true },
          { id: "B", text: "Donner un traitement au hasard sans examiner le patient", isCorrect: false },
        ],
        feedback: "Splendide ! La sémiologie est la boussole infaillible du médecin."
      }
    },
    {
      title: "Enseignement 2 : Mécanismes & Repères Anatomiques",
      dialogue: isAuscultationLesson
        ? "Regarde sur mon tableau holographique : voici les 4 foyers cardiovasculaires (Aortique, Pulmonaire, Tricuspide, Mitral). Déplace ton stéthoscope pour les écouter !"
        : `Regarde bien les mécanismes physiopathologiques inscrits sur ce parchemin :\n\n${lesson.cours_points_cles_fr || lesson.cours_detaille_fr || ""}`,
      hasDiagram: isAuscultationLesson,
      miniQuestion: {
        question: isAuscultationLesson
          ? "Quel foyer anatomique écoute principalement l'Apex cardiaque (pointe) ?"
          : "Sur quoi repose le diagnostic de certitude ?",
        options: isAuscultationLesson
          ? [
              { id: "A", text: "Le foyer mitral (5e espace intercostal gauche)", isCorrect: true },
              { id: "B", text: "Le foyer aortique (2e espace intercostal droit)", isCorrect: false },
            ]
          : [
              { id: "A", text: "La concordance entre signes fonctionnels et examen physique méthodique", isCorrect: true },
              { id: "B", text: "Une simple supposition sans preuve clinique", isCorrect: false },
            ],
        feedback: "Parfaitement retenu ! Ce repère anatomique est capital."
      }
    },
    {
      title: "Enseignement 3 : Drapeaux Rouges & Pièges à Éviter",
      dialogue: `Garde l'œil ouvert ! Dans notre royaume, un signe discret peut cacher une urgence vitale. Voici les drapeaux rouges majeurs :\n\n${lesson.pieges_cliniques_fr || "Ne jamais négliger les formes atypiques chez les patients âgés ou diabétiques."}`,
      miniQuestion: {
        question: "Face à un drapeau rouge (douleur constrictive prolongée, syncope d'effort), quelle est ta réaction ?",
        options: [
          { id: "A", text: "Prise en charge urgente et examens complémentaires immédiats (ECG, biomarqueurs)", isCorrect: true },
          { id: "B", text: "Rassurer sans faire d'examen et renvoyer le patient chez lui", isCorrect: false },
        ],
        feedback: "Exactement ! Les drapeaux rouges imposent un réflexe d'urgence sans délai."
      }
    },
    {
      title: "Enseignement 4 : L'Arbre Décisionnel & Synthèse",
      dialogue: "Tu as brillamment assimilé mes enseignements ! Mon tableau te dévoile l'arbre décisionnel complet. Retiens bien chaque bifurcation avant de défier les gardiens du donjon !",
      hasMindmap: true,
    }
  ];

  const currentTeaching = stepTeachings[currentStep];

  // Effet machine à écrire
  useEffect(() => {
    setDisplayedText("");
    setIsTypingDone(false);
    setSelectedMiniAnswer(null);
    setIsMiniSubmitted(false);
    setIsMiniCorrect(false);
    setMentorEmotion("speaking");

    let idx = 0;
    const text = currentTeaching.dialogue;
    const timer = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(text.slice(0, idx + 1));
        idx++;
      } else {
        setIsTypingDone(true);
        setMentorEmotion("thinking");
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [currentStep]);

  const handleSkipTyping = () => {
    setDisplayedText(currentTeaching.dialogue);
    setIsTypingDone(true);
    setMentorEmotion("thinking");
  };

  const handleMiniAnswer = (opt: MiniOption) => {
    if (isMiniSubmitted) return;
    setSelectedMiniAnswer(opt.id);
    setIsMiniSubmitted(true);
    setIsMiniCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      setMentorEmotion("happy");
      playRetroSound("correct");
    } else {
      setMentorEmotion("alert");
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
      {/* 1. BARRE DE PROGRESSION DU COURS GUIDÉ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 fill-amber-400" />
            Amphithéâtre d&apos;Aethelgard • Cours Magistral Face-to-Face
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

      {/* 2. SCÈNE EN FACE-TO-FACE AVEC LE MENTOR "LA GRANDE BLOUSE" SUR L'ESTRADE */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-5 md:p-6 shadow-2xl overflow-hidden min-h-[220px] flex flex-col md:flex-row items-center gap-6">
        {/* Décor d'amphithéâtre / salle de classe médiévale */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pixel-rendering pointer-events-none"
          style={{ backgroundImage: "url('/pixel-crawler/mockups/Tavern.png')" }}
        />

        {/* MENTOR LA GRANDE BLOUSE ANIMÉE (FACE AU JOUEUR) */}
        <div className="relative z-10 flex flex-col items-center shrink-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-slate-950/90 border border-amber-400/30 px-2.5 py-0.5 rounded-md mb-2 shadow-md">
            Professeur • Mentor Suprême
          </div>

          {/* Avatar Géant Animé de La Grande Blouse Flottante */}
          <GrandBlouseAvatar
            emotion={mentorEmotion}
            size="lg"
            glow={true}
          />

          <div className="mt-1 text-xs font-black text-white flex items-center gap-1.5">
            <span>La Grande Blouse</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        {/* BULLE DE PAROLE GÉANTE DIRECTEMENT CONNECTÉE AU MENTOR */}
        <div
          onClick={handleSkipTyping}
          className="relative z-10 flex-1 bg-slate-950/95 border-2 border-amber-400/40 rounded-3xl p-5 shadow-2xl cursor-pointer group hover:border-amber-400 transition-colors space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{currentTeaching.title}</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-amber-400">
              {!isTypingDone ? "Cliquer pour passer ▶" : "Lecture terminée"}
            </span>
          </div>

          {/* Texte dicté par la Grande Blouse */}
          <div className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed min-h-[70px] whitespace-pre-line">
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

          {/* Formule Mnémotechnique dorée */}
          {currentTeaching.mnemonic && isTypingDone && (
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2 animate-bounce-short">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span><strong>Mnémo :</strong> {currentTeaching.mnemonic}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. TABLEAU HOLOGRAPHIQUE MAGIQUE (SCHÉMA ANATOMIQUE OU ARBRE) */}
      {currentTeaching.hasDiagram && (
        <div className="pt-1 animate-bounce-short">
          <InteractiveChestDiagram mode="auscultation" />
        </div>
      )}

      {currentTeaching.hasMindmap && mindmapData && (
        <div className="space-y-3 pt-1 animate-bounce-short">
          <div className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>Arbre Décisionnel Holographique Débloqué</span>
          </div>
          <MindmapViewer data={mindmapData} />
        </div>
      )}

      {/* 4. MINI-TEST D'APPLICATION IMMÉDIAT AU MILIEU DU COURS */}
      {currentTeaching.miniQuestion && isTypingDone && (
        <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-5 space-y-3.5 animate-bounce-short">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Question d&apos;application du Mentor :</span>
          </div>

          <p className="text-xs md:text-sm font-bold text-white">
            {currentTeaching.miniQuestion.question}
          </p>

          <div className="space-y-2">
            {currentTeaching.miniQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedMiniAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={isMiniSubmitted}
                  onClick={() => handleMiniAnswer(opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between transform active:scale-98 ${
                    isSelected
                      ? opt.isCorrect
                        ? "border-emerald-400 bg-emerald-950/80 text-emerald-200 shadow-lg shadow-emerald-500/20"
                        : "border-rose-400 bg-rose-950/80 text-rose-200 shadow-lg shadow-rose-500/20"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                  style={{ animationDelay: `${optIdx * 100}ms` }}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    <span className="text-xs font-black">
                      {opt.isCorrect ? "✓ Bravo !" : "✗ Attention"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback et félicitations du Mentor */}
          {isMiniSubmitted && (
            <div className={`p-4 rounded-2xl text-xs font-medium animate-bounce-short ${
              isMiniCorrect
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
            }`}>
              <div className="font-black mb-0.5">
                {isMiniCorrect ? "🧙‍♂️ La Grande Blouse valide :" : "🧙‍♂️ La Grande Blouse te conseille :"}
              </div>
              {currentTeaching.miniQuestion.feedback}
            </div>
          )}
        </div>
      )}

      {/* 5. NAVIGATION VERS L'ÉTAPE SUIVANTE OU VERS L'ARÈNE DU DONJON */}
      <div className="pt-2">
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNextStep}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider shadow-amber-500/30"
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
