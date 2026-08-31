"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Lightbulb,
  Play,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import MascotGuide from "./MascotGuide";
import MindmapViewer from "./MindmapViewer";
import InteractiveChestDiagram from "./InteractiveChestDiagram";
import MarkdownViewer from "./MarkdownViewer";

interface GuidedLessonFlowProps {
  lesson: any;
}

export default function GuidedLessonFlow({ lesson }: GuidedLessonFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [microAnswer, setMicroAnswer] = useState<string | null>(null);
  const [isMicroSubmitted, setIsMicroSubmitted] = useState(false);

  // Parsing de la carte mentale
  let mindmapData: any = null;
  if (lesson.carte_mentale_json) {
    try {
      mindmapData = JSON.parse(lesson.carte_mentale_json);
    } catch {
      mindmapData = null;
    }
  }

  // Définition des paliers interactifs selon la leçon
  const isAuscultationLesson = lesson.slug.includes("auscultation");

  const totalSteps = 4;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-bounce-short">
      {/* Barre de progression du cours guidé */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            Parcours Guidé Interactif
          </span>
          <span>
            Étape {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* ÉTAPE 0 : Introduction & Mise en situation avec la mascotte */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <MascotGuide
            type="encouraging"
            title="Objectif de la Leçon"
            message={`Bienvenue ! Aujourd'hui nous explorons : "${lesson.nom_fr}". Nous allons décomposer les signes essentiels palier par palier.`}
          />

          <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-2xl p-4 text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
            {lesson.cours_intro_fr || lesson.description_fr}
          </div>

          {lesson.mnemonique && (
            <MascotGuide
              type="tip"
              title="Moyen Mnémotechnique"
              message={`Retiens bien ce raccourci pour toute ta carrière : ${lesson.mnemonique}`}
            />
          )}

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm mt-4 transition-all"
          >
            <span>Découvrir le schéma clinique</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ÉTAPE 1 : Schéma Interactif ou Mécanisme Clinique */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {isAuscultationLesson ? (
            <InteractiveChestDiagram mode="auscultation" />
          ) : (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Points Clés et Démarche Sémiologique</span>
              </h3>
              <MarkdownViewer content={lesson.cours_points_cles_fr || lesson.cours_detaille_fr || ""} />
            </div>
          )}

          <MascotGuide
            type="thinking"
            title="Le Réflexe Pratique"
            message="Observe bien la démarche méthodique. Au lit du malade, l'inspection et la palpation préparent toujours l'auscultation."
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <span>Vérifier ma compréhension</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : Pièges Cliniques & Drapeaux Rouges */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <MascotGuide
            type="alert"
            title="Drapeau Rouge à ne jamais manquer"
            message="Certains signes imposent une prise en charge immédiate. Voici les pièges et diagnostics différentiels majeurs :"
          />

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs md:text-sm text-rose-950 font-medium leading-relaxed">
            <MarkdownViewer content={lesson.pieges_cliniques_fr || "Ne jamais négliger l'atypie chez le patient diabétique ou âgé."} />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <span>Voir l&apos;arbre de décision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Arbre Décisionnel & Passage à l'Évaluation */}
      {currentStep === 3 && (
        <div className="space-y-5">
          {mindmapData ? (
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Synthèse : Arbre Décisionnel</span>
              </h3>
              <MindmapViewer data={mindmapData} />
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed font-medium">
              <MarkdownViewer content={lesson.cours_points_cles_fr || lesson.description_fr} />
            </div>
          )}

          <MascotGuide
            type="encouraging"
            title="Prêt pour le défi !"
            message="Tu as parcouru tous les concepts fondamentaux de cette leçon. Lance maintenant l'entraînement pour remporter tes XP et consolider ta mémoire !"
          />

          <div className="pt-2">
            <Link
              href={`/session/${lesson.id}`}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Démarrer l&apos;entraînement (+{lesson.xp_reward} XP)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
