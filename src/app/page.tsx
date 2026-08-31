import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  Stethoscope,
  Activity,
  Flame,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";
import { getCardsDueForReview } from "@/lib/srs";
import OnboardingModal from "@/components/OnboardingModal";

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

  const getModuleIcon = (slug: string) => {
    if (slug.includes("signes")) return <Heart className="w-6 h-6 text-rose-500" />;
    if (slug.includes("examen")) return <Stethoscope className="w-6 h-6 text-emerald-500" />;
    return <Activity className="w-6 h-6 text-sky-500" />;
  };

  const getDifficultyBadge = (lvl: number) => {
    switch (lvl) {
      case 1:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Intro</span>;
      case 2:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Intermédiaire</span>;
      case 3:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Avancé</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Expert</span>;
    }
  };

  // Libellé de profil
  const getProfileBadge = () => {
    if (!user) return null;
    const professionLabel =
      user.profession === "medecine"
        ? "Médecine"
        : user.profession === "kine"
        ? "Kinésithérapie"
        : user.profession === "osteo"
        ? "Ostéopathie"
        : user.profession === "pharma"
        ? "Pharmacie"
        : user.profession_autre || "Soignant";

    const niveauLabel =
      user.niveau_etudes === "debutant"
        ? "Fondations (1-3e)"
        : user.niveau_etudes === "avance"
        ? "Clinique (4-6e)"
        : "Praticien Diplômé";

    return `${professionLabel} • ${niveauLabel}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Onboarding Modal si profil incomplet */}
      {user && !user.onboarding_complete && (
        <OnboardingModal
          isOpen={true}
          initialProfession={user.profession}
          initialNiveau={user.niveau_etudes}
          initialMode={user.mode_apprentissage}
        />
      )}

      {/* Bannière de Bienvenue / Gamification */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                  Sémiologie Cardiovasculaire • V1
                </span>
                {user && (
                  <span className="text-[10px] font-extrabold bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 px-2 py-0.5 rounded-full">
                    {getProfileBadge()}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {user ? `Bonjour, ${user.name || "Docteur"} 👋` : "Bienvenue sur ClinicHero 🩺"}
              </h1>
            </div>

            {user && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-3 py-1.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                  <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
                  <span>{user.streak_days} jours</span>
                </div>
                <span className="text-white/30">|</span>
                <div className="flex items-center gap-1.5 text-indigo-300 font-extrabold text-sm">
                  <Zap className="w-4 h-4 fill-indigo-300" />
                  <span>{user.xp_total} XP</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-indigo-100/90 text-sm max-w-xl leading-relaxed">
            Cours théoriques interactifs, mnémotechniques et entraînements sémiologiques adaptés à ta filière de santé.
          </p>

          {/* Actions Rapides : Révision SRS & Atelier Clinique */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {dueCards.length > 0 && (
              <Link
                href="/review"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Révision du jour ({dueCards.length})</span>
              </Link>
            )}

            <Link
              href="/simulations"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Atelier des Simulateurs (Tension & Stéthoscope)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Parcours d'Apprentissage */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Parcours Cardiovasculaire</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {modules.length} Modules
          </span>
        </div>

        <div className="space-y-6">
          {modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-xs space-y-4"
            >
              {/* En-tête du Module */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shadow-xs">
                    {getModuleIcon(mod.slug)}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Module {modIdx + 1}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">{mod.nom_fr}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {mod.description_fr}
                    </p>
                  </div>
                </div>
              </div>

              {/* Liste des Leçons du Module */}
              <div className="grid gap-3 sm:grid-cols-1">
                {mod.lessons.map((lesson, lesIdx) => {
                  const progress =
                    lesson.user_progress && lesson.user_progress.length > 0
                      ? lesson.user_progress[0]
                      : null;
                  const mastery = progress ? progress.mastery_level : 0;
                  const isGold = mastery === 5;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.slug}`}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/70 hover:border-indigo-500/50 hover:bg-indigo-50/30 transition-all shadow-2xs hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110 ${
                            isGold
                              ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-300"
                              : mastery > 0
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isGold ? "👑" : `${modIdx + 1}.${lesIdx + 1}`}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm md:text-base">
                              {lesson.nom_fr}
                            </span>
                            {getDifficultyBadge(lesson.niveau_difficulte)}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {lesson.description_fr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Étoiles de maîtrise */}
                        <div
                          className="flex items-center text-xs font-bold text-amber-500"
                          title={`Maîtrise : ${mastery}/5`}
                        >
                          {"★".repeat(mastery)}
                          <span className="text-slate-200">{"☆".repeat(5 - mastery)}</span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
