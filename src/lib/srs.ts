import { prisma } from "./prisma";

// Intervalles de répétition espacée (en jours) par niveau de boîte Leitner
const LEITNER_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];

export function calculateNextReviewDate(currentLevel: number, isSuccess: boolean): {
  nextLevel: number;
  nextReviewDate: Date;
} {
  const now = new Date();
  let nextLevel: number;

  if (isSuccess) {
    nextLevel = Math.min(5, currentLevel + 1);
  } else {
    nextLevel = Math.max(0, currentLevel - 1);
  }

  const daysToAdd = LEITNER_INTERVALS_DAYS[nextLevel];
  const nextReviewDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  return {
    nextLevel,
    nextReviewDate,
  };
}

export async function processCardReview(userId: string, cardId: string, isSuccess: boolean) {
  const existing = await prisma.userCardProgress.findUnique({
    where: {
      user_id_card_id: {
        user_id: userId,
        card_id: cardId,
      },
    },
  });

  const currentLevel = existing ? existing.srs_niveau : 0;
  const currentSuccesses = existing ? existing.srs_succes_consecutifs : 0;

  const { nextLevel, nextReviewDate } = calculateNextReviewDate(currentLevel, isSuccess);

  const updated = await prisma.userCardProgress.upsert({
    where: {
      user_id_card_id: {
        user_id: userId,
        card_id: cardId,
      },
    },
    update: {
      srs_niveau: nextLevel,
      srs_succes_consecutifs: isSuccess ? currentSuccesses + 1 : 0,
      srs_prochaine_revue: nextReviewDate,
      last_reviewed_at: new Date(),
    },
    create: {
      user_id: userId,
      card_id: cardId,
      srs_niveau: nextLevel,
      srs_succes_consecutifs: isSuccess ? 1 : 0,
      srs_prochaine_revue: nextReviewDate,
      last_reviewed_at: new Date(),
    },
  });

  return updated;
}

export async function getCardsDueForReview(userId: string) {
  const now = new Date();

  // Cartes qui ont déjà un historique et dont la date de révision est échue
  const dueExisting = await prisma.userCardProgress.findMany({
    where: {
      user_id: userId,
      srs_prochaine_revue: {
        lte: now,
      },
    },
    include: {
      card: {
        include: {
          lesson: {
            include: {
              module: true,
            },
          },
        },
      },
    },
    take: 20,
  });

  return dueExisting.map((p) => ({
    ...p.card,
    srs_niveau: p.srs_niveau,
  }));
}
