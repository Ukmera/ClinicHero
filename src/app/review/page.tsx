import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCardsDueForReview } from "@/lib/srs";
import CardPlayer from "@/components/CardPlayer";
import { CheckCircle2, RotateCcw, ArrowLeft, BookOpen, Trophy } from "lucide-react";

export default async function ReviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dueCards = await getCardsDueForReview(user.id);

  if (dueCards.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Aucune révision en attente !
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tu es parfaitement à jour dans ta répétition espacée (SRS). Reviens demain ou explore une nouvelle leçon pour enrichir ta mémoire à long terme.
          </p>
        </div>

        <div className="pt-4 w-full space-y-2.5">
          <Link
            href="/"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Découvrir de nouvelles leçons</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CardPlayer
        lessonId="srs-daily-review"
        lessonTitle={`Révision SRS (${dueCards.length} cartes)`}
        cards={dueCards}
        isReviewMode={true}
      />
    </div>
  );
}
