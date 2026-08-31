"use client";

import React from "react";
import { CharacterClassId } from "@/lib/rpg/types";
import { getClassConfig } from "@/lib/rpg/classes";
import { Stethoscope, FlaskConical, Zap, Activity } from "lucide-react";

interface ClassBadgeProps {
  classId?: CharacterClassId | string | null;
  size?: "sm" | "md" | "lg";
  showPassive?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ClassBadge({
  classId = "clerc",
  size = "md",
  showPassive = false,
  className = "",
  onClick,
}: ClassBadgeProps) {
  const config = getClassConfig(classId);

  const getIcon = () => {
    switch (config.id) {
      case "alchimiste":
        return <FlaskConical className="w-3.5 h-3.5 shrink-0" />;
      case "mage_ecg":
        return <Zap className="w-3.5 h-3.5 shrink-0" />;
      case "moine":
        return <Activity className="w-3.5 h-3.5 shrink-0" />;
      case "clerc":
      default:
        return <Stethoscope className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-bold",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-bold border shadow-xs transition-all ${
        config.badgeBg
      } ${sizeClasses[size]} ${onClick ? "cursor-pointer hover:scale-105" : ""} ${className}`}
      title={`${config.name} : ${config.passiveDescription}`}
    >
      {getIcon()}
      <span className="tracking-tight">{config.name}</span>
      {showPassive && (
        <span className="opacity-75 font-normal text-[10px] border-l border-current pl-1.5 ml-0.5">
          {config.passiveShort}
        </span>
      )}
    </div>
  );
}
