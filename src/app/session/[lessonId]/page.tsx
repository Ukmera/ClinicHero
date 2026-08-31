import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CardPlayer from "@/components/CardPlayer";

interface SessionPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      cards: true,
    },
  });

  if (!lesson || lesson.cards.length === 0) {
    notFound();
  }

  const lessonCourse = {
    cours_intro_fr: lesson.cours_intro_fr,
    cours_points_cles_fr: lesson.cours_points_cles_fr,
    mnemonique: lesson.mnemonique,
    carte_mentale_json: lesson.carte_mentale_json,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CardPlayer
        lessonId={lesson.id}
        lessonTitle={lesson.nom_fr}
        cards={lesson.cards}
        lessonCourse={lessonCourse}
      />
    </div>
  );
}
