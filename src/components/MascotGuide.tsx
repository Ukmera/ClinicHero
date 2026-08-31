"use client";

import React from "react";
import { Sparkles, HeartPulse, ShieldAlert, Lightbulb } from "lucide-react";

interface MascotGuideProps {
  message: string;
  type?: "tip" | "alert" | "encouraging" | "thinking";
  title?: string;
}

export default function MascotGuide({
  message,
  type = "tip",
  title,
}: MascotGuideProps) {
  const getConfig = () => {
    switch (type) {
      case "alert":
        return {
          badge: "Attention Drapeau Rouge",
          badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
          bubbleBg: "bg-rose-50/80 border-rose-200 text-rose-950",
          iconColor: "text-rose-600",
          avatarEmoji: "🚨",
          avatarBg: "bg-rose-500",
        };
      case "encouraging":
        return {
          badge: "Conseil du Dr. Pulse",
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
          bubbleBg: "bg-emerald-50/80 border-emerald-200 text-emerald-950",
          iconColor: "text-emerald-600",
          avatarEmoji: "🩺",
          avatarBg: "bg-emerald-600",
        };
      case "thinking":
        return {
          badge: "Réflexion Clinique",
          badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
          bubbleBg: "bg-purple-50/80 border-purple-200 text-purple-950",
          iconColor: "text-purple-600",
          avatarEmoji: "🤔",
          avatarBg: "bg-purple-600",
        };
      default:
        return {
          badge: "Astuce Mnémotechnique",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
          bubbleBg: "bg-amber-50/80 border-amber-200 text-amber-950",
          iconColor: "text-amber-600",
          avatarEmoji: "💡",
          avatarBg: "bg-amber-500",
        };
    }
  };

  const config = getConfig();

  return (
    <div className="flex items-start gap-3 my-4 animate-bounce-short">
      {/* Avatar Mascotte "Dr. Pulse" */}
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 rounded-2xl ${config.avatarBg} text-white flex items-center justify-center text-2xl shadow-md transform hover:scale-105 transition-transform`}
        >
          {config.avatarEmoji}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-extrabold text-slate-700 shadow-2xs">
          +
        </div>
      </div>

      {/* Bulle de dialogue interactive */}
      <div
        className={`flex-1 rounded-2xl border p-4 shadow-xs relative ${config.bubbleBg}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${config.badgeColor} uppercase tracking-wider`}
            >
              {title || config.badge}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Dr. Pulse</span>
        </div>

        <p className="text-xs md:text-sm leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
