import { Scene } from '../../types';

import intro from './intro.json';
import moonRetroreflectors from './moon_retroreflectors.json';
import moonAlsep from './moon_alsep.json';
import marsViking from './mars_viking.json';
import marsSojourner from './mars_sojourner.json';
import marsPhoenix from './mars_phoenix.json';
import deepSpaceUnlock from './deep_space_unlock.json';
import dsPioneer from './ds_pioneer.json';
import dsVoyager from './ds_voyager.json';
import dsDs1NhBlocked from './ds_ds1_nh_blocked.json';
import climax from './climax.json';
import afterClimax from './after_climax.json';
import marsPhoenixMet from './mars_phoenix_met.json';
import outro from './outro.json';

export const SCENES: Record<string, Scene> = {
  intro: intro as Scene,
  moon_retroreflectors: moonRetroreflectors as Scene,
  moon_alsep: moonAlsep as Scene,
  mars_viking: marsViking as Scene,
  mars_sojourner: marsSojourner as Scene,
  mars_phoenix: marsPhoenix as Scene,
  deep_space_unlock: deepSpaceUnlock as Scene,
  ds_pioneer: dsPioneer as Scene,
  ds_voyager: dsVoyager as Scene,
  ds_ds1_nh_blocked: dsDs1NhBlocked as Scene,
  climax: climax as Scene,
  after_climax: afterClimax as Scene,
  mars_phoenix_met: marsPhoenixMet as Scene,
  outro: outro as Scene
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}
