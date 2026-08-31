import { RpgSpell } from "./types";

export const RPG_SPELLS: Record<string, RpgSpell> = {
  clarity: {
    id: "clarity",
    name: "Sort de Clarté",
    manaCost: 30,
    description: "Élimine une option incorrecte pour faciliter le diagnostic.",
    icon: "Sparkles",
    effectType: "eliminate_wrong",
  },
  grimoire: {
    id: "grimoire",
    name: "Consultation du Grimoire",
    manaCost: 45,
    description: "Révèle le moyen mnémotechnique de la leçon sans malus d'XP.",
    icon: "BookOpen",
    effectType: "show_mnemonic",
  },
  vital_boost: {
    id: "vital_boost",
    name: "Regain Vital",
    manaCost: 60,
    description: "Restaure 1 point de vie (cœur) en cas de difficulté.",
    icon: "Heart",
    effectType: "restore_heart",
  },
};
