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
  Scroll,
} from "lucide-react";
import { getXpForNextLevel, getXpForCurrentLevel } from "@/lib/gamification";
import ProfileSettingsClient from "./ProfileSettingsClient";
import PixelSprite from "@/components/rpg/PixelSprite";

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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Profil Header avec Client Settings Modal */}
      <ProfileSettingsClient user={user} />

      {/* Barre de progression vers le prochain niveau */}
      <div className="card-rpg space-y-3">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-amber-400" />
            Progression Niveau {user.user_level}
          </span>
          <span className="text-amber-400">
            {user.xp_total} / {nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full rounded-full transition-all duration-500 shadow-md shadow-amber-500/20"
            style={{ width: `${levelProgressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Encore {Math.max(0, nextLevelXp - user.xp_total)} XP pour atteindre le Niveau {user.user_level + 1}.
        </p>
      </div>

      {/* Cartes de statistiques RPG */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center shadow-md">
          <div className="flex justify-center mb-1">
            <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
          </div>
          <div className="text-xl font-black text-amber-400">{user.streak_days}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jours de série</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center shadow-md">
          <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400 mx-auto mb-1" />
          <div className="text-xl font-black text-indigo-300">{user.xp_total}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">XP Cumulés</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center shadow-md">
          <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-xl font-black text-emerald-300">{cardProgress.length}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cartes Maîtrisées</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center shadow-md">
          <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-xl font-black text-purple-300">{goldSkillsCount}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quêtes Dorées</div>
        </div>
      </div>

      {/* Grimoire Sémiologique Cardiovasculaire */}
      <div className="card-rpg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white">
              Grimoire des Arcanes Médicales ({glossaryTerms.length} termes)
            </h2>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto pr-2 space-y-1">
          {glossaryTerms.map((g) => (
            <div key={g.id} className="py-3 space-y-1">
              <div className="font-black text-xs text-amber-300 flex items-center gap-2">
                <span>✦</span>
                <span>{g.terme}</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed pl-4.5">{g.definition_fr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bibliographie & Sources Médicales */}
      <div className="card-rpg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-black text-white">
            Traités & Ouvrages Médicaux Référencés
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Toutes les questions, définitions et règles sémiologiques de ClinicHero sont sourcées et adossées aux traités fondamentaux :
        </p>

        <div className="divide-y divide-slate-800/80">
          {medicalSources.map((src, i) => (
            <div key={i} className="py-3 space-y-1">
              <div className="font-extrabold text-sm text-white">{src.title}</div>
              <div className="text-xs text-amber-400 font-bold">
                {src.author} • {src.edition}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">{src.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
