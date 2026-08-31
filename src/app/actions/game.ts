"use server";

import { getCurrentUser } from "@/lib/auth";
import { processCardReview } from "@/lib/srs";
import { awardXpAndProgress } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

export async function submitCardAnswerAction(cardId: string, isSuccess: boolean, lessonId?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  // 1. Mettre à jour le statut SRS de la carte
  const srsProgress = await processCardReview(user.id, cardId, isSuccess);

  return {
    success: true,
    srsLevel: srsProgress.srs_niveau,
  };
}

export async function completeLessonAction(lessonId: string, correctCount: number, totalCount: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) return { error: "Leçon introuvable" };

  // Calcul du taux de réussite
  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  // Calcul du gain d'XP proportionnel
  let xpEarned = lesson.xp_reward;
  if (accuracy === 100) {
    xpEarned += 10; // Bonus sans faute
  }

  // Récupérer le niveau de maîtrise actuel
  const existingProgress = await prisma.userLessonProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: user.id,
        lesson_id: lessonId,
      },
    },
  });

  let currentMastery = existingProgress ? existingProgress.mastery_level : 0;
  let newMastery = currentMastery;

  if (accuracy >= 80) {
    // Si réussite >= 80%, on monte de palier de maîtrise (max 5)
    newMastery = Math.min(5, currentMastery + 1);
  }

  const result = await awardXpAndProgress(user.id, xpEarned, lessonId, newMastery);

  return {
    success: true,
    xpEarned,
    newLevel: result?.newLevel || user.user_level,
    leveledUp: result?.leveledUp || false,
    newMastery,
    accuracy: Math.round(accuracy),
  };
}
