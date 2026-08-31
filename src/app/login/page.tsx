"use client";

import { useState } from "react";
import { loginAction, registerAction, loginAsDemoAction } from "@/app/actions/auth";
import { Zap, AlertCircle, Sparkles, Swords, KeyRound, Shield } from "lucide-react";
import PixelSprite from "@/components/rpg/PixelSprite";
import { playRetroSound } from "@/lib/rpg/audio";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    playRetroSound("click");
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setLoading(false);
      playRetroSound("wrong");
    } else {
      playRetroSound("victory");
    }
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    playRetroSound("click");
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const res = await registerAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setLoading(false);
      playRetroSound("wrong");
    } else {
      playRetroSound("victory");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <PixelSprite type="knight" size="lg" glow={true} />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-500/20 border border-amber-400/30">
            ✚
          </div>
          <PixelSprite type="wizzard" size="lg" glow={true} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Portail de l&apos;Ordre Sémiologique
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Incarne ton héros soignant et forge ton art du diagnostic au lit du malade.
        </p>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="bg-rose-950/40 border border-rose-800 text-rose-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce-short">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Accès Rapide Mode Démo */}
      <div className="card-rpg space-y-3 text-center border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-2">
          <div className="text-xs font-black text-amber-400 flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Accès Immédiat • Mode Démo</span>
          </div>
          <p className="text-xs text-slate-300">
            Entre directement dans la guilde sans inscription pour explorer les donjons cardio.
          </p>
          <form action={loginAsDemoAction}>
            <button
              type="submit"
              disabled={loading}
              onClick={() => playRetroSound("click")}
              className="btn-rpg-gold w-full py-3.5 text-xs font-black uppercase tracking-wider"
            >
              <span>Démarrer l&apos;Aventure en Démo</span>
              <Zap className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Formulaire de Connexion Classique */}
      <div className="card-rpg space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Connexion / Inscription</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email de l&apos;Aventurier</label>
            <input
              name="email"
              type="email"
              placeholder="clerc@clinichero.fr"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mot de passe arcanique</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-xl text-xs transition-all"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
