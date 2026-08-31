import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Heart, Wind, Brain, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default async function ModulesCatalogPage() {
  const user = await getCurrentUser();

  const modules = await prisma.module.findMany({
    orderBy: { ordre_affichage: "asc" },
    include: {
      lessons: {
        orderBy: { ordre_affichage: "asc" },
        include: {
          cards: { select: { id: true } },
          user_progress: user
            ? {
                where: { user_id: user.id },
              }
            : false,
        },
      },
    },
  });

  const futureSystems = [
    {
      name: "Pneumologie",
      icon: Wind,
      desc: "Sémiologie respiratoire (râles crépitants, sibilants, pleurésie, gazométrie).",
      badge: "V2 - Bientôt",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      name: "Neurologie",
      icon: Brain,
      desc: "Syndromes pyramidal, extrapyramidal, vestibulaire et méningé.",
      badge: "V2 - Bientôt",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span>Catalogue des Modules Médicaux</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore l’ensemble des spécialités cliniques disponibles et prévues.
        </p>
      </div>

      {/* Modules Actifs V1 */}
      <div className="space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
          Actifs en V1 • Cardiovasculaire
        </h2>

        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{mod.nom_fr}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{mod.description_fr}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {mod.lessons.length} Leçons
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.slug}`}
                  className="py-3 flex items-center justify-between hover:text-indigo-600 transition-colors group"
                >
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                    {lesson.nom_fr}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{lesson.cards.length} cartes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modules Futurs (Roadmap) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
          Prochaines Spécialités (Roadmap)
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {futureSystems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
