import { prisma } from "./prisma";

// Formule de progression : Niveau = floor(sqrt(XP / 50)) + 1
// N1: 0 XP, N2: 50 XP, N3: 200 XP, N4: 450 XP, N5: 800 XP...
export function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1);
}

export function getXpForNextLevel(currentLevel: number): number {
  return currentLevel * currentLevel * 50;
}

export function getXpForCurrentLevel(currentLevel: number): number {
  if (currentLevel <= 1) return 0;
  return (currentLevel - 1) * (currentLevel - 1) * 50;
}

export function calculateStreak(lastActivityDate: Date | null, currentStreak: number): {
  newStreak: number;
  isNewDay: boolean;
} {
  const now = new Date();
  if (!lastActivityDate) {
    return { newStreak: 1, isNewDay: true };
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActive = new Date(
    lastActivityDate.getFullYear(),
    lastActivityDate.getMonth(),
    lastActivityDate.getDate()
  );

  const diffTime = today.getTime() - lastActive.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Même jour
    return { newStreak: currentStreak, isNewDay: false };
  } else if (diffDays === 1) {
    // Jour suivant : streak continue !
    return { newStreak: currentStreak + 1, isNewDay: true };
  } else {
    // Plus de 24h manquées : remise à 1
    return { newStreak: 1, isNewDay: true };
  }
}

export async function awardXpAndProgress(
  userId: string,
  xpEarned: number,
  lessonId?: string,
  newMasteryLevel?: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  const { newStreak } = calculateStreak(user.last_activity_date, user.streak_days);
  const updatedXp = user.xp_total + xpEarned;
  const updatedLevel = calculateLevel(updatedXp);

  // Mettre à jour l'utilisateur
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp_total: updatedXp,
      user_level: updatedLevel,
      streak_days: newStreak,
      last_activity_date: new Date(),
    },
  });

  // Mettre à jour la progression de la leçon si spécifiée
  if (lessonId && typeof newMasteryLevel === "number") {
    await prisma.userLessonProgress.upsert({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: lessonId,
        },
      },
      update: {
        mastery_level: Math.min(5, Math.max(newMasteryLevel, 1)),
        last_practiced_at: new Date(),
      },
      create: {
        user_id: userId,
        lesson_id: lessonId,
        mastery_level: Math.min(5, Math.max(newMasteryLevel, 1)),
        last_practiced_at: new Date(),
      },
    });
  }

  return {
    user: updatedUser,
    xpEarned,
    leveledUp: updatedLevel > user.user_level,
    newLevel: updatedLevel,
  };
}
