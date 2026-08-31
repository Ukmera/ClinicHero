import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  Stethoscope,
  Activity,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Swords,
  Scroll,
  Trophy,
} from "lucide-react";
import { getCardsDueForReview } from "@/lib/srs";
import OnboardingModal from "@/components/OnboardingModal";
import PixelAvatar from "@/components/rpg/PixelAvatar";
import PixelSprite from "@/components/rpg/PixelSprite";
import ClassBadge from "@/components/rpg/ClassBadge";
import DungeonWorldMap from "@/components/rpg/DungeonWorldMap";
import { getClassConfig, getTitleForLevel } from "@/lib/rpg/classes";

export default async function HomePage() {
  const user = await getCurrentUser();
  const userId = user ? user.id : null;

  const modules = await prisma.module.findMany({
    orderBy: { ordre_affichage: "asc" },
    include: {
      lessons: {
        orderBy: { ordre_affichage: "asc" },
        include: {
          cards: { select: { id: true } },
          user_progress: userId
            ? {
                where: { user_id: userId },
              }
            : false,
        },
      },
    },
  });

  const dueCards = userId ? await getCardsDueForReview(userId) : [];

  const userClass = user?.character_class || "clerc";
  const userTitle = user?.current_title || (user ? getTitleForLevel(user.user_level) : "Initié Sémiologue");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Onboarding Modal si profil incomplet */}
      {user && !user.onboarding_complete && (
        <OnboardingModal
          isOpen={true}
          initialProfession={user.profession}
          initialNiveau={user.niveau_etudes}
          initialMode={user.mode_apprentissage}
          initialClass={user.character_class}
        />
      )}

      {/* Bannière Hero RPG avec artwork Pixel Crawler Tavern */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-7 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Artwork de fond Tavern Pixel Crawler */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pixel-rendering"
          style={{ backgroundImage: "url('/pixel-crawler/environment/tavern.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-indigo-950/80" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/profile" className="hover:scale-105 transition-transform shrink-0" title="Modifier mon personnage">
                  <PixelAvatar
                    classId={userClass}
                    level={user.user_level}
                    variant={user.avatar_id?.includes("2") ? 2 : 1}
                    size="xl"
                    glow={true}
                  />
                </Link>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black shadow-lg">
                  🩺
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                    {userTitle}
                  </span>
                  {user && (
                    <ClassBadge classId={userClass} size="sm" showPassive={false} />
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {user ? `Salut, ${user.name || "Aventurier"} ⚔️` : "Bienvenue sur ClinicHero 🏰"}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  L&apos;Ordre des Guérisseurs d&apos;Aethelgard • Sémiologie Cardiovasculaire
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-md">
                {/* Feu de camp animé Pixel Crawler */}
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm" title={`Série de ${user.streak_days} jours consécutifs`}>
                  <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
                  <span>{user.streak_days} j</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-sm">
                  <Zap className="w-4 h-4 fill-indigo-400" />
                  <span>{user.xp_total} XP</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Approfondis ta démarche clinique au lit du malade, débloque des sorts de diagnostic et terrasse les pièges sémiologiques.
          </p>

          {/* Actions Rapides : Rituels SRS & Atelier */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {dueCards.length > 0 && (
              <Link
                href="/review"
                className="btn-rpg-gold px-4 py-2.5 text-xs font-black shadow-amber-500/25"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rituel de Révision ({dueCards.length} cartes)</span>
              </Link>
            )}

            <Link
              href="/simulations"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Laboratoire Clinique (Tension & Stéthoscope)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CARTE DU MONDE INTERACTIVE DES DONJONS & ÎLOTS */}
      <DungeonWorldMap
        modules={modules as any}
        user={user ? {
          character_class: user.character_class,
          user_level: user.user_level,
          avatar_id: user.avatar_id,
          streak_days: user.streak_days,
        } : null}
      />
    </div>
  );
}
