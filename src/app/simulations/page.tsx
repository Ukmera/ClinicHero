"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gauge,
  Stethoscope,
  ArrowLeft,
  Sparkles,
  Award,
  Activity,
  Layers,
  FlaskConical,
  Wand2,
} from "lucide-react";
import BloodPressureSimulator from "@/components/BloodPressureSimulator";
import HeartSoundSimulator from "@/components/HeartSoundSimulator";
import { playRetroSound } from "@/lib/rpg/audio";

export default function SimulationsPage() {
  const [activeTab, setActiveTab] = useState<"tension" | "auscultation">("tension");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Bouton Retour aux Donjons */}
      <div>
        <Link
          href="/"
          onClick={() => playRetroSound("click")}
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Retour aux Donjons</span>
        </Link>
      </div>

      {/* En-tête du Laboratoire des Alchimistes (Style Med-RPG Sombre) */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-7 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pixel-rendering"
          style={{ backgroundImage: "url('/pixel-crawler/mockups/Tavern.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/80" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <FlaskConical className="w-4 h-4" />
            <span>Forge & Laboratoire Clinique Virtuel</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Atelier des Gestes Sémiologiques
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Entraîne-toi aux gestes cardiovasculaires en temps réel avec des mascottes interactives et des moteurs de synthèse acoustique Web Audio.
          </p>
        </div>
      </div>

      {/* Sélecteur des Simulateurs (2 Boutons RPG Tactiles 3D) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setActiveTab("tension");
            playRetroSound("click");
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 ${
            activeTab === "tension"
              ? "border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10 scale-[1.01]"
              : "border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
              activeTab === "tension"
                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            🩺
          </div>
          <div>
            <div className={`font-black text-sm ${activeTab === "tension" ? "text-amber-400" : "text-white"}`}>
              Prise de Pression
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Bruits de Korotkoff & Sphygmo</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("auscultation");
            playRetroSound("click");
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 ${
            activeTab === "auscultation"
              ? "border-emerald-400 bg-slate-900 shadow-lg shadow-emerald-500/10 scale-[1.01]"
              : "border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
              activeTab === "auscultation"
                ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            🎧
          </div>
          <div>
            <div className={`font-black text-sm ${activeTab === "auscultation" ? "text-emerald-400" : "text-white"}`}>
              Stéthoscope Virtuel
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Foyers & Souffles Cardiaques</div>
          </div>
        </button>
      </div>

      {/* Rendu du Simulateur Actif */}
      <div className="pt-2">
        {activeTab === "tension" ? <BloodPressureSimulator /> : <HeartSoundSimulator />}
      </div>
    </div>
  );
}
