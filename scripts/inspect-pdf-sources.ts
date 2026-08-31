import fs from "fs";
import path from "path";

// @ts-ignore
const { PDFParse } = require("pdf-parse");

async function inspectPdfs() {
  const dir = path.join(process.cwd(), "references_PDF");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf"));

  console.log(`📚 Analyse des ${files.length} livres PDF déposés :\n`);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const dataBuffer = fs.readFileSync(fullPath);
    try {
      const parser = new PDFParse({ data: dataBuffer });
      await parser.load();
      const info = await parser.getInfo();
      const textResult = await parser.getText({ startPage: 1, endPage: 5 });
      const cleanSnippet = (textResult.text || "").slice(0, 180).replace(/\s+/g, " ").trim();

      console.log(`--------------------------------------------------`);
      console.log(`📖 Livre : ${file.slice(0, 70)}...`);
      console.log(`📄 Total pages : ${info.pages || "N/A"}`);
      console.log(`📝 Début : ${cleanSnippet}...`);
      parser.destroy();
    } catch (e: any) {
      console.error(`❌ Erreur sur ${file}:`, e.message);
    }
  }
}

inspectPdfs();
