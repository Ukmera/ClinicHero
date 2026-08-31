"use client";

import React, { useState } from "react";
import { CharacterClassId } from "@/lib/rpg/types";
import { CHARACTER_CLASSES } from "@/lib/rpg/classes";
import PixelAvatar from "./PixelAvatar";
import { Check, Sparkles, Shield, Stethoscope, FlaskConical, Zap, Activity } from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";

interface ClassSelectorProps {
  selectedClass: CharacterClassId;
  onSelectClass: (classId: CharacterClassId) => void;
  selectedAvatarVariant?: 1 | 2;
  onSelectAvatarVariant?: (v: 1 | 2) => void;
  showAvatarCustomization?: boolean;
}

export default function ClassSelector({
  selectedClass = "clerc",
  onSelectClass,
  selectedAvatarVariant = 1,
  onSelectAvatarVariant,
  showAvatarCustomization = true,
}: ClassSelectorProps) {
  const currentClassConfig = CHARACTER_CLASSES[selectedClass] || CHARACTER_CLASSES.clerc;

  const handleClassClick = (id: CharacterClassId) => {
    onSelectClass(id);
    playRetroSound("click");
  };

  const getIcon = (id: CharacterClassId) => {
    switch (id) {
      case "alchimiste":
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case "mage_ecg":
        return <Zap className="w-4 h-4 text-indigo-400" />;
      case "moine":
        return <Activity className="w-4 h-4 text-amber-400" />;
      case "clerc":
      default:
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Grille des 4 classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(CHARACTER_CLASSES) as CharacterClassId[]).map((classKey) => {
          const config = CHARACTER_CLASSES[classKey];
          const isSelected = selectedClass === classKey;

          return (
            <button
              key={classKey}
              type="button"
              onClick={() => handleClassClick(classKey)}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex items-start gap-3.5 group ${
                isSelected
                  ? "border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10 scale-[1.02]"
                  : "border-slate-700/80 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/90"
              }`}
            >
              {/* Avatar Pixel Art de classe */}
              <PixelAvatar
                classId={classKey}
                size="md"
                variant={isSelected ? selectedAvatarVariant : 1}
                level={1}
                className="shrink-0 group-hover:scale-105 transition-transform"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-100 truncate">
                    {getIcon(classKey)}
                    <span>{config.name}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-medium text-slate-400 truncate mb-1.5">
                  {config.role}
                </div>

                {/* Badge du passif */}
                <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{config.passiveShort}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fiche détaillée de la classe sélectionnée */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <PixelAvatar
              classId={selectedClass}
              size="lg"
              variant={selectedAvatarVariant}
              level={1}
              glow={true}
            />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Archétype Sémiologique
              </div>
              <h3 className="text-base font-extrabold text-slate-100">
                {currentClassConfig.name}
              </h3>
              <p className="text-xs text-slate-400">{currentClassConfig.subtitle}</p>
            </div>
          </div>

          {/* Variantes d'avatar (Masculin / Féminin) */}
          {showAvatarCustomization && onSelectAvatarVariant && (
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-1">Style :</span>
              <button
                type="button"
                onClick={() => {
                  onSelectAvatarVariant(1);
                  playRetroSound("click");
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedAvatarVariant === 1
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Style A
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectAvatarVariant(2);
                  playRetroSound("click");
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedAvatarVariant === 2
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Style B
              </button>
            </div>
          )}
        </div>

        {/* Description & Lore */}
        <p className="text-xs text-slate-300 leading-relaxed italic">
          &ldquo;{currentClassConfig.lore}&rdquo;
        </p>

        {/* Détails du Passif et Arme Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trait : {currentClassConfig.passiveName}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {currentClassConfig.passiveDescription}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-extrabold">
              <Shield className="w-3.5 h-3.5" />
              <span>Arme Signature</span>
            </div>
            <div className="text-xs font-bold text-slate-100">
              {currentClassConfig.weaponSignature}
            </div>
            <p className="text-[11px] text-slate-400">
              Objet arcanique évoluant au fil de vos validations de modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
