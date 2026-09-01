export type CharacterClassId =
  | "clerc"
  | "alchimiste"
  | "mage_ecg"
  | "moine"
  | "necromancien"
  | "enchanteuse"
  | "chasseur"
  | "gardien";

export type AvatarTier = "apprenti" | "initie" | "archimage";

export interface CharacterClassConfig {
  id: CharacterClassId;
  name: string;
  subtitle: string;
  role: string;
  lore: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  badgeBg: string;
  borderColor: string;
  passiveName: string;
  passiveShort: string;
  passiveDescription: string;
  classSpellId: string;
  classSpellName: string;
  classSpellDescription: string;
  weaponSignature: string;
  iconName: string;
  stats: {
    auscultation: number;
    biologie: number;
    ecg: number;
    palpation: number;
  };
}

export interface AvatarOption {
  id: string;
  classId: CharacterClassId;
  name: string;
  gender: "m" | "f" | "neutral";
  variant: 1 | 2;
  tier: AvatarTier;
}

export interface RpgSpell {
  id: string;
  name: string;
  manaCost: number;
  cooldownBattles?: number;
  isClassSpell?: boolean;
  classId?: CharacterClassId;
  description: string;
  icon: string;
  effectType:
    | "fifty_fifty"
    | "hint_light"
    | "hint_heavy"
    | "pause_timer"
    | "slow_timer"
    | "restore_hp"
    | "reveal_answer"
    | "ignore_damage"
    | "resurrection"
    | "show_mnemonic"
    | "glossary_free";
}

export interface RpgTitle {
  level: number;
  title: string;
  description: string;
}

export interface UserRpgState {
  character_class: CharacterClassId;
  avatar_id: string;
  current_title: string;
  hp_current: number;
  hp_max: number;
  mana_current: number;
  mana_max: number;
  gems: number;
  unlocked_titles: string[];
  inventory: string[];
  unlocked_spells: string[];
  active_companion: string;
}
