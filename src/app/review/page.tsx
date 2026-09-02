import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCardsDueForReview } from "@/lib/srs";
import DungeonRoomPlayer from "@/components/rpg/DungeonRoomPlayer";
import { CheckCircle2, RotateCcw, ArrowLeft, BookOpen, Trophy, Sparkles } from "lucide-react";
import PixelSprite from "@/components/rpg/PixelSprite";
import GrandBlouseAvatar from "@/components/rpg/GrandBlouseAvatar";

export default async function ReviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dueCards = await getCardsDueForReview(user.id);

  if (dueCards.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-bounce-short">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <GrandBlouseAvatar emotion="happy" size="md" glow={true} />
            <div className="absolute -bottom-2 -right-2">
              <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rituel Quotidien Accompli</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">
            Aucun spectre d&apos;oubli en attente !
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Ta mémoire sémiologique est parfaitement alignée avec l&apos;algorithme de répétition espacée (SuperMemo-2). Reviens demain ou purifie un nouveau donjon.
          </p>
        </div>

        <div className="pt-2 w-full space-y-2.5">
          <Link
            href="/"
            className="btn-rpg-gold w-full py-4 text-sm font-black shadow-amber-500/25"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorer la Carte des Donjons</span>
          </Link>
        </div>
      </div>
    );
  }

  let inventory: string[] = [];
  try {
    inventory = JSON.parse(user.inventory_json || "[]");
  } catch (e) {
    inventory = [];
  }

  return (
    <div className="min-h-screen bg-slate-950 py-4">
      <DungeonRoomPlayer
        lessonId="srs-daily-review"
        lessonTitle={`Donjon Fantôme SRS (${dueCards.length} Spectres d'Oubli)`}
        cards={dueCards as any}
        userClass={user.character_class || "clerc"}
        userHp={user.hp_current ?? 100}
        userHpMax={user.hp_max ?? 100}
        userMana={user.mana_current ?? 100}
        userManaMax={user.mana_max ?? 200}
        userGems={user.gems ?? 50}
        inventory={inventory}
        isBossDungeon={true}
        bossName="Spectre de l'Oubli Clinique"
        bossAvatar="👻"
      />
    </div>
  );
}
