export interface ClinicalQuestion {
  id: string;
  category: "douleur" | "antecedents" | "mode_vie" | "signes_associes";
  question: string;
  patientAnswer: string;
  clinicalClue: string; // Ce que l'étudiant note dans son carnet
  isKeyClue: boolean; // Indispensable pour le score de rigueur
}

export interface PhysicalManeuver {
  id: string;
  category: "inspection" | "palpation" | "auscultation_cardio" | "auscultation_pulmo" | "constantes";
  name: string;
  icon: string;
  actionDescription: string;
  finding: string;
  isPositive: boolean;
  clinicalSignName?: string; // ex: "Signe de Levine", "Reflux Hépato-Jugulaire"
  isCritical: boolean;
}

export interface InvestigationTest {
  id: string;
  name: string;
  category: "biologie" | "imagerie" | "ecg";
  delay: string; // "Immédiat (lit du malade)", "30 minutes"
  resultSummary: string;
  resultDetails: string;
  isUrgentMandatory: boolean;
}

export interface DiagnosticOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface UrgentActionOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3;
  patient: {
    name: string;
    age: number;
    gender: "M" | "F";
    occupation: string;
    avatarEmoji: string;
    initialComplaint: string;
    initialVitals: {
      bp: string; // "145/90 mmHg"
      hr: number; // 92 bpm
      spo2: number; // 96%
      rr: number; // 18 /min
      temp: number; // 37.1 °C
    };
  };
  questions: ClinicalQuestion[];
  maneuvers: PhysicalManeuver[];
  investigations: InvestigationTest[];
  diagnostics: DiagnosticOption[];
  urgentActions: UrgentActionOption[];
  debriefing: {
    finalDiagnosis: string;
    keyLearningPoints: string[];
    redFlags: string[];
    mnemonic: string;
    reference: string;
  };
  rewards: {
    xp: number;
    gems: number;
  };
}

