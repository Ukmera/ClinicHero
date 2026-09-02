import Link from "next/link";
import { Flame, Zap, Shield, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import PixelAvatar from "@/components/rpg/PixelAvatar";
import PixelSprite from "@/components/rpg/PixelSprite";
import RetroAudioToggle from "@/components/rpg/RetroAudioToggle";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Titre */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-400/30">
            ✚
          </div>
          <div>
            <div className="font-black text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              ClinicHero
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                RPG V1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Sémiologie clinique gamifiée</p>
          </div>
        </Link>

        {/* Stats Gamification (Flames, XP, Level, Avatar) */}
        {user ? (
          <div className="flex items-center gap-2.5 md:gap-3.5">
            {/* Streak avec sprite de feu de camp Pixel Crawler */}
            <div
              className="flex items-center gap-1 bg-slate-800 border border-slate-700 text-amber-400 px-2 py-0.5 rounded-xl text-xs font-bold shadow-xs"
              title={`${user.streak_days} jour(s) consécutif(s)`}
            >
              <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
              <span>{user.streak_days}</span>
            </div>

            {/* XP Total */}
            <div
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-indigo-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs"
              title={`${user.xp_total} XP cumulés`}
            >
              <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>{user.xp_total} XP</span>
            </div>

            {/* Gemmes (Lien direct vers la Forge / Shop) */}
            <Link
              href="/shop"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs transition-transform hover:scale-105"
              title="La Forge d'Équipements (Boutique de Gemmes)"
            >
              <span className="text-amber-400">💎</span>
              <span>{user.gems ?? 50}</span>
            </Link>

            {/* Niveau */}
            <div
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs"
              title={`Niveau ${user.user_level}`}
            >
              <Shield className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Niv. {user.user_level}</span>
            </div>

            {/* Forge & Boutique */}
            <Link
              href="/shop"
              className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black shadow-xs transition-transform hover:scale-105"
              title="La Forge d'Équipements & Boutique"
            >
              <span>🔨 Forge</span>
            </Link>

            {/* Atelier Pratique */}
            <Link
              href="/simulations"
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-xs transition-transform hover:scale-105"
              title="Atelier des simulateurs cliniques"
            >
              <span>🩺 Atelier</span>
            </Link>

            {/* Toggle Audio */}
            <RetroAudioToggle />

            {/* Avatar & Profil Link */}
            <Link
              href="/profile"
              className="group relative transition-transform hover:scale-105"
              title="Mon Grimoire & Personnage"
            >
              <PixelAvatar
                classId={user.character_class || "clerc"}
                level={user.user_level}
                variant={user.avatar_id?.includes("2") ? 2 : 1}
                size="sm"
                glow={false}
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-amber-400 px-3 py-2 rounded-lg"
            >
              Connexion
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
