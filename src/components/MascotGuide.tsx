"use client";

import React from "react";
import PixelSprite, { SpriteCharacterType } from "@/components/rpg/PixelSprite";
import { Sparkles, ShieldAlert, Lightbulb, Brain } from "lucide-react";

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
          badge: "Rune d'Alerte • Drapeau Rouge",
          badgeColor: "bg-rose-950/80 text-rose-300 border-rose-700/80",
          bubbleBg: "bg-rose-950/30 border-rose-800/60 text-rose-100",
          spriteType: "skeleton_mage" as SpriteCharacterType,
          icon: ShieldAlert,
        };
      case "encouraging":
        return {
          badge: "Conseil de l'Archimage",
          badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-700/80",
          bubbleBg: "bg-emerald-950/30 border-emerald-800/60 text-emerald-100",
          spriteType: "knight" as SpriteCharacterType,
          icon: Sparkles,
        };
      case "thinking":
        return {
          badge: "Méditation Sémiologique",
          badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-700/80",
          bubbleBg: "bg-indigo-950/30 border-indigo-800/60 text-indigo-100",
          spriteType: "wizzard" as SpriteCharacterType,
          icon: Brain,
        };
      default:
        return {
          badge: "Incantation Mnémotechnique",
          badgeColor: "bg-amber-950/80 text-amber-300 border-amber-700/80",
          bubbleBg: "bg-amber-950/30 border-amber-800/60 text-amber-100",
          spriteType: "wizzard" as SpriteCharacterType,
          icon: Lightbulb,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 my-4 animate-bounce-short">
      {/* Sprite Pixel Crawler */}
      <PixelSprite
        type={config.spriteType}
        size="md"
        glow={true}
        className="shrink-0"
      />

      {/* Bulle de dialogue interactive façon Grimoire RPG */}
      <div className={`flex-1 rounded-2xl border p-4 shadow-lg relative ${config.bubbleBg}`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${config.badgeColor} uppercase tracking-wider flex items-center gap-1`}
            >
              <Icon className="w-3 h-3" />
              <span>{title || config.badge}</span>
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-amber-400">Dr. Pulse</span>
        </div>

        <p className="text-xs md:text-sm leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
