"use client";

import { useState } from "react";
import { loginAction, registerAction, loginAsDemoAction } from "@/app/actions/auth";
import { Zap, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const res = await registerAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-indigo-500/20 mx-auto">
          ✚
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          ClinicHero
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Plateforme d&apos;apprentissage gamifié de la sémiologie clinique pour soignants et étudiants.
        </p>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Accès Rapide Mode Démo */}
      <div className="bg-gradient-to-br from-indigo-50 to-rose-50 border border-indigo-100 rounded-3xl p-5 shadow-xs space-y-3 text-center">
        <div className="text-xs font-bold text-indigo-900 flex items-center justify-center gap-1.5 uppercase">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Accès rapide sans inscription</span>
        </div>
        <p className="text-xs text-slate-600">
          Connecte-toi instantanément avec le compte de test pour explorer les 3 modules Cardio.
        </p>
        <form action={loginAsDemoAction}>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <span>Démarrer en mode Démo</span>
            <Zap className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Formulaire de Connexion Classique */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
          Connexion / Inscription
        </h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="etudiant@medecine.fr"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold rounded-xl text-sm transition-all"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
