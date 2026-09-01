"use server";

import { getCurrentUser } from "@/lib/auth";
import { processCardReview } from "@/lib/srs";
import { awardXpAndProgress } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitCardAnswerAction(cardId: string, isSuccess: boolean, lessonId?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const srsProgress = await processCardReview(user.id, cardId, isSuccess);

  return {
    success: true,
    srsLevel: srsProgress.srs_niveau,
  };
}

export async function submitDungeonRoomAnswerAction(data: {
  cardId: string;
  isSuccess: boolean;
  difficulty: number;
  lessonId: string;
  roomNumber: number;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  // Calcul des dégâts et gains
  const hpLoss = data.isSuccess ? 0 : data.difficulty >= 3 ? 25 : 15;
  const manaDelta = data.isSuccess ? 20 : -5;

  const currentHp = user.hp_current ?? 100;
  const currentMana = user.mana_current ?? 100;

  const newHp = Math.max(0, Math.min(100, currentHp - hpLoss));
  const newMana = Math.max(0, Math.min(200, currentMana + manaDelta));

  // Mettre à jour l'utilisateur en base
  await prisma.user.update({
    where: { id: user.id },
    data: {
      hp_current: newHp,
      mana_current: newMana,
    },
  });

  // SRS Update
  const srsProgress = await processCardReview(user.id, data.cardId, data.isSuccess);

  return {
    success: true,
    newHp,
    newMana,
    hpLoss,
    manaDelta,
    isDead: newHp <= 0,
    srsLevel: srsProgress.srs_niveau,
  };
}

export async function useSpellAction(spellId: string, manaCost: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const currentMana = user.mana_current ?? 100;
  if (currentMana < manaCost) {
    return { error: "Mana insuffisant !" };
  }

  const newMana = currentMana - manaCost;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      mana_current: newMana,
    },
  });

  return {
    success: true,
    newMana,
  };
}

export async function completeDungeonAction(lessonId: string, correctCount: number, totalCount: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) return { error: "Donjon introuvable" };

  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  // Calcul XP et Gemmes
  let xpEarned = lesson.xp_reward;
  let gemsEarned = lesson.gems_reward || 10;

  if (accuracy === 100) {
    xpEarned += 15; // Bonus sans faute
    gemsEarned += 5;
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

  if (accuracy >= 75) {
    newMastery = Math.min(5, currentMastery + 1);
  }

  const result = await awardXpAndProgress(user.id, xpEarned, lessonId, newMastery);

  // Créditer les gemmes
  const currentGems = user.gems ?? 50;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      gems: currentGems + gemsEarned,
      hp_current: 100, // Soin complet à la fin du donjon
    },
  });

  revalidatePath("/");
  revalidatePath("/profile");

  return {
    success: true,
    xpEarned,
    gemsEarned,
    newGems: currentGems + gemsEarned,
    newLevel: result?.newLevel || user.user_level,
    leveledUp: result?.leveledUp || false,
    newMastery,
    accuracy: Math.round(accuracy),
  };
}

export const completeLessonAction = completeDungeonAction;

