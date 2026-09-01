import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Lancement de l'injection exhaustive des connaissances Cardio V1...");

  // Nettoyage préalable pour ré-injection propre
  await prisma.glossaryTerm.deleteMany();
  await prisma.userCardProgress.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.card.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  // =========================================================================
  // 1. GLOSSAIRE MÉDICAL SÉMIOLOGIQUE ENRICHI (Coustet, Bariéty, Bates, McGee)
  // =========================================================================
  const glossary = [
    {
      terme: "Angor (Angine de poitrine)",
      definition_fr: "Douleur thoracique paroxystique rétrosternale constrictive résultant d'une inadéquation transitoire entre les besoins en oxygène du myocarde et les apports par les artères coronaires.",
      exemples: "Angor d'effort classique (cédant au repos), Angor instable (syndrome coronarien aigu menaçant sans élévation initiale de troponine).",
    },
    {
      terme: "Signe de Levine",
      definition_fr: "Geste spontané du patient décrivant sa douleur en serrant son poing fermé contre son sternum. Très forte spécificité pour une ischémie myocardique aiguë.",
      exemples: "Sensibilité ~80 % et spécificité élevée pour le syndrome coronarien aigu [McGee Evidence-Based Physical Diagnosis].",
    },
    {
      terme: "Orthopnée",
      definition_fr: "Dyspnée survenant en décubitus dorsal et soulagée par le passage en position assise ou debout, due à la redistribution de la masse sanguine vers le thorax augmentant la pression capillaire pulmonaire.",
      exemples: "Quantifiée par le nombre d'oreillers nécessaires pour dormir (ex: orthopnée à 3 oreillers).",
    },
    {
      terme: "Dyspnée paroxystique nocturne (DPN)",
      definition_fr: "Accès de suffocation brutale réveillant le patient après 2 à 4 heures de sommeil, l'obligeant à s'asseoir au bord du lit ou à ouvrir la fenêtre.",
      exemples: "Signe clinique très spécifique d'insuffisance ventriculaire gauche sévère.",
    },
    {
      terme: "Turgescence jugulaire",
      definition_fr: "Gonflement visible des veines jugulaires externes à la base du cou, examiné chez un patient incliné à 45°, témoignant d'une augmentation de la pression veineuse centrale.",
      exemples: "Signe cardinal d'insuffisance cardiaque droite, de péricardite constrictive ou de tamponnade.",
    },
    {
      terme: "Reflux hépato-jugulaire (RHJ / Signe de Rondot)",
      definition_fr: "Majoration durable (> 3 secondes) de la turgescence jugulaire provoquée par une pression manuelle douce et prolongée (15 à 30 secondes) de l'hypochondre droit.",
      exemples: "Témoigne de l'incapacité du ventricule droit à absorber un surcroît de retour veineux [Bariéty p.122].",
    },
    {
      terme: "Signe de Kussmaul (veineux)",
      definition_fr: "Augmentation paradoxale de la turgescence jugulaire lors de l'inspiration profonde (au lieu de la diminution physiologique normale).",
      exemples: "Signe classique de péricardite constrictive, de tamponnade ou d'infarctus du ventricule droit [Bates p.310].",
    },
    {
      terme: "Choc de pointe",
      definition_fr: "Soulèvement systolique perçu sous la pulpe des doigts au niveau de l'apex cardiaque (normalement situé au 5e espace intercostal gauche, ligne médioclaviculaire).",
      exemples: "Dévié en bas et à gauche en cas de dilatation ventriculaire gauche ; étalé et hyperdynamique (choc en dôme de Bard) dans l'insuffisance aortique volumineuse.",
    },
    {
      terme: "Signe de Harzer",
      definition_fr: "Perception des battements du ventricule droit hypertrophié ou dilaté à la palpation sous l'appendice xiphoïde en faisant inspirer profondément le patient.",
      exemples: "Signe cardinal d'hypertrophie ventriculaire droite ou de cœur pulmonaire chronique [Coustet p.58].",
    },
    {
      terme: "Bruit B1",
      definition_fr: "Premier bruit cardiaque (« Toum »), sourd et grave, marquant le début de la systole ventriculaire. Causé par la fermeture synchrone des valves atrio-ventriculaires (Mitrale M1 et Tricuspide T1).",
      exemples: "Synchrone de la montée de l'onde pulsatile carotidienne et radiale.",
    },
    {
      terme: "Bruit B2 & Dédoublement physiologique",
      definition_fr: "Deuxième bruit cardiaque (« Ta »), sec et plus aigu, marquant la fin de la systole ventriculaire. Causé par la fermeture des valves sigmoïdes (Aortique A2 puis Pulmonaire P2).",
      exemples: "Dédoublement physiologique audible à l'inspiration profonde au foyer pulmonaire ; dédoublement large et fixe pathognomonique de la CIA [Jules Constant p.112].",
    },
    {
      terme: "Bruit de Galop (B3 / B4)",
      definition_fr: "Bruit surajouté protodiastolique (B3, remplissage passif rapide dans un VG dilaté) ou télédiastolique/présystolique (B4, contraction atriale puissante contre un VG rigide).",
      exemples: "B3 très évocateur d'insuffisance cardiaque avec dysfonction systolique gauche.",
    },
    {
      terme: "Manœuvre de Rivero-Carvallo",
      definition_fr: "Augmentation de l'intensité d'un souffle cardiaque lors d'une inspiration profonde, due à l'augmentation du retour veineux vers les cavités droites.",
      exemples: "Permet de différencier formellement un souffle d'insuffisance tricuspide (positif) d'un souffle d'insuffisance mitrale (inchangé ou diminué).",
    },
    {
      terme: "Pouls paradoxal de Kussmaul (artériel)",
      definition_fr: "Diminution anormale de la pression artérielle systolique de plus de 10 mmHg lors de l'inspiration profonde.",
      exemples: "Signe d'extrême gravité témoignant d'une tamponnade péricardique compressive ou d'un asthme aigu grave [McGee p.352].",
    },
    {
      terme: "Signe de Musset",
      definition_fr: "Secousses ou hochements involontaires de la tête synchrones des battements cardiaques, résultant d'une grande pression pulsée.",
      exemples: "Signe périphérique classique de l'insuffisance aortique massive [Bariéty p.130].",
    },
    {
      terme: "Frottement péricardique",
      definition_fr: "Bruit superficiel, râpeux ou de « cuir neuf », systolo-diastolique à 3 composantes, persistant en apnée respiratoire et variant d'une heure à l'autre.",
      exemples: "Signe physique pathognomonique de la péricardite aiguë sans épanchement abondant [Coustet p.64].",
    },
    {
      terme: "Fraction d'éjection ventriculaire gauche (FEVG)",
      definition_fr: "Pourcentage du volume télédiastolique éjecté par le ventricule gauche à chaque systole. Normale supérieure ou égale à 50 %.",
      exemples: "FEVG < 40 % = insuffisance cardiaque à fraction d'éjection altérée (IC-FEr) [UNESS-Cardio p.34].",
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
      profession: "medecine",
      niveau_etudes: "debutant",
      mode_apprentissage: "complet",
      onboarding_complete: true,
      password_hash,
      xp_total: 120,
      user_level: 2,
      streak_days: 3,
      hp_current: 100,
      hp_max: 100,
      mana_current: 100,
      mana_max: 200,
      gems: 50,
      character_class: "clerc",
      avatar_id: "clerc_1",
      current_title: "Initié Sémiologue",
      last_activity_date: new Date(),
    },
  });

  // ==========================================
  // MONDE 0 : SANCTUAIRE D'INITIATION (TUTO)
  // ==========================================
  console.log("🧙‍♂️ Monde 0 : Sanctuaire d'Initiation & La Grande Blouse...");
  const module0 = await prisma.module.create({
    data: {
      slug: "monde-0-tutoriel",
      nom_fr: "Monde 0 : Sanctuaire d'Initiation",
      description_fr: "Fais tes premiers pas avec La Grande Blouse, apprends à gérer tes PV/Mana et lance ton premier sort de diagnostic !",
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
      description_fr: "Découvre les secrets du royaume d'Aethelgard, tes jauges de vitalité et la puissance de ton grimoire arcanique.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 50,
      gems_reward: 25,
      dungeon_type: "tutorial",
      boss_name: "Spectre de l'Ignorance Novice",
      boss_avatar: "👻",
      rooms_count: 3,
      cours_intro_fr: "Bienvenue à Aethelgard ! En tant qu'Initié, ton stéthoscope et ton sens clinique sont tes meilleures armes contre les erreurs médicales.",
      cours_detaille_fr: "Chaque question répondue correctement restaure ton Mana (+20 Mana) et te rapproche de la victoire. En cas d'erreur, tes points de vie diminuent (-15 PV). N'hésite jamais à invoquer tes sorts (50/50, indices, potions) en cas de doute !",
      cours_points_cles_fr: "• Règle 1 : Observer le patient avant de toucher.\n• Règle 2 : Ne jamais négliger un drapeau rouge (douleur constrictive, syncope d'effort).\n• Règle 3 : Utiliser ton Mana avec sagesse.",
      pieges_cliniques_fr: "Le piège du débutant : se précipiter sans lire l'énoncé. Prends toujours le temps d'analyser le terrain du patient !",
      mnemonique: "P-I-E-D : Péricardite, Infarctus (SCA), Embolie pulmonaire, Dissection aortique.",
      carte_mentale_json: JSON.stringify({
        id: "root",
        label: "Initiation Sémiologique",
        children: [
          { id: "pv", label: "Points de Vie (100 PV) : Vigilance face aux erreurs" },
          { id: "mana", label: "Mana (200 Max) : Carburant des sortilèges" },
          { id: "sorts", label: "Grimoire : 50/50, Indices, Potions" },
        ],
      }),
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
          { id: "D", text: "Apprendre par cœur des définitions sans jamais écouter le patient", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Exactement ! La sémiologie est le socle de toute la médecine : savoir interroger, observer, palper et ausculter avant tout examen complémentaire.",
        reference: "[Baptiste Coustet] p.12-14",
        tags: "initiation,sémiologie,bases",
      },
      {
        lesson_id: lesson0_1.id,
        systeme: "tutoriel",
        niveau_difficulte: 1,
        type_question: "VRAI_FAUX",
        room_number: 2,
        room_type: "standard",
        question_fr: "VRAI ou FAUX : Lorsque tu as un doute dans un donjon, tu peux dépenser du Mana pour lancer un sort 50/50 ou consulter un indice sans perdre de PV.",
        options_json: JSON.stringify(["VRAI", "FAUX"]),
        reponse_correcte: "VRAI",
        feedback_fr: "Vrai ! Ton Mana est là pour t'aider : utilise tes sorts (50/50, Indices) pour éviter de perdre des PV face aux questions pièges.",
        reference: "[Manuel d'Aethelgard]",
        tags: "sorts,mana,gameplay",
      },
      {
        lesson_id: lesson0_1.id,
        systeme: "tutoriel",
        niveau_difficulte: 1,
        type_question: "CAS_CLINIQUE",
        room_number: 3,
        room_type: "boss_guardian",
        contexte_clinique: "Un homme de 58 ans ressent une vive douleur rétrosternale angoissante qui lui serre la poitrine « comme dans un étau » et irradie vers sa mâchoire depuis 30 minutes.",
        question_fr: "Quelle est l'urgence vitale cardiovasculaire à suspecter immédiatement ?",
        options_json: JSON.stringify([
          { id: "A", text: "Un Syndrome Coronarien Aigu (Infarctus du myocarde)", is_correct: true },
          { id: "B", text: "Une simple courbature musculaire bénigne", is_correct: false },
          { id: "C", text: "Un reflux gastrique sans gravité", is_correct: false },
          { id: "D", text: "Une crise d'angoisse isolée", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Bravo ! Toute douleur rétrosternale constrictive prolongée irradiant à la mâchoire est un Syndrome Coronarien Aigu jusqu'à preuve du contraire (ECG 12 dérivations en urgence).",
        reference: "[UNESS-Cardio] p.12 ; [Coustet] p.48",
        tags: "douleur_thoracique,angor,urgence",
      },
    ],
  });

  // ==========================================
  // MODULE 1 : SIGNES FONCTIONNELS CARDIO
  // ==========================================
  console.log("📦 Module 1 : Signes fonctionnels approfondis...");
  const module1 = await prisma.module.create({
    data: {
      slug: "cardio-signes-fonctionnels",
      nom_fr: "Signes fonctionnels & Symptômes",
      nom_en: "Cardiovascular Symptoms & History",
      description_fr: "Identifier et caractériser les motifs de consultation cardiologiques urgents et fréquents.",
      systeme: "cardio",
      ordre_affichage: 1,
      icone: "HeartHandshake",
      color: "rose",
    },
  });

  // Leçon 1.1 : Douleur thoracique
  const lesson1_1 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "douleur-thoracique-angineuse",
      nom_fr: "Douleur thoracique & Angor",
      description_fr: "Reconnaître le syndrome coronarien aigu, les 5 critères de l'angor et éliminer les 4 urgences vitales PIED.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 25,
      cours_intro_fr: "La douleur thoracique aiguë impose une démarche réflexe : éliminer immédiatement les 4 urgences vitales (mnémotechnique PIED) et caractériser précisément les 5 critères de l'angor coronarien selon l'interrogatoire méthodique PARASITE.",
      cours_detaille_fr: `### 1. L'Interrogatoire Méthodique de la Douleur (Mnémotechnique PARASITE)
D'après les traités de sémiologie médicale (*Coustet p.48, Bariéty p.110*) :
- **P - Position / Siège** : Rétrosternal médiothoracique, « en barre » ou « en étau » (constrictive).
- **A - Allure / Début** : Brutal ou progressif, d'emblée maximal ou d'intensité croissante.
- **R - Rythme / Durée** : Brève (< 5 à 15 min dans l'angor stable) ou prolongée (> 20 min dans le SCA / Infarctus).
- **A - Ancienneté** : Premier épisode inaugural (angor de novo) ou douleur récidivante connue.
- **S - Signes d'accompagnement** : Sueurs profuses, angoisse avec sensation de mort imminente, nausées, vomissements, polypnée.
- **I - Irradiations** : Mandibule, mâchoire inférieure, épaule gauche, bord ulnaire du membre supérieur gauche jusqu'aux 4e et 5e doigts.
- **T - Type / Caractère** : Brûlure profonde, striction, écrasement, pesanteur médiothoracique.
- **E - Évolution & Déclencheurs** : Déclenchée par l'effort, la marche en côte, le vent froid, le stress ; **soulagée en moins de 3 minutes par le repos ou la trinitrine sublinguale**.

### 2. Les 4 Urgences Vitales Cardiovasculaires (Mnémotechnique PIED)
1. **P - Péricardite aiguë** : Douleur prolongée, augmentée en inspiration profonde et en décubitus dorsal, nettement **soulagée par la position assise penchée en avant**. Présence possible d'un frottement péricardique systolo-diastolique.
2. **I - Infarctus du myocarde (SCA)** : Douleur rétrosternale constrictive > 20 minutes, résistante à la trinitrine, angoisse majeure, sueurs. Onde de Pardee à l'ECG.
3. **E - Embolie pulmonaire** : Douleur basithoracique rythmée par la respiration (point de côté pleural), polypnée brutale, tachycardie, anxiété, hémoptysie tardive.
4. **D - Dissection aortique** : Douleur d'emblée maximale, déchirante, migratrice postérieure (dorsale inter-scapulaire puis lombaire descendante). Asymétrie tensionnelle (> 20 mmHg) et abolition d'un pouls périphérique.

### 3. Signe de Levine & Présentations Trompeuses
- **Signe de Levine** : Le patient porte spontanément son poing fermé sur le sternum (sensibilité ~80 % pour l'ischémie myocardique selon *Steven McGee*).
- **Formes atypiques et indolores** : Chez la femme, le sujet âgé et le diabétique (neuropathie autonome), l'infarctus peut être totalement indolore et se manifester uniquement par une dyspnée aiguë inexpliquée, un malaise ou des troubles digestifs (nausées, épigastralgies).`,
      cours_points_cles_fr: `- Angor typique = Rétrosternal + Constrictif + Déclenché à l'effort + Cède en < 5 min au repos ou sous trinitrine.
- Douleur > 20 min résistante aux nitrés = Syndrome Coronarien Aigu (SCA / Infarctus) -> Appel SAMU 15.
- Douleur calmée en position assise penchée en avant = Péricardite aiguë.
- Douleur déchirante dorsale descendante + asymétrie des pouls = Dissection aortique aiguë.
- Toute douleur thoracique aiguë impose un **ECG 12 dérivations dans les 10 premières minutes**.`,
      pieges_cliniques_fr: `⚠️ **Pièges & Drapeaux Rouges Majeurs** :
- Une douleur thoracique soulagée par les dérivés nitrés n'exclut pas à 100 % un spasme œsophagien (qui peut aussi réagir aux nitrés).
- Chez le sujet diabétique, tout malaise inexpliqué ou essoufflement brutal doit faire réaliser un ECG immédiat pour éliminer un infarctus indolore.`,
      mnemonique: "P-I-E-D (Péricardite, Infarctus, Embolie, Dissection) & P-A-R-A-S-I-T-E pour l'interrogatoire de la douleur.",
      carte_mentale_json: JSON.stringify({
        title: "Arbre décisionnel : Douleur Thoracique Aiguë",
        nodes: [
          {
            label: "Douleur Thoracique Aiguë",
            children: [
              {
                label: "4 Urgences Vitales (PIED)",
                children: [
                  { label: "Péricardite (calmée assis penché en avant, frottement)" },
                  { label: "Infarctus / SCA (constriction > 20 min, irradiation bras/mâchoire)" },
                  { label: "Embolie Pulmonaire (dyspnée brutale, point de côté pleural)" },
                  { label: "Dissection Aortique (déchirante, dorsale descendante, asymétrie pouls)" },
                ],
              },
              {
                label: "Angor d'effort stable",
                children: [
                  { label: "Cède en < 5 min au repos ou sous trinitrine sublinguale" },
                ],
              },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 1.1
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        contexte_clinique: "Un homme de 58 ans décrit une douleur apparue en marchant rapidement par temps froid.",
        question_fr: "Quel est le siège et le caractère typique de la douleur coronarienne angineuse ?",
        options_json: JSON.stringify([
          { id: "A", text: "Rétrosternale constrictive (« en étau »)", is_correct: true },
          { id: "B", text: "Sous-mammaire gauche punctiforme", is_correct: false },
          { id: "C", text: "Abdominale épigastrique postprandiale", is_correct: false },
          { id: "D", text: "Latéro-thoracique droite rythmée par la toux", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La douleur angineuse typique est rétrosternale médiothoracique, constrictive (« en étau »), irradiant vers la mandibule et le membre supérieur gauche.",
        mnemonique_rappel: "Angor = Rétrosternal constrictif d'effort, cédant sous trinitrine en < 3 min.",
        reference: "[Coustet] Sémiologie médicale, p.48 ; [Bariéty] p.110",
        tags: "angor,douleur-thoracique,urgence",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "VRAI_FAUX",
        contexte_clinique: "Lors de l'interrogatoire d'une douleur thoracique :",
        question_fr: "Une douleur thoracique calmée rapidement par la prise de trinitrine sublinguale oriente fortement vers une ischémie myocardique.",
        options_json: JSON.stringify([
          { id: "true", text: "Vrai", is_correct: true },
          { id: "false", text: "Faux", is_correct: false },
        ]),
        reponse_correcte: "true",
        feedback_fr: "Vrai. La sédation de la douleur en moins de 2 à 3 minutes après trinitrine (test aux dérivés nitrés) est un argument sémiologique majeur.",
        mnemonique_rappel: "Test aux nitrés : positif en moins de 3 min si origine coronarienne.",
        reference: "[Bourdarias] Sémiologie cardiovasculaire, p.32",
        tags: "trinitrine,angor",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "CAS_CLINIQUE",
        contexte_clinique: "Un patient de 65 ans hypertendu décrit une douleur thoracique brutale, 'déchirante', irradiant dans le dos entre les omoplates et descendant vers les lombes.",
        question_fr: "Quel diagnostic d'extrême urgence devez-vous suspecter en priorité absolue ?",
        options_json: JSON.stringify([
          { id: "A", text: "Dissection aortique aiguë", is_correct: true },
          { id: "B", text: "Péricardite aiguë bénigne", is_correct: false },
          { id: "C", text: "Reflux gastro-œsophagien", is_correct: false },
          { id: "D", text: "Pneumothorax spontané", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La douleur à type de déchirure, débutant brutalement et migrant vers le dos et les lombes, est pathognomonique de la dissection de l'aorte thoracique.",
        mnemonique_rappel: "PIED : L'irradiation dorsale descendante signe la Dissection aortique !",
        reference: "[Bariéty / Capron] Sémiologie clinique, p.112",
        tags: "dissection-aortique,urgence",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque profil de douleur thoracique à sa caractéristique sémiologique :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Péricardite aiguë", match: "Calmée en position assise penché en avant" },
            { item: "Infarctus du myocarde", match: "Constriction > 20 min résistante aux nitrés" },
            { item: "Dissection aortique", match: "Irradiation descendante dorsale et lombaire" },
            { item: "Embolie pulmonaire", match: "Point de côté basi-thoracique avec dyspnée aiguë" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Péricardite aiguë": "Calmée en position assise penché en avant",
          "Infarctus du myocarde": "Constriction > 20 min résistante aux nitrés",
          "Dissection aortique": "Irradiation descendante dorsale et lombaire",
          "Embolie pulmonaire": "Point de côté basi-thoracique avec dyspnée aiguë",
        }),
        feedback_fr: "Ces 4 caractéristiques permettent d'orienter le diagnostic dès les premières minutes de l'interrogatoire.",
        reference: "[Coustet] p.50 ; [UNESS-Cardio] p.16",
        tags: "urgences,sémiologie",
      },
      {
        lesson_id: lesson1_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        contexte_clinique: "En sémiologie cardiologique basée sur les preuves :",
        question_fr: "Quel nom porte le signe où le patient décrit sa douleur en serrant son poing fermé contre son sternum ?",
        options_json: JSON.stringify([
          { id: "A", text: "Signe de Levine", is_correct: true },
          { id: "B", text: "Signe de Musset", is_correct: false },
          { id: "C", text: "Signe de Corrigan", is_correct: false },
          { id: "D", text: "Signe de Rivero-Carvallo", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe de Levine (poing serré sur le sternum) traduit la striction médiothoracique de l'ischémie myocardique [McGee Evidence-Based Physical Diagnosis p.320].",
        reference: "[McGee] Evidence-Based Physical Diagnosis, p.320",
        tags: "signe-levine,sémiologie,ischémie",
      },
    ],
  });

  // Leçon 1.2 : Dyspnée & Insuffisance Cardiaque
  const lesson1_2 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "dyspnee-cardiologique",
      nom_fr: "Dyspnée & Insuffisance Cardiaque",
      description_fr: "Classification NYHA et Killip, orthopnée, râles crépitants et signes de surcharge droite/gauche.",
      niveau_difficulte: 1,
      ordre_affichage: 2,
      xp_reward: 25,
      cours_intro_fr: "La dyspnée cardiaque est le témoin d'une élévation des pressions de remplissage ventriculaires. Elle se quantifie selon la classification NYHA et s'accompagne de signes d'insuffisance cardiaque gauche (poumons) ou droite (veines systémiques).",
      cours_detaille_fr: `### 1. Classification Fonctionnelle NYHA (New York Heart Association)
- **Stade I** : Aucune gêne lors des activités physiques ordinaires (dyspnée uniquement aux efforts intenses ou prolongés).
- **Stade II** : Limitation légère lors des efforts importants de la vie courante (ex: montée de plus de deux étages, marche rapide).
- **Stade III** : Limitation marquée lors des activités légères de la vie quotidienne (ex: marche à plat sur 100m, habillage).
- **Stade IV** : Incapacité d'accomplir le moindre effort sans inconfort, dyspnée présente **au repos**.

### 2. Signes Cardinaux d'Insuffisance Cardiaque Gauche (Surcharge pulmonaire)
- **Orthopnée** : Dyspnée en décubitus dorsal obligeant le patient à dormir le buste surélevé par plusieurs oreillers.
- **Dyspnée paroxystique nocturne (DPN)** : Réveils en suffocation nocturne après 2 à 4 heures de sommeil.
- **Râles crépitants alvéolaires** : Bruits fins en « frottement de mèches de cheveux », bilatéraux, symétriques, débutant aux bases et montant vers les sommets (« marée montante » dans l'OAP).
- **Bruit de galop protodiastolique (B3)** à l'apex : Traduit le remplissage passif rapide dans un VG dilaté et peu compliant.

### 3. Signes Cardinaux d'Insuffisance Cardiaque Droite (Surcharge veineuse systémique)
- **Turgescence jugulaire** spontanée à 45° et **Reflux hépato-jugulaire (RHJ / Signe de Rondot)** provoqué par une pression de 15 à 30 secondes sur le foie.
- **Hépatomégalie douloureuse** : Foie cardiaque lisse, à bord inférieur régulier, sensible à la palpation (« foie accordéon »).
- **Œdèmes des membres inférieurs** : Bilatéraux, déclives, blancs, mous, indolores et gardant le godet.
- **Signe de Kussmaul veineux** : Majoration paradoxale de la turgescence jugulaire à l'inspiration profonde (*Bates p.310*).`,
      cours_points_cles_fr: `- Orthopnée = Insuffisance cardiaque gauche (hyperpression capillaire pulmonaire).
- Signes droits = Turgescence jugulaire + Reflux hépato-jugulaire + Œdèmes à godet + Hépatomégalie douloureuse.
- NYHA 4 stades : I (Efforts intenses) -> II (Efforts modérés) -> III (Efforts légers) -> IV (Repos).
- Galop B3 = Rythme à 3 temps pathognomonique de la défaillance ventriculaire gauche.`,
      pieges_cliniques_fr: `⚠️ **Attention** :
- Des râles crépitants bilatéraux qui montent rapidement vers les sommets pulmonaires avec polypnée, sueurs et grésillement laryngé signent l'**Œdème Aigu du Poumon (OAP)** : urgence thérapeutique absolue.
- Ne pas confondre les œdèmes cardiaques (mous, blancs, bilatéraux prenant le godet) avec un œdème unilatéral inflammatoire de phlébite (rouge, chaud, douloureux).`,
      mnemonique: "NYHA : I (Intense) -> II (Moyen) -> III (Léger) -> IV (Repos).",
      carte_mentale_json: JSON.stringify({
        title: "Insuffisance Cardiaque : Cœur Gauche vs Cœur Droit",
        nodes: [
          {
            label: "Signes d'Insuffisance Cardiaque",
            children: [
              {
                label: "Cœur Gauche (Poumons)",
                children: [
                  { label: "Dyspnée d'effort (NYHA I-IV)" },
                  { label: "Orthopnée & Dyspnée nocturne (DPN)" },
                  { label: "Râles crépitants bilatéraux aux bases" },
                  { label: "Bruit de Galop gauche (B3)" },
                ],
              },
              {
                label: "Cœur Droit (Périphérie / Veines)",
                children: [
                  { label: "Turgescence jugulaire & Reflux hépato-jugulaire" },
                  { label: "Hépatomégalie douloureuse au reflux" },
                  { label: "Œdèmes des membres inférieurs (blancs, mous, godet)" },
                  { label: "Signe de Kussmaul veineux (inspiration)" },
                ],
              },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 1.2
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "ORDRE",
        question_fr: "Classez les stades de dyspnée selon la classification NYHA (de la moins sévère à la plus sévère) :",
        options_json: JSON.stringify({
          items: [
            "Stade I : Aucune limitation lors des activités physiques ordinaires",
            "Stade II : Limitation modérée lors des efforts importants",
            "Stade III : Limitation marquée lors des efforts de la vie quotidienne",
            "Stade IV : Incapacité d'effectuer le moindre effort, dyspnée au repos",
          ],
        }),
        reponse_correcte: JSON.stringify([
          "Stade I : Aucune limitation lors des activités physiques ordinaires",
          "Stade II : Limitation modérée lors des efforts importants",
          "Stade III : Limitation marquée lors des efforts de la vie quotidienne",
          "Stade IV : Incapacité d'effectuer le moindre effort, dyspnée au repos",
        ]),
        feedback_fr: "La classification NYHA comporte 4 stades cardinaux de sévérité croissante.",
        reference: "[Coustet] Sémiologie médicale, p.52 ; [UNESS-Cardio] p.38",
        tags: "NYHA,dyspnée",
      },
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        question_fr: "Comment qualifie-t-on une dyspnée survenant en position couchée et obligeant le patient à surélever sa tête par des oreillers ?",
        options_json: JSON.stringify([
          { id: "A", text: "Orthopnée", is_correct: true },
          { id: "B", text: "Platypnée", is_correct: false },
          { id: "C", text: "Trepopnée", is_correct: false },
          { id: "D", text: "Bradypnée expiratoire", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "L'orthopnée est la dyspnée de décubitus, hautement caractéristique de l'insuffisance ventriculaire gauche.",
        reference: "[Coustet] p.52 ; [Bates] Guide de l'examen clinique, p.290",
        tags: "orthopnée,sémiologie",
      },
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque signe clinique au côté du cœur principalement défaillant :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Râles crépitants pulmonaires bilatéraux", match: "Insuffisance cardiaque Gauche" },
            { item: "Orthopnée à 3 oreillers", match: "Insuffisance cardiaque Gauche" },
            { item: "Turgescence jugulaire & Reflux hépato-jugulaire", match: "Insuffisance cardiaque Droite" },
            { item: "Œdèmes des membres inférieurs prenant le godet", match: "Insuffisance cardiaque Droite" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Râles crépitants pulmonaires bilatéraux": "Insuffisance cardiaque Gauche",
          "Orthopnée à 3 oreillers": "Insuffisance cardiaque Gauche",
          "Turgescence jugulaire & Reflux hépato-jugulaire": "Insuffisance cardiaque Droite",
          "Œdèmes des membres inférieurs prenant le godet": "Insuffisance cardiaque Droite",
        }),
        feedback_fr: "Le cœur gauche retentit sur les poumons (crépitants, dyspnée), le cœur droit retentit sur la circulation veineuse périphérique (foie, jugulaires, membres inférieurs).",
        reference: "[Bariéty] p.120 ; [UNESS-Cardio] p.40",
        tags: "insuffisance-cardiaque,signes",
      },
      {
        lesson_id: lesson1_2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        contexte_clinique: "Lors de l'examen d'un patient en décompensation cardiaque globale :",
        question_fr: "Que traduit une augmentation paradoxale de la turgescence jugulaire lors de l'inspiration profonde (Signe de Kussmaul) ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une gêne au remplissage du ventricule droit (tamponnade, péricardite constrictive ou infarctus VD)", is_correct: true },
          { id: "B", text: "Une insuffisance mitrale aiguë par rupture de cordage", is_correct: false },
          { id: "C", text: "Un rétrécissement aortique serré calcifié", is_correct: false },
          { id: "D", text: "Une hypertension artérielle essentielle bien contrôlée", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le signe de Kussmaul veineux traduit l'incapacité des cavités droites à absorber l'augmentation inspiratoire normale du retour veineux [Bates p.310, McGee p.340].",
        reference: "[Bates] Guide de l'examen clinique, p.310 ; [McGee] p.340",
        tags: "kussmaul,turgescence,péricarde",
      },
    ],
  });

  // Leçon 1.3 : Palpitations, Syncopes & Lipothymies
  const lesson1_3 = await prisma.lesson.create({
    data: {
      module_id: module1.id,
      slug: "palpitations-et-syncope",
      nom_fr: "Palpitations, Syncopes & Lipothymies",
      description_fr: "Différencier malaise vagal bénin, lipothymie, crise d'épilepsie et syncope cardiologique à haut risque.",
      niveau_difficulte: 2,
      ordre_affichage: 3,
      xp_reward: 30,
      cours_intro_fr: "Une syncope est une perte de connaissance brève, à début rapide et récupération spontanée complète, causée par une hypoperfusion cérébrale globale transitoire.",
      cours_detaille_fr: `### 1. Définitions & Diagnostics Différentiels Clés
- **Syncope** : Perte de connaissance totale, brève (< 1 à 3 min), avec perte du tonus postural (chute) et retour rapide et complet à l'état de conscience antérieur sans confusion post-critique.
- **Lipothymie** : Sensation de perte de connaissance imminente (« voile noir », faiblesse extrême) sans perte de conscience complète.
- **Crise d'épilepsie généralisée** : Perte de connaissance plus prolongée, précédée parfois d'une aura, avec secousses cloniques synchrones, morsure du bord latéral de la langue, perte d'urines et **confusion post-critique prolongée (stertor)**.

### 2. Syncope Vasovagale vs Syncope Cardiaque
- **Malaise / Syncope Vasovagale (Bénigne)** : Sujet jeune, atmosphère confinée et chaude, station debout prolongée, douleur aiguë ou émotion. Précédée de **prodromes nets** (sueurs, nausées, pâleur, bâillements, vision trouble, acouphènes).
- **Syncope Cardiaque / Rythmique (Grave)** : Survenue brutale **SANS prodrome (« à l'emporte-pièce »)**, survenant à l'effort ou chez un patient avec cardiopathie connue. Risque élevé de mort subite.
- **Syndrome d'Adams-Stokes** : Syncope à l'emporte-pièce provoquée par un bloc auriculo-ventriculaire complet paroxystique avec pause ventriculaire prolongée.

### 3. Les 5 S de la Syncope Cardiaque Grave
- **S - Soudaine** : Chute instantanée sans prodrome.
- **S - Sans prodrome** : Absence de sueurs ou de nausées préalables.
- **S - Survenue à l'effort** : Évoque un rétrécissement aortique serré ou une cardiomyopathie hypertrophique (CMH).
- **S - Sujet cardiologique** : Antécédent d'infarctus, d'insuffisance cardiaque ou souffle connu.
- **S - Sommation ECG anormale** : Présence d'un bloc de branche, d'un intervalle PR allongé, d'un QT long ou d'un syndrome de Brugada.`,
      cours_points_cles_fr: `- Syncope = Perte de connaissance brève avec retour spontané complet sans confusion.
- Sans prodrome (« chute brutale ») ou survenant à l'effort = Syncope d'origine cardiaque suspecte jusqu'à preuve du contraire.
- Tout premier épisode de syncope impose un **ECG 12 dérivations systématique immédiat**.
- Morsure latérale de langue + confusion prolongée = Épilepsie (et non syncope).`,
      pieges_cliniques_fr: `⚠️ **Piège classique** : Une syncope prolongée (> 15 secondes) avec anoxie cérébrale peut s'accompagner de quelques secousses cloniques (myoclonies d'anoxie) : ne pas la confondre à tort avec une crise d'épilepsie !`,
      mnemonique: "5 S de la Syncope cardiaque : Soudaine, Sans prodrome, Survenue à l'effort, Sujet cardiologique, Sommation ECG anormale.",
      carte_mentale_json: JSON.stringify({
        title: "Orientation devant une Perte de Connaissance Brève",
        nodes: [
          {
            label: "Perte de Connaissance Brève",
            children: [
              {
                label: "Syncope Vagal (Bénigne)",
                children: [
                  { label: "Prodromes : Sueurs, pâleur, nausées, bâillements" },
                  { label: "Facteurs : Chaleur, émotion, station debout" },
                ],
              },
              {
                label: "Syncope Cardiaque (Urgence)",
                children: [
                  { label: "À l'emporte-pièce, SANS prodrome" },
                  { label: "Survenue à l'effort (Rétrécissement aortique, CMH)" },
                  { label: "ECG anormal (Troubles conductifs BAV, QT long, Brugada)" },
                ],
              },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 1.3
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson1_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        contexte_clinique: "Un homme de 72 ans fait une chute brutale sans aucun signe précurseur alors qu'il marchait dans sa cuisine. Il reprend conscience instantanément.",
        question_fr: "Quelle caractéristique doit faire suspecter une syncope d'origine cardiaque grave plutôt qu'un malaise vagal ?",
        options_json: JSON.stringify([
          { id: "A", text: "L'absence totale de prodromes (« syncope à l'emporte-pièce »)", is_correct: true },
          { id: "B", text: "La présence de nausées et de sueurs avant la chute", is_correct: false },
          { id: "C", text: "La survenue dans une pièce très chauffée", is_correct: false },
          { id: "D", text: "L'âge jeune du patient", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La survenue brutale sans aucun signe prémonitoire chez un patient âgé est très suspecte d'un trouble conductif paroxystique (BAV de haut degré / Adams-Stokes) ou d'un trouble du rythme ventriculaire.",
        mnemonique_rappel: "Syncope cardiaque : Soudaine, Sans prodrome -> Hospitalisation et ECG !",
        reference: "[Coustet] p.54 ; [Bariéty] p.135",
        tags: "syncope,malaise,cardio",
      },
      {
        lesson_id: lesson1_3.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "VRAI_FAUX",
        question_fr: "La réalisation d'un ECG 12 dérivations est systématique et obligatoire devant tout premier épisode de syncope.",
        options_json: JSON.stringify([
          { id: "true", text: "Vrai", is_correct: true },
          { id: "false", text: "Faux", is_correct: false },
        ]),
        reponse_correcte: "true",
        feedback_fr: "Vrai. L'ECG est l'examen pivot indispensable pour rechercher un trouble de conduction, un syndrome du QT long, un syndrome de Brugada ou des signes d'ischémie.",
        reference: "[UNESS-Cardio] p.52 ; [Coustet] p.54",
        tags: "ECG,syncope,recommandations",
      },
    ],
  });

  // ==========================================
  // MODULE 2 : EXAMEN CLINIQUE CARDIOVASCULAIRE
  // ==========================================
  console.log("📦 Module 2 : Examen clinique approfondi...");
  const module2 = await prisma.module.create({
    data: {
      slug: "cardio-examen-clinique",
      nom_fr: "Examen clinique cardiovasculaire",
      nom_en: "Cardiovascular Physical Examination",
      description_fr: "Maîtriser les 4 temps de l'examen : inspection, palpation des pouls, pression artérielle et auscultation.",
      systeme: "cardio",
      ordre_affichage: 2,
      icone: "Stethoscope",
      color: "emerald",
    },
  });

  // Leçon 2.1 : Organisation & Palpation
  const lesson2_1 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "organisation-inspection-palpation",
      nom_fr: "Organisation & Palpation des pouls",
      description_fr: "Recherche du choc de pointe, examen des pouls périphériques, tension artérielle bilatérale et manœuvres.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 25,
      cours_intro_fr: "L'examen cardiovasculaire physique est méthodique, bilatéral et comparatif. Il associe la prise de la pression artérielle aux deux bras, la palpation de l'ensemble des trajets artériels et la recherche de signes droits et gauches.",
      cours_detaille_fr: `### 1. Les 4 Temps de l'Examen Physique Cardiovasculaire
1. **Inspection générale** : Cyanose centrale (hypoxémie) vs périphérique, hippocratisme digital (ongles bombés en verre de montre), dépôts lipidiques cutanés (xanthélasmas aux paupières, arc cornéen / gérontoxon précoce).
2. **Palpation des pouls périphériques (bilatérale et comparative)** :
   - **Membres supérieurs** : Carotides (en dedans du SCOM, jamais comprimées simultanément), brachiaux, radiaux (gouttière radiale), cubitaux.
   - **Membres inférieurs** : Fémoraux (triangle de Scarpa / pli de l'aine), poplités (creux poplité genou fléchi), tibiaux postérieurs (en arrière de la malléole interne), pédieux (dos du pied).
3. **Anomalies du profil de l'onde pulsatile (*Jules Constant p.45, McGee p.350*)** :
   - **Pouls bondissant de Corrigan (celer et altus)** : Montée rapide et effondrement télédiastolique caractéristique de l'insuffisance aortique.
   - **Pouls parvus et tardus (petit et lent)** : Diminution de l'amplitude et retard de l'acmé dans le rétrécissement aortique serré.
   - **Pouls alternant** : Alternance d'un battement fort et d'un battement faible à rythme régulier (signe de faillite ventriculaire gauche sévère).
   - **Pouls paradoxal de Kussmaul** : Baisse de PAS > 10 mmHg à l'inspiration (tamponnade péricardique).
4. **Palpation précordiale** :
   - **Choc de pointe** : Palpé à l'apex (5e espace intercostal gauche, ligne médioclaviculaire). Dévié en bas et à gauche si cardiomégalie. Choc en dôme de Bard (soulèvement large et hyperdynamique) dans l'insuffisance aortique.
   - **Signe de Harzer** : Perception anormale des battements du VD sous l'appendice xiphoïde en inspiration.
   - **Frémissement cataire (thrill)** : Sensation tactile de vibration équivalente à un souffle cardiaque intense (>= 4/6).`,
      cours_points_cles_fr: `- Toujours palper les pouls de façon bilatérale et symétrique de haut en bas.
- L'abolition ou la diminution des pouls fémoraux chez l'adulte jeune évoque une coarctation aortique ; chez le sujet âgé, une artériopathie (AOMI).
- La pression artérielle se mesure aux deux bras au repos : une asymétrie > 20 mmHg est pathologique (dissection aortique, sténose sous-clavière).
- Pouls bondissant = Insuffisance aortique / Pouls lent et diminué = Rétrécissement aortique.`,
      pieges_cliniques_fr: `⚠️ **Règle absolue** : Ne jamais palper les deux artères carotides en même temps sous peine de déclencher une syncope vagale ou un arrêt cardiaque réflexe !`,
      mnemonique: "Pouls périphériques de haut en bas : Carotidien -> Brachial -> Radial -> Fémoral -> Poplité -> Tibial Postérieur -> Pédieux.",
      carte_mentale_json: JSON.stringify({
        title: "Organisation de l'Examen Physique Cardiovasculaire",
        nodes: [
          {
            label: "Examen Cardiovasculaire",
            children: [
              { label: "1. Inspection : Cyanose, hippocratisme, xanthélasmas, turgescence" },
              { label: "2. Palpation : Pouls bilatéraux + Profils (Corrigan, Parvus) + Choc de pointe + Harzer" },
              { label: "3. Pression Artérielle : Aux deux bras (asymétrie < 10 mmHg) + Orthostatisme" },
              { label: "4. Auscultation : 4 foyers APTM + Manœuvres dynamiques" },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 2.1
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "ORDRE",
        question_fr: "Remettez dans l'ordre chronologique les trajets de palpation des pouls de haut en bas :",
        options_json: JSON.stringify({
          items: [
            "Pouls carotidien",
            "Pouls radial",
            "Pouls fémoral",
            "Pouls poplité",
            "Pouls tibial postérieur et pédieux",
          ],
        }),
        reponse_correcte: JSON.stringify([
          "Pouls carotidien",
          "Pouls radial",
          "Pouls fémoral",
          "Pouls poplité",
          "Pouls tibial postérieur et pédieux",
        ]),
        feedback_fr: "La palpation méthodique s'effectue de haut en bas, toujours de manière bilatérale et comparative.",
        reference: "[Coustet] Sémiologie médicale, p.56 ; [Bariéty] p.124",
        tags: "pouls,examen-physique",
      },
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        question_fr: "Que traduit la perception d'un choc de pointe cardiaque dévié en bas et à gauche au 6ème espace intercostal sur la ligne axillaire antérieure ?",
        options_json: JSON.stringify([
          { id: "A", text: "Une dilatation et hypertrophie du ventricule gauche (cardiomégalie)", is_correct: true },
          { id: "B", text: "Une insuffisance respiratoire restrictive", is_correct: false },
          { id: "C", text: "Une tamponnade péricardique avec épanchement abondant", is_correct: false },
          { id: "D", text: "Une hypertension artérielle pulmonaire isolée", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le déplacement du choc de pointe en bas et à gauche est le signe clinique direct d'une cardiomégalie avec dilatation ventriculaire gauche.",
        reference: "[Bariéty] p.124 ; [Talley & O'Connor] p.58",
        tags: "choc-de-pointe,cardiomégalie",
      },
      {
        lesson_id: lesson2_1.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque profil de pouls artériel à sa cardiopathie d'origine :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Pouls bondissant de Corrigan (celer et altus)", match: "Insuffisance aortique volumineuse" },
            { item: "Pouls petit et lent (parvus et tardus)", match: "Rétrécissement aortique serré" },
            { item: "Pouls paradoxal de Kussmaul (baisse PAS > 10 mmHg)", match: "Tamponnade péricardique compressive" },
            { item: "Pouls alternant (battement fort puis faible)", match: "Insuffisance ventriculaire gauche sévère" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Pouls bondissant de Corrigan (celer et altus)": "Insuffisance aortique volumineuse",
          "Pouls petit et lent (parvus et tardus)": "Rétrécissement aortique serré",
          "Pouls paradoxal de Kussmaul (baisse PAS > 10 mmHg)": "Tamponnade péricardique compressive",
          "Pouls alternant (battement fort puis faible)": "Insuffisance ventriculaire gauche sévère",
        }),
        feedback_fr: "L'analyse palpatoire de la morphologie du pouls apporte des renseignements hémodynamiques essentiels [Jules Constant p.45, McGee p.350].",
        reference: "[Jules Constant] Essentials of Bedside Cardiology, p.45 ; [McGee] p.350",
        tags: "pouls,hémodynamique,auscultation",
      },
    ],
  });

  // Leçon 2.2 : Foyers d'Auscultation & Bruits fondamentaux
  const lesson2_2 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "foyers-auscultation-et-bruits",
      nom_fr: "Foyers d'auscultation & Bruits B1/B2/B3/B4",
      description_fr: "Repères anatomiques des 4 foyers APTM, genèse de B1/B2, dédoublements de B2 et bruits de galop.",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 30,
      cours_intro_fr: "L'auscultation cardiaque méthodique nécessite de positionner le stéthoscope sur 4 repères anatomiques cardinaux correspondant à la projection acoustique des valves.",
      cours_detaille_fr: `### 1. Les 4 Foyers Cardinaux d'Auscultation (Mnémotechnique APTM)
- **Foyer Aortique (A)** : 2e espace intercostal droit, au bord sternal droit.
- **Foyer Pulmonaire (P)** : 2e espace intercostal gauche, au bord sternal gauche.
- **Foyer Tricuspide (T)** : Au niveau de l'appendice xiphoïde (bas du sternum) ou 4e-5e espace bord sternal gauche.
- **Foyer Mitral / Apex (M)** : 5e espace intercostal gauche, sur la ligne médioclaviculaire (au niveau du choc de pointe).
- *(Foyer d'Erb / 2e foyer aortique : 3e espace intercostal gauche, idéal pour entendre le souffle diastolique d'insuffisance aortique).*

### 2. Physiologie des Bruits B1 et B2
- **B1 (« Toum »)** : Fermeture des valves atrio-ventriculaires (Mitrale M1 et Tricuspide T1). Marque le début de la **systole**. Synchrone de la pulsation carotidienne.
- **B2 (« Ta »)** : Fermeture des valves sigmoïdes (Aortique A2 et Pulmonaire P2). Marque la fin de la systole et le début de la **diastole**.

### 3. Les Dédoublements du Bruit B2 (*Jules Constant p.112, McGee p.370*)
- **Dédoublement physiologique** : À l'inspiration profonde, l'augmentation du retour veineux retarde la fermeture de la valve pulmonaire (A2-P2 distincts). Disparaît à l'expiration.
- **Dédoublement large et fixe** : Dédoublement constant et identique en inspiration et en expiration $\rightarrow$ **pathognomonique de la Communication Inter-Auriculaire (CIA)**.
- **Dédoublement paradoxal (inversé)** : Le B2 est dédoublé à l'expiration et fusionne à l'inspiration (retard de fermeture de la valve aortique A2 $\rightarrow$ Rétrécissement Aortique serré ou Bloc de Branche Gauche).

### 4. Bruits Surajoutés (B3, B4, Clics et Claquements)
- **Galop B3 (protodiastolique)** : Bruit sourd de remplissage ventriculaire passif rapide $\rightarrow$ Insuffisance cardiaque avec VG dilaté.
- **Galop B4 (télédiastolique / présystolique)** : Bruit de contraction atriale puissante contre un VG rigide $\rightarrow$ Hypertrophie VG (HTA, cardiomyopathie).
- **Clic d'éjection protosystolique** : Bicuspidie aortique.
- **Claquement d'ouverture mitrale (COM)** : Rétrécissement mitral (précède le roulement diastolique).`,
      cours_points_cles_fr: `- Mnémotechnique des foyers : A-P-T-M (Aorte, Pulmonaire, Tricuspide, Mitrale).
- B1 = Fermeture mitro-tricuspide (Début systole). B2 = Fermeture aorto-pulmonaire (Fin systole).
- Dédoublement large et fixe de B2 = CIA.
- Galop B3 = Défaillance systolique VG / Galop B4 = Rigidité et hypertrophie VG.`,
      pieges_cliniques_fr: `⚠️ Toujours palper le pouls radial ou carotidien en auscultant : le bruit B1 est strictement synchrone de la montée de l'onde pulsatile !`,
      mnemonique: "A-P-T-M : Aortique (2e Droit), Pulmonaire (2e Gauche), Tricuspide (Xiphoïde), Mitral (5e Apex).",
      carte_mentale_json: JSON.stringify({
        title: "Foyers et Cycle Auscultatoire",
        nodes: [
          {
            label: "Auscultation Cardiaque",
            children: [
              { label: "Foyer Aortique (2e EIC Droit)" },
              { label: "Foyer Pulmonaire (2e EIC Gauche)" },
              { label: "Foyer Tricuspide (Appendice Xiphoïde)" },
              { label: "Foyer Mitral (Apex - 5e EIC Gauche LMC)" },
              { label: "B1 (Fermeture AV) -> Systole -> B2 (Fermeture Sigmoïdes) -> Diastole (B3/B4)" },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 2.2
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "ASSOCIATION",
        contexte_clinique: "Repérage anatomique au lit du malade :",
        question_fr: "Associez chaque foyer d'auscultation cardiaque à son repère anatomique précis :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Foyer Aortique", match: "2ème espace intercostal droit, bord sternal" },
            { item: "Foyer Pulmonaire", match: "2ème espace intercostal gauche, bord sternal" },
            { item: "Foyer Mitral (apex)", match: "5ème espace intercostal gauche, ligne médioclaviculaire" },
            { item: "Foyer Tricuspide", match: "Bas du sternum / appendice xiphoïde" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Foyer Aortique": "2ème espace intercostal droit, bord sternal",
          "Foyer Pulmonaire": "2ème espace intercostal gauche, bord sternal",
          "Foyer Mitral (apex)": "5ème espace intercostal gauche, ligne médioclaviculaire",
          "Foyer Tricuspide": "Bas du sternum / appendice xiphoïde",
        }),
        feedback_fr: "Moyen mnémotechnique classique : A-P-T-M (Aortique 2e EIC droit, Pulmonaire 2e EIC gauche, Tricuspide xiphoïde, Mitral apex 5e EIC gauche).",
        mnemonique_rappel: "A-P-T-M : Aortique (2e droit) -> Pulmonaire (2e gauche) -> Tricuspide (xiphoïde) -> Mitral (5e gauche).",
        reference: "[Talley & O'Connor] Examen clinique et sémiologie, p.62 ; [Coustet] p.60",
        tags: "auscultation,foyers,anatomie",
      },
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        question_fr: "À quel événement mécanique du cycle cardiaque correspond physiologiquement le premier bruit du cœur (B1) ?",
        options_json: JSON.stringify([
          { id: "A", text: "Fermeture des valves atrio-ventriculaires (mitrale et tricuspide)", is_correct: true },
          { id: "B", text: "Fermeture des valves sigmoïdes (aortique et pulmonaire)", is_correct: false },
          { id: "C", text: "Ouverture brutale de la valve aortique en systole", is_correct: false },
          { id: "D", text: "Remplissage ventriculaire passif rapide", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "B1 marque le début de la systole ventriculaire et correspond à la fermeture des valves mitrale et tricuspide. B2 correspond à la fermeture des valves sigmoïdes aortique et pulmonaire.",
        reference: "[Bourdarias] p.44 ; [UNESS-Cardio] p.22",
        tags: "bruits-cardiaques,B1,B2",
      },
      {
        lesson_id: lesson2_2.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        question_fr: "La découverte d'un dédoublement large et FIXE du deuxième bruit cardiaque (B2) au foyer pulmonaire est pathognomonique de quelle anomalie ?",
        options_json: JSON.stringify([
          { id: "A", text: "Communication Inter-Auriculaire (CIA)", is_correct: true },
          { id: "B", text: "Rétrécissement aortique serré calcifié", is_correct: false },
          { id: "C", text: "Insuffisance mitrale aiguë", is_correct: false },
          { id: "D", text: "Péricardite aiguë constrictive", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le shunt gauche-droite auriculaire maintient un débit pulmonaire élevé constant insensible aux variations respiratoires, créant un dédoublement fixe de B2 [Jules Constant p.112].",
        reference: "[Jules Constant] Essentials of Bedside Cardiology, p.112 ; [Coustet] p.62",
        tags: "B2,dédoublement,CIA",
      },
    ],
  });

  // Leçon 2.3 : Souffles Cardiaques fondamentaux
  const lesson2_3 = await prisma.lesson.create({
    data: {
      module_id: module2.id,
      slug: "souffles-cardiaques-fondamentaux",
      nom_fr: "Souffles cardiaques & Manœuvres dynamiques",
      description_fr: "Différencier souffles systoliques et diastoliques, intensité de Levine et manœuvres auscultatoires.",
      niveau_difficulte: 3,
      ordre_affichage: 3,
      xp_reward: 35,
      cours_intro_fr: "Un souffle cardiaque résulte d'un écoulement sanguin turbulent à travers un orifice valvulaire rétréci ou fuyant. Sa caractérisation repose sur sa chronologie, son foyer maximal, son irradiation, son timbre et sa réaction aux manœuvres dynamiques.",
      cours_detaille_fr: `### 1. Les Souffles Systoliques (Entre B1 et B2)
- **Rétrécissement Aortique (RA)** : Souffle méso-systolique éjectionnel, rude et râpeux, en losange (*crescendo-decrescendo*), maximum au foyer aortique (2e EIC droit), **irradiant vers les carotides**. Diminution ou abolition du B2 si rétrécissement serré.
- **Insuffisance Mitrale (IM)** : Souffle holosystolique (couvrant toute la systole), doux, « en jet de vapeur », maximum à l'apex (foyer mitral), **irradiant vers l'aisselle gauche**.
- **Cardiomyopathie Hypertrophique Obstructive (CMHO)** : Souffle méso-systolique éjectionnel parasternal gauche augmentant lors de la manœuvre de Valsalva.

### 2. Les Souffles Diastoliques (Entre B2 et le B1 suivant - Toujours Pathologiques)
- **Insuffisance Aortique (IA)** : Souffle holodiastolique doux, lointain, « humé », maximum au foyer aortique et au bord sternal gauche (foyer d'Erb), irradiant vers l'appendice xiphoïde. Signes d'hyperpulsatilité : signe de Musset (hochements de tête), pouls de Corrigan, double souffle crural de Duroziez.
- **Rétrécissement Mitral (RM)** : Roulement diastolique sourd et grave au foyer mitral avec éclat du B1 et claquement d'ouverture mitrale (triade de Duroziez).

### 3. Les Manœuvres Dynamiques Auscultatoires (*Jules Constant p.140, Bates p.325*)
- **Manœuvre de Rivero-Carvallo (Inspiration profonde)** : Augmente le retour veineux droit $\rightarrow$ **augmente tous les souffles du cœur droit** (Insuffisance tricuspide, sténose pulmonaire).
- **Manœuvre de Valsalva / Passage debout** : Diminue le retour veineux et le volume ventriculaire $\rightarrow$ **diminue la majorité des souffles**, mais **AUGMENTE le souffle de CMHO** et avance le clic du prolapsus mitral (Syndrome de Barlow).
- **Squatting / Accroupissement** : Augmente le retour veineux et la postcharge $\rightarrow$ augmente les souffles de RA et d'IA, diminue le souffle de CMHO.`,
      cours_points_cles_fr: `- Souffle râpeux au 2e EIC droit irradiant aux carotides = Rétrécissement Aortique (RA).
- Souffle en jet de vapeur à l'apex irradiant à l'aisselle = Insuffisance Mitrale (IM).
- **Règle d'or** : Tout souffle diastolique est TOUJOURS organique et pathologique.
- Manœuvre de Rivero-Carvallo (inspiration) = majore les souffles droits.
- Intensité >= 4/6 = présence d'un frémissement palpable.`,
      pieges_cliniques_fr: `⚠️ **Attention** : L'intensité d'un souffle aortique ne reflète pas toujours sa sévérité ! En cas d'insuffisance cardiaque sévère à bas débit, un rétrécissement aortique très serré peut n'avoir qu'un souffle discret (1/6 ou 2/6).`,
      mnemonique: "RA = Carotides (Râpeux) / IM = Aisselle (Jet de vapeur). Valsalva augmente la CMHO. Rivero-Carvallo augmente le cœur droit.",
      carte_mentale_json: JSON.stringify({
        title: "Classification des Souffles & Manœuvres",
        nodes: [
          {
            label: "Souffles Cardiaques",
            children: [
              {
                label: "Systoliques (Entre B1 et B2)",
                children: [
                  { label: "Rétrécissement Aortique : 2e EIC Droit -> Carotides (Râpeux)" },
                  { label: "Insuffisance Mitrale : Apex -> Aisselle (Jet de vapeur)" },
                  { label: "CMHO : Parasternal gauche, majoré au Valsalva" },
                ],
              },
              {
                label: "Diastoliques (Entre B2 et B1) - Toujours pathologiques",
                children: [
                  { label: "Insuffisance Aortique : Bord sternal gauche (Doux, humé)" },
                  { label: "Rétrécissement Mitral : Apex (Roulement diastolique)" },
                ],
              },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 2.3
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "CAS_CLINIQUE",
        contexte_clinique: "Un homme de 78 ans consulte pour un essoufflement d'effort. L'auscultation retrouve un souffle systolique rude, râpeux, prédominant au 2e espace intercostal droit et irradiant vers les carotides.",
        question_fr: "Quel est le diagnostic valvulaire le plus probable ?",
        options_json: JSON.stringify([
          { id: "A", text: "Rétrécissement aortique calcifié (maladie de Mönckeberg)", is_correct: true },
          { id: "B", text: "Insuffisance mitrale dégénérative", is_correct: false },
          { id: "C", text: "Insuffisance aortique dystrophique", is_correct: false },
          { id: "D", text: "Communication inter-auriculaire", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Le souffle méso-systolique éjectionnel, râpeux au foyer aortique avec irradiation aux carotides chez le sujet âgé est pathognomonique du rétrécissement aortique.",
        mnemonique_rappel: "RA = Foyer Aortique + Râpeux + Irradiation carotides.",
        reference: "[Bourdarias] p.68 ; [UNESS-Cardio] p.60",
        tags: "souffles,valvulopathies,rétrécissement-aortique",
      },
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "VRAI_FAUX",
        question_fr: "Un souffle cardiaque diastolique peut être tout à fait anorganique (souffle fonctionnel ou innocent de l'enfant/adulte jeune).",
        options_json: JSON.stringify([
          { id: "true", text: "Vrai", is_correct: false },
          { id: "false", text: "Faux", is_correct: true },
        ]),
        reponse_correcte: "false",
        feedback_fr: "Faux. Un souffle fonctionnel/innocent est STRICTEMENT systolique. Un souffle diastolique est TOUJOURS organique et pathologique.",
        reference: "[Coustet] p.65 ; [UNESS-Cardio] p.62",
        tags: "souffle-diastolique,règle-or",
      },
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque valvulopathie à la zone d'irradiation caractéristique de son souffle :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Rétrécissement Aortique", match: "Irradiation vers les artères carotides" },
            { item: "Insuffisance Mitrale", match: "Irradiation vers le creux axillaire gauche" },
            { item: "Insuffisance Aortique", match: "Irradiation le long du bord gauche du sternum" },
            { item: "Insuffisance Tricuspide", match: "Majoration à l'inspiration profonde (signe de Rivero-Carvallo)" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Rétrécissement Aortique": "Irradiation vers les artères carotides",
          "Insuffisance Mitrale": "Irradiation vers le creux axillaire gauche",
          "Insuffisance Aortique": "Irradiation le long du bord gauche du sternum",
          "Insuffisance Tricuspide": "Majoration à l'inspiration profonde (signe de Rivero-Carvallo)",
        }),
        feedback_fr: "L'irradiation et la manœuvre inspiratoire permettent d'identifier formellement la valve en cause.",
        reference: "[Talley & O'Connor] p.70 ; [Bariéty] p.128",
        tags: "irradiations,souffles",
      },
      {
        lesson_id: lesson2_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        contexte_clinique: "Lors de l'examen auscultatoire d'un patient jeune présentant un souffle méso-systolique :",
        question_fr: "Quelle manœuvre auscultatoire permet d'augmenter spécifiquement le souffle d'une Cardiomyopathie Hypertrophique Obstructive (CMHO) en diminuant le remplissage ventriculaire ?",
        options_json: JSON.stringify([
          { id: "A", text: "La manœuvre de Valsalva ou le passage en orthostatisme", is_correct: true },
          { id: "B", text: "L'accroupissement prolongé (Squatting)", is_correct: false },
          { id: "C", text: "L'inspiration profonde bloquée (Rivero-Carvallo)", is_correct: false },
          { id: "D", text: "L'élévation passive des jambes en décubitus", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "La manœuvre de Valsalva diminue le retour veineux, ce qui réduit le calibre de la chambre de chasse ventriculaire et majore l'obstacle dynamique dans la CMHO [Jules Constant p.140, Bates p.325].",
        reference: "[Jules Constant] Essentials of Bedside Cardiology, p.140 ; [Bates] p.325",
        tags: "manoeuvres,valsalva,CMHO",
      },
    ],
  });

  // ==========================================
  // MODULE 3 : EXAMENS COMPLÉMENTAIRES CARDIO
  // ==========================================
  console.log("📦 Module 3 : Examens complémentaires approfondis...");
  const module3 = await prisma.module.create({
    data: {
      slug: "cardio-examens-complementaires",
      nom_fr: "Examens complémentaires cardio",
      nom_en: "Cardiovascular Diagnostic Tests",
      description_fr: "Comprendre le rôle, les indications et la pertinence de l'ECG, de la radio de thorax, des biomarqueurs et de l'échocardiographie.",
      systeme: "cardio",
      ordre_affichage: 3,
      icone: "Activity",
      color: "sky",
    },
  });

  // Leçon 3.1 : ECG Fondamentaux
  const lesson3_1 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "ecg-principes-indications",
      nom_fr: "Électrocardiogramme (ECG) : Fondamentaux",
      description_fr: "Les 12 dérivations, repères temporels, étalonnage standard et analyse méthodique du tracé.",
      niveau_difficulte: 1,
      ordre_affichage: 1,
      xp_reward: 25,
      cours_intro_fr: "L'ECG 12 dérivations est l'examen complémentaire de base en cardiologie. Il enregistre l'activité électrique du myocarde sur du papier millimétré à vitesse et voltage standardisés.",
      cours_detaille_fr: `### 1. Paramètres d'Étalonnage Standard
- **Vitesse de défilement** : **25 mm/s**.
  - $1 \\text{ mm} = 0{,}04 \\text{ seconde (40 ms)}$.
  - $5 \\text{ mm (1 grand carreau)} = 0{,}20 \\text{ seconde (200 ms)}$.
- **Voltage / Amplitude** : **10 mm/mV**.
  - $1 \\text{ mm} = 0{,}1 \\text{ mV}$.
  - $10 \\text{ mm (2 grands carreaux)} = 1 \\text{ mV}$.

### 2. Les 12 Dérivations & Topographie Myocardique
- **6 dérivations frontales (périphériques)** :
  - DI, aVL : Paroi latérale haute.
  - DII, DIII, aVF : Paroi inférieure (diaphragmatique).
  - aVR : Cavité ventriculaire droite (dérivation inversée).
- **6 dérivations précordiales (horizontales)** :
  - **V1 - V2** : Paroi septale (V1 au 4e EIC droit, V2 au 4e EIC gauche).
  - **V3 - V4** : Paroi antérieure (V4 au 5e EIC ligne médioclaviculaire).
  - **V5 - V6** : Paroi latérale basse (5e EIC lignes axillaires antérieure et moyenne).
  - *(Dérivations complémentaires : V7-V8-V9 territoire postérieur / basal ; V3R-V4R ventricule droit).*

### 3. Les Ondes et Intervalles Normaux
- **Onde P** : Dépolarisation des oreillettes (durée < 120 ms, amplitude < 2,5 mm en DII).
- **Intervalle PR** : Temps de conduction auriculo-ventriculaire (normal entre 120 et 200 ms = 3 à 5 petits carreaux).
- **Complexe QRS** : Dépolarisation des ventricules (durée normale < 80 à 100 ms).
- **Segment ST et Onde T** : Repolarisation ventriculaire (le segment ST doit être rigoureusement isoélectrique).`,
      cours_points_cles_fr: `- Vitesse 25 mm/s -> 1 petit carreau = 0,04 s (40 ms). 1 grand carreau = 0,20 s (200 ms).
- Rythme sinusal normal = Onde P positive en DII, constante, suivie à chaque fois d'un complexe QRS fin.
- Un sus-décalage du segment ST persistant convexe vers le haut signe un syndrome coronarien aigu avec sus-décalage (STEMI / Onde de Pardee).`,
      pieges_cliniques_fr: `⚠️ Toujours vérifier l'étalonnage en début de tracé : une vitesse de 50 mm/s doublerait artificiellement la durée apparente de tous les intervalles !`,
      mnemonique: "P (Oreillettes) -> PR (Conduction AV) -> QRS (Ventricules) -> T (Repolarisation).",
      carte_mentale_json: JSON.stringify({
        title: "Analyse Méthodique de l'ECG",
        nodes: [
          {
            label: "Lecture Méthodique de l'ECG",
            children: [
              { label: "1. Étalonnage : Vitesse 25 mm/s, Amplitude 10 mm/mV" },
              { label: "2. Rythme : Sinusal ou non (Onde P avant chaque QRS)" },
              { label: "3. Fréquence : 300 / nombre de grands carreaux RR (Normale : 60-100 bpm)" },
              { label: "4. Intervalles : PR (120-200 ms), QRS (< 100 ms), QTc (< 440 ms)" },
              { label: "5. Repolarisation : Segment ST (isoélectrique) et onde T" },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 3.1
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_1.id,
        systeme: "cardio",
        niveau_difficulte: 1,
        type_question: "QCM",
        question_fr: "À la vitesse d'enregistrement standard de l'ECG (25 mm/s), quelle est la valeur temporelle d'un petit carreau de 1 mm ?",
        options_json: JSON.stringify([
          { id: "A", text: "0,04 seconde (40 millisecondes)", is_correct: true },
          { id: "B", text: "0,10 seconde (100 millisecondes)", is_correct: false },
          { id: "C", text: "0,20 seconde (200 millisecondes)", is_correct: false },
          { id: "D", text: "0,01 seconde (10 millisecondes)", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "À 25 mm/s : 1 mm = 0,04 s (40 ms). Un grand carreau de 5 mm correspond à 0,20 s (200 ms).",
        reference: "[UNESS-Cardio] ECG normal et pathologique, p.8 ; [Coustet] p.75",
        tags: "ECG,étalonnage,paramètres",
      },
      {
        lesson_id: lesson3_1.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque groupe de dérivations précordiales au territoire myocardique exploré :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Dérivations V1 - V2", match: "Territoire Septal / Ventricule droit" },
            { item: "Dérivations V3 - V4", match: "Territoire Antérieur" },
            { item: "Dérivations V5 - V6", match: "Territoire Latéral bas / Apex" },
            { item: "Dérivations DII, DIII, aVF", match: "Territoire Inférieur (diaphragmatique)" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Dérivations V1 - V2": "Territoire Septal / Ventricule droit",
          "Dérivations V3 - V4": "Territoire Antérieur",
          "Dérivations V5 - V6": "Territoire Latéral bas / Apex",
          "Dérivations DII, DIII, aVF": "Territoire Inférieur (diaphragmatique)",
        }),
        feedback_fr: "La topographie des dérivations permet de localiser avec précision le territoire d'une ischémie coronarienne.",
        reference: "[UNESS-Cardio] p.10 ; [Coustet] p.78",
        tags: "dérivations,territoires,ECG",
      },
    ],
  });

  // Leçon 3.2 : Radio & Biomarqueurs
  const lesson3_2 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "radio-thorax-et-biomarqueurs",
      nom_fr: "Radiographie & Biomarqueurs (Troponine, BNP)",
      description_fr: "Index cardiothoracique, signes radiologiques d'OAP, Troponine ultrasensible et peptides natriurétiques.",
      niveau_difficulte: 2,
      ordre_affichage: 2,
      xp_reward: 30,
      cours_intro_fr: "La radiographie thoracique et les biomarqueurs sanguins (Troponine, BNP/NT-proBNP, D-Dimères) complètent l'examen clinique pour confirmer l'insuffisance cardiaque, l'ischémie ou la maladie thromboembolique.",
      cours_detaille_fr: `### 1. La Radiographie Thoracique (Face debout)
- **Index Cardio-Thoracique (ICT)** : Rapport $\\frac{\\text{Diamètre transversal du cœur}}{\\text{Diamètre transversal du thorax}}$.
  - Normal $\\le 0{,}50$ chez l'adulte debout.
  - **ICT $> 0{,}50$ = Cardiomégalie**.
- **Signes Radiologiques de Surcharge Pulmonaire (Stades hémodynamiques)** :
  - **Stade 1 ($PCP 13-18\\text{ mmHg}$)** : Redistribution vasculaire vers les sommets (inversion du rapport apex/base).
  - **Stade 2 ($PCP 18-25\\text{ mmHg}$)** : Œdème interstitiel avec lignes B de Kerley aux bases et flou péri-broncho-vasculaire.
  - **Stade 3 ($PCP > 25\\text{ mmHg}$)** : Œdème alvéolaire avec opacités floues bilatérales péri-hilaires « en ailes de papillon ».

### 2. Les Biomarqueurs Cardiovasculaires Clés
- **Troponine I ou T ultrasensible (us)** : Marqueur d'extrême sensibilité de **nécrose myocardique**. Indispensable pour le diagnostic de syndrome coronarien aigu (SCA).
- **BNP / NT-proBNP** : Peptides natriurétiques sécrétés par les ventricules en réponse à l'étirement et à l'hyperpression. Excellente valeur prédictive négative ($> 98\\%$) pour **exclure une insuffisance cardiaque** si BNP $< 100\\text{ pg/mL}$ ou NT-proBNP $< 300\\text{ pg/mL}$.
- **D-Dimères** : Produits de dégradation de la fibrine. Valeur prédictive négative très élevée ($> 99\\%$) pour **exclure une embolie pulmonaire** si $< 500\\text{ ng/mL}$.`,
      cours_points_cles_fr: `- ICT $> 0{,}50$ = Cardiomégalie.
- Opacités en ailes de papillon + crépitants = Œdème Aigu du Poumon (OAP).
- Troponine = Nécrose myocardique / Infarctus.
- BNP/NT-proBNP = Pression de remplissage / Insuffisance cardiaque.
- D-Dimères $< 500$ ng/mL = Élimine l'embolie pulmonaire chez le sujet à probabilité faible/intermédiaire.`,
      pieges_cliniques_fr: `⚠️ La troponine peut s'élever en dehors de l'infarctus (ex: myocardite, embolie pulmonaire, insuffisance rénale sévère, sepsis). C'est la cinétique (ascension puis décroissance) qui signe le SCA aigu !`,
      mnemonique: "Troponine = Nécrose / BNP = Pression & Surcharge / D-Dimères = Exclusion Thrombose.",
      carte_mentale_json: JSON.stringify({
        title: "Biomarqueurs & Radiographie Cardiaque",
        nodes: [
          {
            label: "Examens Paracliniques Rapides",
            children: [
              { label: "Radiographie Thorax : ICT > 0.50 (Cardiomégalie) + Ailes de papillon (OAP)" },
              { label: "Troponine us : Élévation et cinétique de nécrose (Infarctus, Myocardite)" },
              { label: "BNP / NT-proBNP : Élévation en cas de décompensation cardiaque" },
              { label: "D-Dimères : Si < 500 ng/mL -> exclusion de l'embolie pulmonaire" },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 3.2
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "QCM",
        question_fr: "Sur une radiographie thoracique de face chez un adulte debout, à partir de quelle valeur de l'index cardio-thoracique (ICT) définit-on une cardiomégalie ?",
        options_json: JSON.stringify([
          { id: "A", text: "ICT supérieur à 0,50 (50 %)", is_correct: true },
          { id: "B", text: "ICT supérieur à 0,35 (35 %)", is_correct: false },
          { id: "C", text: "ICT supérieur à 0,70 (70 %)", is_correct: false },
          { id: "D", text: "ICT supérieur à 0,20 (20 %)", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Chez l'adulte debout, le rapport diamètre cardiaque / diamètre thoracique est normalement inférieur ou égal à 0,50. Au-delà, on parle de cardiomégalie.",
        reference: "[Coustet] p.82 ; [UNESS-Cardio] p.28",
        tags: "ICT,radiographie,cardiomégalie",
      },
      {
        lesson_id: lesson3_2.id,
        systeme: "cardio",
        niveau_difficulte: 2,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque biomarqueur sanguin à sa principale valeur d'utilisation en pratique clinique :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Troponine I ou T ultrasensible", match: "Marqueur de nécrose myocardique aiguë (SCA)" },
            { item: "BNP ou NT-proBNP", match: "Marqueur d'étirement myocardique et d'insuffisance cardiaque" },
            { item: "D-Dimères (< 500 ng/mL)", match: "Exclusion d'une maladie thromboembolique veineuse" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Troponine I ou T ultrasensible": "Marqueur de nécrose myocardique aiguë (SCA)",
          "BNP ou NT-proBNP": "Marqueur d'étirement myocardique et d'insuffisance cardiaque",
          "D-Dimères (< 500 ng/mL)": "Exclusion d'une maladie thromboembolique veineuse",
        }),
        feedback_fr: "Ces trois biomarqueurs constituent le bilan biologique d'urgence en cardiologie.",
        reference: "[UNESS-Cardio] p.30 ; [Coustet] p.80",
        tags: "biomarqueurs,troponine,BNP",
      },
    ],
  });

  // Leçon 3.3 : Échocardiographie Doppler
  const lesson3_3 = await prisma.lesson.create({
    data: {
      module_id: module3.id,
      slug: "echocardiographie-doppler",
      nom_fr: "Échocardiographie Doppler & Explorations",
      description_fr: "Indications de l'ETT et de l'ETO, mesure de la FEVG, gradients valvulaires et péricarde.",
      niveau_difficulte: 3,
      ordre_affichage: 3,
      xp_reward: 35,
      cours_intro_fr: "L'échocardiographie-Doppler transthoracique (ETT) est l'examen morphologique et hémodynamique cardiaque de référence. Non invasive et réalisable au lit du malade, elle évalue la structure, la contractilité et les flux valvulaires.",
      cours_detaille_fr: `### 1. Échocardiographie Transthoracique (ETT) vs Transœsophagienne (ETO)
- **ETT (1ère intention non invasive)** : Réalisée par sonde posée sur le thorax (vues parasternale grand axe/petit axe, apicale 4/5/2 cavités, sous-costale). Évalue la taille des cavités, l'épaisseur des parois, la contractilité globale et les flux valvulaires.
- **ETO (2ème intention invasive)** : Sonde endoscopique introduite dans l'œsophage. Excellente visualisation des oreillettes (recherche de thrombus dans l'auricule gauche avant cardioversion de FA), des valves natives/prothétiques (recherche de végétations d'endocardite infectieuse) et de l'aorte thoracique (dissection).

### 2. Paramètres Clés Mesurés à l'Échocardiographie
- **Fraction d'Éjection du Ventricule Gauche (FEVG)** :
  - **Normale : $\\ge 50\\%$**.
  - Altération modérée : $40 - 49\\%$.
  - Altération sévère : $< 40\\%$ (Insuffisance cardiaque à fraction d'éjection réduite IC-FEr).
- **Doppler cardiaque** : Mesure la vitesse des flux sanguins pour quantifier les sténoses (gradients de pression via l'équation de Bernoulli $\\Delta P = 4v^2$) et les régurgitations (volume régurgité).
- **Péricarde** : Visualisation immédiate d'un décollement liquidien péricardique (épanchement ou tamponnade avec compression des cavités droites).`,
      cours_points_cles_fr: `- FEVG normale $\\ge 50\\%$.
- ETT = Examen de 1ère intention pour tout souffle ou suspicion d'insuffisance cardiaque.
- ETO = Indiquée pour la recherche d'endocardite infectieuse, de thrombus intracardiaque ou de dissection aortique.
- Échocardiographie au lit du malade = Examen clé d'urgence dans le choc cardiogénique et la tamponnade.`,
      pieges_cliniques_fr: `⚠️ Une FEVG normale n'élimine pas une insuffisance cardiaque ! Il peut s'agir d'une **Insuffisance Cardiaque à Fraction d'Éjection Préservée (IC-FEp)** par anomalie du remplissage diastolique (ventricule rigide).`,
      mnemonique: "ETT (Partout / 1ère intention) vs ETO (Œsophage / Zoom sur valves, auricules et endocardite).",
      carte_mentale_json: JSON.stringify({
        title: "Échocardiographie Doppler en Pratique",
        nodes: [
          {
            label: "Échocardiographie Cardiaque",
            children: [
              {
                label: "ETT (Transthoracique)",
                children: [
                  { label: "FEVG (Normale >= 50 %)" },
                  { label: "Épaisseur des parois & Diamètres cavités" },
                  { label: "Doppler : Fuites et sténoses valvulaires" },
                  { label: "Péricarde : Épanchement / Tamponnade" },
                ],
              },
              {
                label: "ETO (Transœsophagienne)",
                children: [
                  { label: "Végétations d'endocardite infectieuse" },
                  { label: "Thrombus de l'auricule gauche (FA)" },
                  { label: "Dissection de l'aorte thoracique" },
                ],
              },
            ],
          },
        ],
      }),
    },
  });

  // Cartes Leçon 3.3
  await prisma.card.createMany({
    data: [
      {
        lesson_id: lesson3_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "QCM",
        question_fr: "En échocardiographie-Doppler, quelle est la valeur seuil normale de la Fraction d'Éjection du Ventricule Gauche (FEVG) chez l'adulte ?",
        options_json: JSON.stringify([
          { id: "A", text: "Supérieure ou égale à 50 %", is_correct: true },
          { id: "B", text: "Supérieure ou égale à 75 %", is_correct: false },
          { id: "C", text: "Supérieure ou égale à 30 %", is_correct: false },
          { id: "D", text: "Exactement 100 %", is_correct: false },
        ]),
        reponse_correcte: "A",
        feedback_fr: "Une FEVG normale est supérieure ou égale à 50 %. Une valeur inférieure à 40 % définit l'insuffisance cardiaque à fraction d'éjection altérée.",
        reference: "[UNESS-Cardio] p.34 ; [Bourdarias] p.90",
        tags: "FEVG,échocardiographie,normes",
      },
      {
        lesson_id: lesson3_3.id,
        systeme: "cardio",
        niveau_difficulte: 3,
        type_question: "ASSOCIATION",
        question_fr: "Associez chaque modalité échographique à son indication préférentielle :",
        options_json: JSON.stringify({
          pairs: [
            { item: "Échocardiographie Transthoracique (ETT)", match: "Évaluation de 1ère intention de la FEVG et des cavités" },
            { item: "Échocardiographie Transœsophagienne (ETO)", match: "Recherche de végétations d'endocardite ou de thrombus auriculaire" },
            { item: "Doppler continu / pulsé", match: "Quantification des vitesses et gradients de pression valvulaires" },
          ],
        }),
        reponse_correcte: JSON.stringify({
          "Échocardiographie Transthoracique (ETT)": "Évaluation de 1ère intention de la FEVG et des cavités",
          "Échocardiographie Transœsophagienne (ETO)": "Recherche de végétations d'endocardite ou de thrombus auriculaire",
          "Doppler continu / pulsé": "Quantification des vitesses et gradients de pression valvulaires",
        }),
        feedback_fr: "L'ETT est l'examen d'accès rapide non invasif, tandis que l'ETO offre une résolution supérieure pour les structures postérieures.",
        reference: "[Talley & O'Connor] p.85 ; [Coustet] p.84",
        tags: "ETT,ETO,échocardiographie",
      },
    ],
  });

  // Progression initiale
  await prisma.userLessonProgress.create({
    data: {
      user_id: demoUser.id,
      lesson_id: lesson1_1.id,
      mastery_level: 2,
      deja_aborde_cours: true,
      last_practiced_at: new Date(),
    },
  });

  console.log("✅ Injection exhaustive terminée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
