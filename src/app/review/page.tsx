import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCardsDueForReview } from "@/lib/srs";
import CardPlayer from "@/components/CardPlayer";
import { CheckCircle2, RotateCcw, ArrowLeft, BookOpen, Trophy, Sparkles } from "lucide-react";
import PixelSprite from "@/components/rpg/PixelSprite";

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
          <PixelSprite type="bonfire" size="xl" glow={true} />
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rituel Quotidien Accompli</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">
            Aucun rituel de révision en attente !
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Ta mémoire sémiologique est parfaitement alignée avec l&apos;algorithme de répétition espacée (SuperMemo-2). Reviens demain ou explore un nouveau donjon.
          </p>
        </div>

        <div className="pt-2 w-full space-y-2.5">
          <Link
            href="/"
            className="btn-rpg-gold w-full py-4 text-sm font-black shadow-amber-500/25"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorer les Donjons</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <CardPlayer
        lessonId="srs-daily-review"
        lessonTitle={`Rituel de Révision SRS (${dueCards.length} cartes)`}
        cards={dueCards}
        isReviewMode={true}
      />
    </div>
  );
}
