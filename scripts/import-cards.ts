import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface CardImport {
  lesson_slug: string;
  systeme?: string;
  niveau_difficulte?: number;
  type_question: string;
  question_fr: string;
  question_en?: string;
  options_json: any;
  reponse_correcte: any;
  feedback_fr: string;
  feedback_en?: string;
  reference: string;
  tags?: string;
  illustration_url?: string;
}

async function importCards(filePath: string) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Fichier introuvable : ${absolutePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(absolutePath, "utf-8");
  const cards: CardImport[] = JSON.parse(content);

  console.log(`📦 Début de l'importation de ${cards.length} cartes depuis ${path.basename(filePath)}...`);

  let count = 0;
  for (const cardData of cards) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: cardData.lesson_slug },
    });

    if (!lesson) {
      console.warn(`⚠️ Leçon avec le slug "${cardData.lesson_slug}" introuvable. Carte ignorée.`);
      continue;
    }

    const optionsString =
      typeof cardData.options_json === "string"
        ? cardData.options_json
        : JSON.stringify(cardData.options_json);

    const reponseString =
      typeof cardData.reponse_correcte === "string"
        ? cardData.reponse_correcte
        : JSON.stringify(cardData.reponse_correcte);

    await prisma.card.create({
      data: {
        lesson_id: lesson.id,
        systeme: cardData.systeme || "cardio",
        niveau_difficulte: cardData.niveau_difficulte || 1,
        type_question: cardData.type_question,
        question_fr: cardData.question_fr,
        question_en: cardData.question_en,
        options_json: optionsString,
        reponse_correcte: reponseString,
        feedback_fr: cardData.feedback_fr,
        feedback_en: cardData.feedback_en,
        reference: cardData.reference,
        tags: cardData.tags,
        illustration_url: cardData.illustration_url,
      },
    });

    count++;
  }

  console.log(`✅ ${count} cartes importées avec succès !`);
}

const targetFile = process.argv[2] || "scripts/example-cards.json";
importCards(targetFile)
  .catch((e) => {
    console.error("❌ Erreur pendant l'import :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
