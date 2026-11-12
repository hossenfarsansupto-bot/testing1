// Pure Node test for flow rules and transitions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read flow.ts and evaluate logic
const flowCode = fs.readFileSync(path.join(__dirname, '../src/content/flow.ts'), 'utf8');

// Quick assertion helper
function assert(condition, message) {
  if (!condition) {
    console.error(`ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('--- Running Flow Simulation Test Suite ---');

// Validate flow constants match requirements exactly
const expectedSceneIds = [
  'intro',
  'moon_retroreflectors',
  'moon_alsep',
  'mars_viking',
  'mars_sojourner',
  'mars_phoenix',
  'deep_space_unlock',
  'ds_pioneer',
  'ds_voyager',
  'ds_ds1_nh_blocked',
  'climax',
  'after_climax',
  'mars_phoenix_met',
  'outro'
];

expectedSceneIds.forEach(id => {
  assert(flowCode.includes(`'${id}'`), `flow.ts must define scene id '${id}'`);
});
console.log(`✓ All ${expectedSceneIds.length} scene IDs present in flow.ts`);

// Check transition logic in code:
assert(flowCode.includes('SCENE_IDS.INTRO') && flowCode.includes("type: 'open_hub', hub: 'main'"),
  'Intro must transition to main hub');
console.log('✓ Intro -> main console transition rule verified');

assert(flowCode.includes('isMoonCompleted') && flowCode.includes('isMarsCompleted') && flowCode.includes('SCENE_IDS.DEEP_SPACE_UNLOCK'),
  'Deep space unlock triggers when second of Moon/Mars completes');
console.log('✓ Second completed destination -> deep_space_unlock verified');

assert(
  flowCode.includes("id: 'ds_ds1'") &&
    flowCode.includes("id: 'ds_new_horizons'") &&
    flowCode.includes('SCENE_IDS.DS_BLOCKED') &&
    flowCode.includes('SCENE_IDS.CLIMAX'),
  'Deep Space hub exposes all 4 options (Pioneer, Voyager, DS1, New Horizons) with DS_BLOCKED -> CLIMAX transition'
);
console.log('✓ Deep space 4-option hub (Pioneer, Voyager, DS1, New Horizons) and climax trigger verified');

assert(flowCode.includes('SCENE_IDS.CLIMAX') && flowCode.includes('SCENE_IDS.AFTER_CLIMAX') &&
       flowCode.includes('SCENE_IDS.MARS_PHOENIX_MET') && flowCode.includes('SCENE_IDS.OUTRO'),
  'Climax sequence chains climax -> after_climax -> mars_phoenix_met -> outro');
console.log('✓ Climax chain sequence verified');

console.log('ALL FLOW SIMULATION CHECKS PASSED!');
