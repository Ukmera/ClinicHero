import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import DungeonRoomPlayer from "@/components/rpg/DungeonRoomPlayer";

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

  const isBoss = lesson.dungeon_type === "boss";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-4">
      <DungeonRoomPlayer
        lessonId={lesson.id}
        lessonTitle={lesson.nom_fr}
        cards={lesson.cards as any}
        userClass={user.character_class || "clerc"}
        userHp={user.hp_current ?? 100}
        userMana={user.mana_current ?? 100}
        userGems={user.gems ?? 50}
        isBossDungeon={isBoss}
        bossName={lesson.boss_name}
        bossAvatar={lesson.boss_avatar}
      />
    </div>
  );
}
