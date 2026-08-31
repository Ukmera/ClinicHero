"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Stethoscope,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
} from "lucide-react";

interface SoundTrack {
  id: string;
  nom: string;
  type: string;
  bpm: number;
  foyer_optimal: string;
  foyer_optimal_nom: string;
  description_fr: string;
  reference: string;
}

const SOUND_TRACKS: SoundTrack[] = [
  {
    id: "normal",
    nom: "Rythme Sinusal Normal (B1 - B2)",
    type: "Physiologique",
    bpm: 72,
    foyer_optimal: "mitral",
    foyer_optimal_nom: "Foyer Mitral / Apex (5e EIC)",
    description_fr: "Cycle normal à 2 temps (« Toum-Ta »). B1 sourd à la fermeture AV, B2 sec à la fermeture des sigmoïdes.",
    reference: "[UNESS-Cardio] p.22",
  },
  {
    id: "ra",
    nom: "Rétrécissement Aortique (Souffle éjectionnel)",
    type: "Souffle Systolique",
    bpm: 70,
    foyer_optimal: "aortique",
    foyer_optimal_nom: "Foyer Aortique (2e EIC Droit)",
    description_fr: "Souffle méso-systolique rude et râpeux en losange (crescendo-decrescendo) entre B1 et B2 avec irradiation aux carotides.",
    reference: "[Bourdarias] p.68",
  },
  {
    id: "im",
    nom: "Insuffisance Mitrale (Souffle holosystolique)",
    type: "Souffle Systolique",
    bpm: 78,
    foyer_optimal: "mitral",
    foyer_optimal_nom: "Foyer Mitral / Apex",
    description_fr: "Souffle holosystolique doux en « jet de vapeur » couvrant toute la systole de B1 à B2, irradiant vers l'aisselle.",
    reference: "[Bariéty] p.128",
  },
  {
    id: "galop",
    nom: "Bruit de Galop Gauche (B3 Protodiastolique)",
    type: "Bruit Surajouté",
    bpm: 85,
    foyer_optimal: "mitral",
    foyer_optimal_nom: "Foyer Mitral / Apex",
    description_fr: "Bruit sourd protodiastolique survenant juste après B2 (« Toum-Ta-Ta »), rythme à 3 temps d'insuffisance cardiaque.",
    reference: "[Talley & O'Connor] p.66",
  },
  {
    id: "ia",
    nom: "Insuffisance Aortique (Souffle holodiastolique)",
    type: "Souffle Diastolique",
    bpm: 72,
    foyer_optimal: "aortique",
    foyer_optimal_nom: "Bord Sternal Gauche",
    description_fr: "Souffle holodiastolique doux, humé, régressif le long du bord gauche du sternum, débutant dès B2.",
    reference: "[Coustet] p.64",
  },
  {
    id: "frottement",
    nom: "Frottement Péricardique (Péricardite Aiguë)",
    type: "Bruit Péricardique",
    bpm: 88,
    foyer_optimal: "tricuspide",
    foyer_optimal_nom: "Bord Sternal Gauche / Xiphoïde",
    description_fr: "Bruit superficiel râpeux de « cuir neuf », systolo-diastolique à 3 composantes, persistant en apnée.",
    reference: "[UNESS-Cardio] p.18",
  },
];

