import Link from "next/link";
import { Flame, Zap, Shield, User as UserIcon, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Titre */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            ✚
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              ClinicHero
              <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                Cardio V1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Sémiologie clinique gamifiée</p>
          </div>
        </Link>

        {/* Stats Gamification (Flames, XP, Level) */}
        {user ? (
          <div className="flex items-center gap-3 md:gap-4">
            {/* Streak */}
            <div
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/70 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
              title={`${user.streak_days} jour(s) consécutif(s)`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{user.streak_days}</span>
            </div>

            {/* XP Total */}
            <div
              className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/70 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
              title={`${user.xp_total} XP cumulés`}
            >
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              <span>{user.xp_total} XP</span>
            </div>

            {/* Niveau */}
            <div
              className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/70 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
              title={`Niveau ${user.user_level}`}
            >
              <Shield className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>Niv. {user.user_level}</span>
            </div>

            {/* Atelier Pratique */}
            <Link
              href="/simulations"
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow-xs transition-colors"
              title="Atelier des simulateurs cliniques"
            >
              <span>🩺 Atelier</span>
            </Link>

            {/* Profil Link */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              title="Mon Profil"
            >
              <UserIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg"
            >
              Connexion
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
