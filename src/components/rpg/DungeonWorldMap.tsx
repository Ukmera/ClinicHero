"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Crown,
  Sparkles,
  ChevronRight,
  Swords,
  Scroll,
  Heart,
  Stethoscope,
  Activity,
  CheckCircle2,
  Zap,
  Flame,
  Shield,
} from "lucide-react";
import PixelSprite from "./PixelSprite";
import MentorDialogue from "./MentorDialogue";
import { playRetroSound } from "@/lib/rpg/audio";
import { CharacterClassId } from "@/lib/rpg/types";

interface LessonData {
  id: string;
  slug: string;
  nom_fr: string;
  description_fr: string;
  niveau_difficulte: number;
  ordre_affichage: number;
  xp_reward: number;
  cards: { id: string }[];
  user_progress?: {
    mastery_level: number;
    deja_aborde_cours: boolean;
  }[];
}

interface ModuleData {
  id: string;
  slug: string;
  nom_fr: string;
  description_fr: string;
  ordre_affichage: number;
  lessons: LessonData[];
}

interface DungeonWorldMapProps {
  modules: ModuleData[];
  user: {
    character_class?: string | null;
    user_level?: number;
    avatar_id?: string | null;
    streak_days?: number;
  } | null;
}

export default function DungeonWorldMap({ modules, user }: DungeonWorldMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: LessonData;
    modIdx: number;
    lesIdx: number;
    isLocked: boolean;
    isBoss: boolean;
    isCurrent: boolean;
  } | null>(null);

  // Déterminer la position actuelle du joueur sur la carte
  let currentActiveNodeFound = false;
  let currentActiveLessonId: string | null = null;

  // Parcourir les leçons pour trouver la première non terminée
  modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      const progress = les.user_progress && les.user_progress.length > 0 ? les.user_progress[0] : null;
      const isMastered = progress && progress.mastery_level >= 3;
      if (!currentActiveNodeFound && (!progress || progress.mastery_level < 5)) {
        currentActiveLessonId = les.id;
        currentActiveNodeFound = true;
      }
    });
  });

  // Si tout est maîtrisé, le joueur est sur la dernière étape
  if (!currentActiveLessonId && modules.length > 0) {
    const lastMod = modules[modules.length - 1];
    if (lastMod.lessons.length > 0) {
      currentActiveLessonId = lastMod.lessons[lastMod.lessons.length - 1].id;
    }
  }

  // Obtenir le décalage horizontal pour tracer le chemin en lacets
  const getHorizontalOffset = (index: number) => {
    const pattern = [0, 48, 0, -48]; // Centre, Droite, Centre, Gauche
    return pattern[index % pattern.length];
  };

  const getDungeonTheme = (mod: ModuleData, modIdx: number) => {
    if (mod.slug.includes("tuto") || (modIdx === 0 && mod.slug.includes("tutoriel"))) {
      return {
        title: "Monde 0 : Sanctuaire d'Initiation",
        subtitle: "L'Éveil du Sémiologue avec La Grande Blouse",
        accentColor: "from-amber-500/20 via-slate-900 to-slate-950",
        border: "border-amber-400/40",
        badgeColor: "bg-amber-950/80 text-amber-300 border-amber-700/60",
        icon: Sparkles,
      };
    }

    if (mod.slug.includes("chapitre-1") || mod.slug.includes("douleur-thoracique")) {
      return {
        title: "Monde 1 • Chapitre 1 : Les Fléaux Thoraciques",
        subtitle: "Ischémie Coronarienne, Angor & Spectre de l'Infarctus",
        accentColor: "from-rose-500/20 via-slate-900 to-slate-950",
        border: "border-rose-500/40",
        badgeColor: "bg-rose-950/80 text-rose-300 border-rose-700/60",
        icon: Heart,
      };
    }

    if (mod.slug.includes("chapitre-2") || mod.slug.includes("insuffisance-cardiaque")) {
      return {
        title: "Monde 1 • Chapitre 2 : Les Marais Congestifs",
        subtitle: "IVG, OAP, Choc Cardiogénique & Léviathan Congestif",
        accentColor: "from-cyan-500/20 via-slate-900 to-slate-950",
        border: "border-cyan-500/40",
        badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-700/60",
        icon: Activity,
      };
    }

    if (mod.slug.includes("chapitre-3") || mod.slug.includes("auscultation")) {
      return {
        title: "Monde 1 • Chapitre 3 : La Chambre Acoustique",
        subtitle: "Foyers, Souffles Systolo-Diastoliques & Gargouille Valvulaire",
        accentColor: "from-emerald-500/20 via-slate-900 to-slate-950",
        border: "border-emerald-500/40",
        badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
        icon: Stethoscope,
      };
    }

    if (mod.slug.includes("chapitre-4") || mod.slug.includes("troubles-du-rythme")) {
      return {
        title: "Monde 1 • Chapitre 4 : La Foudre Électrique",
        subtitle: "Fibrillation Atriale, BAV, TV & Dragon Rythmologique",
        accentColor: "from-amber-400/20 via-slate-900 to-slate-950",
        border: "border-yellow-400/40",
        badgeColor: "bg-yellow-950/80 text-yellow-300 border-yellow-700/60",
        icon: Zap,
      };
    }

    if (mod.slug.includes("chapitre-5") || mod.slug.includes("vaisseaux")) {
      return {
        title: "Monde 1 • Chapitre 5 : La Forteresse Aortique",
        subtitle: "TVP, AOMI, Urgences HTA & Seigneur Suprême de l'Aorte",
        accentColor: "from-purple-600/20 via-slate-900 to-slate-950",
        border: "border-purple-500/40",
        badgeColor: "bg-purple-950/80 text-purple-300 border-purple-700/60",
        icon: Shield,
      };
    }

    return {
      title: "Royaume d'Aethelgard",
      subtitle: "Quêtes & Défis Sémiologiques",
      accentColor: "from-indigo-500/20 via-slate-900 to-slate-950",
      border: "border-indigo-400/40",
      badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-700/60",
      icon: Swords,
    };
  };

  let globalLessonCounter = 0;

  return (
    <div className="space-y-8 relative pb-16">
      {/* Mentor La Grande Blouse pour guider le joueur */}
      <MentorDialogue
        title="La Grande Blouse te salue !"
        message="Bienvenue dans les contrées d'Aethelgard ! Pour dissiper les brumes de l'erreur médicale, chaque donjon mettra à l'épreuve ton raisonnement clinique. Surveille tes 100 PV et dépense ton Mana pour invoquer tes sorts !"
        expression="sage"
      />

      {/* En-tête de la Carte du Monde Med-RPG */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
              Carte des Donjons d&apos;Aethelgard
            </h2>
            <p className="text-xs text-slate-400">
              Progresse d&apos;îlot en îlot pour dissiper le brouillard sémiologique.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-400">
          <Crown className="w-4 h-4" />
          <span>{modules.length} Régions</span>
        </div>
      </div>

      {/* Rendu des Donjons & Îlots interconnectés */}
      {modules.map((mod, modIdx) => {
        const theme = getDungeonTheme(mod, modIdx);
        const Icon = theme.icon;

        return (
          <div
            key={mod.id}
            className={`relative rounded-3xl p-5 md:p-8 bg-gradient-to-b ${theme.accentColor} border ${theme.border} shadow-2xl overflow-hidden`}
          >
            {/* Texture de fond de donjon avec overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 pixel-rendering pointer-events-none"
              style={{ backgroundImage: "url('/pixel-crawler/tilesets/Dungeon_Tiles.png')" }}
            />

            {/* Décor d'environnement aux coins */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-40">
              <PixelSprite type="bonfire" size="xs" glow={false} className="bg-transparent border-0" />
            </div>

            {/* Bannière de Région / Donjon */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    {theme.title}
                  </div>
                  <h3 className="text-base md:text-lg font-black text-white">{mod.nom_fr}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{theme.subtitle}</p>
                </div>
              </div>

              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badgeColor}`}>
                {mod.lessons.length} Îlots de Quête
              </span>
            </div>

            {/* Tracé de la Carte : Îlots en lacets */}
            <div className="relative z-10 max-w-md mx-auto py-4 flex flex-col items-center gap-10">
              {/* Ligne de connexion sinueuse SVG en arrière-plan */}
              <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="w-1.5 h-full bg-slate-800/80 rounded-full border-x border-slate-700/50 shadow-inner" />
              </div>

              {mod.lessons.map((lesson, lesIdx) => {
                const currentGlobalIdx = globalLessonCounter++;
                const progress =
                  lesson.user_progress && lesson.user_progress.length > 0
                    ? lesson.user_progress[0]
                    : null;
                const mastery = progress ? progress.mastery_level : 0;
                const isMastered = mastery >= 3;
                const isGold = mastery === 5;
                const isBoss =
                  lesson.nom_fr.toLowerCase().includes("boss") ||
                  lesson.slug.toLowerCase().includes("boss") ||
                  (lesIdx === mod.lessons.length - 1 && mod.lessons.length >= 4);
                const isCurrent = lesson.id === currentActiveLessonId;
                const isLocked = !isCurrent && mastery === 0 && currentGlobalIdx > 0 && !progress;

                const xOffset = getHorizontalOffset(lesIdx);

                // Déterminer le sprite de monstre approprié pour chaque boss de chapitre
                const getBossSpriteType = (): "skeleton_warrior" | "skeleton_mage" | "orc_shaman" | "skeleton_rogue" => {
                  if (mod.slug.includes("tuto")) return "skeleton_mage";
                  if (mod.slug.includes("chapitre-1")) return "skeleton_warrior";
                  if (mod.slug.includes("chapitre-2")) return "orc_shaman";
                  if (mod.slug.includes("chapitre-3")) return "skeleton_mage";
                  if (mod.slug.includes("chapitre-4")) return "skeleton_mage";
                  return "skeleton_warrior";
                };

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateX(${xOffset}px)`,
                    }}
                  >
                    {/* Héros positionné sur son îlot actuel */}
                    {isCurrent && (
                      <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce-short">
                        <div className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg border border-amber-300 mb-1 tracking-wider whitespace-nowrap">
                          ⚔️ Étape Actuelle
                        </div>
                        <PixelSprite
                          classId={user?.character_class || "clerc"}
                          size="sm"
                          animation="idle"
                          glow={true}
                        />
                      </div>
                    )}

                    {/* Boss Sprite sur l'ultime sanctuaire */}
                    {isBoss && !isCurrent && (
                      <div className="absolute -top-12 z-20 flex flex-col items-center">
                        <div className="bg-gradient-to-r from-red-600 to-rose-700 border border-red-400 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg mb-1 animate-pulse flex items-center gap-1">
                          <span>👑</span>
                          <span>BOSS</span>
                        </div>
                        <PixelSprite
                          type={getBossSpriteType()}
                          size="sm"
                          glow={true}
                        />
                      </div>
                    )}

                    {/* L'ÎLOT DE QUÊTE (Stepping Stone 3D) */}
                    <button
                      onClick={() => {
                        playRetroSound("click");
                        setSelectedLesson({
                          lesson,
                          modIdx,
                          lesIdx,
                          isLocked,
                          isBoss,
                          isCurrent,
                        });
                      }}
                      className={`group relative rounded-3xl flex flex-col items-center justify-center transition-all transform active:scale-95 select-none ${
                        isBoss
                          ? "w-24 h-24 bg-gradient-to-b from-rose-900 via-red-950 to-slate-950 text-rose-200 border-3 border-rose-500 shadow-2xl shadow-rose-600/40 hover:scale-105 ring-4 ring-rose-500/30"
                          : isCurrent
                          ? "w-20 h-20 bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-3 border-amber-200 shadow-2xl shadow-amber-500/50 scale-110 ring-4 ring-amber-400/30"
                          : isGold
                          ? "w-20 h-20 bg-gradient-to-b from-amber-500 to-yellow-600 text-slate-950 border-3 border-amber-300 shadow-lg shadow-amber-500/20 hover:scale-105"
                          : isMastered
                          ? "w-20 h-20 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white border-2 border-indigo-400 shadow-lg hover:scale-105"
                          : isLocked
                          ? "w-20 h-20 bg-slate-900/90 text-slate-600 border-2 border-slate-800 opacity-60 hover:opacity-80"
                          : "w-20 h-20 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 border-2 border-slate-700 shadow-md hover:scale-105"
                      }`}
                    >
                      {/* Icône Centrale de l'Îlot */}
                      <div className="text-xl font-black">
                        {isGold ? (
                          <Crown className="w-7 h-7 text-slate-950 animate-bounce" />
                        ) : isBoss ? (
                          <span className="text-2xl animate-pulse">👑</span>
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-slate-500" />
                        ) : isCurrent ? (
                          <Sparkles className="w-7 h-7 text-slate-950" />
                        ) : (
                          <span>{`${modIdx + 1}.${lesIdx + 1}`}</span>
                        )}
                      </div>

                      {/* Étoiles sous l'îlot */}
                      <div className="flex items-center gap-0.5 text-[9px] font-black mt-1">
                        {mastery > 0 ? (
                          <div className="flex text-amber-300">
                            {"★".repeat(mastery)}
                          </div>
                        ) : isBoss ? (
                          <span className="text-[8px] font-black uppercase text-rose-400 tracking-wider">
                            Multi-Phases
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-400">
                            N.{lesson.niveau_difficulte}
                          </span>
                        )}
                      </div>

                      {/* Socle d'ombre 3D */}
                      <div className="absolute -bottom-2 w-14 h-3 bg-black/40 rounded-full blur-xs -z-10" />
                    </button>

                    {/* Étiquette du nom de la quête sous l'îlot */}
                    <div className="mt-2.5 max-w-[150px] text-center">
                      <div className={`text-xs font-black line-clamp-1 ${
                        isBoss
                          ? "text-rose-400 font-black"
                          : isCurrent
                          ? "text-amber-400 font-black"
                          : "text-slate-300"
                      }`}>
                        {lesson.nom_fr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {lesson.cards.length} cartes • +{lesson.xp_reward} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* MODAL POPUP DE L'ÎLOT SÉLECTIONNÉ */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-rpg max-w-md w-full p-6 space-y-5 animate-bounce-short border-amber-400/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* En-tête de la Modale */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Îlot {selectedLesson.modIdx + 1}.{selectedLesson.lesIdx + 1}
                  </span>
                  {selectedLesson.isBoss && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                      <span>👑</span>
                      <span>Combat de Boss</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-white">{selectedLesson.lesson.nom_fr}</h3>
              </div>

              <button
                onClick={() => setSelectedLesson(null)}
                className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Description & Objectifs */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedLesson.lesson.description_fr}
            </p>

            {/* Récompenses & Maîtrise */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Récompense</div>
                <div className="text-sm font-black text-amber-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>+{selectedLesson.lesson.xp_reward} XP</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Salles de Défi</div>
                <div className="text-sm font-black text-indigo-300 flex items-center gap-1 mt-0.5">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>{selectedLesson.lesson.cards.length} salles</span>
                </div>
              </div>
            </div>

            {/* Actions doubles : Combattre direct OU Réviser avec le Mentor */}
            <div className="space-y-2.5 pt-1">
              <Link
                href={`/session/${selectedLesson.lesson.id}`}
                onClick={() => playRetroSound("click")}
                className="btn-rpg-gold w-full py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>⚔️ Entrer dans le Donjon ({selectedLesson.lesson.cards.length} Salles)</span>
              </Link>

              <Link
                href={`/lesson/${selectedLesson.lesson.slug}`}
                onClick={() => playRetroSound("click")}
                className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>📖 Cours avec La Grande Blouse</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
