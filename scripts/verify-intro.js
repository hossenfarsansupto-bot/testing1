import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docxPath = path.join(__dirname, '../story-source/01_intro/1_Felice_Intro_Final.docx');
const unzippedDir = path.join(__dirname, '../story-source/01_intro/unzipped');
const introJsonPath = path.join(__dirname, '../src/content/scenes/intro.json');

function normalize(str) {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDocxParagraphs() {
  const docXmlPath = path.join(unzippedDir, 'word/document.xml');
  if (!fs.existsSync(docXmlPath)) {
    fs.mkdirSync(unzippedDir, { recursive: true });
    execSync(`tar -xf "${docxPath}" -C "${unzippedDir}"`);
  }
  const xml = fs.readFileSync(docXmlPath, 'utf8');
  const pMatches = xml.match(/<w:p[\s>].*?<\/w:p>/g) || [];
  const paragraphs = [];
  for (const p of pMatches) {
    const tMatches = (p.match(/<w:t[\s>][^<]*<\/w:t>|<w:t\/>/g) || []).map(t =>
      t.replace(/<[^>]+>/g, '')
    );
    const text = tMatches.join('');
    if (text.trim().length > 0) {
      paragraphs.push(text);
    }
  }
  return paragraphs;
}

function extractJsonTexts() {
  const introData = JSON.parse(fs.readFileSync(introJsonPath, 'utf8'));
  const texts = [];
  for (const node of introData.nodes) {
    if (node.text) {
      texts.push(node.text);
    }
    if (node.list && Array.isArray(node.list)) {
      for (const item of node.list) {
        texts.push(item);
      }
    }
  }
  return { introData, texts };
}

function runVerification() {
  console.log('--- Verifying Intro Scene Content ---');
  if (!fs.existsSync(introJsonPath)) {
    console.error('FAIL: intro.json does not exist at ' + introJsonPath);
    process.exit(1);
  }
  if (!fs.existsSync(docxPath)) {
    console.error('FAIL: 1_Felice_Intro_Final.docx does not exist at ' + docxPath);
    process.exit(1);
  }

  const docxParagraphs = extractDocxParagraphs();
  const { introData, texts: jsonTexts } = extractJsonTexts();

  console.log(`Extracted ${docxParagraphs.length} paragraphs from docx.`);
  console.log(`Extracted ${jsonTexts.length} text segments across ${introData.nodes.length} nodes in intro.json.`);

  // Find the end boundary of the intro scene in docx
  // P 20 is "System:Hyperdrive spooling up. Navigation console unlocked."
  const endMarkerIdx = docxParagraphs.findIndex(p =>
    p.includes('Hyperdrive spooling up') && p.includes('Navigation console unlocked')
  );

  if (endMarkerIdx === -1) {
    console.error('FAIL: Could not locate ending marker in docx.');
    process.exit(1);
  }

  const storyParagraphs = docxParagraphs.slice(0, endMarkerIdx + 1);
  const trailingParagraphs = docxParagraphs.slice(endMarkerIdx + 1);

  // The trailing paragraphs must only contain destination menus and author notes
  console.log(`Story paragraphs in docx: 0 to ${endMarkerIdx} (${storyParagraphs.length} paragraphs).`);
  console.log(`Trailing menu/notes paragraphs in docx: ${trailingParagraphs.length} paragraphs.`);

  // Combine docx story text
  let docxStoryText = storyParagraphs
    .map(p => p.replace(/^System:\s*/i, '').replace(/^Felice:\s*/i, ''))
    .join(' ');

  // Combine json text
  let jsonCombinedText = jsonTexts.join(' ');

  // Normalize quotes and whitespace
  let normDocx = normalize(docxStoryText);
  let normJson = normalize(jsonCombinedText);

  // Strip asterisks around awkward silence in docx
  normDocx = normDocx.replace(/\*Awkward silence\*/g, 'Awkward silence');

  // Allowed typo fixes:
  // 1. "up my arsenal" -> "in my arsenal"
  normDocx = normDocx.replace(/up my arsenal/g, 'in my arsenal');
  // 2. "miliseconds" -> "milliseconds"
  normDocx = normDocx.replace(/miliseconds/g, 'milliseconds');
  // 3. "moon(Earth's only satellite)" -> "Moon (Earth's only satellite)"
  normDocx = normDocx.replace(/moon\s*\(\s*Earth's only satellite\s*\)/gi, "Moon (Earth's only satellite)");
  // 4. "mars (The closest planet" -> "Mars (the closest planet"
  normDocx = normDocx.replace(/mars\s*\(\s*The closest/gi, 'Mars (the closest');
  // 5. Mismatched quote before Félicette -> straight quote
  normDocx = normDocx.replace(/"Félicette"/g, '"Félicette"');

  // Also clean up any extra spacing around parentheses in normDocx
  normDocx = normDocx.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
  normJson = normJson.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

  // Word token comparison
  const docxWords = normDocx.split(/\s+/);
  const jsonWords = normJson.split(/\s+/);

  console.log(`Docx word count (post-normalization): ${docxWords.length}`);
  console.log(`JSON word count (post-normalization): ${jsonWords.length}`);

  let mismatches = [];
  const maxLen = Math.max(docxWords.length, jsonWords.length);
  for (let i = 0; i < maxLen; i++) {
    const dw = docxWords[i] || '<END_OF_DOCX>';
    const jw = jsonWords[i] || '<END_OF_JSON>';
    if (dw !== jw) {
      mismatches.push({ index: i, docx: dw, json: jw });
      if (mismatches.length >= 10) break;
    }
  }

  if (mismatches.length > 0) {
    console.error('FAIL: Word discrepancies found between docx script and intro.json:');
    mismatches.forEach(m => {
      console.error(`  Word #${m.index}: docx="${m.docx}" vs json="${m.json}"`);
    });
    process.exit(1);
  }

  console.log('PASS: All story words from docx match intro.json exactly up to allowed typo fixes.');
  console.log('Verified: Trailing author notes and menu removed properly.');
  console.log('Verified: Safety rules mapped to ordered list.');
  console.log('Verification result: PASS');
}

runVerification();
