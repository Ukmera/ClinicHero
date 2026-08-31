import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, Zap, BookOpen, Brain, Sparkles } from "lucide-react";
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
      {/* Retour */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au parcours</span>
      </Link>

      {/* En-tête de la leçon */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {lesson.module.nom_fr}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Niveau {lesson.niveau_difficulte}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              {"★".repeat(mastery)}
              <span className="text-slate-200">{"☆".repeat(5 - mastery)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-indigo-600" />
              <span>+{lesson.xp_reward} XP</span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {lesson.nom_fr}
          </h1>
          <p className="text-slate-600 text-sm mt-1">{lesson.description_fr}</p>
        </div>

        {/* Sources médicales associées */}
        {references.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold">Sources académiques :</span>
            <span>{references.join(" • ")}</span>
          </div>
        )}
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
