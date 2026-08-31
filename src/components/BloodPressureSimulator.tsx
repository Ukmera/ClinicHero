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
  Stethoscope,
} from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";

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
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  // Son de Korotkoff
  const playKorotkoffSound = () => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  };

  // Son de Gonflage
  const playPumpSound = () => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  };

  // Décharge progressive
  useEffect(() => {
    let timer: any;
    if (isValveOpen && pressure > 0) {
      timer = setInterval(() => {
        setPressure((prev) => {
          if (prev <= 1) {
            setIsValveOpen(false);
            return 0;
          }
          return Math.max(0, prev - 2.5);
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isValveOpen, pressure]);

  // Battements de Korotkoff
  useEffect(() => {
    let beatTimer: any;
    if (pressure > 0 && isValveOpen) {
      const intervalMs = (60 / scenario.bpm) * 1000;
      beatTimer = setInterval(() => {
        if (pressure <= scenario.pas_cible && pressure >= scenario.pad_cible) {
          playKorotkoffSound();
        }
      }, intervalMs);
    }
    return () => clearInterval(beatTimer);
  }, [pressure, isValveOpen, scenario, audioEnabled]);

  const handlePump = () => {
    getAudioContext();
    playPumpSound();
    setIsPumping(true);
    setTimeout(() => setIsPumping(false), 150);
    setPressure((prev) => Math.min(280, prev + 25));
  };

  const handleReset = () => {
    setIsValveOpen(false);
    setPressure(0);
    setMarkedPas(null);
    setMarkedPad(null);
    setIsEvaluated(false);
    setEvaluationResult(null);
    playRetroSound("click");
  };

  const handleEvaluate = () => {
    if (markedPas === null || markedPad === null) return;

    const pasError = Math.abs(markedPas - scenario.pas_cible);
    const padError = Math.abs(markedPad - scenario.pad_cible);

    const isPasExact = pasError <= 10;
    const isPadExact = padError <= 10;
    const isExcellent = pasError <= 5 && padError <= 5;

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

    if (isExcellent) {
      playRetroSound("victory");
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      playRetroSound("correct");
    }
  };

  const isKorotkoffAudible = pressure > 0 && pressure <= scenario.pas_cible && pressure >= scenario.pad_cible;
  const needleAngle = -135 + (pressure / 300) * 270;
  const cuffScale = 1 + (pressure / 280) * 0.28;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 1. SÉLECTEUR DE PATIENT */}
      <div className="card-rpg flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xl">🏥</span>
          <span className="font-black text-xs text-amber-400 uppercase tracking-wider">
            Patient :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  getAudioContext();
                  setScenarioIndex(idx);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 border ${
                  scenarioIndex === idx
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>{s.avatar}</span>
                <span>{s.nom.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-300 font-bold">
          {scenario.avatar} <strong className="text-white">{scenario.nom}</strong> ({scenario.age} ans) • ❤️ {scenario.bpm} bpm
        </div>
      </div>

      {/* 2. SCÈNE CLINIQUE ANIMÉE (DR. PULSE + PATIENT + MANOMÈTRE) */}
      <div className="card-rpg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* A. LA SCÈNE DU PATIENT AVEC BRASSARD QUI GONFLE */}
          <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px] shadow-inner">
            <div className="absolute top-3 left-4 text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Salle de consultation
            </div>

            {/* Personnages */}
            <div className="relative flex items-center justify-center gap-6 my-4">
              {/* Patient */}
              <div className="flex flex-col items-center">
                <div className="text-5xl leading-none animate-bounce-short">
                  {scenario.avatar}
                </div>
                <span className="bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold mt-1 shadow-xs">
                  {scenario.nom.split(" ")[0]}
                </span>
              </div>

              {/* Brassard Gonflable */}
              <div className="flex flex-col items-center relative">
                <div className="text-[10px] font-black text-indigo-400 mb-1">
                  Brassard
                </div>

                <div
                  className={`w-14 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isKorotkoffAudible
                      ? "bg-rose-600 border-rose-400 shadow-rose-500/30"
                      : "bg-indigo-600 border-indigo-400 shadow-indigo-500/30"
                  } shadow-md`}
                  style={{
                    transform: `scale(${cuffScale})`,
                  }}
                >
                  <span className="text-base">{pressure > 0 ? "💨" : "🩺"}</span>
                </div>

                {/* Stéthoscope */}
                <div className="text-xl -mt-2 z-10">🎧</div>

                {/* Bulle Sonore */}
                {isKorotkoffAudible && (
                  <div className="absolute -top-7 bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full border border-rose-400 shadow-md animate-bounce whitespace-nowrap">
                    🎵 TOC ! TOC !
                  </div>
                )}
              </div>

              {/* Dr. Pulse */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-4xl leading-none transition-transform ${
                    isPumping ? "scale-90 rotate-[-8deg]" : "scale-100"
                  }`}
                >
                  ❤️
                </div>
                <span className="bg-rose-950 border border-rose-700 text-rose-300 px-2.5 py-0.5 rounded-lg text-[10px] font-black mt-1 shadow-xs">
                  Dr. Pulse
                </span>
              </div>
            </div>

            {/* Indicateur Sonore */}
            <div className="bg-slate-900 border border-slate-700 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold flex items-center gap-2 shadow-xs">
              <span className={isKorotkoffAudible ? "text-rose-400" : "text-slate-400"}>
                {isKorotkoffAudible
                  ? "🔊 Bruits de Korotkoff perçus !"
                  : pressure > scenario.pas_cible
                  ? "🤫 Artère occluse (Silence)"
                  : "🤫 Silence diastolique"}
              </span>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Activer/Couper le son"
              >
                {audioEnabled ? "🔔" : "🔕"}
              </button>
            </div>
          </div>

          {/* B. LE MANOMÈTRE ANÉROÏDE */}
          <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center shadow-inner">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">
              Manomètre Anéroïde (mmHg)
            </div>

            <div className="relative w-44 h-44 bg-slate-950 rounded-full border-4 border-indigo-500/80 shadow-2xl flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full absolute">
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

              {/* Aiguille rouge */}
              <div
                className="absolute w-1 h-18 bg-rose-500 rounded-full origin-bottom shadow-lg"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                  transformOrigin: "50% 90%",
                  transition: "transform 100ms linear",
                }}
              />

              {/* Centre de cadran */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-950 z-20" />

              {/* Pression Digitale */}
              <div className="absolute bottom-4 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-0.5 text-xs font-black font-mono text-cyan-400 shadow-sm">
                {Math.round(pressure)} <span className="text-[9px] text-slate-400">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MANETTES DUOLINGO (BOUTONS RPG 3D) */}
        <div className="space-y-3 pt-2">
          {/* Étape 1 : Gonfler / Dégonfler */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handlePump}
              className="btn-rpg-indigo py-3 px-2 text-xs flex-col"
            >
              <span>🎈 Gonfler poire</span>
              <span className="text-[10px] text-indigo-200">+25 mmHg</span>
            </button>

            <button
              onClick={() => {
                getAudioContext();
                setIsValveOpen(!isValveOpen);
              }}
              disabled={pressure === 0}
              className={`py-3 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all border ${
                isValveOpen
                  ? "bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800 disabled:opacity-40"
              }`}
            >
              <span>{isValveOpen ? "⏸️ Pause" : "💨 Dégonfler"}</span>
              <span className="text-[10px] opacity-75">2-3 mmHg / s</span>
            </button>

            <button
              onClick={handleReset}
              className="py-3 px-2 rounded-2xl font-black text-xs bg-slate-900 text-slate-400 border border-slate-800 hover:text-white flex flex-col items-center justify-center"
            >
              <span>🔄 Reset</span>
              <span className="text-[10px] opacity-60">0 mmHg</span>
            </button>
          </div>

          {/* Étape 2 : Clics Top Systole & Top Diastole */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                setMarkedPas(Math.round(pressure));
                playRetroSound("click");
              }}
              disabled={pressure === 0}
              className={`p-3 rounded-2xl border-2 font-black text-xs flex items-center justify-between transition-all ${
                markedPas !== null
                  ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md"
                  : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 disabled:opacity-40"
              }`}
            >
              <span>🎯 1. Top Systole (PAS)</span>
              <span className="font-mono text-xs font-black">
                {markedPas !== null ? `${markedPas} mmHg` : "1er bruit"}
              </span>
            </button>

            <button
              onClick={() => {
                setMarkedPad(Math.round(pressure));
                playRetroSound("click");
              }}
              disabled={pressure === 0}
              className={`p-3 rounded-2xl border-2 font-black text-xs flex items-center justify-between transition-all ${
                markedPad !== null
                  ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md"
                  : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 disabled:opacity-40"
              }`}
            >
              <span>🎯 2. Top Diastole (PAD)</span>
              <span className="font-mono text-xs font-black">
                {markedPad !== null ? `${markedPad} mmHg` : "Silence"}
              </span>
            </button>
          </div>

          {/* Bouton Valider l'évaluation */}
          {markedPas !== null && markedPad !== null && !isEvaluated && (
            <button
              onClick={handleEvaluate}
              className="btn-rpg-gold w-full py-4 text-xs font-black uppercase tracking-wider animate-bounce-short shadow-amber-500/25"
            >
              🏆 Vérifier et évaluer ma mesure sémiologique !
            </button>
          )}
        </div>
      </div>

      {/* 4. RÉSULTAT & SCORE GAMIFIÉ */}
      {isEvaluated && evaluationResult && (
        <div
          className={`card-rpg space-y-3 border-2 ${
            evaluationResult.isExcellent ? "border-emerald-500 shadow-emerald-500/10" : "border-amber-400 shadow-amber-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {evaluationResult.isExcellent ? "🎉" : "🩺"}
              </span>
              <div>
                <h3 className="text-base font-black text-white">
                  {evaluationResult.isExcellent
                    ? "Parfait ! Précision de cardiologue !"
                    : "Bien joué ! Mesure enregistrée"}
                </h3>
                <p className="text-xs font-black text-amber-400">
                  Récompense : +{evaluationResult.xp} XP • {scenario.nom}
                </p>
              </div>
            </div>

            <div className="flex gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Votre saisie</span>
                <strong className="text-sm text-cyan-400">
                  {markedPas} / {markedPad} mmHg
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Pression réelle</span>
                <strong className="text-sm text-emerald-400">
                  {scenario.pas_cible} / {scenario.pad_cible} mmHg
                </strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 leading-relaxed font-medium">
            💡 <strong className="text-amber-400">Rappel clinique</strong> : {scenario.description} (Phase I de Korotkoff = PAS, Phase V = PAD).
          </div>

          <button
            onClick={() => {
              setScenarioIndex((scenarioIndex + 1) % SCENARIOS.length);
              handleReset();
            }}
            className="btn-rpg-gold w-full py-3.5 text-xs font-black uppercase tracking-wider"
          >
            <span>Passer au patient suivant ({scenarioIndex + 1}/{SCENARIOS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
