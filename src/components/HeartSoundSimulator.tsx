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
import { playRetroSound } from "@/lib/rpg/audio";

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
];

export default function HeartSoundSimulator() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedFoyer, setSelectedFoyer] = useState<string>("mitral");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizSecretIndex, setQuizSecretIndex] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);

  const currentTrack = SOUND_TRACKS[isQuizMode && quizSecretIndex !== null ? quizSecretIndex : currentTrackIndex];

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

  const playCycleSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const attenuation = selectedFoyer === currentTrack.foyer_optimal ? 1 : 0.45;
      const gainFactor = volume * attenuation;

      // 1. BRUIT B1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      gain1.gain.setValueAtTime(0.35 * gainFactor, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // 2. SOUFFLES SYSTOLIQUES
      if (currentTrack.id === "ra" || currentTrack.id === "im") {
        const dur = currentTrack.id === "ra" ? 0.22 : 0.28;
        const bufferSize = ctx.sampleRate * dur;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = currentTrack.id === "ra" ? "bandpass" : "lowpass";
        filter.frequency.value = currentTrack.id === "ra" ? 350 : 500;
        filter.Q.value = currentTrack.id === "ra" ? 2.5 : 1;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now + 0.05);
        if (currentTrack.id === "ra") {
          noiseGain.gain.linearRampToValueAtTime(0.25 * gainFactor, now + 0.14);
          noiseGain.gain.linearRampToValueAtTime(0.001, now + 0.28);
        } else {
          noiseGain.gain.setValueAtTime(0.18 * gainFactor, now + 0.05);
          noiseGain.gain.linearRampToValueAtTime(0.001, now + 0.32);
        }

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now + 0.05);
        noise.stop(now + 0.34);
      }

      // 3. BRUIT B2
      const tB2 = now + 0.32;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(110, tB2);
      osc2.frequency.exponentialRampToValueAtTime(45, tB2 + 0.05);
      gain2.gain.setValueAtTime(0.25 * gainFactor, tB2);
      gain2.gain.exponentialRampToValueAtTime(0.001, tB2 + 0.06);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(tB2);
      osc2.stop(tB2 + 0.07);

      // 4. BRUIT B3
      if (currentTrack.id === "galop") {
        const tB3 = tB2 + 0.14;
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(40, tB3);
        osc3.frequency.exponentialRampToValueAtTime(25, tB3 + 0.06);
        gain3.gain.setValueAtTime(0.25 * gainFactor, tB3);
        gain3.gain.exponentialRampToValueAtTime(0.001, tB3 + 0.07);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(tB3);
        osc3.stop(tB3 + 0.08);
      }

      // 5. SOUFFLE DIASTOLIQUE
      if (currentTrack.id === "ia") {
        const dur = 0.35;
        const bufferSize = ctx.sampleRate * dur;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 600;
        filter.Q.value = 1.2;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18 * gainFactor, tB2 + 0.02);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, tB2 + 0.35);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(tB2 + 0.02);
        noise.stop(tB2 + 0.36);
      }
    } catch {}
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / currentTrack.bpm) * 1000;
      playCycleSound();
      timerRef.current = setInterval(() => {
        playCycleSound();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack, selectedFoyer, volume]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying(!isPlaying);
    playRetroSound("click");
  };

  const startQuiz = () => {
    const r = Math.floor(Math.random() * SOUND_TRACKS.length);
    setQuizSecretIndex(r);
    setIsQuizMode(true);
    setQuizAnswer(null);
    setIsQuizSubmitted(false);
    setIsPlaying(true);
    playRetroSound("click");
  };

  const handleQuizSubmit = (trackId: string) => {
    setQuizAnswer(trackId);
    setIsQuizSubmitted(true);
    if (trackId === SOUND_TRACKS[quizSecretIndex!].id) {
      playRetroSound("victory");
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      playRetroSound("wrong");
    }
  };

  const foyers = [
    { id: "aortique", label: "Aortique", code: "A", sub: "2e EIC D", color: "#f43f5e" },
    { id: "pulmonaire", label: "Pulmonaire", code: "P", sub: "2e EIC G", color: "#38bdf8" },
    { id: "tricuspide", label: "Tricuspide", code: "T", sub: "Xiphoïde", color: "#f59e0b" },
    { id: "mitral", label: "Mitral", code: "M", sub: "Apex 5e", color: "#10b981" },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 1. EN-TÊTE AVEC BOUTON DÉFI */}
      <div className="card-rpg flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎧</span>
          <div>
            <h2 className="text-base font-black text-white">
              Stéthoscope Virtuel Interactif
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Synthèse acoustique Web Audio des vrais bruits et souffles cardiaques
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
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 border ${
            isQuizMode
              ? "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
              : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-950" />
          <span>{isQuizMode ? "Quitter le défi" : "🎯 Mode Défi Aveugle"}</span>
        </button>
      </div>

      {/* 2. SCÈNE D'AUSCULTATION */}
      <div className="card-rpg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* A. LECTEUR D'ONDE & DR. PULSE */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-inner">
            <div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-indigo-400">
                <span>{isQuizMode ? "Patient Mystère" : currentTrack.type}</span>
                <span>❤️ {currentTrack.bpm} bpm</span>
              </div>
              <h3 className="text-base font-black text-white mt-1 line-clamp-2">
                {isQuizMode ? "Écoutez attentivement..." : currentTrack.nom}
              </h3>
            </div>

            {/* Onde sonore animée */}
            <div className="h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center gap-1 px-3 overflow-hidden">
              {isPlaying ? (
                Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "4px",
                      background: "linear-gradient(180deg, #38bdf8 0%, #ec4899 100%)",
                      borderRadius: "4px",
                      height: `${Math.max(15, (Math.sin(i * 0.6) * 0.5 + 0.5) * 100)}%`,
                      transition: "height 0.2s ease",
                    }}
                  />
                ))
              ) : (
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <span>⏸️ Stéthoscope en pause</span>
                </span>
              )}
            </div>

            {/* Bouton Play/Stop */}
            <button
              onClick={togglePlay}
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isPlaying
                  ? "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-rose-600/30"
                  : "btn-rpg-indigo"
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? "Couper l'écoute" : "Poser le stéthoscope"}</span>
            </button>
          </div>

          {/* B. SÉLECTEUR DE FOYER ANATOMIQUE */}
          <div className="md:col-span-7 space-y-3">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Position du Stéthoscope (Foyer d&apos;Écoute) :
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {foyers.map((f) => {
                const isSelected = selectedFoyer === f.id;
                const isOptimal = f.id === currentTrack.foyer_optimal;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      getAudioContext();
                      setSelectedFoyer(f.id);
                      playRetroSound("click");
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-amber-400 bg-slate-900 shadow-md shadow-amber-500/10 scale-[1.01]"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-xl font-black text-xs text-white flex items-center justify-center shrink-0 shadow-xs"
                      style={{ background: f.color }}
                    >
                      {f.code}
                    </span>
                    <div>
                      <div className="font-black text-xs text-white">{f.label}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {f.sub} {!isQuizMode && isOptimal && "⭐ Optimal"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. LISTE DES BRUITS CARDIAQUES (EN MODE LIBRE) */}
        {!isQuizMode && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Bibliothèque des Signes Acoustiques :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    getAudioContext();
                    setCurrentTrackIndex(idx);
                    setSelectedFoyer(t.foyer_optimal);
                    setIsPlaying(true);
                    playRetroSound("click");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    currentTrackIndex === idx
                      ? "border-amber-400 bg-slate-900 text-white font-bold"
                      : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>{t.nom}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{t.bpm} bpm</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                    {t.description_fr}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. MODE DÉFI AVEUGLE */}
        {isQuizMode && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Quel diagnostic acoustique reconnais-tu ?
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_TRACKS.map((t) => {
                const isSelected = quizAnswer === t.id;
                const isCorrect = isQuizSubmitted && t.id === SOUND_TRACKS[quizSecretIndex!].id;
                const isWrong = isQuizSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={t.id}
                    disabled={isQuizSubmitted}
                    onClick={() => handleQuizSubmit(t.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 font-black"
                        : isWrong
                        ? "border-rose-500 bg-rose-950/60 text-rose-300"
                        : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold">{t.nom}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isQuizSubmitted && (
              <div className="space-y-3 pt-2">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-medium">
                  💡 <strong className="text-amber-400">Explication clinique</strong> : {SOUND_TRACKS[quizSecretIndex!].description_fr}
                </div>
                <button
                  onClick={startQuiz}
                  className="btn-rpg-gold w-full py-3.5 text-xs font-black uppercase tracking-wider"
                >
                  <span>Passer au patient mystère suivant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
