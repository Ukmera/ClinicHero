"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Zap,
  Sparkles,
  AlertTriangle,
  Play,
  Brain,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Compass,
  FileText,
  Stethoscope,
  Swords,
} from "lucide-react";
import MindmapViewer from "@/components/MindmapViewer";
import MarkdownViewer from "@/components/MarkdownViewer";
import MascotGuide from "@/components/MascotGuide";
import GuidedLessonFlow from "@/components/GuidedLessonFlow";
import InteractiveChestDiagram from "@/components/InteractiveChestDiagram";
import { setLessonPriorKnowledgeAction } from "@/app/actions/user";
import { playRetroSound } from "@/lib/rpg/audio";

interface LessonViewerProps {
  lesson: any;
  userLevel?: string;
  hasPriorKnowledge?: boolean;
}

export default function LessonViewer({
  lesson,
  userLevel = "debutant",
  hasPriorKnowledge = false,
}: LessonViewerProps) {
  const [viewMode, setViewMode] = useState<"guided" | "fiche">(
    userLevel === "praticien" || hasPriorKnowledge ? "fiche" : "guided"
  );
  const [activeTab, setActiveTab] = useState<"essentiel" | "detail" | "pieges" | "carte">("essentiel");
  const [priorKnowledge, setPriorKnowledge] = useState(hasPriorKnowledge);
  const [isUpdatingKnowledge, setIsUpdatingKnowledge] = useState(false);

  let mindmapData: any = null;
  if (lesson.carte_mentale_json) {
    try {
      mindmapData = JSON.parse(lesson.carte_mentale_json);
    } catch {
      mindmapData = null;
    }
  }

  const isAuscultationLesson = lesson.slug.includes("auscultation");

  const handleTogglePriorKnowledge = async (val: boolean) => {
    setPriorKnowledge(val);
    setIsUpdatingKnowledge(true);
    playRetroSound("click");
    await setLessonPriorKnowledgeAction(lesson.id, val);
    setIsUpdatingKnowledge(false);
    if (val) {
      setViewMode("fiche");
    } else {
      setViewMode("guided");
    }
  };

  return (
    <div className="space-y-6">
      {/* Questionnaire de pré-requis préalable */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm text-white">
              As-tu déjà abordé ce sujet en cours ?
            </div>
            <p className="text-xs text-slate-400">
              Nous adaptons la méthode et le rythme d&apos;apprentissage à ton niveau.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            disabled={isUpdatingKnowledge}
            onClick={() => handleTogglePriorKnowledge(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              !priorKnowledge
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            Découverte
          </button>
          <button
            disabled={isUpdatingKnowledge}
            onClick={() => handleTogglePriorKnowledge(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              priorKnowledge
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            Déjà vu
          </button>
        </div>
      </div>

      {/* Sélecteur de Mode : Parcours Guidé vs Fiche Mémo */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode("guided");
              playRetroSound("click");
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === "guided"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Parcours Guidé Interactif</span>
          </button>

          <button
            onClick={() => {
              setViewMode("fiche");
              playRetroSound("click");
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === "fiche"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Fiche Mémo Grimoire</span>
          </button>
        </div>
      </div>

      {/* MODE 1 : Parcours Guidé Interactif */}
      {viewMode === "guided" ? (
        <GuidedLessonFlow lesson={lesson} />
      ) : (
        /* MODE 2 : Fiche Synthétique par Onglets */
        <div className="space-y-6">
          {/* Onglets Pédagogiques */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("essentiel");
                playRetroSound("click");
              }}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "essentiel"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>L&apos;Essentiel</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("detail");
                playRetroSound("click");
              }}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "detail"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cours Complet</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("pieges");
                playRetroSound("click");
              }}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "pieges"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pièges & Alertes</span>
            </button>

            {mindmapData && (
              <button
                onClick={() => {
                  setActiveTab("carte");
                  playRetroSound("click");
                }}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "carte"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Arbre Décisionnel</span>
              </button>
            )}
          </div>

          {/* Contenu de l'onglet actif */}
          <div className="card-rpg space-y-6">
            {/* ONGLET 1 : L'Essentiel */}
            {activeTab === "essentiel" && (
              <div className="space-y-5">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                  {lesson.cours_intro_fr || lesson.description_fr}
                </div>

                {isAuscultationLesson && <InteractiveChestDiagram mode="auscultation" />}

                {lesson.mnemonique && (
                  <MascotGuide
                    type="tip"
                    title="Moyen Mnémotechnique"
                    message={lesson.mnemonique}
                  />
                )}

                {lesson.cours_points_cles_fr && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Points Clés & Réflexes Cliniques
                    </h3>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200">
                      <MarkdownViewer content={lesson.cours_points_cles_fr} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ONGLET 2 : Cours Complet */}
            {activeTab === "detail" && (
              <div className="space-y-4 text-slate-200">
                <MarkdownViewer
                  content={lesson.cours_detaille_fr || lesson.cours_intro_fr || "Cours en cours de rédaction."}
                />
              </div>
            )}

            {/* ONGLET 3 : Pièges & Alertes */}
            {activeTab === "pieges" && (
              <div className="space-y-4">
                <MascotGuide
                  type="alert"
                  title="Drapeaux Rouges & Pièges Fréquents"
                  message="Ne jamais négliger ces présentations cliniques trompeuses en pratique quotidienne :"
                />
                <div className="bg-rose-950/20 border border-rose-900/60 rounded-2xl p-4 text-rose-100">
                  <MarkdownViewer
                    content={lesson.pieges_cliniques_fr || "Aucun piège critique identifié sur cette fiche."}
                  />
                </div>
              </div>
            )}

            {/* ONGLET 4 : Carte Mentale */}
            {activeTab === "carte" && mindmapData && (
              <div className="space-y-4">
                <MindmapViewer data={mindmapData} />
              </div>
            )}
          </div>

          {/* Boutons d'action : Exercices & Simulateur Associé */}
          <div className="pt-2 space-y-3">
            {(isAuscultationLesson || lesson.slug.includes("souffle") || lesson.slug.includes("palpation")) && (
              <Link
                href="/simulations"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Tester le Simulateur Pratique en Atelier (Tension / Auscultation)</span>
              </Link>
            )}

            <Link
              href={`/session/${lesson.id}`}
              className="btn-rpg-gold w-full py-4 text-base shadow-amber-500/25"
            >
              <Swords className="w-5 h-5" />
              <span>Lancer le Combat Sémiologique ({lesson.cards.length} exercices)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
