"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { error: "Identifiants incorrects." };
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return { error: "Identifiants incorrects." };
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token);
  redirect("/");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) || "Futur Soignant";

  if (!email || !password || password.length < 6) {
    return { error: "Mot de passe d'au moins 6 caractères requis." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existing) {
    return { error: "Cet email est déjà utilisé." };
  }

  const password_hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password_hash,
      name,
      xp_total: 0,
      user_level: 1,
      streak_days: 1,
      last_activity_date: new Date(),
    },
  });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token);
  redirect("/");
}

export async function loginAsDemoAction() {
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@clinichero.fr" },
  });

  if (!demoUser) {
    // Si l'utilisateur n'existe pas, on le recrée à la volée
    const password_hash = await hashPassword("clinichero123");
    const created = await prisma.user.create({
      data: {
        email: "demo@clinichero.fr",
        name: "Interne Démo",
        password_hash,
        xp_total: 120,
        user_level: 2,
        streak_days: 3,
        last_activity_date: new Date(),
      },
    });

    const token = await createSessionToken({
      userId: created.id,
      email: created.email,
      name: created.name,
    });
    await setSessionCookie(token);
  } else {
    const token = await createSessionToken({
      userId: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
    });
    await setSessionCookie(token);
  }

  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
