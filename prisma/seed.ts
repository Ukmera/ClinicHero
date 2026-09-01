import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Déploiement exhaustif des 5 Chapitres & 5 Boss du Monde 1 (Cardiovasculaire)...");

  // Nettoyage préalable pour ré-injection propre
  await prisma.glossaryTerm.deleteMany();
  await prisma.userCardProgress.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.card.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  // =========================================================================
  // 1. GLOSSAIRE MÉDICAL SÉMIOLOGIQUE ENRICHI
  // =========================================================================
  const glossary = [
    {
      terme: "Angor (Angine de poitrine)",
      definition_fr: "Douleur thoracique paroxystique rétrosternale constrictive résultant d'une ischémie myocardique transitoire.",
      exemples: "Angor d'effort stable (cédant au repos en < 3 min), Angor instable (SCA menaçant).",
    },
    {
      terme: "Signe de Levine",
      definition_fr: "Geste spontané du patient décrivant sa douleur en serrant son poing fermé contre son sternum.",
      exemples: "Très forte spécificité pour l'ischémie myocardique aiguë [McGee].",
    },
    {
      terme: "Orthopnée",
      definition_fr: "Dyspnée survenant en décubitus dorsal et soulagée par la position assise ou debout.",
      exemples: "Quantifiée par le nombre d'oreillers (ex: orthopnée à 3 oreillers dans l'IVG).",
    },
    {
      terme: "Dyspnée paroxystique nocturne (DPN)",
      definition_fr: "Accès de suffocation brutale réveillant le patient après 2 à 4 heures de sommeil.",
      exemples: "Signe très spécifique d'insuffisance ventriculaire gauche sévère.",
    },
    {
      terme: "Reflux hépato-jugulaire (RHJ / Signe de Rondot)",
      definition_fr: "Majoration durable (> 3 sec) de la turgescence jugulaire provoquée par une pression manuelle de l'hypochondre droit.",
      exemples: "Témoigne de l'insuffisance ventriculaire droite [Bariéty p.122].",
    },
    {
      terme: "Signe de Harzer",
      definition_fr: "Perception des battements du ventricule droit dilaté à la palpation sous l'appendice xiphoïde.",
      exemples: "Signe cardinal d'hypertrophie ventriculaire droite ou de cœur pulmonaire chronique.",
    },
    {
      terme: "Bruit de Galop (B3 / B4)",
      definition_fr: "Bruit surajouté protodiastolique (B3, remplissage rapide VG dilaté) ou télédiastolique (B4, contraction atriale contre VG rigide).",
      exemples: "B3 très évocateur d'insuffisance cardiaque avec FEVG altérée.",
    },
    {
      terme: "Manœuvre de Rivero-Carvallo",
      definition_fr: "Augmentation de l'intensité d'un souffle cardiaque lors d'une inspiration profonde.",
      exemples: "Différencie formellement l'insuffisance tricuspide (positive) de l'insuffisance mitrale (négative).",
    },
    {
      terme: "Signe de Homans",
      definition_fr: "Douleur provoquée au mollet lors de la dorsiflexion passive du pied dans la TVP.",
      exemples: "Associé à la perte du ballottement du mollet et à un œdème unilatéral.",
    },
    {
      terme: "Index de Pression Systolique (IPS)",
      definition_fr: "Rapport entre la PAS à la cheville et la PAS humérale. Normale : 0.90 à 1.30.",
      exemples: "IPS < 0.90 affirme l'Artériopathie Oblitérante des Membres Inférieurs (AOMI).",
    },
  ];

  for (const g of glossary) {
    await prisma.glossaryTerm.create({ data: g });
  }

  // ==========================================
  // 2. UTILISATEUR DÉMO AVEC STATS RPG
  // ==========================================
  const password_hash = await bcrypt.hash("clinichero123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@clinichero.fr",
      name: "Interne Démo",
      password_hash,
      user_level: 2,
      xp_total: 250,
      streak_days: 3,
      hp_current: 100,
      hp_max: 100,
      mana_current: 140,
      mana_max: 200,
      gems: 50,
      character_class: "clerc",
      avatar_id: "clerc_1",
      current_title: "Initié Sémiologue",
      last_activity_date: new Date(),
    },
  });

  // =========================================================================
  // MONDE 0 : SANCTUAIRE D'INITIATION (TUTO LA GRANDE BLOUSE)
  // =========================================================================
  console.log("🧙‍♂️ Monde 0 : Sanctuaire d'Initiation...");
  const module0 = await prisma.module.create({
    data: {
      slug: "monde-0-tutoriel",
      nom_fr: "Monde 0 : Sanctuaire d'Initiation",
      description_fr: "Fais tes premiers pas avec La Grande Blouse et apprends à maîtriser ton grimoire de sorts.",
      systeme: "tutoriel",
      ordre_affichage: 0,
      icone: "Sparkles",
      color: "amber",
    },
  });

  const lesson0_1 = await prisma.lesson.create({
    data: {
      module_id: module0.id,
      slug: "tutoriel-la-grande-blouse",
      nom_fr: "L'Éveil du Sémiologue & La Grande Blouse",
      description_fr: "Découvre tes 100 PV, ton Mana et le lancement de sorts arcaniques au lit du malade.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 50,
      gems_reward: 25,
      dungeon_type: "tutorial",
      boss_name: "Spectre de l'Ignorance Novice",
      boss_avatar: "👻",
      rooms_count: 3,
      cours_intro_fr: "Bienvenue à Aethelgard ! En tant qu'Initié, ton stéthoscope et ton sens clinique sont tes meilleures armes contre les erreurs médicales.",
      cours_points_cles_fr: "• Règle 1 : Observer le patient avant de toucher.\n• Règle 2 : Ne jamais négliger un drapeau rouge.\n• Règle 3 : Utiliser ton Mana pour lancer tes sorts (50/50, indices).",
      mnemonique: "P-I-E-D : Péricardite, Infarctus (SCA), Embolie pulmonaire, Dissection aortique.",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson0_1.id,
        systeme: "tutoriel",
        niveau_difficulte: 1,
        type_question: "QCM",
        room_number: 1,
        room_type: "qcm_basic",
        question_fr: "Quel est le rôle primordial de la sémiologie médicale au lit du malade ?",
        options_json: JSON.stringify([
          { id: "A", text: "Recueillir les signes physiques et symptômes pour poser un diagnostic méthodique", is_correct: true },
          { id: "B", text: "Remplacer systématiquement l'examen clinique par un scanner", is_correct: false },
          { id: "C", text: "Prescrire des médicaments au hasard en espérant une guérison", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Exactement ! La sémiologie est le socle de toute la médecine : interroger, observer, palper et ausculter avec rigueur.",
        reference: "[Baptiste Coustet] p.12-14",
        tags: "initiation,sémiologie",
      },
      {
        lesson_id: lesson0_1.id,
        systeme: "tutoriel",
        niveau_difficulte: 1,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Lorsque tu as un doute dans un donjon, tu peux dépenser du Mana pour lancer un sort 50/50 ou un indice sans risquer tes PV.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Ton Mana te permet d'activer tes sorts de diagnostic pour franchir les salles de donjon.",
        reference: "[Grimoire d'Aethelgard]",
        tags: "sorts,mana",
      },
      {
        lesson_id: lesson0_1.id,
        systeme: "tutoriel",
        niveau_difficulte: 1,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_guardian",
        contexte_clinique: "Un homme de 58 ans ressent une vive douleur rétrosternale angoissante « en étau » irradiant à la mâchoire depuis 30 minutes.",
        question_fr: "Quelle est l'urgence vitale cardiovasculaire à suspecter immédiatement ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un Syndrome Coronarien Aigu (Infarctus du myocarde)", is_correct: true },
          { id: "B", text: "Une simple courbature musculaire", is_correct: false },
          { id: "C", text: "Un reflux gastrique banal", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Bravo ! Toute douleur rétrosternale constrictive prolongée est un Syndrome Coronarien Aigu jusqu'à preuve du contraire.",
        reference: "[UNESS-Cardio] p.12",
        tags: "SCA,urgence",
      },
    ],
  });

  // =========================================================================
  // CHAPITRE 1 : DOULEUR THORACIQUE & ISCHÉMIE CORONARIENNE
  // =========================================================================
  console.log("🫀 Chapitre 1 : Douleur Thoracique & Ischémie Coronarienne...");
  const module1 = await prisma.module.create({
    data: {
      slug: "chapitre-1-douleur-thoracique",
      nom_fr: "Chapitre 1 : Douleur Thoracique & Ischémie Coronarienne",
      description_fr: "Disséquer l'angor, le syndrome coronarien aigu et éliminer les 4 urgences vitales PIED avant de défier le Spectre de l'Infarctus.",
      systeme: "cardio",
      ordre_affichage: 1,
      icone: "Heart",
      color: "rose",
    },
  });

  // 1.1 Angor
  const lesson1_1 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "douleur-thoracique-angineuse",
      nom_fr: "Donjon 1.1 : Angor d'effort stable & Signe de Levine",
      description_fr: "Reconnaître les 5 critères de l'angor d'effort, le signe de Levine et le test aux dérivés nitrés.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 30,
      gems_reward: 10,
      dungeon_type: "standard",
      boss_name: "Sentinelle de l'Angor",
      rooms_count: 3,
      cours_intro_fr: "L'angor résulte d'une ischémie myocardique transitoire. Il se caractérise par une douleur rétrosternale constrictive survenant à l'effort et cédant rapidement au repos ou sous trinitrine.",
      cours_points_cles_fr: "• Rétrosternale constrictive (« en étau »).\n• Irradiations : mâchoire, épaule gauche, bord ulnaire du bras.\n• Cède en moins de 3 minutes au repos ou après trinitrine sublinguale.",
      mnemonique: "P-A-R-A-S-I-T-E : Position, Allure, Rythme, Ancienneté, Signes associés, Irradiations, Type, Évolution.",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        contexte_clinique: "Un homme de 62 ans ressent une vive gêne thoracique en marchant en côte contre le vent froid.",
        question_fr: "Quel est le caractère sémiologique le plus typique de la douleur coronarienne ?",
        options_json: JSON.stringify([
          { id: "A", text: "Rétrosternale constrictive (« en étau ») irradiant au bras gauche et à la mâchoire", is_correct: true },
          { id: "B", text: "Sous-mammaire gauche punctiforme augmentée par la palpation", is_correct: false },
          { id: "C", text: "Point de côté basithoracique rythmée par la toux", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La douleur angineuse typique est rétrosternale médiothoracique, constrictive, irradiant à la mandibule et au bras gauche.",
        reference: "[Coustet] Sémiologie médicale p.48",
        tags: "angor,douleur,coronaires",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Une douleur angineuse stable cède habituellement en moins de 3 à 5 minutes après arrêt de l'effort ou prise de trinitrine sublinguale.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! La sédation rapide au repos ou sous dérivés nitrés est un critère diagnostique majeur de l'angor stable.",
        reference: "[Bariéty / Capron] p.110",
        tags: "trinitrine,angor",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Au cours de la consultation, le patient porte spontanément son poing fermé contre le milieu de son sternum pour décrire son oppression.",
        question_fr: "Quel est le nom de ce signe sémiologique classique à haute valeur prédictive d'ischémie ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le signe de Levine", is_correct: true },
          { id: "B", text: "Le signe de Harzer", is_correct: false },
          { id: "C", text: "Le signe de Homans", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe de Levine (poing fermé sur le sternum) est très spécifique de l'ischémie myocardique constrictive [McGee p.320].",
        reference: "[McGee] p.320",
        tags: "levine,sémiologie",
      },
    ],
  });

  // 1.2 SCA
  const lesson1_2 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "syndrome-coronarien-aigu",
      nom_fr: "Donjon 1.2 : Syndrome Coronarien Aigu (SCA ST+ / ST-)",
      description_fr: "Douleur prolongée > 20 minutes résistante aux nitrés, onde de Pardee et élévation de troponine.",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Golem d'Ischémie Aiguë",
      rooms_count: 3,
      cours_intro_fr: "Le SCA représente l'occlusion aiguë d'une artère coronaire. Toute douleur constrictive prolongée de plus de 20 minutes impose un ECG 12 dérivations immédiat.",
      cours_points_cles_fr: "• Douleur > 20 min résistante aux nitrés.\n• Onde de Pardee (sus-décalage ST englobant l'onde T).\n• Troponine ultrasensible élevée.",
      mnemonique: "Time is Muscle : Désobstruction d'urgence dans les 120 minutes !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        contexte_clinique: "Un homme de 54 ans présente une douleur constrictive médiothoracique avec sueurs profuses depuis 45 minutes, non calmée par la trinitrine.",
        question_fr: "Quelle est la conduite à tenir immédiate prioritaire ?",
        options_json: JSON.stringify([
          { id: "A", text: "Appel immédiat du SAMU (Centre 15) et réalisation d'un ECG 12 dérivations sans délai", is_correct: true },
          { id: "B", text: "Prescrire des antalgiques simples et revoir le patient dans 48h", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Toute douleur thoracique prolongée résistante aux nitrés est un SCA jusqu'à preuve du contraire.",
        reference: "[UNESS-Cardio] p.18",
        tags: "SCA,urgence,ECG",
      },
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : L'onde de Pardee à l'ECG se caractérise par un sus-décalage du segment ST convexe vers le haut englobant l'onde T dans au moins deux dérivations contiguës.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! L'onde de Pardee signe l'infarctus transmural aigu (SCA ST+).",
        reference: "[Coustet] p.52",
        tags: "ECG,pardee",
      },
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Une femme de 72 ans diabétique consulte pour un malaise avec nausées intenses et sueurs sans douleur thoracique franche.",
        question_fr: "Pourquoi devez-vous impérativement réaliser un ECG chez cette patiente ?",
        options_json: JSON.stringify([
          { id: "A", text: "Pour dépister un infarctus du myocarde indolore fréquent chez le diabétique par neuropathie autonome", is_correct: true },
          { id: "B", text: "Pour vérifier l'absence d'ulcère gastrique", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Chez les diabétiques, la neuropathie sensitive autonome peut rendre l'infarctus totalement indolore.",
        reference: "[Bates] p.324",
        tags: "diabète,infarctus_atypique",
      },
    ],
  });

  // 1.3 Péricardite
  const lesson1_3 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "pericardite-aigue-tamponnade",
      nom_fr: "Donjon 1.3 : Péricardite Aiguë & Tamponnade",
      description_fr: "Frottement péricardique, soulagement en position assise penchée en avant et pouls paradoxal.",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Chevalier Péricardique",
      rooms_count: 3,
      cours_intro_fr: "La péricardite aiguë donne une douleur augmentée en décubitus et soulagée en position assise penchée en avant avec frottement systolo-diastolique.",
      cours_points_cles_fr: "• Frottement péricardique : râpeux de cuir neuf, persistant en apnée.\n• Triade de Beck (Tamponnade) : Hypotension + Bruits assourdis + Turgescence jugulaire.",
      mnemonique: "Péricardite = Position assise penchée en avant !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle position antalgique caractéristique soulage typiquement la douleur de péricardite aiguë ?",
        options_json: JSON.stringify([
          { id: "A", text: "La position assise penchée en avant", is_correct: true },
          { id: "B", text: "Le décubitus dorsal strict", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La position assise penchée en avant diminue la pression de contact entre les feuillets péricardiques enflammés.",
        reference: "[Coustet] p.64",
        tags: "péricardite,position",
      },
      {
        lesson_id: lesson1_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le frottement péricardique persiste lors du blocage respiratoire en apnée, ce qui le distingue du frottement pleural.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le frottement péricardique est indépendant des mouvements respiratoires.",
        reference: "[McGee] p.360",
        tags: "frottement",
      },
      {
        lesson_id: lesson1_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un patient suivi pour péricardite présente une tension à 85/55 mmHg, des veines jugulaires turgescentes et des bruits du cœur assourdis.",
        question_fr: "Quel tableau d'extrême urgence vitale devez-vous diagnostiquer sans délai ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une tamponnade cardiaque compressive (Triade de Beck)", is_correct: true },
          { id: "B", text: "Une simple rémission de la péricardite", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Hypotension + turgescence jugulaire + assourdissement = Triade de Beck de la tamponnade péricardique.",
        reference: "[Bariéty] p.122",
        tags: "tamponnade,beck",
      },
    ],
  });

  // 1.4 Dissection
  const lesson1_4 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "dissection-aortique-pied",
      nom_fr: "Donjon 1.4 : Dissection Aortique & Pièges PIED",
      description_fr: "Douleur déchirante d'emblée maximale, irradiation dorsale et asymétrie tensionnelle > 20 mmHg.",
      niveau_difficulte: 2,
      ordre_affichage: 4,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Gardien de l'Aorte Déchirée",
      rooms_count: 3,
      cours_intro_fr: "La dissection aortique est la déchirure de l'intima créant un faux chenal. Elle survient typiquement sur terrain d'HTA sévère.",
      cours_points_cles_fr: "• Douleur d'emblée maximale, déchirante, dorsale descendante.\n• Asymétrie de pression artérielle > 20 mmHg.\n• Abolition d'un pouls périphérique.",
      mnemonique: "PIED : Péricardite, Infarctus, Embolie, Dissection aortique.",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quel signe physique doit être immédiatement recherché aux deux bras devant une suspicion de dissection aortique ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une asymétrie de pression artérielle systolique supérieure à 20 mmHg", is_correct: true },
          { id: "B", text: "Un signe de Homans bilatéral", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'asymétrie tensionnelle > 20 mmHg ou l'abolition d'un pouls oriente fortement vers la dissection aortique.",
        reference: "[Coustet] p.54",
        tags: "dissection,asymétrie",
      },
      {
        lesson_id: lesson1_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : L'apparition d'un souffle diastolique d'insuffisance aortique chez un patient avec douleur thoracique brutale évoque une dissection de type A.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! La dissection de l'aorte ascendante peut dilater l'anneau aortique ou désinsérer un cuspide.",
        reference: "[Bariéty] p.112",
        tags: "dissection,insuffisance_aortique",
      },
      {
        lesson_id: lesson1_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Dans le moyen mnémotechnique PIED des 4 urgences vitales thoraciques, que signifie la lettre 'E' ?",
        options_json: JSON.stringify([
          { id: "A", text: "Embolie Pulmonaire", is_correct: true },
          { id: "B", text: "Endocardite Infectieuse", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "P-I-E-D = Péricardite aiguë, Infarctus (SCA), Embolie pulmonaire, Dissection aortique.",
        reference: "[Coustet] p.50",
        tags: "PIED,urgences",
      },
    ],
  });

  // 1.5 Boss 1 : Spectre de l'Infarctus
  const boss1 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "boss-spectre-infarctus",
      nom_fr: "👑 Boss Chapitre 1 : Le Spectre de l'Infarctus du Myocarde",
      description_fr: "Combat en 5 salles multi-phases : Interrogatoire, ECG en miroir, extension au VD, contre-indications et angioplastie !",
      niveau_difficulte: 3,
      ordre_affichage: 5,
      xp_reward: 100,
      gems_reward: 35,
      dungeon_type: "boss",
      boss_name: "Spectre de l'Infarctus du Myocarde",
      boss_avatar: "💀🔥",
      rooms_count: 5,
      cours_intro_fr: "Pour vaincre le Spectre de l'Infarctus, enchaîne les 5 étapes capitales de la prise en charge coronarienne d'urgence sans faillir !",
      cours_points_cles_fr: "1. Striction > 20 min.\n2. Onde de Pardee.\n3. Extension VD (dérivations droites V3R/V4R).\n4. Contre-indication absolue des nitrés/diurétiques si atteinte du VD.\n5. Coronarographie primaire < 120 min.",
      mnemonique: "Time is Muscle : Chaque minute compte dans le SCA !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: boss1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 1,
        room_type: "boss_phase_1",
        contexte_clinique: "PHASE 1 - INTERROGATOIRE : Un homme de 50 ans fumeur présente une striction médiothoracique avec sueurs depuis 40 minutes.",
        question_fr: "Quel élément affirme qu'il s'agit d'un SCA plutôt que d'un angor stable ?",
        options_json: JSON.stringify([
          { id: "A", text: "La durée supérieure à 20 minutes et la résistance aux dérivés nitrés", is_correct: true },
          { id: "B", text: "La présence de palpitations isolées", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Frappe réussie ! Une douleur constrictive > 20 min résistante aux nitrés définit le SCA.",
        reference: "[UNESS-Cardio] p.14",
        tags: "boss1,phase1",
      },
      {
        lesson_id: boss1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 2,
        room_type: "boss_phase_2",
        contexte_clinique: "PHASE 2 - ECG : Sus-décalage ST en DII, DIII, aVF avec image en miroir en DI, aVL.",
        question_fr: "Dans quel territoire coronarien se situe l'infarctus transmural ?",
        options_json: JSON.stringify([
          { id: "A", text: "Territoire inférieur (artère coronaire droite)", is_correct: true },
          { id: "B", text: "Territoire antérieur étendu (artère IVA)", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Coup critique ! DII, DIII, aVF explorent la paroi inférieure du VG.",
        reference: "[Coustet] p.52",
        tags: "boss1,phase2",
      },
      {
        lesson_id: boss1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_phase_3",
        contexte_clinique: "PHASE 3 - EXTENSION : Le patient présente une tension à 80/50 mmHg, une turgescence jugulaire et des poumons clairs.",
        question_fr: "Quelle complication coronarienne devez-vous immédiatement explorer par V3R/V4R ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une extension de l'infarctus au ventricule droit (VD)", is_correct: true },
          { id: "B", text: "Une embolie gazeuse massive", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Magistral ! Hypotension + turgescence jugulaire + poumons clairs dans l'infarctus inférieur signe l'atteinte du VD.",
        reference: "[Bariéty] p.116",
        tags: "boss1,phase3",
      },
      {
        lesson_id: boss1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 4,
        room_type: "boss_phase_4",
        contexte_clinique: "PHASE 4 - CONTRE-INDICATION : Devant cet infarctus étendu au ventricule droit :",
        question_fr: "VRAI ou FAUX : L'administration de dérivés nitrés ou de diurétiques est formellement contre-indiquée car elle entraîne un collapsus fatal.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Parfait ! Le VD dépend de la précharge : les nitrés provoquent un effondrement tensionnel sévère.",
        reference: "[UNESS-Cardio] p.20",
        tags: "boss1,phase4",
      },
      {
        lesson_id: boss1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 5,
        room_type: "boss_phase_5",
        contexte_clinique: "PHASE 5 - RECOLONISATION : Le patient est pris en charge par le SMUR à H+1 du début de l'infarctus.",
        question_fr: "Quelle est la stratégie thérapeutique de choix en urgence ?",
        options_json: JSON.stringify([
          { id: "A", text: "Angioplastie coronaire primaire en salle de cathétérisme dans un délai < 120 minutes", is_correct: true },
          { id: "B", text: "Surveillance simple sans geste invasif", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "VICTOIRE TOTALE ! L'angioplastie coronaire primaire d'urgence est le traitement de référence absolue du SCA ST+.",
        reference: "[ESC Guidelines STEMI]",
        tags: "boss1,phase5",
      },
    ],
  });

  // =========================================================================
  // CHAPITRE 2 : INSUFFISANCE CARDIAQUE & CONGESTION
  // =========================================================================
  console.log("🌊 Chapitre 2 : Insuffisance Cardiaque & Congestion...");
  const module2 = await prisma.module.create({
    data: {
      slug: "chapitre-2-insuffisance-cardiaque",
      nom_fr: "Chapitre 2 : Insuffisance Cardiaque & Congestion",
      description_fr: "Maîtriser l'orthopnée, la turgescence jugulaire, les crépitants d'OAP et vaincre le Léviathan Congestif.",
      systeme: "cardio",
      ordre_affichage: 2,
      icone: "Activity",
      color: "cyan",
    },
  });

  // 2.1 IVG & Orthopnée
  const lesson2_1 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "insuffisance-ventriculaire-gauche-orthopnee",
      nom_fr: "Donjon 2.1 : Insuffisance Ventriculaire Gauche & Orthopnée",
      description_fr: "Classification NYHA, dyspnée paroxystique nocturne (DPN) et râles crépitants pulmonaires.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 30,
      gems_reward: 10,
      dungeon_type: "standard",
      boss_name: "Sentinelle de l'Orthopnée",
      rooms_count: 3,
      cours_intro_fr: "L'insuffisance ventriculaire gauche entraîne une élévation des pressions capillaires pulmonaires, responsable d'orthopnée et de râles crépitants aux bases.",
      cours_points_cles_fr: "• Orthopnée : gêne respiratoire en position couchée imposant de surélever la tête avec des oreillers.\n• Râles crépitants fins de fin d'inspiration aux bases pulmonaires.\n• Galop B3 protodiastolique.",
      mnemonique: "NYHA 1 à 4 : Du grand effort au repos absolu !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Comment se définit sémiologiquement l'orthopnée chez un patient insuffisant cardiaque ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une dyspnée survenant en position couchée et soulagée par le passage en position assise", is_correct: true },
          { id: "B", text: "Une dyspnée survenant uniquement en position debout", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'orthopnée est la dyspnée de décubitus, due à la redistribution de la masse sanguine vers le thorax augmentant la pression capillaire pulmonaire.",
        reference: "[Coustet] p.56",
        tags: "orthopnée,IVG",
      },
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Selon la classification NYHA, le stade III correspond à une limitation marquée lors des activités légères de la vie quotidienne (marche sur 100m à plat).",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Stade I = efforts intenses ; Stade II = efforts modérés ; Stade III = efforts légers de la vie quotidienne ; Stade IV = repos.",
        reference: "[UNESS-Cardio] p.28",
        tags: "NYHA,stades",
      },
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "À l'auscultation pulmonaire d'un patient essoufflé, vous entendez des bruits fins crépitants, comparables au bruit de pas dans la neige fraîche ou au froissement de cheveux, prédominant aux deux bases.",
        question_fr: "Quel signe stéthacoustique pathognomonique de stase capillaire pulmonaire identifiez-vous ?",
        options_json: JSON.stringify([
          { id: "A", text: "Des râles crépitants de fin d'inspiration", is_correct: true },
          { id: "B", text: "Des râles sibilants expiratoires", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Les râles crépitants télé-inspiratoires bilatéraux traduisent l'inondation alvéolaire par transsudation séreuse (stase pulmonaire gauche).",
        reference: "[Bariéty] p.126",
        tags: "crépitants,auscultation",
      },
    ],
  });

  // 2.2 IVD & Harzer
  const lesson2_2 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "insuffisance-cardiaque-droite-harzer",
      nom_fr: "Donjon 2.2 : Insuffisance Cardiaque Droite & Signe de Harzer",
      description_fr: "Turgescence jugulaire, reflux hépato-jugulaire (RHJ) et œdèmes des membres inférieurs prenant le godet.",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Golem Congestif Périphérique",
      rooms_count: 3,
      cours_intro_fr: "L'insuffisance cardiaque droite se manifeste par une congestion veineuse systémique : turgescence des jugulaires, gros foie douloureux de stase et œdèmes des membres inférieurs.",
      cours_points_cles_fr: "• Signe de Harzer : perception des battements du VD sous la xiphoïde en inspiration.\n• Reflux hépato-jugulaire (RHJ) : turgescence jugulaire durable lors de la compression hépatique.\n• Œdèmes des membres inférieurs : bilatéraux, blancs, mous, indolores, prenant le godet.",
      mnemonique: "IVD = Veines, Foie, Jambes (Godet) !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Comment réalise-t-on la recherche du signe de Harzer en sémiologie cardiaque ?",
        options_json: JSON.stringify([
          { id: "A", text: "Par palpation sous l'appendice xiphoïde en faisant inspirer profondément le patient pour sentir les battements du ventricule droit", is_correct: true },
          { id: "B", text: "Par percussion de la fosse iliaque droite", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe de Harzer consiste à glisser le pouce ou les doigts sous la xiphoïde vers le haut et la gauche lors d'une inspiration profonde pour percevoir le soulèvement du ventricule droit dilaté.",
        reference: "[Coustet] p.58",
        tags: "harzer,IVD",
      },
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le reflux hépato-jugulaire est considéré comme positif lorsque la compression douce et prolongée du foie majore la turgescence jugulaire de manière soutenue pendant plus de 3 secondes.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le RHJ positif traduit l'incapacité du ventricule droit à absorber un surcroît de retour veineux [Bariéty p.122].",
        reference: "[Bariéty] p.122",
        tags: "RHJ,stase",
      },
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un patient insuffisant cardiaque présente un gonflement bilatéral des deux chevilles. Lorsque vous appuyez votre pouce sur la crête tibiale pendant quelques secondes, une empreinte en creux persiste après le retrait du doigt.",
        question_fr: "Quel est le nom de ce signe clinique caractéristique d'œdème interstitiel d'hypertension veineuse ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le signe du godet", is_correct: true },
          { id: "B", text: "Le signe de Trousseau", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe du godet positif signe l'accumulation liquidienne interstitielle déclive liée à l'augmentation de la pression hydrostatique capillaire.",
        reference: "[Bates] p.318",
        tags: "godet,œdèmes",
      },
    ],
  });

  // 2.3 OAP
  const lesson2_3 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "oedeme-aigu-du-poumon-oap",
      nom_fr: "Donjon 2.3 : Œdème Aigu du Poumon (OAP)",
      description_fr: "Polypnée asphyxique, grésillement laryngé, crépitants en marée montante et expectoration saumonée.",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Spectre de l'Asphyxie Congestive",
      rooms_count: 3,
      cours_intro_fr: "L'OAP est l'inondation brutale des alvéoles par franchissement de la pression oncotique plasmatique (> 25 mmHg de pression capillaire). C'est une détresse respiratoire aiguë vitale.",
      cours_points_cles_fr: "• Polypnée superficielle angoissante avec grésillement laryngé audible à distance.\n• Crépitants bilatéraux en marée montante (des bases vers les sommets).\n• Expectoration mousseuse blanche ou saumonée.",
      mnemonique: "OAP = Urgence : Position assise + Furosémide IV + Dérivés nitrés + O2 !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        contexte_clinique: "Un patient de 68 ans est assis au bord de son lit, suffocant, couvert de sueurs, avec une respiration bruyante à type de grésillement laryngé.",
        question_fr: "Quelle caractéristique d'auscultation pulmonaire signe la gravité immédiate d'un OAP hémodynamique ?",
        options_json: JSON.stringify([
          { id: "A", text: "L'ascension des râles crépitants « en marée montante » atteignant les tiers moyens et supérieurs des champs pulmonaires", is_correct: true },
          { id: "B", text: "La présence d'un murmure vésiculaire parfaitement pur", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Les crépitants en marée montante témoignent de l'extension de l'inondation alvéolaire vers les apex pulmonaires.",
        reference: "[Coustet] p.60",
        tags: "OAP,crépitants_marée_montante",
      },
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : L'expectoration typique de l'œdème aigu du poumon hémodynamique est mousseuse, aérée et rosée/saumonée.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! L'expectoration rosée saumonée résulte du mélange d'air, de liquide d'œdème et de quelques hématies extravasées sous haute pression capillaire.",
        reference: "[Bariéty] p.128",
        tags: "OAP,expectoration",
      },
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Quelle position physique devez-vous impérativement faire adopter en urgence à un patient en crise d'OAP ?",
        options_json: JSON.stringify([
          { id: "A", text: "Position assise jambes pendantes au bord du lit (pour diminuer le retour veineux)", is_correct: true },
          { id: "B", text: "Position allongée sur le dos jambes surélevées (Trendelenburg)", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La position assise jambes pendantes piège le sang veineux dans les membres inférieurs et réduit la précharge ventriculaire, allégeant le travail cardiaque.",
        reference: "[UNESS-Cardio] p.30",
        tags: "OAP,urgence_position",
      },
    ],
  });

  // 2.4 Choc Cardiogénique
  const lesson2_4 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "choc-cardiogenique-hypoperfusion",
      nom_fr: "Donjon 2.4 : Choc Cardiogénique & Marbrures",
      description_fr: "Hypotension artérielle sévère, marbrures aux genoux, extrémités froides et oligurie.",
      niveau_difficulte: 3,
      ordre_affichage: 4,
      xp_reward: 40,
      gems_reward: 15,
      dungeon_type: "standard",
      boss_name: "Gardien du Collapsus",
      rooms_count: 3,
      cours_intro_fr: "Le choc cardiogénique est la défaillance aiguë de la pompe cardiaque incapable d'assurer un débit suffisant aux organes nobles.",
      cours_points_cles_fr: "• PAS < 90 mmHg ou chute > 40 mmHg.\n• Signes d'hypoperfusion périphérique : marbrures débutant aux genoux, temps de recoloration cutanée (TRC) > 3 secondes, oligurie (< 0.5 mL/kg/h), confusion.\n• Élévation des lactates plasmatiques.",
      mnemonique: "Choc = Pression basse + Marbrures + Oligurie !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Où débutent typiquement les marbrures cutanées traduisant la vasoconstriction réflexe intense lors d'un état de choc cardiogénique ?",
        options_json: JSON.stringify([
          { id: "A", text: "Aux genoux et aux extrémités des membres inférieurs", is_correct: true },
          { id: "B", text: "Au visage et aux paupières", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Les marbrures cutanées débutent aux rotules et progressent vers les cuisses en fonction de la sévérité du collapsus hémodynamique (Score de marbrures).",
        reference: "[Coustet] p.62 ; [McGee] p.340",
        tags: "choc,marbrures",
      },
      {
        lesson_id: lesson2_4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Un Temps de Recoloration Cutanée (TRC) supérieur à 3 secondes après pression digitale sur l'ongle ou la pulpe est un signe physique fiable d'hypoperfusion tissulaire.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le TRC allongé (> 3 sec) témoigne d'une microcirculation compromise dans l'état de choc.",
        reference: "[McGee Evidence-Based Physical Diagnosis] p.342",
        tags: "TRC,choc",
      },
      {
        lesson_id: lesson2_4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Quel inotrope positif d'action bêta-1 adrénergique est la molécule de référence de première intention pour soutenir la contractilité myocardique dans le choc cardiogénique ?",
        options_json: JSON.stringify([
          { id: "A", text: "La Dobutamine en perfusion continue", is_correct: true },
          { id: "B", text: "Un bêtabloquant à forte dose", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La dobutamine stimule les récepteurs bêta-1 cardiaques, augmentant l'inotropisme et le volume d'éjection systolique sans vasoconstriction excessive.",
        reference: "[UNESS-Cardio] p.32",
        tags: "dobutamine,choc_cardiogénique",
      },
    ],
  });

  // 2.5 Boss 2 : Léviathan Congestif
  const boss2 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "boss-leviathan-congestif",
      nom_fr: "👑 Boss Chapitre 2 : Le Léviathan Congestif des Marais",
      description_fr: "Combat en 5 salles multi-phases : Évaluation de la surcharge globale, différentiation droite/gauche, traitement diurétique et sauvetage inotrope !",
      niveau_difficulte: 3,
      ordre_affichage: 5,
      xp_reward: 120,
      gems_reward: 40,
      dungeon_type: "boss",
      boss_name: "Léviathan Congestif des Marais",
      boss_avatar: "🌊🫀",
      rooms_count: 5,
      cours_intro_fr: "Le Léviathan submerge les poumons et les veines de fluide stasique. Terrasse ses 5 assauts en purifiant la congestion cardiaque !",
      cours_points_cles_fr: "1. Distinguer la stase pulmonaire (IVG) et veineuse périphérique (IVD).\n2. Gérer l'OAP asphyxique.\n3. Adapter les diurétiques de l'anse.\n4. Traiter le choc cardiogénique.",
      mnemonique: "Drainer la stase, soutenir la pompe, purifier Aethelgard !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: boss2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 1,
        room_type: "boss_phase_1",
        contexte_clinique: "PHASE 1 - DÉTECTION DU FLUX : Le Léviathan présente un patient essoufflé ayant pris 4 kg en 5 jours avec gros œdèmes prenant le godet et turgescence jugulaire.",
        question_fr: "Quel diagnostic syndromique global devez-vous poser ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une poussée d'insuffisance cardiaque globale congestive en rétention hydrosodée", is_correct: true },
          { id: "B", text: "Une déshydratation extracellulaire sévère", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Frappe réussie ! Prise de poids rapide + œdèmes + turgescence jugulaire = Décompensation cardiaque congestive globale.",
        reference: "[Coustet] p.56",
        tags: "boss2,phase1",
      },
      {
        lesson_id: boss2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 2,
        room_type: "boss_phase_2",
        contexte_clinique: "PHASE 2 - AUSCULTATION CARDIAQUE : À l'apex en décubitus latéral gauche, vous percevez un bruit sourd surajouté en début de diastole (« Toum-Ta-Da »).",
        question_fr: "Quel est ce bruit de galop caractéristique d'une dysfonction systolique ventriculaire gauche sévère ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le galop protodiastolique B3", is_correct: true },
          { id: "B", text: "Le clic d'éjection protosystolique", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Coup critique ! Le B3 de galop résulte de la décélération brutale du flux sanguin entrant dans un ventricule gauche dilaté et peu compliant.",
        reference: "[McGee] p.350",
        tags: "boss2,phase2",
      },
      {
        lesson_id: boss2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_phase_3",
        contexte_clinique: "PHASE 3 - CRISE D'OAP : Le patient décompense brutalement avec saturation à 78 % et crépitants jusqu'aux sommets.",
        question_fr: "Quelle association médicamenteuse injectable d'urgence devez-vous administrer sans délai ?",
        options_json: JSON.stringify([
          { id: "A", text: "Furosémide IV forte dose + Dérivés nitrés IV (si PAS > 110 mmHg) + Oxygénothérapie", is_correct: true },
          { id: "B", text: "Remplissage vasculaire massif par 2L de sérum physiologique", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Magistral ! Le furosémide draine la surcharge par diurèse et vasodilatation veineuse, tandis que les nitrés réduisent puissamment la précharge.",
        reference: "[UNESS-Cardio] p.30",
        tags: "boss2,phase3",
      },
      {
        lesson_id: boss2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 4,
        room_type: "boss_phase_4",
        contexte_clinique: "PHASE 4 - SURVEILLANCE BIOLOGIQUE : Sous traitement diurétique intensif :",
        question_fr: "VRAI ou FAUX : Il est indispensable de surveiller quotidiennement la fonction rénale (créatininémie) et le ionogramme sanguin à la recherche d'une hypokaliémie induite par le furosémide.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Parfait ! Les diurétiques de l'anse augmentent la kaliurèse et peuvent provoquer une hypokaliémie arythmogène redoutable.",
        reference: "[Coustet] p.62",
        tags: "boss2,phase4",
      },
      {
        lesson_id: boss2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 5,
        room_type: "boss_phase_5",
        contexte_clinique: "PHASE 5 - CHOC TERMINAL : La tension s'effondre à 75/40 mmHg avec marbrures et lactates à 4.5 mmol/L.",
        question_fr: "Quelle thérapeutique inotrope d'urgence permet de terrasser le Léviathan ?",
        options_json: JSON.stringify([
          { id: "A", text: "Introduction immédiate de Dobutamine IV au pousse-seringue électrique", is_correct: true },
          { id: "B", text: "Prescription d'un bêtabloquant per os", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "VICTOIRE TOTALE ! La dobutamine restaure le débit cardiaque et la perfusion tissulaire, terrassant le Léviathan Congestif !",
        reference: "[UNESS-Cardio] p.32",
        tags: "boss2,phase5",
      },
    ],
  });

  // =========================================================================
  // CHAPITRE 3 : AUSCULTATION CARDIAQUE & VALVULOPATHIES
  // =========================================================================
  console.log("🩺 Chapitre 3 : Auscultation Cardiaque & Valvulopathies...");
  const module3 = await prisma.module.create({
    data: {
      slug: "chapitre-3-auscultation-valvulopathies",
      nom_fr: "Chapitre 3 : Auscultation Cardiaque & Valvulopathies",
      description_fr: "Discerner les 4 foyers, les souffles systoliques et diastoliques, et vaincre la Gargouille Valvulaire.",
      systeme: "cardio",
      ordre_affichage: 3,
      icone: "Stethoscope",
      color: "emerald",
    },
  });

  // 3.1 Foyers & Bruits B1/B2
  const lesson3_1 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "foyers-anatomiques-bruits-b1-b2",
      nom_fr: "Donjon 3.1 : Les 4 Foyers Anatomiques & Bruits B1/B2",
      description_fr: "Foyers Aortique, Pulmonaire, Tricuspide, Mitral et dédoublement physiologique de B2.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 30,
      gems_reward: 10,
      dungeon_type: "standard",
      boss_name: "Sentinelle du Stéthoscope",
      rooms_count: 3,
      cours_intro_fr: "L'auscultation méthodique explore les 4 foyers anatomiques : Aortique (2e EICD), Pulmonaire (2e EICG), Tricuspide (xiphoïde) et Mitral (apex, 5e EICG).",
      cours_points_cles_fr: "• B1 (« Toum ») : fermeture des valves atrio-ventriculaires (M1/T1), début de systole.\n• B2 (« Ta ») : fermeture des valves sigmoïdes (A2/P2), fin de systole.\n• Dédoublement physiologique de B2 audible à l'inspiration au foyer pulmonaire.",
      mnemonique: "A-P-T-M : Aortique, Pulmonaire, Tricuspide, Mitral !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Où se situe le foyer d'auscultation aortique sur la paroi thoracique antérieure ?",
        options_json: JSON.stringify([
          { id: "A", text: "Au 2e espace intercostal droit, au bord droit du sternum", is_correct: true },
          { id: "B", text: "Au 5e espace intercostal gauche, sur la ligne médioclaviculaire", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le foyer aortique se situe au 2e EIC droit. Le foyer mitral se situe à l'apex (5e EIC gauche).",
        reference: "[Coustet] p.66",
        tags: "foyers,auscultation",
      },
      {
        lesson_id: lesson3_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le premier bruit du cœur B1 est synchrone de la montée de l'onde pulsatile carotidienne.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! B1 marque le début de la contraction isovolumétrique et de l'éjection ventriculaire.",
        reference: "[Bariéty] p.132",
        tags: "B1,pouls",
      },
      {
        lesson_id: lesson3_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Lors de l'auscultation d'un jeune athlète au foyer pulmonaire, vous entendez un dédoublement net du bruit B2 lors d'une inspiration profonde, qui disparaît à l'expiration.",
        question_fr: "Quelle est la signification sémiologique de ce phénomène ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un dédoublement physiologique normal de B2 lié à l'augmentation du retour veineux droit à l'inspiration retardant la fermeture de P2", is_correct: true },
          { id: "B", text: "Une communication interauriculaire sévère", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le dédoublement inspiratoire variable de B2 est parfaitement physiologique chez le sujet jeune.",
        reference: "[McGee] p.348",
        tags: "B2,dédoublement",
      },
    ],
  });

  // 3.2 Souffles Systoliques
  const lesson3_2 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "souffles-systoliques-ra-im",
      nom_fr: "Donjon 3.2 : Souffles Systoliques : Rétrécissement Aortique & Insuffisance Mitrale",
      description_fr: "Souffle éjectionnel râpeux irradiant aux carotides (RA) vs Souffle holosystolique en jet de vapeur axillaire (IM).",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Golem des Souffles Systoliques",
      rooms_count: 3,
      cours_intro_fr: "Les souffles systoliques surviennent entre B1 et B2. Le Rétrécissement Aortique (RA) donne un souffle éjectionnel losangique râpeux, tandis que l'Insuffisance Mitrale (IM) donne un souffle régurgitant holosystolique en jet de vapeur.",
      cours_points_cles_fr: "• Rétrécissement Aortique (RA) : Foyer aortique, méso-systolique éjectionnel râpeux, irradiation aux carotides.\n• Insuffisance Mitrale (IM) : Foyer mitral (apex), holosystolique doux en jet de vapeur, irradiation à l'aisselle gauche.",
      mnemonique: "RA = Carotides râpeuses ; IM = Aisselle en jet de vapeur !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle est l'irradiation caractéristique du souffle de rétrécissement aortique serré ?",
        options_json: JSON.stringify([
          { id: "A", text: "Vers les vaisseaux du cou (artères carotides primitives)", is_correct: true },
          { id: "B", text: "Vers le creux axillaire gauche", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le souffle éjectionnel aortique est projeté dans le sens du flux sanguin à travers l'orifice sténosé vers les carotides.",
        reference: "[Coustet] p.70",
        tags: "RA,carotides",
      },
      {
        lesson_id: lesson3_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le souffle d'insuffisance mitrale typique est holosystolique (couvrant toute la systole de B1 à B2), d'intensité constante (« en plateau ») et de timbre en jet de vapeur.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! L'IM produit un reflux de haute vélocité du VG vers l'OG dès la fermeture atrioventriculaire.",
        reference: "[Bariéty] p.136",
        tags: "IM,holosystolique",
      },
      {
        lesson_id: lesson3_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un homme de 78 ans présente un souffle systolique rude 4/6 au foyer aortique avec abolition du deuxième bruit B2 et un pouls carotidien d'ascension lente (pulsus parvus et tardus).",
        question_fr: "Quel diagnostic valvulaire sévère devez-vous porter ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un rétrécissement aortique calcifié serré (Maladie de Mönckeberg)", is_correct: true },
          { id: "B", text: "Une insuffisance pulmonaire congénitale", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'association souffle râpeux + abolition de B2 + pouls parvus et tardus signe la sténose aortique serrée.",
        reference: "[McGee] p.356",
        tags: "RA,serré,B2",
      },
    ],
  });

  // 3.3 Souffles Diastoliques
  const lesson3_3 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "souffles-diastoliques-ia-rm",
      nom_fr: "Donjon 3.3 : Souffles Diastoliques : Insuffisance Aortique & Rétrécissement Mitral",
      description_fr: "Souffle doux aspiratif au foyer aortique (IA) vs Roulement diastolique apexien (RM).",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de la Diastole",
      rooms_count: 3,
      cours_intro_fr: "Les souffles diastoliques surviennent entre B2 et B1. Ils sont toujours pathologiques ! L'Insuffisance Aortique (IA) donne un souffle doux humé aspiratif, tandis que le Rétrécissement Mitral (RM) donne un roulement diastolique.",
      cours_points_cles_fr: "• Insuffisance Aortique (IA) : Souffle doux humé aspiratif, débutant à B2, le long du bord gauche du sternum, majoré penché en avant en expiration.\n• Signes périphériques d'IA : Élargissement de la pression pulsée (hyper-pulsatilité), signe de Musset (hochement de tête).\n• Rétrécissement Mitral (RM) : Roulement diastolique à l'apex en décubitus latéral gauche avec claquement d'ouverture mitrale (COM) et éclat de B1.",
      mnemonique: "IA = Aspiratif et hyperpulsatile ; RM = Roulement avec éclat de B1 !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle manœuvre d'auscultation permet de sensibiliser au maximum la recherche d'un souffle d'insuffisance aortique minime ?",
        options_json: JSON.stringify([
          { id: "A", text: "Faire asseoir le patient penché en avant, en apnée expiratoire complète", is_correct: true },
          { id: "B", text: "Faire allonger le patient sur le ventre", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La position assise penchée en avant en expiration rapproche la racine aortique de la paroi thoracique antérieure.",
        reference: "[Coustet] p.74",
        tags: "IA,manœuvre",
      },
      {
        lesson_id: lesson3_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le signe de Musset correspond à des secousses involontaires de la tête synchrones des battements cardiaques, résultant de l'élargissement majeur de la différentielle tensionnelle dans l'insuffisance aortique volumineuse.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le signe de Musset est un signe périphérique classique d'IA massive [Bariéty p.130].",
        reference: "[Bariéty] p.130",
        tags: "musset,IA",
      },
      {
        lesson_id: lesson3_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "À l'auscultation de l'apex chez une patiente de 55 ans en décubitus latéral gauche avec la cloche du stéthoscope, vous percevez un éclat du premier bruit (B1), suivi d'un claquement sec puis d'un roulement sourd en milieu de diastole.",
        question_fr: "Quel est ce triomphe sémiologique classique (triade de Duroziez) ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le rétrécissement mitral (RM)", is_correct: true },
          { id: "B", text: "Une péricardite aiguë constrictive", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Éclat de B1 + Claquement d'ouverture mitrale (COM) + Roulement diastolique = Triade classique du rétrécissement mitral.",
        reference: "[Coustet] p.72",
        tags: "RM,duroziez",
      },
    ],
  });

  // 3.4 Bruits Surajoutés & Galops
  const lesson3_4 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "bruits-surajoutes-galops-b3-b4",
      nom_fr: "Donjon 3.4 : Bruits Surajoutés & Galops B3/B4",
      description_fr: "Galop protodiastolique B3, galop présystolique B4, clics d'éjection et frottement péricardique.",
      niveau_difficulte: 2,
      ordre_affichage: 4,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle Acoustique",
      rooms_count: 3,
      cours_intro_fr: "Les galops sont des bruits surajoutés en diastole créant un rythme à 3 temps semblable au galop d'un cheval. Le B3 témoigne d'une surcharge volumétrique (VG dilaté), le B4 d'une surcharge de pression (VG hypertrophié rigide).",
      cours_points_cles_fr: "• B3 (Protodiastolique) : remplissage passif rapide dans un VG dilaté (FEVG altérée).\n• B4 (Présystolique/Télédiastolique) : contraction atriale puissante contre un ventricule rigide (HTA, CMH).\n• Clic de prolapsus mitral (Syndrome de Barlow) : méso-systolique suivi d'un souffle télésystolique.",
      mnemonique: "B3 = Dilaté / Flasque ; B4 = Rigide / Épais !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Dans quelle condition hémodynamique entend-on typiquement un galop présystolique B4 ?",
        options_json: JSON.stringify([
          { id: "A", text: "Lors de la contraction de l'oreillette contre un ventricule gauche épaissi et rigide (ex: cardiopathie hypertensive ou rétrécissement aortique)", is_correct: true },
          { id: "B", text: "En cas de fibrillation atriale avec perte de la contraction auriculaire", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le B4 est généré par la systole atriale forçant le sang dans un ventricule non compliant. Il disparaît en cas de fibrillation atriale !",
        reference: "[Coustet] p.68",
        tags: "B4,galop,compliance",
      },
      {
        lesson_id: lesson3_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : La manœuvre de Rivero-Carvallo (inspiration profonde) augmente l'intensité des souffles du cœur droit (ex: insuffisance tricuspide) grâce à l'augmentation du retour veineux.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! La positivité du signe de Rivero-Carvallo signe l'origine droite d'un souffle régurgitant.",
        reference: "[Bariéty] p.138",
        tags: "rivero_carvallo,cœur_droit",
      },
      {
        lesson_id: lesson3_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Quel bruit stéthacoustique surajouté est classiquement comparé au froissement de cuir neuf ou de soie ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le frottement péricardique", is_correct: true },
          { id: "B", text: "Le clic d'ouverture mitrale", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le frottement péricardique a un timbre râpeux caractéristique de cuir neuf persistant en apnée.",
        reference: "[Coustet] p.64",
        tags: "frottement,auscultation",
      },
    ],
  });

  // 3.5 Boss 3 : La Gargouille Valvulaire
  const boss3 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "boss-gargouille-valvulaire",
      nom_fr: "👑 Boss Chapitre 3 : La Gargouille Valvulaire de Pierre",
      description_fr: "Combat en 5 salles multi-phases : Foyers d'auscultation, manœuvres respiratoires, signes périphériques et quantification échographique Doppler !",
      niveau_difficulte: 3,
      ordre_affichage: 5,
      xp_reward: 140,
      gems_reward: 45,
      dungeon_type: "boss",
      boss_name: "Gargouille Valvulaire de Pierre",
      boss_avatar: "🗿🩺",
      rooms_count: 5,
      cours_intro_fr: "La Gargouille scelle les flux intracardiaques de son stéthoscope de pierre. Discerne chaque vibration pour libérer les orifices valvulaires d'Aethelgard !",
      cours_points_cles_fr: "1. Positionner le stéthoscope au bon foyer.\n2. Différencier systole et diastole.\n3. Utiliser la manœuvre de Rivero-Carvallo.\n4. Reconnaître les signes périphériques d'hyperpulsatilité.\n5. Interpréter l'échocardiographie Doppler.",
      mnemonique: "Écouter avec précision, classifier sans hésiter !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: boss3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 1,
        room_type: "boss_phase_1",
        contexte_clinique: "PHASE 1 - SOUFFLE ÉJECTIONNEL : La Gargouille projette un patient de 82 ans ayant fait une syncope à l'effort. Vous auscultez un souffle méso-systolique 4/6 au 2e EIC droit irradiant aux carotides avec abolition de B2.",
        question_fr: "Quelle valvulopathie obstructive critique est responsable de cette syncope ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un rétrécissement aortique calcifié très serré", is_correct: true },
          { id: "B", text: "Une insuffisance mitrale fonctionnelle", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Frappe réussie ! Syncope d'effort + souffle aortique râpeux + B2 aboli = Rétrécissement aortique serré symptomatique.",
        reference: "[Coustet] p.70",
        tags: "boss3,phase1",
      },
      {
        lesson_id: boss3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 2,
        room_type: "boss_phase_2",
        contexte_clinique: "PHASE 2 - MANŒUVRE RESPIRATOIRE : Vous auscultez un souffle holosystolique à l'appendice xiphoïde dont l'intensité augmente nettement lors d'une inspiration profonde.",
        question_fr: "Quelle valvulopathie est affirmée par cette positivité de la manœuvre de Rivero-Carvallo ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une insuffisance tricuspidienne", is_correct: true },
          { id: "B", text: "Une insuffisance mitrale", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Coup critique ! L'inspiration augmente le retour veineux au cœur droit et majore le souffle d'insuffisance tricuspide (Signe de Rivero-Carvallo).",
        reference: "[Bariéty] p.138",
        tags: "boss3,phase2",
      },
      {
        lesson_id: boss3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_phase_3",
        contexte_clinique: "PHASE 3 - HYPERPULSATILITÉ : La Gargouille présente un patient avec tension artérielle à 170/50 mmHg (pression pulsée élargie à 120 mmHg) et pouls bondissant de Corrigan.",
        question_fr: "Quel souffle diastolique devez-vous rechercher le long du bord gauche du sternum ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un souffle diastolique doux humé aspiratif d'insuffisance aortique", is_correct: true },
          { id: "B", text: "Un roulement de rétrécissement mitral", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Magistral ! L'élargissement de la différentielle tensionnelle avec pouls de Corrigan signe la régurgitation aortique massive.",
        reference: "[McGee] p.358",
        tags: "boss3,phase3",
      },
      {
        lesson_id: boss3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 4,
        room_type: "boss_phase_4",
        contexte_clinique: "PHASE 4 - CRIBLAGE ÉCHOCARDIOGRAPHIQUE : En échocardiographie-Doppler transthoracique (ETT) :",
        question_fr: "VRAI ou FAUX : Un rétrécissement aortique est défini comme serré lorsque la surface aortique calculée est inférieure à 1.0 cm² (ou < 0.6 cm²/m²) et que le gradient moyen dépasse 40 mmHg.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Parfait ! Les critères de sténose aortique serrée sont Surface < 1 cm² et Gradient moyen > 40 mmHg (Vitesse max > 4 m/s).",
        reference: "[UNESS-Cardio] p.36",
        tags: "boss3,phase4",
      },
      {
        lesson_id: boss3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 5,
        room_type: "boss_phase_5",
        contexte_clinique: "PHASE 5 - INDICATION OPÉRATOIRE : Devant ce rétrécissement aortique serré symptomatique (syncope et dyspnée d'effort) :",
        question_fr: "Quelle prise en charge curative permet d'abattre la Gargouille Valvulaire ?",
        options_json: JSON.stringify([
          { id: "A", text: "Remplacement valvulaire aortique (chirurgical ou TAVI par voie percutanée)", is_correct: true },
          { id: "B", text: "Poursuite du traitement médical seul sans intervention", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "VICTOIRE TOTALE ! Le remplacement valvulaire (TAVI ou chirurgie) est l'unique traitement curatif du RA serré symptomatique !",
        reference: "[ESC Guidelines Valvular Heart Disease]",
        tags: "boss3,phase5",
      },
    ],
  });

  // =========================================================================
  // CHAPITRE 4 : TROUBLES DU RYTHME & PALPITATIONS
  // =========================================================================
  console.log("⚡ Chapitre 4 : Troubles du Rythme & Palpitations...");
  const module4 = await prisma.module.create({
    data: {
      slug: "chapitre-4-troubles-du-rythme",
      nom_fr: "Chapitre 4 : Troubles du Rythme & Palpitations",
      description_fr: "Disséquer la fibrillation atriale, les blocs atrioventriculaires, les tachycardies ventriculaires et vaincre le Dragon Rythmologique.",
      systeme: "cardio",
      ordre_affichage: 4,
      icone: "Zap",
      color: "yellow",
    },
  });

  // 4.1 Fibrillation Atriale
  const lesson4_1 = await prisma.lesson.create({
    data: {
      module_id: module4.id,
      slug: "fibrillation-atriale-arythmie",
      nom_fr: "Donjon 4.1 : Fibrillation Atriale (FA) & Arythmie Complète",
      description_fr: "Bruits du cœur anarchiques, absence d'onde P, risque thromboembolique et score CHA2DS2-VASc.",
      niveau_difficulte: 2,
      ordre_affichage: 1,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de l'Arythmie",
      rooms_count: 3,
      cours_intro_fr: "La Fibrillation Atriale (FA) est le trouble du rythme soutenu le plus fréquent. Elle se traduit par une désorganisation électrique totale des oreillettes (absence d'ondes P, réponse ventriculaire irrégulière).",
      cours_points_cles_fr: "• Clinique : Bruits du cœur et pouls totalement irréguliers dans leur rythme et leur intensité (« arythmie complète »).\n• ECG : Disparition des ondes P remplacées par un trémulation de la ligne isoélectrique, intervalles R-R irréguliers.\n• Score CHA2DS2-VASc : évalue le risque d'AVC ischémique et pose l'indication d'anticoagulation orale.",
      mnemonique: "CHA2DS2-VASc : IC, HTA, Âge > 75 (2 pts), Diabète, Stroke/AIT (2 pts), Vasculaire, Âge 65-74, Sexe F.",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson4_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quel aspect stéthacoustique et palpatoire est pathognomonique de la fibrillation atriale non ralentie ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une arythmie complète avec bruits du cœur et pouls totalement anarchiques et inégaux", is_correct: true },
          { id: "B", text: "Un rythme parfaitement régulier à 60 bpm", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'arythmie complète par fibrillation atriale (ACFA) associe battements irréguliers et variation permanente de l'amplitude du pouls.",
        reference: "[Coustet] p.78",
        tags: "FA,arythmie",
      },
      {
        lesson_id: lesson4_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : À l'électrocardiogramme (ECG), la fibrillation atriale se caractérise par la disparition des ondes P sinusales et une irrégularité complète des intervalles R-R.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! L'absence d'onde P et l'irrégularité des espaces R-R affirment le diagnostic de FA.",
        reference: "[Bariéty] p.142",
        tags: "ECG,FA",
      },
      {
        lesson_id: lesson4_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Dans le score thromboembolique CHA2DS2-VASc, quels sont les deux critères comptant chacun pour 2 points ?",
        options_json: JSON.stringify([
          { id: "A", text: "Âge supérieur ou égal à 75 ans ET Antécédent d'AVC / AIT / Embolie", is_correct: true },
          { id: "B", text: "Hypertension artérielle ET Diabète", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le 'A2' (Âge >= 75 ans) et le 'S2' (Stroke / AVC) rapportent chacun 2 points dans le calcul du score.",
        reference: "[ESC Guidelines AF] ; [UNESS-Cardio] p.40",
        tags: "CHA2DS2VASc,score",
      },
    ],
  });

  // 4.2 Tachycardies & Flutter
  const lesson4_2 = await prisma.lesson.create({
    data: {
      module_id: module4.id,
      slug: "tachycardies-ventriculaires-flutter",
      nom_fr: "Donjon 4.2 : Tachycardies Ventriculaires & Flutter Atrial",
      description_fr: "QRS larges, dissociation auriculo-ventriculaire, aspect en dents de scie (ondes F) et manœuvres vagales.",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Golem de Tachycardie",
      rooms_count: 3,
      cours_intro_fr: "Les tachycardies se divisent en tachycardies à QRS fins (jonctionnelles, flutter, FA) et tachycardies à QRS larges (Tachycardie Ventriculaire TV jusqu'à preuve du contraire).",
      cours_points_cles_fr: "• Tachycardie à QRS larges (> 120 ms) = Tachycardie Ventriculaire (Urgence vitale).\n• Dissociation auriculo-ventriculaire avec complexes de capture et de fusion = Preuve formelle de TV.\n• Flutter Atrial : activité auriculaire rapide et régulière à 300/min en 'dents de scie' (ondes F négatives en DII, DIII, aVF).",
      mnemonique: "QRS large tachycarde = TV jusqu'à preuve du contraire !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson4_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle est la règle d'or sémiologique devant toute tachycardie régulière à QRS larges (> 120 ms) chez l'adulte ?",
        options_json: JSON.stringify([
          { id: "A", text: "La considérer comme une Tachycardie Ventriculaire (TV) jusqu'à preuve formelle du contraire", is_correct: true },
          { id: "B", text: "La considérer comme un simple stress anxiogène", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Toute tachycardie à QRS larges est une TV jusqu'à preuve du contraire : risque de dégénérescence en fibrillation ventriculaire fatale.",
        reference: "[Coustet] p.80",
        tags: "TV,QRS_larges",
      },
      {
        lesson_id: lesson4_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le flutter atrial commun se caractérise à l'ECG par des ondes auriculaires F régulières à 300/min sans retour à la ligne isoélectrique, donnant un aspect classique en 'dents de scie' ou 'toit d'usine'.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Les ondes F en dents de scie sont typiques du flutter atrial avec conduction 2/1 (fréquence ventriculaire ~150 bpm).",
        reference: "[Bariéty] p.144",
        tags: "flutter,ondes_F",
      },
      {
        lesson_id: lesson4_2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Sur l'ECG d'une tachycardie à QRS larges, vous observez des complexes de capture (QRS fin d'origine sinusale) et des complexes de fusion.",
        question_fr: "Quelle est la valeur diagnostique de ces complexes de fusion/capture ?",
        options_json: JSON.stringify([
          { id: "A", text: "Ils affirment formellement le diagnostic de Tachycardie Ventriculaire (dissociation AV)", is_correct: true },
          { id: "B", text: "Ils indiquent un artefact de mouvement des électrodes", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Les captures et fusions sont pathognomoniques de la dissociation auriculo-ventriculaire dans la tachycardie ventriculaire.",
        reference: "[UNESS-Cardio] p.44",
        tags: "capture,fusion,TV",
      },
    ],
  });

  // 4.3 Bradycardies & BAV
  const lesson4_3 = await prisma.lesson.create({
    data: {
      module_id: module4.id,
      slug: "bradycardies-blocs-atrioventriculaires-bav",
      nom_fr: "Donjon 4.3 : Bradycardies & Blocs Atrio-Ventriculaires (BAV)",
      description_fr: "BAV 1er degré, Mobitz I (Wenckebach), Mobitz II et BAV 3e degré complet avec échappement.",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de la Conduction",
      rooms_count: 3,
      cours_intro_fr: "Les blocs atrio-ventriculaires (BAV) traduisent un ralentissement ou une interruption de la conduction électrique entre les oreillettes et les ventricules.",
      cours_points_cles_fr: "• BAV 1 : Allongement fixe de l'espace PR > 200 ms (toutes les ondes P sont conduites).\n• BAV 2 Mobitz I (Wenckebach) : Allongement progressif du PR jusqu'à une onde P bloquée.\n• BAV 2 Mobitz II : Blocage inopiné d'une onde P avec PR constant (Haut risque de syncope).\n• BAV 3 (Complet) : Dissociation atrio-ventriculaire totale (ondes P indépendantes des QRS, rythme d'échappement lent).",
      mnemonique: "BAV 3 = Dissociation complète : Pacemaker en urgence !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson4_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle est la définition électrocardiographique stricte du BAV du 1er degré chez l'adulte ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un allongement constant de l'intervalle PR supérieur à 200 ms (0.20 sec), chaque onde P étant suivie d'un QRS", is_correct: true },
          { id: "B", text: "La survenue d'ondes P bloquées intermittentes", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le BAV 1 correspond à un simple retard nodal sans aucune onde P bloquée (PR > 200 ms).",
        reference: "[Coustet] p.82",
        tags: "BAV1,PR",
      },
      {
        lesson_id: lesson4_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le BAV du 2e degré Mobitz II (avec blocage inopiné d'ondes P sans allongement préalable du PR) est une situation à haut risque de passage en BAV complet nécessitant l'implantation d'un stimulateur cardiaque (pacemaker).",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le Mobitz II est un bloc infra-nodal instable à haut risque de syncope d'Adams-Stokes et d'asystolie.",
        reference: "[UNESS-Cardio] p.46",
        tags: "mobitz2,pacemaker",
      },
      {
        lesson_id: lesson4_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un homme de 80 ans fait une syncope brutale à l'emporte-pièce. À l'ECG, la fréquence atriale (ondes P) est à 80/min et la fréquence ventriculaire (QRS larges) est à 32/min, totalement indépendantes l'une de l'autre.",
        question_fr: "Quel diagnostic de trouble conductif majeur portez-vous ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un BAV du 3e degré (complet) avec rythme d'échappement ventriculaire lent", is_correct: true },
          { id: "B", text: "Une simple bradycardie sinusale du sportif", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Dissociation totale entre ondes P et QRS avec bradycardie sévère = BAV 3 complet (urgence d'entraînement électrosystolique et pacemaker).",
        reference: "[Bariéty] p.146",
        tags: "BAV3,dissociation",
      },
    ],
  });

  // 4.4 Syncopes
  const lesson4_4 = await prisma.lesson.create({
    data: {
      module_id: module4.id,
      slug: "syncopes-malaises-cardiaques",
      nom_fr: "Donjon 4.4 : Syncopes & Malaises Cardiaques",
      description_fr: "Syncope à l'emporte-pièce (Adams-Stokes), syncope d'effort et critères d'orientation clinique.",
      niveau_difficulte: 2,
      ordre_affichage: 4,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de la Conscience",
      rooms_count: 3,
      cours_intro_fr: "La syncope est une perte de connaissance brève, complète, avec récupération spontanée rapide liée à une hypoperfusion cérébrale globale transitoire.",
      cours_points_cles_fr: "• Syncope à l'emporte-pièce sans prodrome (Syndrome d'Adams-Stokes) = BAV complet ou TV paroxystique.\n• Syncope survenant à l'effort = Rétrécissement aortique serré ou cardiomyopathie hypertrophique (CMH).\n• Syncope avec prodromes (sueurs, nausées, bâillements) chez le sujet jeune en position debout prolongée = Malaise vasovagal bénin.",
      mnemonique: "Syncope à l'effort ou sans prodrome = Hospitalisation ECG immédiate !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson4_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Comment se caractérise le syndrome de Stokes-Adams en sémiologie cardiologique ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une syncope brutale à l'emporte-pièce sans prodrome avec pâleur initiale suivie d'une rougeur au réveil rapide, due à une pause cardiaque ou BAV complet", is_correct: true },
          { id: "B", text: "Une crise d'épilepsie avec confusion post-critique prolongée de plus de 30 minutes", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le syndrome d'Adams-Stokes est la syncope cardiologique paroxystique typique sans avertissement liée à un arrêt temporaire de la commande ventriculaire.",
        reference: "[Coustet] p.84",
        tags: "stokes_adams,syncope",
      },
      {
        lesson_id: lesson4_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Une syncope survenant en plein effort physique chez un adulte jeune impose la recherche prioritaire d'un obstacle à l'éjection (rétrécissement aortique, cardiomyopathie hypertrophique CMH) ou d'une anomalie du rythme (syndrome de Brugada, QT long).",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! La syncope d'effort est un drapeau rouge majeur de mort subite du sportif nécessitant un bilan cardiologique complet.",
        reference: "[UNESS-Cardio] p.48",
        tags: "syncope_effort,drapeau_rouge",
      },
      {
        lesson_id: lesson4_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Quel examen simple et non invasif doit être réalisé systématiquement au lit du malade devant toute syncope inexpliquée ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un électrocardiogramme 12 dérivations de repos", is_correct: true },
          { id: "B", text: "Un scanner cérébral avec injection de produit de contraste", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'ECG 12 dérivations est l'examen pivot incontournable de toute perte de connaissance brève.",
        reference: "[ESC Guidelines Syncope]",
        tags: "ECG,syncope",
      },
    ],
  });

  // 4.5 Boss 4 : Dragon Rythmologique
  const boss4 = await prisma.lesson.create({
    data: {
      module_id: module4.id,
      slug: "boss-dragon-rythmologique",
      nom_fr: "👑 Boss Chapitre 4 : Le Dragon Rythmologique d'Électrode",
      description_fr: "Combat en 5 salles multi-phases : Interprétation d'arythmie en direct, gestion du BAV 3 complet, Tachycardie Ventriculaire et Cardioversion d'urgence !",
      niveau_difficulte: 3,
      ordre_affichage: 5,
      xp_reward: 150,
      gems_reward: 50,
      dungeon_type: "boss",
      boss_name: "Dragon Rythmologique d'Électrode",
      boss_avatar: "⚡🐉",
      rooms_count: 5,
      cours_intro_fr: "Le Dragon foudroie le système de conduction cardiaque de ses éclairs désordonnés. Dompte les courants électriques d'Aethelgard !",
      cours_points_cles_fr: "1. Reconnaître l'ACFA.\n2. Évaluer le score CHA2DS2-VASc.\n3. Traiter le BAV 3 symptomatique.\n4. Identifier la TV.\n5. Réaliser le choc électrique externe.",
      mnemonique: "Rythme, Conduction, Défibrillation : Rétablir l'onde pure !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: boss4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 1,
        room_type: "boss_phase_1",
        contexte_clinique: "PHASE 1 - ORAGE AURICULAIRE : Le Dragon libère une tachycardie irrégulière à 160 bpm avec trémulation de la ligne de base sans onde P chez un homme hypertendu de 76 ans.",
        question_fr: "Quel traitement anticoagulant au long cours devez-vous initier au vu de son score CHA2DS2-VASc >= 2 ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un Anticoagulant Oral Direct (AOD comme l'Apixaban) ou AVK", is_correct: true },
          { id: "B", text: "Une simple aspirine à faible dose", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Frappe réussie ! L'anticoagulation curative orale est obligatoire chez l'homme avec score CHA2DS2-VASc >= 2 pour prévenir les embolies systémiques.",
        reference: "[ESC Guidelines AF]",
        tags: "boss4,phase1",
      },
      {
        lesson_id: boss4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 2,
        room_type: "boss_phase_2",
        contexte_clinique: "PHASE 2 - BLOCAGE CONDUCTIF : Le rythme chute soudainement à 28 bpm avec dissociation auriculo-ventriculaire totale.",
        question_fr: "Quel médicament parasympatholytique d'urgence en bolus IV peut accélérer la conduction nodale en attendant la sonde d'entraînement ?",
        options_json: JSON.stringify([
          { id: "A", text: "L'Atropine (0.5 à 1 mg IV)", is_correct: true },
          { id: "B", text: "La Digoxine IV", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Coup critique ! L'atropine bloque l'effet vagal et améliore la conduction du nœud atrio-ventriculaire.",
        reference: "[Coustet] p.82",
        tags: "boss4,phase2",
      },
      {
        lesson_id: boss4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_phase_3",
        contexte_clinique: "PHASE 3 - DÉCHAÎNEMENT VENTRICULAIRE : Le patient passe brutalement en tachycardie régulière à QRS très larges à 190 bpm avec tension effondrée à 65/40 mmHg.",
        question_fr: "Quel geste de réanimation électrique d'urgence immédiate devez-vous délivrer ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un choc électrique externe (Cardioversion synchronisée) en urgence vitale", is_correct: true },
          { id: "B", text: "Un massage sino-carotidien prolongé", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Magistral ! Une TV mal tolérée sur le plan hémodynamique impose la cardioversion électrique synchronisée immédiate sous sédation.",
        reference: "[UNESS-Cardio] p.44",
        tags: "boss4,phase3",
      },
      {
        lesson_id: boss4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 4,
        room_type: "boss_phase_4",
        contexte_clinique: "PHASE 4 - RYTHME SINUSAL RESTAURÉ : Le tracé montre à présent un rythme régulier avec une onde P positive en DII devant chaque QRS fin :",
        question_fr: "VRAI ou FAUX : Le rythme sinusal normal d'un adulte au repos se situe entre 50 et 100 battements par minute.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Parfait ! La fréquence sinusale physiologique de repos chez l'adulte est comprise entre 50 et 100 bpm.",
        reference: "[Coustet] p.76",
        tags: "boss4,phase4",
      },
      {
        lesson_id: boss4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 5,
        room_type: "boss_phase_5",
        contexte_clinique: "PHASE 5 - PROTECTION DÉFINITIVE : Pour protéger définitivement le patient contre le risque de récidive de TV mal tolérée sur cicatrice d'infarctus :",
        question_fr: "Quel dispositif implantable est indiqué pour terrasser le Dragon Rythmologique ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un Défibrillateur Automatique Implantable (DAI)", is_correct: true },
          { id: "B", text: "Un simple enregistreur Holter externe de 24 heures", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "VICTOIRE TOTALE ! Le défibrillateur automatique implantable (DAI) prévient la mort subite par choc électrique interne immédiat !",
        reference: "[ESC Guidelines Ventricular Arrhythmias]",
        tags: "boss4,phase5",
      },
    ],
  });

  // =========================================================================
  // CHAPITRE 5 : VAISSEAUX PÉRIPHÉRIQUES & URGENCES HTA
  // =========================================================================
  console.log("🩸 Chapitre 5 : Vaisseaux Périphériques & Urgences HTA...");
  const module5 = await prisma.module.create({
    data: {
      slug: "chapitre-5-vaisseaux-urgences-hta",
      nom_fr: "Chapitre 5 : Vaisseaux Périphériques & Urgences HTA",
      description_fr: "Maîtriser la TVP, l'AOMI, l'anévrisme aortique abdominal et terrasser le Seigneur Suprême de l'Aorte.",
      systeme: "cardio",
      ordre_affichage: 5,
      icone: "Shield",
      color: "purple",
    },
  });

  // 5.1 TVP & Homans
  const lesson5_1 = await prisma.lesson.create({
    data: {
      module_id: module5.id,
      slug: "thrombose-veineuse-profonde-homans",
      nom_fr: "Donjon 5.1 : Thrombose Veineuse Profonde (TVP) & Embolie Pulmonaire",
      description_fr: "Signe de Homans, perte du ballottement du mollet, œdème unilatéral et score de Wells.",
      niveau_difficulte: 2,
      ordre_affichage: 1,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle Thrombotique",
      rooms_count: 3,
      cours_intro_fr: "La Thrombose Veineuse Profonde (TVP) est l'oblitération d'une veine profonde par un thrombus cruorique. Sa complication majeure est l'Embolie Pulmonaire par migration du caillot.",
      cours_points_cles_fr: "• Signe de Homans : douleur à la dorsiflexion passive du pied.\n• Perte du ballottement passif du mollet et augmentation de circonférence > 3 cm par rapport au côté sain.\n• Score de Wells : oriente vers le dosage des D-dimères ou l'écho-Doppler veineux immédiat.",
      mnemonique: "TVP = Douleur, Mollet gonflé/chaud, Homans, Risque d'Embolie !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson5_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Comment met-on en évidence le signe de Homans à l'examen clinique des membres inférieurs ?",
        options_json: JSON.stringify([
          { id: "A", text: "Par la dorsiflexion passive du pied, qui réveille une douleur vive dans le mollet", is_correct: true },
          { id: "B", text: "Par l'élévation du bras au-dessus de la tête", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe de Homans est la douleur provoquée au mollet lors de la flexion dorsale du pied.",
        reference: "[Coustet] p.86",
        tags: "homans,TVP",
      },
      {
        lesson_id: lesson5_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Un taux plasmatique de D-dimères inférieur à 500 ng/mL (ou ajusté à l'âge chez le sujet de plus de 50 ans) permet d'exclure formellement une TVP chez un patient à probabilité clinique faible ou intermédiaire.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Les D-dimères ont une excellente valeur prédictive négative (> 98 %) permettant d'éliminer la maladie thromboembolique.",
        reference: "[UNESS-Cardio] p.52",
        tags: "D-dimères,VPN",
      },
      {
        lesson_id: lesson5_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Une femme de 45 ans traitée pour TVP du membre inférieur droit présente brutalement une dyspnée aiguë avec point de côté basithoracique droit et tachycardie à 115 bpm.",
        question_fr: "Quelle complication d'extrême urgence vitale devez-vous diagnostiquer sans délai ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une embolie pulmonaire par migration du thrombus veineux", is_correct: true },
          { id: "B", text: "Un pneumothorax sous tension", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Toute dyspnée aiguë chez un patient avec TVP est une embolie pulmonaire jusqu'à preuve du contraire (angioscanner thoracique en urgence).",
        reference: "[Coustet] p.88",
        tags: "embolie_pulmonaire,TVP",
      },
    ],
  });

  // 5.2 AOMI & Pouls
  const lesson5_2 = await prisma.lesson.create({
    data: {
      module_id: module5.id,
      slug: "arteriopathie-obliterante-aomi-pouls",
      nom_fr: "Donjon 5.2 : Artériopathie Oblitérante (AOMI) & Pouls",
      description_fr: "Palpation des pouls périphériques, classification de Leriche-Fontaine et Index de Pression Systolique (IPS).",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Golem d'Ischémie Artérielle",
      rooms_count: 3,
      cours_intro_fr: "L'Artériopathie Oblitérante des Membres Inférieurs (AOMI) est la sténose athéromateuse des artères des jambes. Elle se dépiste par la palpation systématique de tous les pouls et le calcul de l'IPS.",
      cours_points_cles_fr: "• Classification de Leriche & Fontaine : Stade 1 = Asymptomatique / Stade 2 = Claudication intermittente d'effort / Stade 3 = Douleurs de décubitus nocturnes / Stade 4 = Troubles trophiques (ulcère artériel, gangrène).\n• Index de Pression Systolique (IPS) = PAS cheville / PAS humérale (Normal : 0.90 à 1.30 ; AOMI si < 0.90).\n• Ischémie aiguë de membre (les 5 P) : Pain, Pallor, Pulselessness, Paresthesia, Paralysis.",
      mnemonique: "IPS < 0.90 = AOMI ; 5P = Ischémie aiguë opératoire !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson5_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle valeur de l'Index de Pression Systolique (IPS) à la cheville confirme formellement le diagnostic d'AOMI chez l'adulte ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un IPS strictement inférieur à 0.90", is_correct: true },
          { id: "B", text: "Un IPS égal à 1.15", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Un IPS < 0.90 a une sensibilité et spécificité > 95 % pour affirmer l'AOMI sténosante.",
        reference: "[Coustet] p.90",
        tags: "IPS,AOMI",
      },
      {
        lesson_id: lesson5_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Dans la classification de Leriche et Fontaine, le stade 3 correspond à l'apparition de douleurs ischémiques de repos en décubitus, obligeant souvent le patient à laisser pendre sa jambe hors du lit.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Les douleurs de décubitus (stade 3) témoignent d'une ischémie critique chronique menaçant la viabilité du membre.",
        reference: "[Bariéty] p.150",
        tags: "leriche_fontaine,stade3",
      },
      {
        lesson_id: lesson5_2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un patient se présente avec une jambe droite brutalement froide, livide, insensible (paresthésies), sans aucun pouls périphérique palpable et douloureuse.",
        question_fr: "Quel tableau d'extrême urgence chirurgicale de revascularisation devez-vous porter ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une ischémie aiguë de membre inférieur (Embolie ou thrombose artérielle aiguë)", is_correct: true },
          { id: "B", text: "Une entorse de la cheville", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Les 5P (Pain, Pallor, Pulselessness, Paresthesia, Paralysis) signent l'ischémie aiguë de membre imposant une embolectomie (sonde de Fogarty) dans les 6 heures.",
        reference: "[UNESS-Cardio] p.54",
        tags: "ischémie_aiguë,fogarty",
      },
    ],
  });

  // 5.3 Urgences HTA
  const lesson5_3 = await prisma.lesson.create({
    data: {
      module_id: module5.id,
      slug: "crise-aigue-hypertensive-retentissement",
      nom_fr: "Donjon 5.3 : Crise Aiguë Hypertensive & Retentissement Viscéral",
      description_fr: "HTA maligne, encéphalopathie hypertensive, fond d'œil stade IV et retentissement viscéral aigu.",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de la Pression",
      rooms_count: 3,
      cours_intro_fr: "L'urgence hypertensive est définie par une PAS >= 180 mmHg et/ou PAD >= 120 mmHg associée à une souffrance aiguë d'un organe cible (cerveau, cœur, rein, rétine).",
      cours_points_cles_fr: "• Éléments de souffrance d'organe : Encéphalopathie hypertensive (céphalées en casque, vomissements, confusion), OAP hypertensif, dissection aortique, éclampsie.\n• Rétinopathie hypertensive stade IV : œdème papillaire, exsudats cotonneux et hémorragies.\n• Objectif : Baisse progressive de la pression artérielle de 20 à 25 % dans les premières heures (pas de chute brutale !).",
      mnemonique: "Urgence HTA = Chiffre élevé + Organe qui souffre !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson5_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quelle est la différence sémiologique fondamentale entre une simple 'poussée hypertensive' et une 'urgence hypertensive' ?",
        options_json: JSON.stringify([
          { id: "A", text: "La présence d'une atteinte aiguë menaçante d'un organe cible (cerveau, cœur, rein, rétine, aorte)", is_correct: true },
          { id: "B", text: "Uniquement le chiffre absolu de la pression sans examen clinique", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "C'est la souffrance viscérale aiguë (encéphalopathie, OAP, SCA, dissection, IRA) qui définit l'urgence hypertensive vitale.",
        reference: "[Coustet] p.92",
        tags: "HTA,urgence_viscérale",
      },
      {
        lesson_id: lesson5_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Dans l'urgence hypertensive (sauf dissection aortique), il est recommandé de réduire la pression artérielle de 20 à 25 % dans les premières heures sans chercher à la normaliser brutalement afin d'éviter une ischémie cérébrale ou coronarienne par hypoperfusion.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Une baisse trop brutale de la pression dans l'HTA chronique déplace la courbe d'autorégulation et peut provoquer un AVC ischémique iatrogène.",
        reference: "[UNESS-Cardio] p.56",
        tags: "HTA,baisse_progressive",
      },
      {
        lesson_id: lesson5_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 3,
        room_type: "guardian",
        question_fr: "Quelle anomalie du fond d'œil signe le stade IV (stade ultime) de la rétinopathie hypertensive dans l'HTA maligne ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un œdème papillaire bilatéral avec flou des berges de la papille optique", is_correct: true },
          { id: "B", text: "Un simple rétrécissement artériel isolé", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'œdème papillaire au fond d'œil définit le stade IV de Kirkendall et signe l'HTA maligne.",
        reference: "[Bates] p.330",
        tags: "fond_œil,HTA_maligne",
      },
    ],
  });

  // 5.4 AAA
  const lesson5_4 = await prisma.lesson.create({
    data: {
      module_id: module5.id,
      slug: "anevrisme-aorte-abdominale-aaa",
      nom_fr: "Donjon 5.4 : Anévrisme de l'Aorte Abdominale & Masse Battante",
      description_fr: "Masse abdominale battante et expansive, signes de fissuration et échographie de dépistage.",
      niveau_difficulte: 2,
      ordre_affichage: 4,
      xp_reward: 35,
      gems_reward: 12,
      dungeon_type: "standard",
      boss_name: "Sentinelle de l'Aorte Abdominale",
      rooms_count: 3,
      cours_intro_fr: "L'Anévrisme de l'Aorte Abdominale (AAA) est la dilatation localisée du calibre aortique (> 30 mm ou > 50 % du diamètre normal). Il est le plus souvent sous-rénal.",
      cours_points_cles_fr: "• Examen physique : Masse médiane sus-ombilicale, battante (au rythme du cœur) et expansive (écartant les deux mains lors de la palpation bimanuelle).\n• Fissuration / Rupture : Triade classique (Douleur abdominale ou lombaire brutale + Masse battante + État de choc hémodynamique).\n• Échographie abdominale : Examen de dépistage et de surveillance de référence.",
      mnemonique: "AAA = Masse battante ET expansive !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson5_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        room_number: 1,
        room_type: "standard",
        question_fr: "Quel caractère sémiologique fondamental à la palpation bimanuelle permet de distinguer avec certitude un anévrisme aortique abdominal d'une masse transmise par l'aorte ?",
        options_json: JSON.stringify([
          { id: "A", text: "Le caractère expansif (la masse écarte activement les deux mains de l'examinateur à chaque systole)", is_correct: true },
          { id: "B", text: "Le caractère totalement fixe et non mobile", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Une masse simplement transmise est soulevée d'arrière en avant ; un anévrisme est battant ET expansif dans toutes les directions (expansion latérale).",
        reference: "[Coustet] p.94 ; [McGee] p.370",
        tags: "AAA,expansivité",
      },
      {
        lesson_id: lesson5_4.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Le seuil de diamètre aortique à partir duquel une indication chirurgicale de cure d'AAA sous-rénal asymptomatique est posée est généralement de 50 à 55 mm.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Le risque de rupture augmente exponentiellement au-delà de 50-55 mm de diamètre transversal.",
        reference: "[UNESS-Cardio] p.58",
        tags: "AAA,diamètre_opératoire",
      },
      {
        lesson_id: lesson5_4.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "guardian",
        contexte_clinique: "Un homme de 70 ans porteur d'un AAA connu est amené pour une douleur lombaire gauche brutale et intolérable avec malaise, pâleur extrême et tension à 70/40 mmHg.",
        question_fr: "Quelle complication cataclysmique devez-vous suspecter et transférer au bloc opératoire sans délai ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une rupture d'anévrisme de l'aorte abdominale dans le rétropéritoine", is_correct: true },
          { id: "B", text: "Une colique néphrétique bénigne", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Douleur lombaire + choc hémodynamique + terrain d'AAA = Rupture aortique rétro-péritonéale (urgence chirurgicale absolue).",
        reference: "[Bariéty] p.154",
        tags: "rupture_AAA,urgence",
      },
    ],
  });

  // 5.5 Boss Ultime Monde 1 : Le Seigneur de l'Aorte
  const boss5 = await prisma.lesson.create({
    data: {
      module_id: module5.id,
      slug: "boss-seigneur-aorte",
      nom_fr: "👑 Boss Ultime Monde 1 : Le Seigneur Suprême de l'Aorte",
      description_fr: "Le combat final du Monde Cardiovasculaire en 5 salles multi-phases : Synthèse totale des urgences vasculaires, de l'ischémie, de l'insuffisance cardiaque et de l'auscultation !",
      niveau_difficulte: 3,
      ordre_affichage: 5,
      xp_reward: 200,
      gems_reward: 60,
      dungeon_type: "boss",
      boss_name: "Seigneur Suprême de l'Aorte",
      boss_avatar: "👑🩸",
      rooms_count: 5,
      cours_intro_fr: "Le Maître Suprême des Vaisseaux d'Aethelgard se dresse devant toi. Déploie toute la science sémiologique acquise dans le Monde 1 pour purifier définitivement le Royaume Cardiovasculaire !",
      cours_points_cles_fr: "1. Diagnostic éclair des 4 urgences PIED.\n2. Reconnaissance des souffles et des galops B3/B4.\n3. Analyse des troubles conductifs et rythmiques.\n4. Sauvetage vasculaire et hémodynamique d'urgence.",
      mnemonique: "Purification totale du Monde 1 : Gloire au Héros d'Aethelgard !",
    },
  });

  await prisma.card.createMany({
    data: [
      {
        lesson_id: boss5.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 1,
        room_type: "boss_phase_1",
        contexte_clinique: "PHASE 1 - L'ÉPREUVE DES 4 FLÉAUX : Le Seigneur de l'Aorte invoque une douleur dorsale déchirante descendante avec asymétrie tensionnelle de 35 mmHg entre les deux bras.",
        question_fr: "Quelle urgence vitale aortique devez-vous nommer pour briser son premier bouclier ?",
        options_json: JSON.stringify([
          { id: "A", text: "La dissection aiguë de l'aorte thoracique", is_correct: true },
          { id: "B", text: "Une péricardite aiguë bénigne", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Frappe divine ! L'irradiation dorsale descendante et l'asymétrie de tension signent la dissection aortique.",
        reference: "[Coustet] p.54",
        tags: "boss5,phase1",
      },
      {
        lesson_id: boss5.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 2,
        room_type: "boss_phase_2",
        contexte_clinique: "PHASE 2 - L'ÉPREUVE ACOUSTIQUE : Un souffle méso-systolique 4/6 rude au 2e EIC droit irradiant aux carotides avec abolition de B2.",
        question_fr: "Quelle anomalie valvulaire identifiez-vous ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un rétrécissement aortique serré", is_correct: true },
          { id: "B", text: "Une insuffisance mitrale", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Coup critique ! L'éjection aortique sténosée projette le souffle vers les carotides avec disparition de A2.",
        reference: "[Bariéty] p.134",
        tags: "boss5,phase2",
      },
      {
        lesson_id: boss5.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_phase_3",
        contexte_clinique: "PHASE 3 - L'ÉPREUVE ÉLECTRIQUE : Le Seigneur de l'Aorte déclenche une dissociation atrioventriculaire complète avec fréquence ventriculaire à 30 bpm et syncope d'Adams-Stokes.",
        question_fr: "Quel traitement électrophysiologique définitif rétablira la conduction cardiaque ?",
        options_json: JSON.stringify([
          { id: "A", text: "L'implantation d'un stimulateur cardiaque définitif (Pacemaker)", is_correct: true },
          { id: "B", text: "La prescription de bêtabloquants", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Magistral ! Le BAV 3 complet symptomatique impose la pose d'un pacemaker définitif.",
        reference: "[UNESS-Cardio] p.46",
        tags: "boss5,phase3",
      },
      {
        lesson_id: boss5.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "VRAI_FAUX",
        room_number: 4,
        room_type: "boss_phase_4",
        contexte_clinique: "PHASE 4 - L'ÉPREUVE VASCULAIRE : Chez un patient avec claudication intermittente du mollet à 150 mètres :",
        question_fr: "VRAI ou FAUX : Un Index de Pression Systolique (IPS) mesuré à 0.65 confirme une artériopathie oblitérante des membres inférieurs (AOMI) modérée à sévère.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Parfait ! Un IPS < 0.90 affirme l'AOMI, et une valeur entre 0.40 et 0.70 signe une sténose artérielle significative.",
        reference: "[Coustet] p.90",
        tags: "boss5,phase4",
      },
      {
        lesson_id: boss5.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        room_number: 5,
        room_type: "boss_phase_5",
        contexte_clinique: "PHASE 5 - LE SACRE DU SÉMIOLOGUE : Le Seigneur de l'Aorte s'effondre. Vous devez poser le geste ultime face à un choc cardiogénique avec OAP massif.",
        question_fr: "Quelle triade thérapeutique de sauvetage immédiat délivre la victoire totale sur le Monde 1 ?",
        options_json: JSON.stringify([
          { id: "A", text: "Position assise + Furosémide IV + Dobutamine IV + Revascularisation coronaire d'urgence", is_correct: true },
          { id: "B", text: "Décubitus dorsal strict et arrêt de tout traitement", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "VICTOIRE LÉGENDAIRE SUR LE MONDE 1 ! Tu as triomphé des 5 Chapitres et terrassé le Seigneur de l'Aorte ! Aethelgard chante tes louanges !",
        reference: "[Traité de Sémiologie d'Aethelgard]",
        tags: "boss5,phase5,victoire_monde_1",
      },
    ],
  });

  // Progression initiale de l'utilisateur démo
  await prisma.userLessonProgress.create({
    data: {
      user_id: demoUser.id,
      lesson_id: lesson1_1.id,
      mastery_level: 2,
      deja_aborde_cours: true,
      last_practiced_at: new Date(),
    },
  });

  console.log("✅ Déploiement exhaustif des 5 Chapitres & 5 Boss terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
