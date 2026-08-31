import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import {
  User as UserIcon,
  Zap,
  Flame,
  Shield,
  BookOpen,
  Trophy,
  LogOut,
  Sparkles,
  Settings,
  GraduationCap,
} from "lucide-react";
import { getXpForNextLevel, getXpForCurrentLevel } from "@/lib/gamification";
import ProfileSettingsClient from "./ProfileSettingsClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Statistiques de l'utilisateur
  const lessonProgress = await prisma.userLessonProgress.findMany({
    where: { user_id: user.id },
  });

  const cardProgress = await prisma.userCardProgress.findMany({
    where: { user_id: user.id },
  });

  const glossaryTerms = await prisma.glossaryTerm.findMany({
    orderBy: { terme: "asc" },
  });

  const goldSkillsCount = lessonProgress.filter((p) => p.mastery_level === 5).length;

  const currentLevelXp = getXpForCurrentLevel(user.user_level);
  const nextLevelXp = getXpForNextLevel(user.user_level);
  const levelProgressPercent =
    nextLevelXp > currentLevelXp
      ? Math.min(
          100,
          Math.max(
            0,
            ((user.xp_total - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
          )
        )
      : 100;

  // Ouvrages de référence
  const medicalSources = [
    {
      title: "Sémiologie médicale : l’apprentissage pratique de l’examen clinique",
      author: "Baptiste Coustet",
      edition: "Éditions Vuibert",
      role: "Ouvrage de base pour la démarche sémiologique au lit du malade.",
    },
    {
      title: "Sémiologie cardiovasculaire",
      author: "Professeur Jean Bourdarias",
      edition: "Flammarion Médecine-Sciences",
      role: "Référence cardiologique approfondie pour les souffles et bruits cardiaques.",
    },
    {
      title: "Sémiologie clinique",
      author: "Bariéty, Capron, Grateau",
      edition: "Masson",
      role: "Traité fondamental de sémiologie descriptive.",
    },
    {
      title: "Polycopié National de Cardiologie",
      author: "Collège National des Enseignants de Cardiologie (UNESS)",
      edition: "Édition Officielle R2C / ECNi",
      role: "Ancrage académique officiel et consensus d'urgences cardiovasculaires.",
    },
    {
      title: "Examen clinique et sémiologie : l'essentiel",
      author: "Talley & O'Connor",
      edition: "Elsevier Masson",
      role: "Guide international de l'examen physique méthodique.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Profil Header avec Client Settings Modal */}
      <ProfileSettingsClient user={user} />

      {/* Barre de progression vers le prochain niveau */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-600" />
            Progression Niveau {user.user_level}
          </span>
          <span className="text-indigo-600">
            {user.xp_total} / {nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${levelProgressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Encore {Math.max(0, nextLevelXp - user.xp_total)} XP pour atteindre le Niveau {user.user_level + 1}.
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 text-center">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
          <div className="text-xl font-extrabold text-amber-950">{user.streak_days}</div>
          <div className="text-[10px] font-bold text-amber-700 uppercase">Jours de série</div>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-2xl p-3.5 text-center">
          <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500 mx-auto mb-1" />
          <div className="text-xl font-extrabold text-indigo-950">{user.xp_total}</div>
          <div className="text-[10px] font-bold text-indigo-700 uppercase">XP Totaux</div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 text-center">
          <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className="text-xl font-extrabold text-emerald-950">{cardProgress.length}</div>
          <div className="text-[10px] font-bold text-emerald-700 uppercase">Cartes mémorisées</div>
        </div>

        <div className="bg-purple-50/70 border border-purple-200/60 rounded-2xl p-3.5 text-center">
          <Sparkles className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-xl font-extrabold text-purple-950">{goldSkillsCount}</div>
          <div className="text-[10px] font-bold text-purple-700 uppercase">Leçons dorées</div>
        </div>
      </div>

      {/* Glossaire Médical Découvert */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Glossaire Sémiologique Cardiovasculaire ({glossaryTerms.length} termes)
            </h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-2">
          {glossaryTerms.map((g) => (
            <div key={g.id} className="py-2.5 space-y-0.5">
              <div className="font-bold text-xs text-indigo-950">{g.terme}</div>
              <div className="text-[11px] text-slate-600">{g.definition_fr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bibliographie & Sources Médicales */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-extrabold text-slate-900">
            Sources & Ouvrages Médicaux Référencés
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Toutes les questions, définitions et feedbacks de ClinicHero sont vérifiés et adossés aux traités de référence :
        </p>

        <div className="divide-y divide-slate-100">
          {medicalSources.map((src, i) => (
            <div key={i} className="py-3 space-y-1">
              <div className="font-bold text-sm text-slate-900">{src.title}</div>
              <div className="text-xs text-indigo-600 font-medium">
                {src.author} • {src.edition}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">{src.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
