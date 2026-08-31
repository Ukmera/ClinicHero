import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Heart, Wind, Brain, ArrowRight, Sparkles, BookOpen, Scroll, Swords } from "lucide-react";

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
      name: "Pneumologie & Voies Aériennes",
      icon: Wind,
      desc: "Sémiologie respiratoire (râles crépitants, sibilants, pleurésie, gazométrie).",
      badge: "Donjon V2",
      color: "bg-cyan-950/80 text-cyan-300 border-cyan-700/80",
    },
    {
      name: "Neurologie & Réflexes",
      icon: Brain,
      desc: "Syndromes pyramidal, extrapyramidal, vestibulaire et méningé.",
      badge: "Donjon V2",
      color: "bg-purple-950/80 text-purple-300 border-purple-700/80",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <span>Catalogue des Donjons Médicaux</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Explore l’ensemble des régions anatomiques disponibles et les futures extensions de l&apos;Ordre.
        </p>
      </div>

      {/* Modules Actifs V1 */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Swords className="w-3.5 h-3.5" />
          <span>Donjons Actifs • Cardiovasculaire</span>
        </h2>

        {modules.map((mod) => (
          <div
            key={mod.id}
            className="card-rpg space-y-4"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white">{mod.nom_fr}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{mod.description_fr}</p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
                {mod.lessons.length} Quêtes
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.slug}`}
                  className="py-3 flex items-center justify-between hover:text-amber-400 transition-colors group"
                >
                  <div className="text-xs md:text-sm font-extrabold text-slate-200 group-hover:text-amber-400">
                    {lesson.nom_fr}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                    <span>{lesson.cards.length} cartes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-amber-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modules Futurs (Roadmap) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Futures Régions & Spécialités
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {futureSystems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-3 opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-white text-xs md:text-sm">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
