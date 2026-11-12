import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scenesDir = path.join(__dirname, '../src/content/scenes');

const placeholders = [
  { id: 'moon_retroreflectors', title: 'Retroreflectors', theme: 'moon' },
  { id: 'moon_alsep', title: 'ALSEP', theme: 'moon' },
  { id: 'mars_viking', title: 'Viking 1 and 2', theme: 'mars' },
  { id: 'mars_sojourner', title: "Sojourner's_APXS", theme: 'mars' },
  { id: 'mars_phoenix', title: 'TEGA&MECA', theme: 'mars_arctic' },
  { id: 'deep_space_unlock', title: 'Deep Space Unlock', theme: 'deep_space' },
  { id: 'ds_pioneer', title: 'Pioneer', theme: 'deep_space' },
  { id: 'ds_voyager', title: 'Voyager', theme: 'deep_space' },
  { id: 'ds_ds1_nh_blocked', title: 'Deep Space Course Check', theme: 'deep_space' },
  { id: 'climax', title: 'Climax Emergency', theme: 'alarm' },
  { id: 'after_climax', title: 'Journey Home', theme: 'home_stretch' },
  { id: 'mars_phoenix_met', title: 'Phoenix Tale', theme: 'ship' },
  { id: 'outro', title: 'Journey Outro', theme: 'ship', endsStory: true }
];

placeholders.forEach(p => {
  const scene = {
    id: p.id,
    title: p.title,
    theme: p.theme,
    ...(p.endsStory ? { endsStory: true } : {}),
    nodes: [
      {
        type: 'say',
        speaker: 'system',
        text: `[Placeholder: ${p.id} — script not added yet]`
      },
      {
        type: 'say',
        speaker: 'felice',
        text: `The data packet for ${p.id} is being transcribed by the cartography team. Everything is operating smoothly!`
      }
    ]
  };
  fs.writeFileSync(path.join(scenesDir, `${p.id}.json`), JSON.stringify(scene, null, 2));
  console.log(`Created ${p.id}.json`);
});
