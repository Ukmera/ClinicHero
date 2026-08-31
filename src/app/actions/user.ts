"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveOnboardingProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const profession = (formData.get("profession") as string) || "medecine";
  const profession_autre = formData.get("profession_autre") as string | null;
  const niveau_etudes = (formData.get("niveau_etudes") as string) || "debutant";
  const mode_apprentissage = (formData.get("mode_apprentissage") as string) || "complet";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      profession,
      profession_autre: profession === "autre" ? profession_autre : null,
      niveau_etudes,
      mode_apprentissage,
      onboarding_complete: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/profile");
  return { success: true };
}

export async function setLessonPriorKnowledgeAction(lessonId: string, dejaAborde: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  await prisma.userLessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id: user.id,
        lesson_id: lessonId,
      },
    },
    update: {
      deja_aborde_cours: dejaAborde,
      last_practiced_at: new Date(),
    },
    create: {
      user_id: user.id,
      lesson_id: lessonId,
      deja_aborde_cours: dejaAborde,
      mastery_level: 0,
      last_practiced_at: new Date(),
    },
  });

  revalidatePath(`/lesson/${lessonId}`);
  return { success: true };
}

export async function getGlossaryTermsAction() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { terme: "asc" },
  });
  return terms;
}
