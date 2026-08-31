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
} from "lucide-react";
import BloodPressureSimulator from "@/components/BloodPressureSimulator";
import HeartSoundSimulator from "@/components/HeartSoundSimulator";

export default function SimulationsPage() {
  const [activeTab, setActiveTab] = useState<"tension" | "auscultation">("tension");

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", padding: "20px 16px" }} className="space-y-4">
      {/* Bouton Retour */}
      <div>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#ffffff",
            border: "2px solid #cbd5e1",
            borderRadius: "14px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "800",
            color: "#475569",
            textDecoration: "none",
            boxShadow: "0 2px 0 #cbd5e1",
          }}
          className="hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Retour au parcours</span>
        </Link>
      </div>

      {/* En-tête de l'Atelier Pratique (Style Cartoon Moderne) */}
      <div
        style={{
          background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)",
          border: "3px solid #4338ca",
          borderRadius: "28px",
          padding: "22px 24px",
          color: "#ffffff",
          boxShadow: "0 6px 0 #1e1b4b",
        }}
        className="relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-300 mb-1">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Laboratoire & Gestes Cliniques Virtuels</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "-0.5px" }} className="md:text-3xl">
          Atelier des Gestes Sémiologiques
        </h1>
        <p style={{ fontSize: "13px", color: "#c7d2fe", fontWeight: "600", marginTop: "4px", maxWidth: "600px" }}>
          Entraîne-toi aux gestes cardiovasculaires en temps réel avec des mascottes interactives et des moteurs de synthèse acoustique.
        </p>
      </div>

      {/* Sélecteur des Simulateurs (2 Gros Boutons 3D) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("tension")}
          style={{
            background: activeTab === "tension" ? "#ffffff" : "#f8fafc",
            border: "3px solid",
            borderColor: activeTab === "tension" ? "#4f46e5" : "#cbd5e1",
            borderRadius: "22px",
            padding: "12px 16px",
            textAlign: "left",
            boxShadow: activeTab === "tension" ? "0 5px 0 #3730a3" : "0 3px 0 #cbd5e1",
            transform: activeTab === "tension" ? "translateY(-2px)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.15s ease",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: activeTab === "tension" ? "#4f46e5" : "#e2e8f0",
              color: activeTab === "tension" ? "#ffffff" : "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🩺
          </div>
          <div>
            <div style={{ fontWeight: "900", fontSize: "14px", color: "#0f172a" }}>Prise de Tension</div>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>Bruits de Korotkoff</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("auscultation")}
          style={{
            background: activeTab === "auscultation" ? "#ffffff" : "#f8fafc",
            border: "3px solid",
            borderColor: activeTab === "auscultation" ? "#4f46e5" : "#cbd5e1",
            borderRadius: "22px",
            padding: "12px 16px",
            textAlign: "left",
            boxShadow: activeTab === "auscultation" ? "0 5px 0 #3730a3" : "0 3px 0 #cbd5e1",
            transform: activeTab === "auscultation" ? "translateY(-2px)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.15s ease",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: activeTab === "auscultation" ? "#4f46e5" : "#e2e8f0",
              color: activeTab === "auscultation" ? "#ffffff" : "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🎧
          </div>
          <div>
            <div style={{ fontWeight: "900", fontSize: "14px", color: "#0f172a" }}>Stéthoscope Virtuel</div>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>Auscultation & Souffles</div>
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
