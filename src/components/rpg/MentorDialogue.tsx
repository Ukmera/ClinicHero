"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, ChevronRight, X } from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";
import GrandBlouseAvatar from "./GrandBlouseAvatar";

interface MentorDialogueProps {
  title?: string;
  message: string;
  expression?: "sage" | "humor" | "alert" | "victory";
  onDismiss?: () => void;
  showDismissButton?: boolean;
}

export default function MentorDialogue({
  title = "La Grande Blouse",
  message,
  expression = "sage",
  onDismiss,
  showDismissButton = true,
}: MentorDialogueProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getAvatarEmotion = () => {
    switch (expression) {
      case "humor":
      case "victory":
        return "happy";
      case "alert":
        return "alert";
      case "sage":
      default:
        return "speaking";
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true);
          playRetroSound("click");
        }}
        className="inline-flex items-center gap-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-black px-3.5 py-2 rounded-2xl shadow-lg transition-all hover:scale-105"
      >
        <GrandBlouseAvatar emotion="idle" size="sm" glow={false} className="w-6 h-7" />
        <span>Conseil de La Grande Blouse</span>
      </button>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-950/95 via-slate-900/95 to-purple-950/95 border-2 border-cyan-500/40 rounded-3xl p-4 md:p-5 shadow-2xl shadow-cyan-950/40 space-y-3 animate-bounce-short">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Animé de La Grande Blouse Flottante */}
          <GrandBlouseAvatar emotion={getAvatarEmotion()} size="sm" glow={true} />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded-md">
                Spectre Protecteur • Mentor
              </span>
            </div>
            <h4 className="text-sm font-black text-white">{title}</h4>
          </div>
        </div>

        {showDismissButton && (
          <button
            onClick={() => {
              setIsExpanded(false);
              if (onDismiss) onDismiss();
              playRetroSound("click");
            }}
            className="w-7 h-7 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Bulle de texte avec punchline ou conseil médical */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
        {message}
      </div>
    </div>
  );
}
