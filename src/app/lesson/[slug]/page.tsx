import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, Zap, BookOpen, Brain, Sparkles, Scroll, Swords } from "lucide-react";
import LessonViewer from "@/components/LessonViewer";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: {
      module: true,
      cards: true,
      user_progress: user
        ? {
            where: { user_id: user.id },
          }
        : false,
    },
  });

  if (!lesson) {
    notFound();
  }

  const progress =
    lesson.user_progress && lesson.user_progress.length > 0
      ? lesson.user_progress[0]
      : null;
  const mastery = progress ? progress.mastery_level : 0;
  const hasPriorKnowledge = progress ? progress.deja_aborde_cours : false;

  const references = Array.from(new Set(lesson.cards.map((c) => c.reference))).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Retour vers le Donjon */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux Donjons</span>
      </Link>

      {/* En-tête de la leçon façon Grimoire Arcanique */}
      <div className="card-rpg space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5" />
                <span>{lesson.module.nom_fr}</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Niveau {lesson.niveau_difficulte}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                {"★".repeat(mastery)}
                <span className="text-slate-700">{"☆".repeat(5 - mastery)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>+{lesson.xp_reward} XP</span>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {lesson.nom_fr}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">{lesson.description_fr}</p>
          </div>

          {/* Sources médicales associées */}
          {references.length > 0 && (
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-extrabold text-slate-300">Sources académiques certifiées :</span>
              <span>{references.join(" • ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lecteur de micro-cours adaptatif avec onglets */}
      <LessonViewer
        lesson={lesson}
        userLevel={user?.niveau_etudes || "debutant"}
        hasPriorKnowledge={hasPriorKnowledge}
      />
    </div>
  );
}
