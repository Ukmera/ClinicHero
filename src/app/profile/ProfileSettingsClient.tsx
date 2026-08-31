"use client";

import { useState } from "react";
import { User as UserIcon, Shield, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import OnboardingModal from "@/components/OnboardingModal";

interface ProfileSettingsClientProps {
  user: {
    name?: string | null;
    email: string;
    profession?: string | null;
    profession_autre?: string | null;
    niveau_etudes?: string | null;
    mode_apprentissage?: string | null;
    user_level: number;
  };
}

export default function ProfileSettingsClient({ user }: ProfileSettingsClientProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        return "4ème-6ème année (Clinique & Urgences)";
      case "praticien":
        return "Praticien Diplômé";
      default:
        return "Niveau standard";
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{user.name || "Apprenant"}</h1>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {getProfessionText()} • {getNiveauText()}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Niveau {user.user_level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Modifier mes préférences de cours"
          >
            <Settings className="w-5 h-5" />
          </button>

          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <OnboardingModal
        isOpen={isSettingsOpen}
        initialProfession={user.profession}
        initialNiveau={user.niveau_etudes}
        initialMode={user.mode_apprentissage}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
