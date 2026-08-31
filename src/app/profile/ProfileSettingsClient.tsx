"use client";

import { useState } from "react";
import { User as UserIcon, Shield, Settings, LogOut, Sparkles, Wand2 } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import OnboardingModal from "@/components/OnboardingModal";
import CharacterSheetModal from "@/components/rpg/CharacterSheetModal";
import PixelAvatar from "@/components/rpg/PixelAvatar";
import ClassBadge from "@/components/rpg/ClassBadge";
import { getClassConfig, getTitleForLevel } from "@/lib/rpg/classes";
import { playRetroSound } from "@/lib/rpg/audio";

interface ProfileSettingsClientProps {
  user: {
    name?: string | null;
    email: string;
    profession?: string | null;
    profession_autre?: string | null;
    niveau_etudes?: string | null;
    mode_apprentissage?: string | null;
    user_level: number;
    xp_total: number;
    character_class?: string | null;
    avatar_id?: string | null;
    current_title?: string | null;
  };
}

export default function ProfileSettingsClient({ user }: ProfileSettingsClientProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);

  const currentClass = user.character_class || "clerc";
  const title = user.current_title || getTitleForLevel(user.user_level);

  const getProfessionText = () => {
    switch (user.profession) {
      case "medecine":
        return "Médecine";
      case "kine":
        return "Kinésithérapie";
      case "osteo":
        return "Ostéopathie";
      case "pharma":
        return "Pharmacie";
      default:
        return user.profession_autre || "Filière de santé";
    }
  };

  const getNiveauText = () => {
    switch (user.niveau_etudes) {
      case "debutant":
        return "1ère-3ème année (Fondations)";
      case "avance":
        return "4ème-6ème année (Clinique)";
      case "praticien":
        return "Praticien Diplômé";
      default:
        return "Niveau standard";
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              setIsCharacterSheetOpen(true);
              playRetroSound("click");
            }}
            className="cursor-pointer group relative"
            title="Ouvrir la fiche de personnage RPG"
          >
            <PixelAvatar
              classId={currentClass}
              level={user.user_level}
              variant={user.avatar_id?.includes("2") ? 2 : 1}
              size="xl"
              glow={true}
              className="group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full text-[10px] font-extrabold shadow-md">
              <Wand2 className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {user.name || "Apprenant"}
              </h1>
              <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                {title}
              </span>
            </div>

            <p className="text-xs text-slate-400">{user.email}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <ClassBadge
                classId={currentClass}
                size="sm"
                showPassive={true}
                onClick={() => {
                  setIsCharacterSheetOpen(true);
                  playRetroSound("click");
                }}
              />
              <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                {getProfessionText()} • {getNiveauText()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCharacterSheetOpen(true);
              playRetroSound("click");
            }}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
            title="Ouvrir le Grimoire RPG"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fiche RPG</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Modifier mes préférences de cours"
          >
            <Settings className="w-4 h-4" />
          </button>

          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-rose-950/50 hover:border-rose-800 hover:text-rose-400 text-slate-400 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Modal Fiche de Personnage RPG */}
      <CharacterSheetModal
        isOpen={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
        user={user}
      />

      {/* Modal Préférences Pédagogiques */}
      <OnboardingModal
        isOpen={isSettingsOpen}
        initialProfession={user.profession}
        initialNiveau={user.niveau_etudes}
        initialMode={user.mode_apprentissage}
        initialClass={user.character_class}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
