"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Gauge,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Heart,
  CheckCircle2,
} from "lucide-react";

interface PatientScenario {
  id: string;
  nom: string;
  avatar: string;
  age: number;
  profil: string;
  pas_cible: number;
  pad_cible: number;
  bpm: number;
  description: string;
}

const SCENARIOS: PatientScenario[] = [
  {
    id: "normotendu",
    nom: "Léo le Lapin",
    avatar: "🐰",
    age: 24,
    profil: "Jeune adulte en pleine forme, visite de routine.",
    pas_cible: 120,
    pad_cible: 80,
    bpm: 72,
    description: "Pression artérielle normale idéale (< 130/85 mmHg).",
  },
  {
    id: "hta",
    nom: "Papi Panda",
    avatar: "🐼",
    age: 65,
    profil: "Gourmand et sédentaire, tension à surveiller.",
    pas_cible: 160,
    pad_cible: 100,
    bpm: 80,
    description: "Hypertension artérielle Grade 2 (PAS ≥ 160 mmHg / PAD ≥ 100 mmHg).",
  },
  {
    id: "hypotension",
    nom: "Mimi la Souris",
    avatar: "🐭",
    age: 20,
    profil: "Petite baisse d'énergie au saut du lit.",
    pas_cible: 95,
    pad_cible: 60,
    bpm: 90,
    description: "Hypotension artérielle bénigne mais symptomatique.",
  },
  {
    id: "ia",
    nom: "Gaspard le Renard",
    avatar: "🦊",
    age: 48,
    profil: "Souffle cardiaque avec différentielle très élargie.",
    pas_cible: 150,
    pad_cible: 45,
    bpm: 76,
    description: "Élargissement franc de la pression pulsée (Insuffisance Aortique).",
  },
];

