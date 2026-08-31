import { CharacterClassConfig, CharacterClassId, AvatarTier, RpgTitle, AvatarOption } from "./types";

export const CHARACTER_CLASSES: Record<CharacterClassId, CharacterClassConfig> = {
  clerc: {
    id: "clerc",
    name: "Clerc Auscultateur",
    subtitle: "Maître du Rythme & de l'Hémodynamique",
    role: "Médecine, Urgences & Cardiologie",
    lore: "Initié aux mystères acoustiques du cœur, il entend les murmures pathologiques et discerne chaque battement de la vie.",
    color: "#f43f5e", // Rose / Red
    accentColor: "rose-500",
    bgGradient: "from-rose-500/20 via-rose-600/10 to-slate-900",
    badgeBg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    borderColor: "border-rose-500",
    passiveName: "Égide Clinique",
    passiveShort: "1 joker d'erreur en auscultation",
    passiveDescription: "Bénéficie d'une tolérance d'erreur gratuite par séance sur les questions d'auscultation et bruits cardiaques B1-B4.",
    weaponSignature: "Stéthoscope de Lumière",
    iconName: "Stethoscope",
    stats: {
      auscultation: 95,
      biologie: 70,
      ecg: 80,
      palpation: 75,
    },
  },
  alchimiste: {
    id: "alchimiste",
    name: "Alchimiste Diagnosticien",
    subtitle: "Sorcier des Biomarqueurs & Formules",
    role: "Pharmacie, Biologie & Toxicologie",
    lore: "Pourfendeur de l'invisible, il dose les enzymes cellulaires et transmute les bilans sanguins en diagnostics certains.",
    color: "#10b981", // Emerald
    accentColor: "emerald-500",
    bgGradient: "from-emerald-500/20 via-teal-600/10 to-slate-900",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500",
    passiveName: "Transmutation d'XP",
    passiveShort: "+15% XP sur associations & cas cliniques",
    passiveDescription: "Chaque association correcte et diagnostic de cas clinique accorde un bonus de +15% de points d'expérience.",
    weaponSignature: "Fiole de Troponine Pure",
    iconName: "FlaskConical",
    stats: {
      auscultation: 65,
      biologie: 98,
      ecg: 75,
      palpation: 60,
    },
  },
  mage_ecg: {
    id: "mage_ecg",
    name: "Invocateur d'Ondes",
    subtitle: "Archimage de l'Électrophysiologie",
    role: "Électrocardiographie & Rythmologie",
    lore: "Canalisateur des flux électriques myocardiques, il déchiffre les ondes P-Q-R-S-T et dompte les tempêtes rythmiques.",
    color: "#6366f1", // Indigo
    accentColor: "indigo-500",
    bgGradient: "from-indigo-500/20 via-purple-600/10 to-slate-900",
    badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    borderColor: "border-indigo-500",
    passiveName: "Vision Arcanique",
    passiveShort: "Zoom & indices sur segments ECG",
    passiveDescription: "Débloque la loupe sémiologique et surligne les anomalies clés sur les tracés ECG 12 dérivations.",
    weaponSignature: "Sceptre Galvanométrique",
    iconName: "Zap",
    stats: {
      auscultation: 75,
      biologie: 75,
      ecg: 98,
      palpation: 65,
    },
  },
  moine: {
    id: "moine",
    name: "Moine Biomécanicien",
    subtitle: "Gardien du Toucher & des Pouls",
    role: "Kinésithérapie, Ostéopathie & Anatomie",
    lore: "Maître de l'examen physique méthodique, ses mains détectent le moindre frémissement vasculaire et les tensions tissulaires.",
    color: "#f59e0b", // Amber
    accentColor: "amber-500",
    bgGradient: "from-amber-500/20 via-orange-600/10 to-slate-900",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500",
    passiveName: "Toucher Médical",
    passiveShort: "Bonus au simulateur de tension",
    passiveDescription: "Score de précision accru dans les simulateurs de pression artérielle et palpation des pouls périphériques.",
    weaponSignature: "Gantelet de Palpation",
    iconName: "Activity",
    stats: {
      auscultation: 80,
      biologie: 60,
      ecg: 70,
      palpation: 98,
    },
  },
};

export const RPG_TITLES: RpgTitle[] = [
  { level: 1, title: "Initié Sémiologue", description: "Fait ses premiers pas dans l'art de l'interrogatoire clinique." },
  { level: 2, title: "Apprenti Auscultateur", description: "Distingue les bruits B1 et B2 au lit du patient." },
  { level: 3, title: "Pourfendeur de l'Angor", description: "Reconnaît immédiatement la douleur thoracique coronarienne." },
  { level: 4, title: "Gardien du Rythme Sinusal", description: "Dompte les tracés électriques et identifie les extrasystoles." },
  { level: 5, title: "Mage des Bruits & Souffles", description: "Déchiffre les irradiations et manœuvres dynamiques sans hésiter." },
  { level: 6, title: "Grand Alchimiste des Enzymes", description: "Interprète avec brio la cinétique des troponines et du BNP." },
  { level: 8, title: "Commandeur de l'Hémodynamique", description: "Maîtrise la pression artérielle et les signes d'insuffisance cardiaque." },
  { level: 10, title: "Archimage Sémiologue Suprême", description: "Incarnation vivante de la démarche clinique méthodique et infaillible." },
];

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "clerc_1", classId: "clerc", name: "Valère l'Auscultateur", gender: "m", variant: 1, tier: "apprenti" },
  { id: "clerc_2", classId: "clerc", name: "Éléonore du Rythme", gender: "f", variant: 2, tier: "apprenti" },
  { id: "alchimiste_1", classId: "alchimiste", name: "Nicolas le Doseur", gender: "m", variant: 1, tier: "apprenti" },
  { id: "alchimiste_2", classId: "alchimiste", name: "Sybille des Flacons", gender: "f", variant: 2, tier: "apprenti" },
  { id: "mage_ecg_1", classId: "mage_ecg", name: "Éole des Tracés", gender: "m", variant: 1, tier: "apprenti" },
  { id: "mage_ecg_2", classId: "mage_ecg", name: "Astrid la Fulgurante", gender: "f", variant: 2, tier: "apprenti" },
  { id: "moine_1", classId: "moine", name: "Gaspard du Pouls", gender: "m", variant: 1, tier: "apprenti" },
  { id: "moine_2", classId: "moine", name: "Théa la Praticienne", gender: "f", variant: 2, tier: "apprenti" },
];

export function getClassConfig(classId?: string | null): CharacterClassConfig {
  if (classId && classId in CHARACTER_CLASSES) {
    return CHARACTER_CLASSES[classId as CharacterClassId];
  }
  return CHARACTER_CLASSES.clerc;
}

export function getTitleForLevel(level: number): string {
  const eligibleTitles = RPG_TITLES.filter((t) => t.level <= level);
  if (eligibleTitles.length === 0) return "Initié Sémiologue";
  return eligibleTitles[eligibleTitles.length - 1].title;
}

export function getAvatarTier(level: number): AvatarTier {
  if (level >= 10) return "archimage";
  if (level >= 5) return "initie";
  return "apprenti";
}
