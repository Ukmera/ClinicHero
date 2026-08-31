"use client";

import { useState } from "react";
import { Stethoscope, Heart, Info, Sparkles } from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";

interface InteractiveChestDiagramProps {
  mode?: "auscultation" | "douleur";
}

export default function InteractiveChestDiagram({
  mode = "auscultation",
}: InteractiveChestDiagramProps) {
  const [activeFoyer, setActiveFoyer] = useState<string>("aortique");

  const foyers = {
    aortique: {
      id: "aortique",
      letter: "A",
      nom: "Foyer Aortique",
      loc: "2ème espace intercostal droit (bord sternal)",
      role: "Écoute de la valve aortique (B2 aortique, souffle de rétrécissement ou insuffisance aortique).",
      x: 38,
      y: 35,
      color: "bg-rose-500",
    },
    pulmonaire: {
      id: "pulmonaire",
      letter: "P",
      nom: "Foyer Pulmonaire",
      loc: "2ème espace intercostal gauche (bord sternal)",
      role: "Écoute de la valve pulmonaire (B2 pulmonaire, souffle pulmonaire).",
      x: 62,
      y: 35,
      color: "bg-sky-500",
    },
    tricuspide: {
      id: "tricuspide",
      letter: "T",
      nom: "Foyer Tricuspide",
      loc: "Appendice xiphoïde / 4e-5e EIC bord gauche",
      role: "Écoute de la valve tricuspide (B1 tricuspide, signe de Rivero-Carvallo).",
      x: 48,
      y: 60,
      color: "bg-amber-500",
    },
    mitral: {
      id: "mitral",
      letter: "M",
      nom: "Foyer Mitral (Apex)",
      loc: "5ème espace intercostal gauche (ligne médio-claviculaire)",
      role: "Écoute de la valve mitrale (B1 mitral éclatant, souffle d'insuffisance ou roulement mitrale).",
      x: 68,
      y: 68,
      color: "bg-emerald-500",
    },
  };

  const current = foyers[activeFoyer as keyof typeof foyers] || foyers.aortique;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl space-y-4 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-sm md:text-base tracking-tight">
            Schéma Anatomique Interactif : Les 4 Foyers (A-P-T-M)
          </h3>
        </div>
        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
          Interactif
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Touche ou clique sur un foyer anatomique pour positionner le stéthoscope et comprendre sa sémiologie :
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Schéma SVG du thorax */}
        <div className="relative aspect-square max-w-[260px] mx-auto w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-3 flex items-center justify-center overflow-hidden">
          {/* Silhouette stylisée du thorax */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
            {/* Clavicules & Sternum */}
            <path
              d="M20 20 Q50 25 80 20 M50 20 L50 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="2 2"
            />
            {/* Côtes schématisées */}
            <path
              d="M30 35 Q50 40 70 35 M25 45 Q50 50 75 45 M22 55 Q50 60 78 55 M25 65 Q50 70 75 65"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Contour silhouette */}
            <path
              d="M15 15 Q30 30 20 85 Q50 95 80 85 Q70 30 85 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          {/* Points interactifs des 4 foyers */}
          {Object.values(foyers).map((f) => {
            const isSelected = activeFoyer === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFoyer(f.id);
                  playRetroSound("click");
                }}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full font-black text-xs flex items-center justify-center transition-all ${
                  isSelected
                    ? `${f.color} text-white ring-4 ring-white/30 scale-125 shadow-lg shadow-indigo-500/50 z-20`
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:scale-110 z-10"
                }`}
              >
                {f.letter}
              </button>
            );
          })}
        </div>

        {/* Détail du foyer sélectionné */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-lg ${current.color} text-white font-extrabold text-xs flex items-center justify-center`}
            >
              {current.letter}
            </span>
            <div className="font-extrabold text-sm text-white">{current.nom}</div>
          </div>

          <div className="text-xs text-indigo-300 font-semibold">
            📍 Repère : {current.loc}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-700">
            {current.role}
          </p>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mnémo : A (Aorte) → P (Pulm.) → T (Tricusp.) → M (Mitral)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