export default function HeartSoundSimulator() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [activeFoyer, setActiveFoyer] = useState<string>("mitral");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);

  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizSecretIndex, setQuizSecretIndex] = useState(0);
  const [quizGuess, setQuizGuess] = useState<string | null>(null);
  const [quizEvaluated, setQuizEvaluated] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = isQuizMode ? SOUND_TRACKS[quizSecretIndex] : SOUND_TRACKS[selectedTrackIndex];

  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) audioCtxRef.current = new AudioCtx();
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const playCardiacCycle = (track: SoundTrack) => {
    if (!audioCtxRef.current || !isPlaying) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const t = ctx.currentTime;

    // B1
    const oscB1 = ctx.createOscillator();
    const gainB1 = ctx.createGain();
    oscB1.type = "sine";
    oscB1.frequency.setValueAtTime(100, t);
    oscB1.frequency.exponentialRampToValueAtTime(70, t + 0.08);

    gainB1.gain.setValueAtTime(0.001, t);
    gainB1.gain.exponentialRampToValueAtTime(volume * 0.95, t + 0.015);
    gainB1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    oscB1.connect(gainB1);
    gainB1.connect(ctx.destination);
    oscB1.start(t);
    oscB1.stop(t + 0.1);

    // RA
    if (track.id === "ra") {
      const bufferSize = ctx.sampleRate * 0.22;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 350;
      filter.Q.value = 1.8;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t + 0.05);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.15);
      noiseGain.gain.linearRampToValueAtTime(0.001, t + 0.26);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t + 0.05);
    }

    // IM
    if (track.id === "im") {
      const bufferSize = ctx.sampleRate * 0.26;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 650;
      filter.Q.value = 1.2;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t + 0.03);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.6, t + 0.06);
      noiseGain.gain.setValueAtTime(volume * 0.6, t + 0.24);
      noiseGain.gain.linearRampToValueAtTime(0.001, t + 0.28);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t + 0.03);
    }

    // B2
    const tB2 = t + 0.28;
    const oscB2 = ctx.createOscillator();
    const gainB2 = ctx.createGain();
    oscB2.type = "sine";
    oscB2.frequency.setValueAtTime(150, tB2);
    oscB2.frequency.exponentialRampToValueAtTime(110, tB2 + 0.06);
    gainB2.gain.setValueAtTime(0.001, tB2);
    gainB2.gain.exponentialRampToValueAtTime(volume * 0.85, tB2 + 0.012);
    gainB2.gain.exponentialRampToValueAtTime(0.001, tB2 + 0.07);
    oscB2.connect(gainB2);
    gainB2.connect(ctx.destination);
    oscB2.start(tB2);
    oscB2.stop(tB2 + 0.08);

    // B3 Galop
    if (track.id === "galop") {
      const tB3 = t + 0.42;
      const oscB3 = ctx.createOscillator();
      const gainB3 = ctx.createGain();
      oscB3.type = "sine";
      oscB3.frequency.setValueAtTime(65, tB3);
      gainB3.gain.setValueAtTime(0.001, tB3);
      gainB3.gain.exponentialRampToValueAtTime(volume * 0.6, tB3 + 0.015);
      gainB3.gain.exponentialRampToValueAtTime(0.001, tB3 + 0.08);
      oscB3.connect(gainB3);
      gainB3.connect(ctx.destination);
      oscB3.start(tB3);
      oscB3.stop(tB3 + 0.09);
    }

    // IA
    if (track.id === "ia") {
      const bufferSize = ctx.sampleRate * 0.35;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 500;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.5, tB2 + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, tB2 + 0.36);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(tB2 + 0.02);
    }

    // Frottement
    if (track.id === "frottement") {
      const bufferSize = ctx.sampleRate * 0.55;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * (i % 200 > 100 ? 1 : 0.3);
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 2.0;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.4, t + 0.1);
      noiseGain.gain.linearRampToValueAtTime(0.001, t + 0.55);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }
    const intervalMs = (60 / currentTrack.bpm) * 1000;
    playCardiacCycle(currentTrack);
    loopTimerRef.current = setInterval(() => playCardiacCycle(currentTrack), intervalMs);
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isPlaying, currentTrack, volume]);

  const togglePlay = () => {
    if (!isPlaying && audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const startQuiz = () => {
    const rand = Math.floor(Math.random() * SOUND_TRACKS.length);
    setQuizSecretIndex(rand);
    setQuizGuess(null);
    setQuizEvaluated(false);
    setIsQuizMode(true);
    setIsPlaying(true);
  };

  const handleQuizAnswer = (trackId: string) => {
    setQuizGuess(trackId);
    setQuizEvaluated(true);
    if (trackId === currentTrack.id) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const foyers = [
    { id: "aortique", label: "Aortique", code: "A", sub: "2e Droit", color: "#f43f5e" },
    { id: "pulmonaire", label: "Pulmonaire", code: "P", sub: "2e Gauche", color: "#3b82f6" },
    { id: "tricuspide", label: "Tricuspide", code: "T", sub: "Xiphoïde", color: "#eab308" },
    { id: "mitral", label: "Mitral", code: "M", sub: "Apex 5e", color: "#10b981" },
  ];

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }} className="space-y-4">
      {/* 1. CARTOON EN-TÊTE AVEC BOUTON DÉFI 3D */}
      <div
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
          border: "3px solid #cbd5e1",
          borderRadius: "24px",
          padding: "14px 18px",
          boxShadow: "0 4px 0 #94a3b8",
        }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "28px" }}>🎧</span>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#1e1b4b" }}>
              Stéthoscope Virtuel Interactif
            </h2>
            <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>
              Écoute les vrais souffles cardiaques au stéthoscope
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isQuizMode) {
              setIsQuizMode(false);
              setIsPlaying(false);
            } else {
              startQuiz();
            }
          }}
          style={{
            background: isQuizMode
              ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
            color: "#ffffff",
            border: "3px solid",
            borderColor: isQuizMode ? "#020617" : "#b45309",
            borderRadius: "16px",
            padding: "8px 14px",
            fontWeight: "900",
            fontSize: "12px",
            boxShadow: isQuizMode ? "0 3px 0 #020617" : "0 3px 0 #78350f",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          className="active:translate-y-1 active:shadow-none transition-all"
        >
          <Trophy className="w-4 h-4 text-amber-200" />
          <span>{isQuizMode ? "Quitter le défi" : "🎯 Mode Défi Aveugle"}</span>
        </button>
      </div>

      {/* 2. SCÈNE D'AUSCULTATION (CARTOON PATIENT + DR. PULSE) */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
          border: "3px solid #cbd5e1",
          borderRadius: "28px",
          padding: "20px",
          boxShadow: "0 6px 0 #94a3b8",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* A. LECTEUR D'ONDE & DR. PULSE */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
              border: "3px solid #312e81",
              borderRadius: "24px",
              padding: "16px",
              boxShadow: "0 4px 0 #1e1b4b",
              color: "#ffffff",
            }}
            className="md:col-span-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                <span>{isQuizMode ? "Patient Mystère" : currentTrack.type}</span>
                <span>❤️ {currentTrack.bpm} bpm</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "900" }} className="mt-1 line-clamp-2">
                {isQuizMode ? "Écoutez attentivement..." : currentTrack.nom}
              </h3>
            </div>

            {/* Onde sonore animée */}
            <div
              style={{
                height: "60px",
                background: "#020617",
                border: "2px solid #334155",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "0 10px",
                overflow: "hidden",
              }}
            >
              {isPlaying ? (
                Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "4px",
                      background: "linear-gradient(180deg, #38bdf8 0%, #ec4899 100%)",
                      borderRadius: "4px",
                      height: `${Math.max(15, (Math.sin(i * 0.6) * 0.5 + 0.5) * 100)}%`,
                    }}
                    className="animate-pulse"
                  />
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                  ⏸️ Stéthoscope en pause
                </span>
              )}
            </div>

            {/* Bouton Play/Stop 3D Duolingo */}
            <button
              onClick={togglePlay}
              style={{
                width: "100%",
                background: isPlaying
                  ? "linear-gradient(180deg, #e11d48 0%, #be123c 100%)"
                  : "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
                border: "3px solid",
                borderColor: isPlaying ? "#881337" : "#3730a3",
                borderRadius: "18px",
                padding: "12px",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "13px",
                boxShadow: isPlaying ? "0 4px 0 #4c0519" : "0 4px 0 #312e81",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              className="active:translate-y-1 active:shadow-none transition-all"
            >
              {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? "Arrêter l'auscultation" : "Démarrer l'auscultation"}</span>
            </button>
          </div>

          {/* B. SÉLECTION DES FOYERS & BIBLIOTHÈQUE / DÉFI */}
          <div className="md:col-span-7 space-y-3">
            {/* Les 4 Foyers APTM Cartoon */}
            <div className="space-y-1">
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#475569", textTransform: "uppercase" }}>
                Repères d&apos;auscultation (APTM) :
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {foyers.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFoyer(f.id)}
                    style={{
                      background: activeFoyer === f.id ? "#eef2ff" : "#ffffff",
                      border: "2px solid",
                      borderColor: activeFoyer === f.id ? f.color : "#cbd5e1",
                      borderRadius: "14px",
                      padding: "6px 4px",
                      textAlign: "center",
                      boxShadow: activeFoyer === f.id ? `0 2px 0 ${f.color}` : "0 2px 0 #cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "900", fontSize: "12px", color: f.color }}>{f.code}</div>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "700" }}>{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Libre : Liste des souffles */}
            {!isQuizMode ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SOUND_TRACKS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: selectedTrackIndex === idx ? "#e0e7ff" : "#ffffff",
                      border: "2px solid",
                      borderColor: selectedTrackIndex === idx ? "#4f46e5" : "#e2e8f0",
                      borderRadius: "14px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#1e1b4b" }}>{t.nom}</div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>📍 {t.foyer_optimal_nom}</div>
                    </div>
                    {selectedTrackIndex === idx && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Mode Défi Aveugle */
              <div className="space-y-2">
                <div style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a" }}>
                  Quel est le diagnostic auscultatoire ?
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SOUND_TRACKS.map((t) => {
                    const isSelected = quizGuess === t.id;
                    const isCorrect = t.id === currentTrack.id;
                    return (
                      <button
                        key={t.id}
                        disabled={quizEvaluated}
                        onClick={() => handleQuizAnswer(t.id)}
                        style={{
                          background:
                            quizEvaluated && isCorrect
                              ? "#ecfdf5"
                              : isSelected && !isCorrect
                              ? "#fff1f2"
                              : "#ffffff",
                          border: "2px solid",
                          borderColor:
                            quizEvaluated && isCorrect
                              ? "#10b981"
                              : isSelected && !isCorrect
                              ? "#f43f5e"
                              : "#cbd5e1",
                          borderRadius: "14px",
                          padding: "8px 10px",
                          fontSize: "11px",
                          fontWeight: "800",
                          color:
                            quizEvaluated && isCorrect
                              ? "#065f46"
                              : isSelected && !isCorrect
                              ? "#881337"
                              : "#1e293b",
                          textAlign: "left",
                          cursor: quizEvaluated ? "default" : "pointer",
                        }}
                      >
                        {t.nom.split("(")[0]}
                      </button>
                    );
                  })}
                </div>

                {quizEvaluated && (
                  <button
                    onClick={startQuiz}
                    style={{
                      width: "100%",
                      background: "#4f46e5",
                      border: "3px solid #3730a3",
                      borderRadius: "14px",
                      padding: "8px",
                      color: "#ffffff",
                      fontWeight: "900",
                      fontSize: "12px",
                      boxShadow: "0 3px 0 #312e81",
                      cursor: "pointer",
                      marginTop: "6px",
                    }}
                  >
                    Patient suivant ➔
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
