"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isAudioMuted, setAudioMuted, playRetroSound } from "@/lib/rpg/audio";

interface RetroAudioToggleProps {
  className?: string;
}

export default function RetroAudioToggle({ className = "" }: RetroAudioToggleProps) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setAudioMuted(newMuted);
    if (!newMuted) {
      playRetroSound("click");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-xs ${className}`}
      title={muted ? "Activer les sons rétro 8-bit" : "Couper les sons rétro 8-bit"}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-slate-500" />
      ) : (
        <Volume2 className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
}
