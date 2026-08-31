"use client";

import React, { useState } from "react";
import { CharacterClassId } from "@/lib/rpg/types";
import { getClassConfig, getTitleForLevel, RPG_TITLES, CHARACTER_CLASSES } from "@/lib/rpg/classes";
import PixelAvatar from "./PixelAvatar";
import ClassSelector from "./ClassSelector";
import RetroAudioToggle from "./RetroAudioToggle";
import { X, Sparkles, Trophy, Award, Shield, Stethoscope, Zap, BookOpen, Check } from "lucide-react";
import { updateUserRpgAction } from "@/app/actions/user";
import { playRetroSound } from "@/lib/rpg/audio";

interface CharacterSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    email: string;
    user_level: number;
    xp_total: number;
    character_class?: string | null;
    avatar_id?: string | null;
    current_title?: string | null;
  };
}

export default function CharacterSheetModal({
  isOpen,
  onClose,
  user,
}: CharacterSheetModalProps) {
  const [activeTab, setActiveTab] = useState<"sheet" | "change_class">("sheet");
  const [selectedClass, setSelectedClass] = useState<CharacterClassId>(
    (user.character_class as CharacterClassId) || "clerc"
  );
  const [selectedVariant, setSelectedVariant] = useState<1 | 2>(
    user.avatar_id?.includes("2") ? 2 : 1
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const currentConfig = getClassConfig(user.character_class);
  const calculatedTitle = user.current_title || getTitleForLevel(user.user_level);

  const handleSaveClass = async () => {
    setSaving(true);
    const avatarId = `${selectedClass}_${selectedVariant}`;
    await updateUserRpgAction({
      character_class: selectedClass,
      avatar_id: avatarId,
    });
    setSaving(false);
    playRetroSound("levelup");
    setActiveTab("sheet");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl space-y-6 my-8 animate-bounce-short">
        {/* Header avec bouton fermer & audio */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-extrabold tracking-tight text-white">
              Grimoire de l&apos;Aventurier Sémiologue
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <RetroAudioToggle />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Onglets Fiche / Choix de Classe */}
        <div className="flex gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab("sheet")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === "sheet"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📜 Fiche de Personnage
          </button>
          <button
            onClick={() => setActiveTab("change_class")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === "change_class"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚔️ Changer d&apos;Archétype
          </button>
        </div>

        {/* VUE 1 : Fiche de Personnage */}
        {activeTab === "sheet" && (
          <div className="space-y-5">
            {/* Profil Rétro Hero Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <PixelAvatar
                classId={user.character_class}
                size="xl"
                level={user.user_level}
                variant={user.avatar_id?.includes("2") ? 2 : 1}
                glow={true}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">
                    {user.name || "Apprenant"}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                    Niv. {user.user_level}
                  </span>
                </div>
                <div className="text-xs font-bold text-indigo-400">{calculatedTitle}</div>
                <div className="text-[11px] text-slate-400">
                  {currentConfig.name} • {currentConfig.role}
                </div>
              </div>
            </div>

            {/* Statistiques d'Aptitudes Sémiologiques */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Aptitudes de Classe
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Auscultation & Bruits B1-B4", val: currentConfig.stats.auscultation, color: "bg-rose-500" },
                  { label: "Biomarqueurs & Toxicologie", val: currentConfig.stats.biologie, color: "bg-emerald-500" },
                  { label: "Électrocardiographie (ECG)", val: currentConfig.stats.ecg, color: "bg-indigo-500" },
                  { label: "Palpation & Examen Physique", val: currentConfig.stats.palpation, color: "bg-amber-500" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-300">{stat.label}</span>
                      <span className="text-slate-400">{stat.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all`}
                        style={{ width: `${stat.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arme & Trait Passif */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Arme Débloquée</div>
                <div className="text-xs font-extrabold text-white">
                  {currentConfig.weaponSignature}
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Trait Passif</div>
                <div className="text-xs font-extrabold text-white">
                  {currentConfig.passiveName}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VUE 2 : Sélecteur de Classe */}
        {activeTab === "change_class" && (
          <div className="space-y-4">
            <ClassSelector
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              selectedAvatarVariant={selectedVariant}
              onSelectAvatarVariant={setSelectedVariant}
            />

            <button
              onClick={handleSaveClass}
              disabled={saving}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>{saving ? "Invocation en cours..." : "Confirmer mon Archétype ⚔️"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
