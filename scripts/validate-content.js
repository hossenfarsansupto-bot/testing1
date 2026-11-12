import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scenesDir = path.join(__dirname, '../src/content/scenes');
const flowPath = path.join(__dirname, '../src/content/flow.ts');

const VALID_THEMES = new Set([
  'ship',
  'moon',
  'mars',
  'mars_arctic',
  'deep_space',
  'alarm',
  'home_stretch'
]);

function extractSceneIdsFromFlow() {
  const content = fs.readFileSync(flowPath, 'utf8');
  // Match ALL_SCENE_IDS array or SCENE_IDS constants
  const match = content.match(/export const ALL_SCENE_IDS: string\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not find ALL_SCENE_IDS in flow.ts');
  }
  // Extract scene ids from SCENE_IDS.*
  const idsMatch = content.match(/SCENE_IDS = {([\s\S]*?)} as const;/);
  if (!idsMatch) {
    throw new Error('Could not find SCENE_IDS map in flow.ts');
  }
  const idPairs = idsMatch[1].match(/:\s*['"]([^'"]+)['"]/g) || [];
  return idPairs.map(s => s.replace(/:\s*['"]/, '').replace(/['"]$/, ''));
}

function validateNode(node, pathStr, errors) {
  if (!node || typeof node !== 'object') {
    errors.push(`${pathStr}: Node must be an object`);
    return;
  }
  switch (node.type) {
    case 'say':
      if (node.speaker !== 'felice' && node.speaker !== 'system') {
        errors.push(`${pathStr}: Invalid speaker '${node.speaker}'`);
      }
      if (typeof node.text !== 'string' || !node.text.trim()) {
        errors.push(`${pathStr}: say node must have non-empty text`);
      }
      if (node.list !== undefined) {
        if (!Array.isArray(node.list) || node.list.some(item => typeof item !== 'string')) {
          errors.push(`${pathStr}: list must be an array of strings`);
        }
      }
      break;
    case 'stage':
      if (typeof node.text !== 'string' || !node.text.trim()) {
        errors.push(`${pathStr}: stage node must have non-empty text`);
      }
      break;
    case 'choice':
      if (!Array.isArray(node.options) || node.options.length === 0) {
        errors.push(`${pathStr}: choice node must have non-empty options array`);
      } else {
        node.options.forEach((opt, idx) => {
          if (typeof opt.label !== 'string' || !opt.label.trim()) {
            errors.push(`${pathStr}.options[${idx}]: Option must have a label`);
          }
          if (!Array.isArray(opt.response)) {
            errors.push(`${pathStr}.options[${idx}]: Option must have a response array`);
          } else {
            opt.response.forEach((respNode, respIdx) => {
              validateNode(respNode, `${pathStr}.options[${idx}].response[${respIdx}]`, errors);
            });
          }
        });
      }
      break;
    case 'menu':
      if (typeof node.prompt !== 'string') {
        errors.push(`${pathStr}: menu node must have prompt`);
      }
      if (node.mode !== 'visitAll') {
        errors.push(`${pathStr}: menu mode must be 'visitAll'`);
      }
      if (!Array.isArray(node.options) || node.options.length === 0) {
        errors.push(`${pathStr}: menu options must be non-empty array`);
      } else {
        node.options.forEach((opt, idx) => {
          if (typeof opt.id !== 'string' || typeof opt.label !== 'string') {
            errors.push(`${pathStr}.options[${idx}]: menu option must have id and label`);
          }
          if (!Array.isArray(opt.nodes)) {
            errors.push(`${pathStr}.options[${idx}]: menu option must have nodes array`);
          } else {
            opt.nodes.forEach((optNode, optIdx) => {
              validateNode(optNode, `${pathStr}.options[${idx}].nodes[${optIdx}]`, errors);
            });
          }
        });
      }
      break;
    case 'goto':
      if (typeof node.scene !== 'string') {
        errors.push(`${pathStr}: goto node must specify target scene string`);
      }
      break;
    default:
      errors.push(`${pathStr}: Unknown node type '${node.type}'`);
  }
}

function runValidation() {
  const errors = [];
  const sceneIds = extractSceneIdsFromFlow();
  console.log(`Checking ${sceneIds.length} scene definitions from flow.ts...`);

  for (const sceneId of sceneIds) {
    const sceneFile = path.join(scenesDir, `${sceneId}.json`);
    if (!fs.existsSync(sceneFile)) {
      errors.push(`Missing scene file: ${sceneFile}`);
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
      if (data.id !== sceneId) {
        errors.push(`${sceneId}.json: id '${data.id}' does not match filename`);
      }
      if (typeof data.title !== 'string') {
        errors.push(`${sceneId}.json: missing or invalid title`);
      }
      if (!VALID_THEMES.has(data.theme)) {
        errors.push(`${sceneId}.json: invalid theme '${data.theme}'`);
      }
      if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
        errors.push(`${sceneId}.json: nodes must be a non-empty array`);
      } else {
        data.nodes.forEach((node, idx) => {
          validateNode(node, `${sceneId}.nodes[${idx}]`, errors);
        });
      }
    } catch (e) {
      errors.push(`${sceneId}.json: JSON parse error: ${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('FAIL: Content validation found errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log(`PASS: All ${sceneIds.length} scenes and their nodes are valid.`);
  }
}

runValidation();