export const CLINICAL_CASES: ClinicalCase[] = [
  // =========================================================================
  // CAS 1 : M. ROBERT, 58 ANS — DOULEUR THORACIQUE EN ÉTAU (SCA ST+)
  // =========================================================================
  {
    id: "case-1-infarctus",
    title: "Cas 1 : Douleur Rétrosternale Angoissante à l'Effort",
    subtitle: "Homme de 58 ans amené par son épouse pour oppression thoracique brutale",
    difficulty: 2,
    patient: {
      name: "M. Robert",
      age: 58,
      gender: "M",
      occupation: "Comptable",
      avatarEmoji: "🧔🩺",
      initialComplaint: "Docteur, j'ai une barre terrible dans la poitrine depuis 45 minutes, comme si un étau m'écrasait le sternum... Je transpire énormément.",
      initialVitals: {
        bp: "105/65 mmHg",
        hr: 98,
        spo2: 95,
        rr: 22,
        temp: 36.8,
      },
    },
    questions: [
      {
        id: "q_caractere",
        category: "douleur",
        question: "Pouvez-vous me décrire précisément le type de douleur et où elle se situe ?",
        patientAnswer: "C'est une sensation de lourdeur écrasante au milieu de la poitrine, en plein sternum. J'ai l'impression qu'un poids de 50 kg est posé sur moi.",
        clinicalClue: "Douleur rétrosternale médiothoracique constrictive (« en étau »).",
        isKeyClue: true,
      },
      {
        id: "q_irradiation",
        category: "douleur",
        question: "La douleur part-elle vers d'autres endroits de votre corps ?",
        patientAnswer: "Oui, elle remonte dans ma mâchoire inférieure et descend tout le long de mon bras gauche jusqu'au petit doigt.",
        clinicalClue: "Irradiation typique à la mandibule et au membre supérieur gauche (bord ulnaire).",
        isKeyClue: true,
      },
      {
        id: "q_duree",
        category: "douleur",
        question: "Depuis combien de temps avez-vous cette douleur et a-t-elle diminué au repos ?",
        patientAnswer: "Cela fait maintenant 45 minutes que ça a commencé en montant l'escalier. Même assis, la douleur ne s'est pas du tout calmée.",
        clinicalClue: "Durée prolongée > 20 minutes et résistance au repos.",
        isKeyClue: true,
      },
      {
        id: "q_facteurs_risque",
        category: "mode_vie",
        question: "Avez-vous des facteurs de risque comme le tabac, du cholestérol ou de la tension ?",
        patientAnswer: "Je fume un paquet par jour depuis mes 20 ans, j'ai un peu de cholestérol mais je ne prends pas mes médicaments régulièrement.",
        clinicalClue: "FDRCV majeurs : Tabagisme actif 38 PA, dyslipidémie non traitée.",
        isKeyClue: true,
      },
      {
        id: "q_antecedents",
        category: "antecedents",
        question: "Y a-t-il des problèmes cardiaques connus dans votre famille ?",
        patientAnswer: "Mon père a fait une crise cardiaque à 52 ans.",
        clinicalClue: "Hérédité coronarienne précoce au 1er degré.",
        isKeyClue: false,
      },
      {
        id: "q_signes_associes",
        category: "signes_associes",
        question: "Ressentez-vous d'autres sensations comme des nausées ou des vertiges ?",
        patientAnswer: "Je me sens très nauséeux, angoissé, et j'ai des sueurs froides dans tout le corps.",
        clinicalClue: "Signes végétatifs associés : Sueurs profuses, nausées, angoisse de mort imminente.",
        isKeyClue: false,
      },
    ],
    maneuvers: [
      {
        id: "m_levine",
        category: "inspection",
        name: "Observation de la gestuelle spontanée du patient",
        icon: "✊",
        actionDescription: "Observer comment le patient positionne ses mains en décrivant son oppression thoracique.",
        finding: "Le patient serre spontanément son poing fermé contre le milieu de son sternum en parlant.",
        clinicalSignName: "Signe de Levine (hautement spécifique d'ischémie myocardique)",
        isPositive: true,
        isCritical: true,
      },
      {
        id: "m_auscultation_cardio",
        category: "auscultation_cardio",
        name: "Auscultation des 4 foyers cardiaques (A, P, T, M)",
        icon: "🩺",
        actionDescription: "Écoute attentive des bruits du cœur à la recherche d'un souffle, galop ou frottement.",
        finding: "Bruits du cœur réguliers sans souffle surajouté ni frottement. Absence de galop B3 audible.",
        isPositive: false,
        isCritical: true,
      },
      {
        id: "m_auscultation_pulmo",
        category: "auscultation_pulmo",
        name: "Auscultation des deux champs pulmonaires",
        icon: "🫁",
        actionDescription: "Recherche de râles crépitants aux bases (stase pulmonaire gauche).",
        finding: "Murmure vésiculaire symétrique et pur aux deux bases, absence de râles crépitants (Killip I).",
        isPositive: false,
        isCritical: true,
      },
      {
        id: "m_pouls_peripheriques",
        category: "palpation",
        name: "Palpation des pouls périphériques et mesure de PA aux 2 bras",
        icon: "🖐️",
        actionDescription: "Palpation des pouls radiaux et fémoraux + prise de tension bilatérale.",
        finding: "Pouls présents et symétriques. PA droite = 105/65 mmHg, PA gauche = 108/67 mmHg (Absence d'asymétrie tensionnelle > 20 mmHg).",
        isPositive: false,
        isCritical: false,
      },
      {
        id: "m_harzer",
        category: "palpation",
        name: "Recherche du signe de Harzer et turgescence jugulaire",
        icon: "⚡",
        actionDescription: "Palpation sous la xiphoïde en inspiration profonde et inspection du cou.",
        finding: "Discrète turgescence jugulaire sans signe de Harzer franc. Pouls à 98 bpm.",
        isPositive: true,
        clinicalSignName: "Turgescence jugulaire débutante (surveiller extension au VD)",
        isCritical: false,
      },
    ],
    investigations: [
      {
        id: "test_ecg",
        category: "ecg",
        name: "Électrocardiogramme 12 dérivations d'urgence",
        delay: "Immédiat (< 10 min)",
        resultSummary: "Sus-décalage du segment ST convexe vers le haut en DII, DIII, aVF (Onde de Pardee) avec miroir en DI, aVL.",
        resultDetails: "Infarctus transmural aigu du territoire inférieur. Les dérivations droites V3R/V4R montrent un sus-décalage de 1 mm signant l'extension au ventricule droit.",
        isUrgentMandatory: true,
      },
      {
        id: "test_troponine",
        category: "biologie",
        name: "Troponine I ultrasensible",
        delay: "30 minutes",
        resultSummary: "Troponine I ultrasensible = 1250 ng/L (Normale < 14 ng/L).",
        resultDetails: "Élévation massive confirmant la nécrose myocardique aiguë.",
        isUrgentMandatory: true,
      },
      {
        id: "test_radio_thorax",
        category: "imagerie",
        name: "Radiographie thoracique de face au lit",
        delay: "20 minutes",
        resultSummary: "Silhouette cardiaque de taille normale. Pas de syndrome alvéolo-interstitiel ni d'élargissement du médiastin.",
        resultDetails: "Élimine un gros pneumothorax ou un volumineux épanchement.",
        isUrgentMandatory: false,
      },
    ],
    diagnostics: [
      {
        id: "diag_sca_st_plus",
        label: "Syndrome Coronarien Aigu avec sus-décalage du segment ST (SCA ST+ inférieur avec extension VD)",
        isCorrect: true,
        explanation: "Douleur constrictive > 20 min avec irradiations typiques + signe de Levine + onde de Pardee en DII-DIII-aVF = SCA ST+ inférieur.",
      },
      {
        id: "diag_pericardite",
        label: "Péricardite Aiguë isolée",
        isCorrect: false,
        explanation: "Incorrect : la douleur n'est pas soulagée penché en avant, il n'y a pas de frottement péricardique et l'ECG montre un miroir et une onde de Pardee localisée.",
      },
      {
        id: "diag_dissection",
        label: "Dissection Aortique aiguë",
        isCorrect: false,
        explanation: "Incorrect : la douleur n'est pas dorsale descendante et il n'y a pas d'asymétrie tensionnelle.",
      },
      {
        id: "diag_angor_stable",
        label: "Angor d'effort stable",
        isCorrect: false,
        explanation: "Incorrect : l'angor stable cède au repos en moins de 3 minutes et ne s'accompagne pas d'onde de Pardee ni d'élévation de troponine.",
      },
    ],
    urgentActions: [
      {
        id: "act_samu_coro",
        label: "Alerte SAMU 15 immédiate + Transfert d'urgence en salle de cathétérisme pour Coronarographie / Angioplastie primaire < 120 min",
        isCorrect: true,
        explanation: "L'angioplastie coronaire primaire d'urgence avec pose de stent est le traitement de reperfusion de référence absolue du SCA ST+.",
      },
      {
        id: "act_nitres_diuretiques",
        label: "Administration de Dérivés Nitrés en spray sublingual et Diurétiques IV à forte dose",
        isCorrect: false,
        explanation: "DANGER MORTEL : Les dérivés nitrés et diurétiques sont contre-indiqués en cas d'extension au ventricule droit car ils effondrent la précharge et provoquent un collapsus fatal !",
      },
      {
        id: "act_antalgiques_domicile",
        label: "Prescription de paracétamol et retour à domicile avec repos",
        isCorrect: false,
        explanation: "Erreur médicale majeure : le patient risque la fibrillation ventriculaire et la mort subite sans désobstruction immédiate.",
      },
    ],
    debriefing: {
      finalDiagnosis: "Syndrome Coronarien Aigu ST+ (Infarctus inférieur étendu au ventricule droit)",
      keyLearningPoints: [
        "Toute douleur constrictive prolongée > 20 minutes impose un ECG 12 dérivations dans les 10 minutes.",
        "Le signe de Levine (poing fermé sur le sternum) est hautement prédictif d'ischémie myocardique.",
        "Dans l'infarctus inférieur (DII, DIII, aVF), toujours réaliser V3R/V4R pour dépister l'extension au ventricule droit.",
        "En cas d'atteinte du ventricule droit, proscrire formellement les dérivés nitrés et les diurétiques.",
      ],
      redFlags: [
        "Durée > 20 min résistante aux dérivés nitrés.",
        "Signes végétatifs profus (sueurs, nausées).",
        "Hypotension artérielle associée à des poumons clairs.",
      ],
      mnemonic: "Time is Muscle : Désobstruction d'urgence par angioplastie en moins de 120 minutes !",
      reference: "[ESC Guidelines STEMI] ; [UNESS-Cardio] p.14-22 ; [Coustet] p.48-52",
    },
    rewards: {
      xp: 75,
      gems: 25,
    },
  },

  // =========================================================================
  // CAS 2 : MME JEANNE, 72 ANS — OAP & INSUFFISANCE CARDIAQUE GAUCHE
  // =========================================================================
  {
    id: "case-2-oap",
    title: "Cas 2 : Asphyxie Nocturne & Crépitants Pulmonaires",
    subtitle: "Femme de 72 ans réveillée en pleine nuit par une suffocation angoissante",
    difficulty: 2,
    patient: {
      name: "Mme Jeanne",
      age: 72,
      gender: "F",
      occupation: "Retraitée",
      avatarEmoji: "👵💨",
      initialComplaint: "Docteur... je n'arrive plus à respirer... dès que je m'allonge, j'étouffe complètement... j'entends un bouillonnement dans ma gorge...",
      initialVitals: {
        bp: "185/100 mmHg",
        hr: 112,
        spo2: 82,
        rr: 32,
        temp: 37.0,
      },
    },
    questions: [
      {
        id: "q_position",
        category: "douleur",
        question: "Que se passe-t-il lorsque vous essayez de vous allonger sur le dos ?",
        patientAnswer: "C'est impossible ! J'étouffe au bout de 30 secondes, je dois m'asseoir au bord du lit avec 4 oreillers pour reprendre un peu d'air.",
        clinicalClue: "Orthopnée sévère à 4 oreillers soulagée par la position assise.",
        isKeyClue: true,
      },
      {
        id: "q_expectoration",
        category: "signes_associes",
        question: "Avez-vous toussé ou craché quelque chose pendant cette crise ?",
        patientAnswer: "Oui, j'ai craché une mousse blanche très aérée avec quelques reflets rosés.",
        clinicalClue: "Expectoration mousseuse aérée et saumonée caractéristique de transsudation alvéolaire.",
        isKeyClue: true,
      },
      {
        id: "q_antecedents_hta",
        category: "antecedents",
        question: "Avez-vous des antécédents d'hypertension artérielle ou de maladie cardiaque ?",
        patientAnswer: "Je suis hypertendue depuis 20 ans, et j'ai fait un infarctus il y a 3 ans.",
        clinicalClue: "Terrain de cardiopathie ischémique et hypertensive chronique.",
        isKeyClue: true,
      },
      {
        id: "q_prise_poids",
        category: "signes_associes",
        question: "Avez-vous remarqué un gonflement de vos jambes ou une prise de poids récente ?",
        patientAnswer: "J'ai pris 3 kg en 4 jours et mes chevilles sont très gonflées le soir.",
        clinicalClue: "Prise de poids rapide par rétention hydrosodée congestive.",
        isKeyClue: false,
      },
    ],
    maneuvers: [
      {
        id: "m_auscultation_pulmo_oap",
        category: "auscultation_pulmo",
        name: "Auscultation pulmonaire bilatérale des bases aux sommets",
        icon: "🫁",
        actionDescription: "Recherche de râles crépitants et évaluation de leur hauteur d'ascension.",
        finding: "Râles crépitants fins bilatéraux 'en marée montante' atteignant les deux tiers moyens des champs pulmonaires.",
        clinicalSignName: "Râles crépitants en marée montante d'OAP hémodynamique",
        isPositive: true,
        isCritical: true,
      },
      {
        id: "m_auscultation_cardio_galop",
        category: "auscultation_cardio",
        name: "Auscultation de l'apex en décubitus latéral gauche",
        icon: "🩺",
        actionDescription: "Recherche d'un bruit de galop surajouté en diastole.",
        finding: "Tachycardie régulière à 112 bpm avec présence d'un galop protodiastolique B3 apexien net.",
        clinicalSignName: "Bruit de galop B3 protodiastolique (dysfonction systolique VG)",
        isPositive: true,
        isCritical: true,
      },
      {
        id: "m_godet",
        category: "palpation",
        name: "Palpation des crêtes tibiales et des chevilles",
        icon: "🖐️",
        actionDescription: "Pression digitale sur la face antérieure du tibia pendant 5 secondes.",
        finding: "Présence d'œdèmes bilatéraux, blancs, mous, indolores, gardant l'empreinte du pouce (signe du godet positif).",
        clinicalSignName: "Signe du godet positif bilatéral",
        isPositive: true,
        isCritical: false,
      },
    ],
    investigations: [
      {
        id: "test_bnp",
        category: "biologie",
        name: "Dosage du NT-proBNP plasmatique",
        delay: "30 minutes",
        resultSummary: "NT-proBNP = 4850 pg/mL (Normale < 300 pg/mL).",
        resultDetails: "Élévation majeure confirmant la surcharge hémodynamique et la distension des parois ventriculaires.",
        isUrgentMandatory: true,
      },
      {
        id: "test_radio_thorax_oap",
        category: "imagerie",
        name: "Radiographie pulmonaire de face au lit",
        delay: "Immédiat",
        resultSummary: "Cardiomégalie + Syndrome alvéolo-interstitiel bilatéral floconneux péri-hilaire 'en ailes de papillon' avec lignes B de Kerley aux bases.",
        resultDetails: "Image typique d'œdème aigu du poumon hémodynamique en surcharge volémique.",
        isUrgentMandatory: true,
      },
    ],
    diagnostics: [
      {
        id: "diag_oap",
        label: "Œdème Aigu du Poumon hémodynamique (OAP) sur poussée d'insuffisance cardiaque gauche hypertensive",
        isCorrect: true,
        explanation: "Orthopnée majeure + expectoration saumonée + crépitants en marée montante + galop B3 + NT-proBNP très élevé = OAP hémodynamique.",
      },
      {
        id: "diag_asthme",
        label: "Crise d'asthme aigu grave",
        isCorrect: false,
        explanation: "L'asthme se traduit par des râles sibilants expiratoires et non des crépitants fins en marée montante.",
      },
      {
        id: "diag_pneumonie",
        label: "Pneumonie franche lobaire aiguë bilatérale",
        isCorrect: false,
        explanation: "Absence de fièvre (température 37°C), et aspect floconneux bilatéral péri-hilaire avec galop B3 signant l'origine cardiogénique.",
      },
    ],
    urgentActions: [
      {
        id: "act_traitement_oap",
        label: "Position assise jambes pendantes + Oxygénothérapie à fort débit + Furosémide IVD (80 mg) + Dérivés nitrés IV (Isocet) sous surveillance tensionnelle",
        isCorrect: true,
        explanation: "La triade d'urgence : Position assise + Furosémide IV (veinodilatation puis diurèse) + Nitrés IV (baisse puissante de la précharge) + O2.",
      },
      {
        id: "act_remplissage",
        label: "Perfusion rapide de 1000 mL de sérum physiologique en position allongée",
        isCorrect: false,
        explanation: "DANGER : Aggraverait massivement l'inondation alvéolaire et conduirait à l'arrêt respiratoire par asphyxie !",
      },
    ],
    debriefing: {
      finalDiagnosis: "Œdème Aigu du Poumon hémodynamique (OAP gauche en surcharge)",
      keyLearningPoints: [
        "L'orthopnée et les crépitants en marée montante sont les deux signes cardinaux de l'OAP.",
        "Le galop B3 protodiastolique traduit le remplissage brutal d'un ventricule gauche dilaté et peu compliant.",
        "La position assise jambes pendantes réduit mécaniquement le retour veineux vers le cœur défaillant.",
      ],
      redFlags: [
        "Saturation en O2 < 90% sous air ambiant.",
        "Grésillement laryngé audible à distance sans stéthoscope.",
        "Signes d'épuisement respiratoire (tirage intercostal, balancement thoraco-abdominal).",
      ],
      mnemonic: "OAP = Urgence : Assis + Furosémide IV + Nitrés IV + O2 !",
      reference: "[UNESS-Cardio] p.28-34 ; [Coustet] p.56-62 ; [Bariéty] p.126-128",
    },
    rewards: {
      xp: 75,
      gems: 25,
    },
  },

  // =========================================================================
  // CAS 3 : M. ANTOINE, 48 ANS — PÉRICARDITE AIGUË
  // =========================================================================
  {
    id: "case-3-pericardite",
    title: "Cas 3 : Douleur Thoracique Augmentée en Décubitus",
    subtitle: "Homme de 48 ans sans facteur de risque présentant une douleur thoracique vive post-syndrome grippal",
    difficulty: 1,
    patient: {
      name: "M. Antoine",
      age: 48,
      gender: "M",
      occupation: "Professeur de lycée",
      avatarEmoji: "👨‍🏫🤒",
      initialComplaint: "Docteur, depuis hier soir j'ai une douleur aiguë au milieu de la poitrine. Elle est pire quand j'inspire à fond ou quand je m'allonge sur le lit.",
      initialVitals: {
        bp: "125/75 mmHg",
        hr: 84,
        spo2: 98,
        rr: 16,
        temp: 37.8,
      },
    },
    questions: [
      {
        id: "q_position_calmante",
        category: "douleur",
        question: "Y a-t-il une position dans laquelle votre douleur diminue ?",
        patientAnswer: "Oui ! Quand je m'assois et que je me penche en avant sur mes genoux, la douleur diminue de moitié.",
        clinicalClue: "Position antalgique caractéristique : soulagement assis penché en avant.",
        isKeyClue: true,
      },
      {
        id: "q_respiration_toux",
        category: "douleur",
        question: "La douleur est-elle modifiée par la respiration ou la toux ?",
        patientAnswer: "Oui, elle devient très vive quand j'inspire profondément, quand je tousse ou quand j'avale (déglutition).",
        clinicalClue: "Douleur rythmée par la respiration et la déglutition (frottement pleural/œsophagien de contiguïté).",
        isKeyClue: true,
      },
      {
        id: "q_contexte_infectieux",
        category: "antecedents",
        question: "Avez-vous été malade ou eu de la fièvre ces derniers jours ?",
        patientAnswer: "J'ai eu un gros syndrome grippal avec fièvre et courbatures il y a 8 jours.",
        clinicalClue: "Contexte d'infection virale récente évocatrice de péricardite aiguë bénigne.",
        isKeyClue: true,
      },
    ],
    maneuvers: [
      {
        id: "m_frottement_pericardique",
        category: "auscultation_cardio",
        name: "Auscultation le long du bord gauche du sternum en apnée",
        icon: "🩺",
        actionDescription: "Faire pencher le patient en avant en demandant une apnée respiratoire complète.",
        finding: "Bruit superficiel râpeux mésocardiaque en 'cuir neuf' ou 'soie froissée', systolo-diastolique à 3 temps, persistant lors de l'apnée respiratoire.",
        clinicalSignName: "Frottement péricardique pathognomonique",
        isPositive: true,
        isCritical: true,
      },
      {
        id: "m_beck",
        category: "constantes",
        name: "Recherche des signes de tamponnade (Triade de Beck)",
        icon: "⚠️",
        actionDescription: "Vérifier la pression artérielle, les bruits du cœur et les veines jugulaires.",
        finding: "PA conservée à 125/75 mmHg, bruits bien audibles, pas de turgescence jugulaire ni de pouls paradoxal.",
        isPositive: false,
        clinicalSignName: "Absence de tamponnade compressive",
        isCritical: true,
      },
    ],
    investigations: [
      {
        id: "test_ecg_pericardite",
        category: "ecg",
        name: "Électrocardiogramme 12 dérivations",
        delay: "Immédiat",
        resultSummary: "Sus-décalage ST concave vers le haut diffus dans toutes les dérivations (sans miroir) + sous-décalage du segment PQ.",
        resultDetails: "Aspect typique de Stade I de Spodick de péricardite aiguë.",
        isUrgentMandatory: true,
      },
      {
        id: "test_crp",
        category: "biologie",
        name: "Bilan inflammatoire (CRP, NFS) et Troponine",
        delay: "30 minutes",
        resultSummary: "CRP = 65 mg/L (syndrome inflammatoire). Troponine normale (< 5 ng/L).",
        resultDetails: "Confirme l'inflammation péricardique sans myocardite associée.",
        isUrgentMandatory: true,
      },
    ],
    diagnostics: [
      {
        id: "diag_pericardite_aigue",
        label: "Péricardite Aiguë virale bénigne non compliquée (sans tamponnade)",
        isCorrect: true,
        explanation: "Douleur calmée penché en avant + frottement péricardique persistant en apnée + sus-décalage ST concave diffus sans miroir + sous-décalage PQ.",
      },
      {
        id: "diag_infarctus_st",
        label: "Infarctus du Myocarde transmural",
        isCorrect: false,
        explanation: "L'infarctus donne un sus-décalage convexe en dôme localisé avec image en miroir et une troponine très élevée.",
      },
    ],
    urgentActions: [
      {
        id: "act_aspirine_colchicine",
        label: "Traitement anti-inflammatoire de 1ère intention : Aspirine forte dose (ou AINS) + Colchicine (0.5 mg x 2/j pendant 3 mois) + Repos",
        isCorrect: true,
        explanation: "L'association Aspirine/Ibuprofène + Colchicine est le traitement de référence réduisant drastiquement le risque de récidive.",
      },
      {
        id: "act_anticoagulation",
        label: "Anticoagulation curative immédiate par Héparine à dose efficace",
        isCorrect: false,
        explanation: "DANGER MAJEUR : Les anticoagulants favorisent l'hémopéricarde et la survenue d'une tamponnade compressive mortelle !",
      },
    ],
    debriefing: {
      finalDiagnosis: "Péricardite Aiguë virale aiguë non compliquée",
      keyLearningPoints: [
        "La position assise penchée en avant soulage la douleur péricardique en diminuant la friction entre les feuillets.",
        "Le frottement péricardique persiste en apnée, ce qui le distingue formellement du frottement pleural.",
        "Le sous-décalage du segment PQ à l'ECG est très précoce et très spécifique.",
      ],
      redFlags: [
        "Hypotension artérielle avec bruits assourdis (Tamponnade de Beck).",
        "Élévation de troponine associée (Myopéricardite).",
        "Fièvre élevée > 38.5°C ou résistance aux AINS.",
      ],
      mnemonic: "Péricardite = Position assise + Frottement en apnée + Colchicine !",
      reference: "[ESC Guidelines Pericardial Diseases] ; [Coustet] p.64 ; [McGee] p.360",
    },
    rewards: {
      xp: 60,
      gems: 20,
    },
  },
];

export function getCaseById(id: string): ClinicalCase | undefined {
  return CLINICAL_CASES.find((c) => c.id === id);
}