export default function BloodPressureSimulator() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = SCENARIOS[scenarioIndex];

  const [pressure, setPressure] = useState(0);
  const [isValveOpen, setIsValveOpen] = useState(false);
  const [isPumping, setIsPumping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Repères enregistrés
  const [markedPas, setMarkedPas] = useState<number | null>(null);
  const [markedPad, setMarkedPad] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Audio Context initialisation sûre
  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch (e) {
      console.warn("Audio Context init error:", e);
      return null;
    }
  };

  // Génération sonore Korotkoff
  const playKorotkoffSound = (currentP: number) => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (currentP > scenario.pas_cible || currentP < scenario.pad_cible) {
      return;
    }

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const progressInWindow = (scenario.pas_cible - currentP) / (scenario.pas_cible - scenario.pad_cible);
      const freq = 80 + progressInWindow * 25;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const volume = currentP > scenario.pad_cible + 8 ? 0.95 : 0.45;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  };

  // Décompression continue
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isValveOpen && pressure > 0) {
      interval = setInterval(() => {
        setPressure((prev) => {
          const next = Math.max(0, prev - 2.2);
          if (next === 0) setIsValveOpen(false);
          return Math.round(next * 10) / 10;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isValveOpen, pressure]);

  // Battements périodiques
  useEffect(() => {
    const beatIntervalMs = (60 / scenario.bpm) * 1000;
    const beatTimer = setInterval(() => {
      if (pressure > 0) {
        playKorotkoffSound(pressure);
      }
    }, beatIntervalMs);

    return () => clearInterval(beatTimer);
  }, [pressure, scenario, audioEnabled]);

  const handlePump = () => {
    getAudioContext();
    setIsPumping(true);
    setTimeout(() => setIsPumping(false), 200);
    setPressure((prev) => Math.min(280, Math.round(prev + 25)));
  };

  const handleReset = () => {
    setPressure(0);
    setIsValveOpen(false);
    setMarkedPas(null);
    setMarkedPad(null);
    setIsEvaluated(false);
    setEvaluationResult(null);
  };

  const handleEvaluate = () => {
    if (markedPas === null || markedPad === null) return;
    const pasError = Math.abs(markedPas - scenario.pas_cible);
    const padError = Math.abs(markedPad - scenario.pad_cible);
    const isPasExact = pasError <= 5;
    const isPadExact = padError <= 5;
    const isExcellent = isPasExact && isPadExact;

    setEvaluationResult({
      isExcellent,
      pasError,
      padError,
      isPasExact,
      isPadExact,
      pas_reel: scenario.pas_cible,
      pad_reel: scenario.pad_cible,
      xp: isExcellent ? 30 : isPasExact || isPadExact ? 15 : 5,
    });
    setIsEvaluated(true);

    if (isExcellent && typeof confetti === "function") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const isKorotkoffAudible = pressure > 0 && pressure <= scenario.pas_cible && pressure >= scenario.pad_cible;
  const needleAngle = -135 + (pressure / 300) * 270;
  const cuffScale = 1 + (pressure / 280) * 0.28;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }} className="space-y-4">
      {/* 1. SÉLECTEUR DE PATIENT (STYLE CARTOON DUOLINGO) */}
      <div
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)",
          border: "3px solid #cbd5e1",
          borderRadius: "24px",
          padding: "12px 18px",
          boxShadow: "0 4px 0 #94a3b8",
        }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "22px" }}>🏥</span>
          <span style={{ fontWeight: "900", fontSize: "13px", color: "#1e1b4b" }}>
            Patient :
          </span>
          <div className="flex gap-1.5">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  getAudioContext();
                  setScenarioIndex(idx);
                  handleReset();
                }}
                style={{
                  background: scenarioIndex === idx ? "#4f46e5" : "#ffffff",
                  color: scenarioIndex === idx ? "#ffffff" : "#334155",
                  border: "2px solid",
                  borderColor: scenarioIndex === idx ? "#3730a3" : "#cbd5e1",
                  borderRadius: "14px",
                  padding: "6px 12px",
                  fontWeight: "800",
                  fontSize: "12px",
                  boxShadow: scenarioIndex === idx ? "0 3px 0 #312e81" : "0 2px 0 #cbd5e1",
                  transform: scenarioIndex === idx ? "translateY(-1px)" : "none",
                  cursor: "pointer",
                }}
              >
                {s.avatar} {s.nom.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#475569", fontWeight: "700" }}>
          {scenario.avatar} <strong>{scenario.nom}</strong> ({scenario.age} ans) • ❤️ {scenario.bpm} bpm
        </div>
      </div>

      {/* 2. SCÈNE CLINIQUE ANIMÉE (DR. PULSE + PATIENT + MANOMÈTRE) */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          border: "3px solid #cbd5e1",
          borderRadius: "28px",
          padding: "18px",
          boxShadow: "0 6px 0 #94a3b8",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* A. LA SCÈNE DU PATIENT AVEC BRASSARD QUI GONFLE */}
          <div
            style={{
              background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
              border: "3px solid #7dd3fc",
              borderRadius: "24px",
              padding: "14px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
            className="md:col-span-6 flex flex-col items-center justify-center min-h-[250px]"
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "14px",
                fontSize: "10px",
                fontWeight: "900",
                color: "#0369a1",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Salle de consultation
            </div>

            {/* Personnages */}
            <div className="relative flex items-center justify-center gap-6 my-2">
              {/* Patient */}
              <div className="flex flex-col items-center">
                <div style={{ fontSize: "58px", lineHeight: "1" }} className="animate-bounce-short">
                  {scenario.avatar}
                </div>
                <span
                  style={{
                    background: "#ffffff",
                    border: "2px solid #38bdf8",
                    borderRadius: "10px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: "900",
                    color: "#0369a1",
                    marginTop: "4px",
                  }}
                >
                  {scenario.nom.split(" ")[0]}
                </span>
              </div>

              {/* Brassard Gonflable */}
              <div className="flex flex-col items-center relative">
                <div style={{ fontSize: "9px", fontWeight: "800", color: "#0284c7", marginBottom: "2px" }}>
                  Brassard
                </div>

                <div
                  style={{
                    width: "56px",
                    height: "40px",
                    background: isKorotkoffAudible ? "#ec4899" : "#4f46e5",
                    border: "3px solid #1e1b4b",
                    borderRadius: "12px",
                    boxShadow: "0 4px 0 #1e1b4b",
                    transform: `scale(${cuffScale})`,
                    transition: "transform 0.15s ease-out, background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{pressure > 0 ? "💨" : "🩺"}</span>
                </div>

                {/* Stéthoscope */}
                <div style={{ fontSize: "20px", marginTop: "-8px", zIndex: 10 }}>🎧</div>

                {/* Bulle Sonore */}
                {isKorotkoffAudible && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-24px",
                      background: "#f43f5e",
                      color: "#ffffff",
                      fontWeight: "900",
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      border: "2px solid #881337",
                      boxShadow: "0 2px 0 #881337",
                      whiteSpace: "nowrap",
                    }}
                    className="animate-bounce"
                  >
                    🎵 TOC ! TOC !
                  </div>
                )}
              </div>

              {/* Dr. Pulse */}
              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontSize: "48px",
                    lineHeight: "1",
                    transform: isPumping ? "scale(0.85) rotate(-8deg)" : "scale(1)",
                    transition: "transform 0.1s",
                  }}
                >
                  ❤️
                </div>
                <span
                  style={{
                    background: "#ffffff",
                    border: "2px solid #f43f5e",
                    borderRadius: "10px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: "900",
                    color: "#e11d48",
                    marginTop: "4px",
                  }}
                >
                  Dr. Pulse
                </span>
              </div>
            </div>

            {/* Indicateur Sonore */}
            <div
              style={{
                background: "#ffffff",
                border: "2px solid #bae6fd",
                borderRadius: "14px",
                padding: "3px 10px",
                fontSize: "10px",
                fontWeight: "800",
                color: isKorotkoffAudible ? "#e11d48" : "#0284c7",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>
                {isKorotkoffAudible
                  ? "🔊 Bruits de Korotkoff perçus !"
                  : pressure > scenario.pas_cible
                  ? "🤫 Artère occluse (Silence)"
                  : "🤫 Silence diastolique"}
              </span>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "13px" }}
                title="Activer/Couper le son"
              >
                {audioEnabled ? "🔔" : "🔕"}
              </button>
            </div>
          </div>

          {/* B. LE MANOMÈTRE ANÉROÏDE */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
              border: "3px solid #312e81",
              borderRadius: "24px",
              padding: "14px",
              boxShadow: "0 4px 0 #1e1b4b",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:col-span-6 text-white"
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "1px",
                color: "#a5b4fc",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Manomètre Anéroïde (mmHg)
            </div>

            <div
              style={{
                position: "relative",
                width: "175px",
                height: "175px",
                background: "#020617",
                borderRadius: "50%",
                border: "5px solid #6366f1",
                boxShadow: "inset 0 0 15px rgba(0,0,0,0.8), 0 4px 0 #312e81",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", position: "absolute" }}>
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeDasharray="360"
                  strokeDashoffset="90"
                  transform="rotate(135 100 100)"
                />

                {Array.from({ length: 16 }).map((_, i) => {
                  const val = i * 20;
                  const angle = -135 + (val / 300) * 270;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 100 + 70 * Math.cos(rad);
                  const y1 = 100 + 70 * Math.sin(rad);
                  const x2 = 100 + 82 * Math.cos(rad);
                  const y2 = 100 + 82 * Math.sin(rad);
                  const textX = 100 + 56 * Math.cos(rad);
                  const textY = 100 + 56 * Math.sin(rad);

                  return (
                    <g key={val}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={i % 5 === 0 ? "3" : "1.5"} />
                      {i % 2 === 0 && (
                        <text
                          x={textX}
                          y={textY}
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {val}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div
                style={{
                  position: "absolute",
                  width: "4px",
                  height: "72px",
                  background: "#f43f5e",
                  borderRadius: "4px",
                  transform: `rotate(${needleAngle}deg)`,
                  transformOrigin: "50% 90%",
                  transition: "transform 100ms linear",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "3px solid #0f172a",
                  zIndex: 20,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  background: "#1e293b",
                  border: "2px solid #475569",
                  borderRadius: "8px",
                  padding: "2px 8px",
                  fontSize: "13px",
                  fontWeight: "900",
                  fontFamily: "monospace",
                  color: "#38bdf8",
                }}
              >
                {Math.round(pressure)} <span style={{ fontSize: "9px", color: "#94a3b8" }}>mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MANETTES DUOLINGO (BOUTONS 3D) */}
        <div className="mt-4 space-y-3">
          {/* Étape 1 : Gonfler / Dégonfler */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handlePump}
              style={{
                background: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
                border: "3px solid #3730a3",
                borderRadius: "16px",
                padding: "10px 6px",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "12px",
                boxShadow: "0 4px 0 #312e81",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              <span>🎈 Gonfler la poire</span>
              <span style={{ fontSize: "10px", opacity: 0.85 }}>+25 mmHg</span>
            </button>

            <button
              onClick={() => {
                getAudioContext();
                setIsValveOpen(!isValveOpen);
              }}
              disabled={pressure === 0}
              style={{
                background: isValveOpen
                  ? "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)"
                  : "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
                border: "3px solid",
                borderColor: isValveOpen ? "#b45309" : "#cbd5e1",
                borderRadius: "16px",
                padding: "10px 6px",
                color: isValveOpen ? "#ffffff" : "#334155",
                fontWeight: "900",
                fontSize: "12px",
                boxShadow: isValveOpen ? "0 4px 0 #78350f" : "0 4px 0 #94a3b8",
                cursor: pressure === 0 ? "not-allowed" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              <span>{isValveOpen ? "⏸️ Pause" : "💨 Dégonfler"}</span>
              <span style={{ fontSize: "10px", opacity: 0.85 }}>2-3 mmHg / s</span>
            </button>

            <button
              onClick={handleReset}
              style={{
                background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "3px solid #cbd5e1",
                borderRadius: "16px",
                padding: "10px 6px",
                color: "#64748b",
                fontWeight: "900",
                fontSize: "12px",
                boxShadow: "0 4px 0 #94a3b8",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              <span>🔄 Réinitialiser</span>
              <span style={{ fontSize: "10px", opacity: 0.85 }}>0 mmHg</span>
            </button>
          </div>

          {/* Étape 2 : Clics Top Systole & Top Diastole */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => setMarkedPas(Math.round(pressure))}
              disabled={pressure === 0}
              style={{
                background: markedPas !== null ? "#ecfdf5" : "#ffffff",
                border: "3px solid",
                borderColor: markedPas !== null ? "#10b981" : "#cbd5e1",
                borderRadius: "16px",
                padding: "10px 12px",
                color: markedPas !== null ? "#065f46" : "#1e293b",
                fontWeight: "900",
                fontSize: "12px",
                boxShadow: markedPas !== null ? "0 4px 0 #047857" : "0 4px 0 #cbd5e1",
                cursor: pressure === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              <span>🎯 1. Top Systole (PAS)</span>
              <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "900" }}>
                {markedPas !== null ? `${markedPas} mmHg` : "Premier bruit"}
              </span>
            </button>

            <button
              onClick={() => setMarkedPad(Math.round(pressure))}
              disabled={pressure === 0}
              style={{
                background: markedPad !== null ? "#ecfdf5" : "#ffffff",
                border: "3px solid",
                borderColor: markedPad !== null ? "#10b981" : "#cbd5e1",
                borderRadius: "16px",
                padding: "10px 12px",
                color: markedPad !== null ? "#065f46" : "#1e293b",
                fontWeight: "900",
                fontSize: "12px",
                boxShadow: markedPad !== null ? "0 4px 0 #047857" : "0 4px 0 #cbd5e1",
                cursor: pressure === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              <span>🎯 2. Top Diastole (PAD)</span>
              <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "900" }}>
                {markedPad !== null ? `${markedPad} mmHg` : "Silence complet"}
              </span>
            </button>
          </div>

          {/* Bouton Valider l'évaluation */}
          {markedPas !== null && markedPad !== null && !isEvaluated && (
            <button
              onClick={handleEvaluate}
              style={{
                width: "100%",
                background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                border: "3px solid #047857",
                borderRadius: "18px",
                padding: "12px",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 4px 0 #064e3b",
                cursor: "pointer",
              }}
              className="active:translate-y-1 active:shadow-none transition-all animate-bounce"
            >
              🏆 Vérifier et évaluer ma mesure sémiologique !
            </button>
          )}
        </div>
      </div>

      {/* 4. RÉSULTAT & SCORE GAMIFIÉ DUOLINGO */}
      {isEvaluated && evaluationResult && (
        <div
          style={{
            background: "#ffffff",
            border: "3px solid",
            borderColor: evaluationResult.isExcellent ? "#10b981" : "#f59e0b",
            borderRadius: "24px",
            padding: "16px",
            boxShadow: `0 6px 0 ${evaluationResult.isExcellent ? "#047857" : "#b45309"}`,
          }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "28px" }}>
                {evaluationResult.isExcellent ? "🎉" : "🩺"}
              </span>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                  {evaluationResult.isExcellent
                    ? "Parfait ! Précision de cardiologue !"
                    : "Bien joué ! Mesure enregistrée"}
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                  Récompense : +{evaluationResult.xp} XP • {scenario.nom}
                </p>
              </div>
            </div>

            <div className="flex gap-4 text-xs font-mono">
              <div>
                <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Votre saisie</span>
                <strong style={{ fontSize: "13px", color: "#4f46e5" }}>
                  {markedPas} / {markedPad} mmHg
                </strong>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Pression réelle</span>
                <strong style={{ fontSize: "13px", color: "#059669" }}>
                  {scenario.pas_cible} / {scenario.pad_cible} mmHg
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: "14px",
              padding: "10px 12px",
              fontSize: "12px",
              color: "#334155",
              lineHeight: "1.4",
              fontWeight: "600",
            }}
          >
            💡 <strong>Rappel clinique</strong> : {scenario.description} (Phase I de Korotkoff = PAS, Phase V = PAD).
          </div>

          <button
            onClick={() => {
              setScenarioIndex((scenarioIndex + 1) % SCENARIOS.length);
              handleReset();
            }}
            style={{
              width: "100%",
              background: "#0f172a",
              border: "3px solid #020617",
              borderRadius: "16px",
              padding: "10px",
              color: "#ffffff",
              fontWeight: "900",
              fontSize: "13px",
              boxShadow: "0 4px 0 #020617",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            className="active:translate-y-1 active:shadow-none transition-all"
          >
            <span>Passer au patient suivant ({scenarioIndex + 1}/{SCENARIOS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
