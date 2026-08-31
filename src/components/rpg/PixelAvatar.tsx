"use client";

import React from "react";
import { CharacterClassId, AvatarTier } from "@/lib/rpg/types";
import PixelSprite, { SpriteCharacterType } from "./PixelSprite";

interface PixelAvatarProps {
  classId?: CharacterClassId | string | null;
  tier?: AvatarTier;
  level?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gender?: "m" | "f" | "neutral";
  variant?: 1 | 2;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

export default function PixelAvatar({
  classId = "clerc",
  tier,
  level = 1,
  size = "md",
  gender = "m",
  variant = 1,
  className = "",
  glow = true,
  animated = true,
}: PixelAvatarProps) {
  // Mapping classe vers sprite Pixel Crawler
  const getSpriteType = (): SpriteCharacterType => {
    switch (classId) {
      case "alchimiste":
        return "wizzard";
      case "mage_ecg":
        return "wizzard";
      case "moine":
        return "rogue";
      case "clerc":
      default:
        return "knight";
    }
  };

  return (
    <PixelSprite
      type={getSpriteType()}
      classId={classId}
      size={size}
      level={level}
      glow={glow}
      animated={animated}
      className={className}
    />
  );
}
