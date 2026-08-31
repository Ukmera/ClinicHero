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
  Swords,
} from "lucide-react";
import MascotGuide from "./MascotGuide";
import MindmapViewer from "./MindmapViewer";
import InteractiveChestDiagram from "./InteractiveChestDiagram";
import MarkdownViewer from "./MarkdownViewer";
import { playRetroSound } from "@/lib/rpg/audio";

interface GuidedLessonFlowProps {
  lesson: any;
}

export default function GuidedLessonFlow({ lesson }: GuidedLessonFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleNextStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    playRetroSound("click");
  };

  return (
    <div className="card-rpg space-y-6 animate-bounce-short">
      {/* Barre de progression du cours guidé */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            Parcours Guidé Interactif
          </span>
          <span className="text-amber-400 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
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

      {/* ÉTAPE 0 : Introduction & Mise en situation avec la mascotte */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <MascotGuide
            type="encouraging"
            title="Objectif de la Quête"
            message={`Bienvenue ! Aujourd'hui nous explorons : "${lesson.nom_fr}". Décomposons les réflexes sémiologiques essentiels palier par palier.`}
          />

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-200 font-medium leading-relaxed shadow-sm">
            {lesson.cours_intro_fr || lesson.description_fr}
          </div>

          {lesson.mnemonique && (
            <MascotGuide
              type="tip"
              title="Incantation Mnémotechnique"
              message={`Retiens bien ce raccourci pour toute ta pratique clinique : ${lesson.mnemonique}`}
            />
          )}

          <button
            onClick={() => handleNextStep(1)}
            className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider mt-4"
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
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Points Clés et Démarche Sémiologique</span>
              </h3>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <MarkdownViewer content={lesson.cours_points_cles_fr || lesson.cours_detaille_fr || ""} />
              </div>
            </div>
          )}

          <MascotGuide
            type="thinking"
            title="Le Réflexe Pratique"
            message="Observe bien la démarche méthodique. Au lit du malade, l'inspection et la palpation préparent toujours l'auscultation."
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleNextStep(0)}
              className="py-3 px-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Précédent
            </button>
            <button
              onClick={() => handleNextStep(2)}
              className="btn-rpg-gold flex-1 py-3 text-xs font-black uppercase tracking-wider"
            >
              <span>Vérifier les Pièges</span>
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

          <div className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-4 text-rose-100 font-medium leading-relaxed">
            <MarkdownViewer content={lesson.pieges_cliniques_fr || "Ne jamais négliger l'atypie chez le patient diabétique ou âgé."} />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleNextStep(1)}
              className="py-3 px-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Précédent
            </button>
            <button
              onClick={() => handleNextStep(3)}
              className="btn-rpg-gold flex-1 py-3 text-xs font-black uppercase tracking-wider"
            >
              <span>Voir l&apos;arbre de décision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Arbre Décisionnel & Passage au Combat */}
      {currentStep === 3 && (
        <div className="space-y-5">
          {mindmapData ? (
            <div className="space-y-2">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Synthèse : Arbre Décisionnel</span>
              </h3>
              <MindmapViewer data={mindmapData} />
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium">
              <MarkdownViewer content={lesson.cours_points_cles_fr || lesson.description_fr} />
            </div>
          )}

          <MascotGuide
            type="encouraging"
            title="Prêt pour le combat !"
            message="Tu as parcouru tous les concepts fondamentaux de cette leçon. Lance maintenant le combat sémiologique pour remporter tes XP !"
          />

          <div className="pt-2">
            <Link
              href={`/session/${lesson.id}`}
              onClick={() => playRetroSound("click")}
              className="btn-rpg-gold w-full py-4 text-sm font-black shadow-amber-500/25 uppercase tracking-wider"
            >
              <Swords className="w-5 h-5" />
              <span>Démarrer le Combat (+{lesson.xp_reward} XP)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
