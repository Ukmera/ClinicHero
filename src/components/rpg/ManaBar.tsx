"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";

interface ManaBarProps {
  currentMana: number;
  maxMana?: number;
  showText?: boolean;
  className?: string;
}

export function ManaBar({
  currentMana,
  maxMana = 100,
  showText = true,
  className = "",
}: ManaBarProps) {
  const percent = Math.min(100, Math.max(0, (currentMana / maxMana) * 100));

  return (
    <div className={`space-y-1 ${className}`}>
      {showText && (
        <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>MANA</span>
          </span>
          <span>
            {currentMana} / {maxMana} MP
          </span>
        </div>
      )}
      <div className="h-3 w-full bg-slate-900 border border-indigo-900/80 rounded-lg p-0.5 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-300 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface HealthBarProps {
  currentHearts: number;
  maxHearts?: number;
  className?: string;
}

export function HealthBar({
  currentHearts,
  maxHearts = 3,
  className = "",
}: HealthBarProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: maxHearts }).map((_, idx) => {
        const isFilled = idx < currentHearts;
        return (
          <div
            key={idx}
            className={`transition-transform duration-200 ${
              isFilled ? "scale-100" : "scale-90 opacity-30"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isFilled
                  ? "text-rose-500 fill-rose-500 filter drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]"
                  : "text-slate-600 fill-slate-700"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
