export type CharacterClassId = "clerc" | "alchimiste" | "mage_ecg" | "moine";

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
  description: string;
  icon: string;
  effectType: "eliminate_wrong" | "show_mnemonic" | "restore_heart";
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
  mana_points: number;
  unlocked_titles: string[];
  inventory: string[];
}
