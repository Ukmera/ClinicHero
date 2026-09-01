"use client";

import React from "react";

interface GrandBlouseAvatarProps {
  emotion?: "speaking" | "thinking" | "happy" | "alert" | "idle";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}

export default function GrandBlouseAvatar({
  emotion = "idle",
  size = "lg",
  className = "",
  glow = true,
}: GrandBlouseAvatarProps) {
  const sizeMap = {
    sm: "w-12 h-14",
    md: "w-20 h-24",
    lg: "w-28 h-34",
    xl: "w-36 h-44",
  };

  // Couleurs spectrales selon l'émotion
  const getSpectralColor = () => {
    switch (emotion) {
      case "happy":
        return "rgba(251, 191, 36, 0.7)"; // Or éclatant
      case "alert":
        return "rgba(244, 63, 94, 0.7)"; // Rouge alerte
      case "speaking":
      case "thinking":
      case "idle":
      default:
        return "rgba(56, 189, 248, 0.65)"; // Bleu spectral éthéré
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      style={{
        filter: glow ? `drop-shadow(0 0 20px ${getSpectralColor()})` : "none",
      }}
    >
      {/* 1. Onde d'énergie spectrale flottante en arrière-plan */}
      <div className="absolute inset-0 bg-radial from-cyan-400/30 via-indigo-500/15 to-transparent rounded-full blur-xl animate-pulse pointer-events-none" />

      {/* 2. Illustration SVG Vectorielle Détaillée de la Grande Blouse Flottante */}
      <svg
        viewBox="0 0 120 140"
        className={`w-full h-full transform transition-transform duration-500 ${
          emotion === "speaking"
            ? "animate-mentor-float"
            : emotion === "happy"
            ? "scale-105 rotate-2"
            : emotion === "alert"
            ? "animate-hurt"
            : "animate-mentor-float"
        }`}
      >
        <defs>
          {/* Dégradé Blouse Blanche de Médecin */}
          <linearGradient id="blouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Dégradé Ombrage Tissu & Revers */}
          <linearGradient id="reversGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Dégradé Cœur Spectral Éthéré (Intérieur de la Blouse) */}
          <radialGradient id="spectreCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="1" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Dégradé Stéthoscope Doré Sacré */}
          <linearGradient id="stethoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Filtre de brillance magique */}
          <filter id="glowFilt" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3. Lueur Éthérée / Âme Spectrale à l'intérieur du col */}
        <ellipse cx="60" cy="30" rx="18" ry="14" fill="url(#spectreCore)" filter="url(#glowFilt)" />
        
        {/* Yeux / Émanations lumineuses du Spectre à l'intérieur */}
        <circle cx="53" cy="28" r="3" fill="#ffffff" filter="url(#glowFilt)" className="animate-pulse" />
        <circle cx="67" cy="28" r="3" fill="#ffffff" filter="url(#glowFilt)" className="animate-pulse" />
        <path d="M50 24 Q60 21 70 24" stroke="#a5f3fc" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* 4. Tissu Flottant de la Grande Blouse Blanche */}
        {/* Corps principal de la Blouse */}
        <path
          d="M38 32 C30 45, 20 70, 24 120 C40 128, 80 128, 96 120 C100 70, 90 45, 82 32 C75 36, 45 36, 38 32 Z"
          fill="url(#blouseGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          filter="drop-shadow(0 8px 12px rgba(0,0,0,0.35))"
        />

        {/* Col & Revers de médecin ouverts */}
        <path
          d="M38 32 L54 62 L60 62 L46 32 Z"
          fill="url(#reversGrad)"
          stroke="#64748b"
          strokeWidth="1"
        />
        <path
          d="M82 32 L66 62 L60 62 L74 32 Z"
          fill="url(#reversGrad)"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Fente centrale de la blouse & Boutons */}
        <path d="M60 62 L60 124" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="1 1" />
        <circle cx="60" cy="74" r="2" fill="#64748b" />
        <circle cx="60" cy="88" r="2" fill="#64748b" />
        <circle cx="60" cy="102" r="2" fill="#64748b" />

        {/* Poches de la blouse avec stylo magique et caducée */}
        <path d="M34 85 L44 85 L44 98 L34 98 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <path d="M76 85 L86 85 L86 98 L76 98 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <line x1="37" y1="80" x2="37" y2="88" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="82" x2="41" y2="88" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

        {/* 5. Manches Flottantes Éthérées sans bras physiques */}
        {/* Manche gauche */}
        <path
          d="M38 36 C24 45, 12 60, 16 82 C20 84, 28 78, 28 72 C24 58, 32 46, 38 36 Z"
          fill="url(#blouseGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />
        {/* Manche droite */}
        <path
          d="M82 36 C96 45, 108 60, 104 82 C100 84, 92 78, 92 72 C96 58, 88 46, 82 36 Z"
          fill="url(#blouseGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />

        {/* 6. Stéthoscope Doré Magique posé autour du cou */}
        <path
          d="M45 34 C45 60, 52 78, 60 78 C68 78, 75 60, 75 34"
          fill="none"
          stroke="url(#stethoGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glowFilt)"
        />
        {/* Pavillon du stéthoscope qui flotte avec un éclat cyan */}
        <circle cx="60" cy="80" r="5" fill="url(#stethoGold)" stroke="#fef08a" strokeWidth="1" />
        <circle cx="60" cy="80" r="2.5" fill="#38bdf8" filter="url(#glowFilt)" />

        {/* 7. Runes Médicales Lumineuses tissées en bas de la blouse */}
        <path
          d="M32 118 Q60 125 88 118"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.8"
        />
      </svg>

      {/* 8. Particules magiques d'étincelles flottant autour */}
      <div className="absolute -top-1 right-2 text-xs animate-ping pointer-events-none opacity-75">
        ✨
      </div>
      <div className="absolute bottom-2 -left-1 text-[10px] animate-pulse pointer-events-none opacity-60">
        ✦
      </div>
    </div>
  );
}
