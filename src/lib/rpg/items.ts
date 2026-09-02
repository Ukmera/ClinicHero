export type ItemCategory = "stethoscope" | "coat" | "relic" | "consumable" | "title";
export type ItemRarity = "commun" | "rare" | "epique" | "legendaire";

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  price: number; // Prix en Gemmes
  icon: string; // Emoji ou identifiant d'icône
  spriteType?: string;
  description: string;
  lore: string;
  bonus: {
    hpMax?: number;
    manaMax?: number;
    freeFiftyFiftyPerDungeon?: number;
    spellCostReduction?: number;
    xpBonusPercent?: number;
    hpRestore?: number;
    manaRestore?: number;
    errorShield?: boolean;
    spectralAura?: boolean;
  };
  requiredLevel?: number;
  isDefault?: boolean;
}

export const SHOP_CATALOG: ShopItem[] = [
  // ==========================================
  // 🩺 STÉTHOSCOPES & INSTRUMENTS ACOUSTIQUES
  // ==========================================
  {
    id: "stethoscope_bronze",
    name: "Stéthoscope d'Initié en Bronze",
    category: "stethoscope",
    rarity: "commun",
    price: 0,
    icon: "🩺",
    description: "Le stéthoscope remis à tout jeune externe franchissant les portes de l'amphithéâtre.",
    lore: "Léger et modeste, il permet de percevoir les premiers battements de cœur d'Aethelgard.",
    bonus: {
      manaMax: 0,
    },
    isDefault: true,
  },
  {
    id: "stethoscope_praticien",
    name: "Stéthoscope Acoustique de Praticien",
    category: "stethoscope",
    rarity: "rare",
    price: 75,
    icon: "🩺✨",
    description: "+25 Mana Max • Clarté d'auscultation accrue.",
    lore: "Forgé dans un alliage d'argent pur, sa membrane amplifie les bruits B1 et B2 les plus discrets.",
    bonus: {
      manaMax: 25,
    },
    requiredLevel: 1,
  },
  {
    id: "stethoscope_or_maitre",
    name: "Stéthoscope Double Pavillon Doré",
    category: "stethoscope",
    rarity: "epique",
    price: 180,
    icon: "🩺👑",
    description: "+50 Mana Max • +10% XP sur tous les donjons.",
    lore: "Béni par les anciens maîtres de la Faculté, ce stéthoscope capte les vibrations subtiles des flux de Korotkoff.",
    bonus: {
      manaMax: 50,
      xpBonusPercent: 10,
    },
    requiredLevel: 2,
  },
  {
    id: "stethoscope_celeste",
    name: "Stéthoscope Éthéré de La Grande Blouse",
    category: "stethoscope",
    rarity: "legendaire",
    price: 350,
    icon: "🌟🩺",
    description: "+80 Mana Max • Réduit le coût de tous les sorts arcaniques de 5 Mana.",
    lore: "Le légendaire stéthoscope doré flottant de La Grande Blouse elle-même. Les murmures des murmures cardiaques lui obéissent.",
    bonus: {
      manaMax: 80,
      spellCostReduction: 5,
    },
    requiredLevel: 3,
  },

  // ==========================================
  // 🥼 BLOUSES & ARMURES CLINIQUES
  // ==========================================
  {
    id: "blouse_externe",
    name: "Blouse Blanche d'Externe",
    category: "coat",
    rarity: "commun",
    price: 0,
    icon: "🥼",
    description: "Protection basique : 100 PV Max.",
    lore: "Une simple blouse en coton aux poches remplies de carnets de notes et de stylos.",
    bonus: {
      hpMax: 0,
    },
    isDefault: true,
  },
  {
    id: "blouse_interne_garde",
    name: "Blouse Renforcée d'Interne de Garde",
    category: "coat",
    rarity: "rare",
    price: 90,
    icon: "🥼🛡️",
    description: "+25 PV Max (Total 125 PV) • Résistance au stress nocturne.",
    lore: "Tissée pour endurer 24 heures de garde consécutives aux urgences sans faiblir.",
    bonus: {
      hpMax: 25,
    },
    requiredLevel: 1,
  },
  {
    id: "blouse_chef_clinique",
    name: "Blouse Royale de Chef de Clinique",
    category: "coat",
    rarity: "epique",
    price: 220,
    icon: "🥼👑",
    description: "+50 PV Max (Total 150 PV) • Bouclier : annule la perte de PV sur la 1ère erreur d'un donjon.",
    lore: "Une étoffe brodée de fils dorés conférant une aura d'autorité incontestable au lit du malade.",
    bonus: {
      hpMax: 50,
      errorShield: true,
    },
    requiredLevel: 2,
  },
  {
    id: "grande_blouse_celeste",
    name: "Grande Blouse Céleste Spectrale",
    category: "coat",
    rarity: "legendaire",
    price: 450,
    icon: "✨👻",
    description: "+50 PV Max • +40 Mana Max • Aura spectrale animée en lévitation.",
    lore: "La véritable tunique spectrale de La Grande Blouse. Celui qui la porte flotte au-dessus des doutes cliniques.",
    bonus: {
      hpMax: 50,
      manaMax: 40,
      spectralAura: true,
    },
    requiredLevel: 3,
  },

  // ==========================================
  // 🔨 RELIQUES & INSTRUMENTS SÉMIOLOGIQUES
  // ==========================================
  {
    id: "marteau_babinski",
    name: "Marteau Réflexe de Babinski Enchanteur",
    category: "relic",
    rarity: "rare",
    price: 110,
    icon: "🔨⚡",
    description: "1 Sort 50/50 gratuit offert à chaque donjon sans dépenser de Mana.",
    lore: "Un marteau en acier trempé dont la pointe télescopique excite les réflexes myotatiques.",
    bonus: {
      freeFiftyFiftyPerDungeon: 1,
    },
    requiredLevel: 1,
  },
  {
    id: "sphygmomanometre_or",
    name: "Sphygmomanomètre de Précision à Cadran",
    category: "relic",
    rarity: "epique",
    price: 160,
    icon: "🧭🩸",
    description: "+15 PV Max • +15 Mana Max • Précision accrue sur les cas hémodynamiques.",
    lore: "Son cadran en laiton poli mesure avec exactitude la pression systolique et diastolique.",
    bonus: {
      hpMax: 15,
      manaMax: 15,
    },
    requiredLevel: 2,
  },
  {
    id: "diapason_weber",
    name: "Diapason Harmonique de Weber & Rinne",
    category: "relic",
    rarity: "legendaire",
    price: 280,
    icon: "🔱🎵",
    description: "+15% XP sur tous les donjons • Résonance vibratoire parfaite.",
    lore: "Vibrant à 128 Hz, il permet de diagnostiquer les troubles de conduction et les hypoacousies.",
    bonus: {
      xpBonusPercent: 15,
    },
    requiredLevel: 3,
  },

  // ==========================================
  // 🧪 ÉLIXIRS & CONSOMMABLES D'URGENCE
  // ==========================================
  {
    id: "potion_serum_phy",
    name: "Flacon de Sérum Physiologique Isotonique",
    category: "consumable",
    rarity: "commun",
    price: 25,
    icon: "🧪💚",
    description: "Restaure immédiatement 50 PV à ton héros.",
    lore: "Une poche de NaCl à 0.9 % restaurant rapidement la volémie et l'énergie vitale.",
    bonus: {
      hpRestore: 50,
    },
  },
  {
    id: "potion_cafeine_garde",
    name: "Infusion de Caféine d'Urgence",
    category: "consumable",
    rarity: "commun",
    price: 30,
    icon: "☕⚡",
    description: "Restaure immédiatement 100 Mana pour tes sorts.",
    lore: "Le nectar des internes de garde à 4 heures du matin. Dissipe le sommeil et recharge l'esprit.",
    bonus: {
      manaRestore: 100,
    },
  },
  {
    id: "elixir_adrenaline",
    name: "Élixir d'Adrénaline Pure 1mg",
    category: "consumable",
    rarity: "epique",
    price: 60,
    icon: "💉🔥",
    description: "Restaure 100 PV et 100 Mana instantanément.",
    lore: "Un puissant sympathomimétique de réanimation pour sauver n'importe quelle situation critique.",
    bonus: {
      hpRestore: 100,
      manaRestore: 100,
    },
  },
];

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_CATALOG.find((item) => item.id === id);
}

export function getRarityColor(rarity: ItemRarity) {
  switch (rarity) {
    case "legendaire":
      return {
        border: "border-amber-400",
        bg: "bg-amber-950/40",
        text: "text-amber-300",
        glow: "shadow-amber-500/30",
        badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      };
    case "epique":
      return {
        border: "border-purple-500",
        bg: "bg-purple-950/40",
        text: "text-purple-300",
        glow: "shadow-purple-500/30",
        badge: "bg-purple-500/20 text-purple-300 border-purple-400/40",
      };
    case "rare":
      return {
        border: "border-cyan-500",
        bg: "bg-cyan-950/40",
        text: "text-cyan-300",
        glow: "shadow-cyan-500/30",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      };
    default:
      return {
        border: "border-slate-700",
        bg: "bg-slate-900/60",
        text: "text-slate-300",
        glow: "shadow-slate-700/20",
        badge: "bg-slate-800 text-slate-400 border-slate-700",
      };
  }
}
