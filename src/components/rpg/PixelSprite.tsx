"use client";

import React from "react";
import { CharacterClassId } from "@/lib/rpg/types";

export type SpriteCharacterType =
  | "wizzard"
  | "knight"
  | "rogue"
  | "peasant"
  | "skeleton_mage"
  | "skeleton_rogue"
  | "skeleton_warrior"
  | "orc_shaman"
  | "bonfire";

interface PixelSpriteProps {
  type?: SpriteCharacterType;
  classId?: CharacterClassId | string | null;
  animation?: "idle" | "run";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  glow?: boolean;
  animated?: boolean;
  className?: string;
  level?: number;
}

export default function PixelSprite({
  type,
  classId,
  animation = "idle",
  size = "md",
  glow = true,
  animated = true,
  className = "",
  level,
}: PixelSpriteProps) {
  // Déduction du type de sprite en fonction de la classe si non fourni
  const resolvedType: SpriteCharacterType =
    type ||
    (classId === "alchimiste"
      ? "wizzard"
      : classId === "mage_ecg"
      ? "wizzard"
      : classId === "moine"
      ? "rogue"
      : "knight");

  // Définition des chemins et spécifications des sprites
  const getSpriteInfo = () => {
    switch (resolvedType) {
      case "wizzard":
        return {
          src:
            animation === "run"
              ? "/pixel-crawler/characters/wizzard/run.png"
              : "/pixel-crawler/characters/wizzard/idle.png",
          frames: animation === "run" ? 6 : 4,
          glowColor:
            classId === "alchimiste"
              ? "rgba(16, 185, 129, 0.4)"
              : "rgba(99, 102, 241, 0.4)",
          accentBorder:
            classId === "alchimiste" ? "border-emerald-500/50" : "border-indigo-500/50",
        };
      case "rogue":
        return {
          src:
            animation === "run"
              ? "/pixel-crawler/characters/rogue/run.png"
              : "/pixel-crawler/characters/rogue/idle.png",
          frames: animation === "run" ? 6 : 4,
          glowColor: "rgba(245, 158, 11, 0.4)",
          accentBorder: "border-amber-500/50",
        };
      case "peasant":
        return {
          src:
            animation === "run"
              ? "/pixel-crawler/characters/peasant/walk.png"
              : "/pixel-crawler/characters/peasant/idle.png",
          frames: 4,
          glowColor: "rgba(148, 163, 184, 0.3)",
          accentBorder: "border-slate-500/50",
        };
      case "skeleton_mage":
        return {
          src: "/pixel-crawler/mobs/skeleton_mage/idle.png",
          frames: 4,
          glowColor: "rgba(168, 85, 247, 0.5)",
          accentBorder: "border-purple-500/60",
        };
      case "skeleton_warrior":
        return {
          src: "/pixel-crawler/mobs/skeleton_warrior/idle.png",
          frames: 4,
          glowColor: "rgba(239, 68, 68, 0.5)",
          accentBorder: "border-rose-500/60",
        };
      case "skeleton_rogue":
        return {
          src: "/pixel-crawler/mobs/skeleton_rogue/idle.png",
          frames: 4,
          glowColor: "rgba(234, 179, 8, 0.5)",
          accentBorder: "border-yellow-500/60",
        };
      case "orc_shaman":
        return {
          src: "/pixel-crawler/mobs/orc_shaman/idle.png",
          frames: 4,
          glowColor: "rgba(34, 197, 94, 0.5)",
          accentBorder: "border-green-500/60",
        };
      case "bonfire":
        return {
          src: "/pixel-crawler/environment/bonfire.png",
          frames: 4,
          glowColor: "rgba(249, 115, 22, 0.6)",
          accentBorder: "border-orange-500/60",
        };
      case "knight":
      default:
        return {
          src:
            animation === "run"
              ? "/pixel-crawler/characters/knight/run.png"
              : "/pixel-crawler/characters/knight/idle.png",
          frames: animation === "run" ? 6 : 4,
          glowColor: "rgba(244, 63, 94, 0.4)",
          accentBorder: "border-rose-500/50",
        };
    }
  };

  const sprite = getSpriteInfo();

  // Dimensions d'affichage
  const sizeMap = {
    xs: { box: "w-7 h-7", zoom: "scale-[1.0]" },
    sm: { box: "w-9 h-9", zoom: "scale-[1.25]" },
    md: { box: "w-14 h-14", zoom: "scale-[1.6]" },
    lg: { box: "w-20 h-20", zoom: "scale-[2.2]" },
    xl: { box: "w-28 h-28", zoom: "scale-[3.0]" },
    "2xl": { box: "w-36 h-36", zoom: "scale-[3.8]" },
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden rounded-2xl bg-slate-950 border ${
        sprite.accentBorder
      } ${sizeMap[size].box} ${className}`}
      style={{
        filter: glow ? `drop-shadow(0 0 10px ${sprite.glowColor})` : "none",
      }}
    >
      {/* Conteneur Sprite 32x32 CSS pixel-art */}
      <div
        className={`w-8 h-8 pixel-rendering transform origin-center ${
          sizeMap[size].zoom
        } ${
          animated
            ? sprite.frames === 6
              ? "sprite-run-6"
              : "sprite-idle-4"
            : ""
        }`}
        style={{
          width: "32px",
          height: "32px",
          backgroundImage: `url('${sprite.src}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${sprite.frames * 32}px 32px`,
          backgroundPosition: "0px 0px",
        }}
      />

      {/* Badge de niveau en coin si applicable */}
      {typeof level === "number" && level > 0 && size !== "xs" && size !== "sm" && (
        <div className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-700 text-amber-400 font-black text-[9px] px-1.5 py-0.2 rounded-md shadow-md leading-tight z-10">
          N.{level}
        </div>
      )}
    </div>
  );
}
