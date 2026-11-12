import { HubCard, HubId } from '../types';
import { HUB_LABELS, FEATURE_FLAGS, LOCKED_MESSAGES } from './config';

export const SCENE_IDS = {
  INTRO: 'intro',
  MOON_RETRO: 'moon_retroreflectors',
  MOON_ALSEP: 'moon_alsep',
  MARS_VIKING: 'mars_viking',
  MARS_SOJOURNER: 'mars_sojourner',
  MARS_PHOENIX: 'mars_phoenix',
  DEEP_SPACE_UNLOCK: 'deep_space_unlock',
  DS_PIONEER: 'ds_pioneer',
  DS_VOYAGER: 'ds_voyager',
  DS_BLOCKED: 'ds_ds1_nh_blocked',
  CLIMAX: 'climax',
  AFTER_CLIMAX: 'after_climax',
  MARS_PHOENIX_MET: 'mars_phoenix_met',
  OUTRO: 'outro'
} as const;

export const ALL_SCENE_IDS: string[] = [
  SCENE_IDS.INTRO,
  SCENE_IDS.MOON_RETRO,
  SCENE_IDS.MOON_ALSEP,
  SCENE_IDS.MARS_VIKING,
  SCENE_IDS.MARS_SOJOURNER,
  SCENE_IDS.MARS_PHOENIX,
  SCENE_IDS.DEEP_SPACE_UNLOCK,
  SCENE_IDS.DS_PIONEER,
  SCENE_IDS.DS_VOYAGER,
  SCENE_IDS.DS_BLOCKED,
  SCENE_IDS.CLIMAX,
  SCENE_IDS.AFTER_CLIMAX,
  SCENE_IDS.MARS_PHOENIX_MET,
  SCENE_IDS.OUTRO
];

export function isMoonCompleted(completed: string[]): boolean {
  return (
    completed.includes(SCENE_IDS.MOON_RETRO) &&
    completed.includes(SCENE_IDS.MOON_ALSEP)
  );
}

export function isMarsCompleted(completed: string[]): boolean {
  return (
    completed.includes(SCENE_IDS.MARS_VIKING) &&
    completed.includes(SCENE_IDS.MARS_SOJOURNER) &&
    completed.includes(SCENE_IDS.MARS_PHOENIX)
  );
}

export function isPioneerVoyagerCompleted(completed: string[]): boolean {
  return (
    completed.includes(SCENE_IDS.DS_PIONEER) &&
    completed.includes(SCENE_IDS.DS_VOYAGER)
  );
}

export type NextStep =
  | { type: 'open_hub'; hub: HubId }
  | { type: 'play_scene'; sceneId: string }
  | { type: 'end_story' };

/**
 * Single source of truth for flow transitions when a scene finishes.
 */
export function getNextStepAfterScene(
  sceneId: string,
  completedSceneIds: string[],
  deepSpaceUnlocked: boolean,
  _climaxDone: boolean = false
): NextStep {
  // If intro ends, go to the main console
  if (sceneId === SCENE_IDS.INTRO) {
    return { type: 'open_hub', hub: 'main' };
  }

  // Moon scenes
  if (sceneId === SCENE_IDS.MOON_RETRO || sceneId === SCENE_IDS.MOON_ALSEP) {
    const moonDone = isMoonCompleted(completedSceneIds);
    if (!moonDone) {
      return { type: 'open_hub', hub: 'moon' };
    }
    // Moon is completed
    const marsDone = isMarsCompleted(completedSceneIds);
    if (marsDone && !deepSpaceUnlocked) {
      // Both Moon and Mars complete, play deep space unlock
      return { type: 'play_scene', sceneId: SCENE_IDS.DEEP_SPACE_UNLOCK };
    }
    return { type: 'open_hub', hub: 'main' };
  }

  // Mars scenes
  if (
    sceneId === SCENE_IDS.MARS_VIKING ||
    sceneId === SCENE_IDS.MARS_SOJOURNER ||
    sceneId === SCENE_IDS.MARS_PHOENIX
  ) {
    const marsDone = isMarsCompleted(completedSceneIds);
    const moonDone = isMoonCompleted(completedSceneIds);
    if (
      !deepSpaceUnlocked &&
      (sceneId === SCENE_IDS.MARS_PHOENIX || (marsDone && moonDone))
    ) {
      // Completing Mars's final mission (or both Moon and Mars) triggers Earth's Deep Space unlock transmission
      return { type: 'play_scene', sceneId: SCENE_IDS.DEEP_SPACE_UNLOCK };
    }
    if (!marsDone) {
      return { type: 'open_hub', hub: 'mars' };
    }
    return { type: 'open_hub', hub: 'main' };
  }

  // Deep Space Unlock
  if (sceneId === SCENE_IDS.DEEP_SPACE_UNLOCK) {
    return { type: 'open_hub', hub: 'deep_space' };
  }

  // Deep Space probes: returning to the 4-option Deep Space menu lets the
  // explorer choose DS1 or New Horizons once Pioneer & Voyager are complete.
  if (sceneId === SCENE_IDS.DS_PIONEER || sceneId === SCENE_IDS.DS_VOYAGER) {
    return { type: 'open_hub', hub: 'deep_space' };
  }

  // Deep space redirect line
  if (sceneId === SCENE_IDS.DS_BLOCKED) {
    return { type: 'open_hub', hub: 'deep_space' };
  }

  // Climax sequence: linear chain to the end
  if (sceneId === SCENE_IDS.CLIMAX) {
    return { type: 'play_scene', sceneId: SCENE_IDS.AFTER_CLIMAX };
  }
  if (sceneId === SCENE_IDS.AFTER_CLIMAX) {
    return { type: 'play_scene', sceneId: SCENE_IDS.MARS_PHOENIX_MET };
  }
  if (sceneId === SCENE_IDS.MARS_PHOENIX_MET) {
    return { type: 'play_scene', sceneId: SCENE_IDS.OUTRO };
  }

  // Outro or any scene with endsStory handled by player
  if (sceneId === SCENE_IDS.OUTRO) {
    return { type: 'end_story' };
  }

  return { type: 'open_hub', hub: 'main' };
}

/**
 * Hub card configurations with dynamic unlock and completion states.
 */
export function getMainConsoleCards(
  completed: string[],
  deepSpaceUnlocked: boolean
): HubCard[] {
  const moonDone = isMoonCompleted(completed);
  const marsDone = isMarsCompleted(completed);

  return [
    {
      id: 'main_moon',
      label: HUB_LABELS.main.moon,
      description: 'Explore the lunar surface hardware left by Apollo astronauts.',
      targetHub: 'moon',
      isUnlocked: true,
      isCompleted: moonDone
    },
    {
      id: 'main_mars',
      label: HUB_LABELS.main.mars,
      description: 'Visit robotic landers and rovers across the Red Planet.',
      targetHub: 'mars',
      isUnlocked: true,
      isCompleted: marsDone
    },
    {
      id: 'main_deep_space',
      label: HUB_LABELS.main.deepSpace,
      description: 'Investigate the furthest probes journeying into interstellar space.',
      targetHub: 'deep_space',
      isUnlocked: deepSpaceUnlocked,
      isCompleted: completed.includes(SCENE_IDS.OUTRO),
      badgeText: deepSpaceUnlocked ? undefined : 'Temporarily unavailable',
      lockReason: LOCKED_MESSAGES.deepSpaceUnavailable
    }
  ];
}

export function getMoonHubCards(completed: string[]): HubCard[] {
  const retroDone = completed.includes(SCENE_IDS.MOON_RETRO);
  const alsepDone = completed.includes(SCENE_IDS.MOON_ALSEP);

  const alsepUnlocked =
    !FEATURE_FLAGS.enforceOrderWithinDestination || retroDone;

  return [
    {
      id: 'moon_retro',
      label: HUB_LABELS.moon.retroreflectors,
      description: 'Laser ranging retroreflector arrays left on the Moon.',
      targetScene: SCENE_IDS.MOON_RETRO,
      isUnlocked: true,
      isCompleted: retroDone
    },
    {
      id: 'moon_alsep',
      label: HUB_LABELS.moon.alsep,
      description: 'Apollo Lunar Surface Experiments Package scientific stations.',
      targetScene: SCENE_IDS.MOON_ALSEP,
      isUnlocked: alsepUnlocked,
      isCompleted: alsepDone,
      lockReason: LOCKED_MESSAGES.moonOrder
    }
  ];
}

export function getMarsHubCards(completed: string[]): HubCard[] {
  const vikingDone = completed.includes(SCENE_IDS.MARS_VIKING);
  const sojournerDone = completed.includes(SCENE_IDS.MARS_SOJOURNER);
  const phoenixDone = completed.includes(SCENE_IDS.MARS_PHOENIX);

  const sojournerUnlocked =
    !FEATURE_FLAGS.enforceOrderWithinDestination || vikingDone;
  const phoenixUnlocked =
    !FEATURE_FLAGS.enforceOrderWithinDestination || sojournerDone;

  return [
    {
      id: 'mars_viking',
      label: HUB_LABELS.mars.viking,
      description: 'The first successful long-term orbiters and landers on Mars.',
      targetScene: SCENE_IDS.MARS_VIKING,
      isUnlocked: true,
      isCompleted: vikingDone
    },
    {
      id: 'mars_sojourner',
      label: HUB_LABELS.mars.sojourner,
      description: 'The microwave-sized rover that tested Mars rocks with APXS.',
      targetScene: SCENE_IDS.MARS_SOJOURNER,
      isUnlocked: sojournerUnlocked,
      isCompleted: sojournerDone,
      lockReason: LOCKED_MESSAGES.marsOrderSojourner
    },
    {
      id: 'mars_phoenix',
      label: HUB_LABELS.mars.phoenix,
      description: 'Thermal and Electrical Analyzers in the Martian arctic plains.',
      targetScene: SCENE_IDS.MARS_PHOENIX,
      isUnlocked: phoenixUnlocked,
      isCompleted: phoenixDone,
      lockReason: LOCKED_MESSAGES.marsOrderPhoenix
    }
  ];
}

export function getDeepSpaceHubCards(completed: string[]): HubCard[] {
  const pioneerDone = completed.includes(SCENE_IDS.DS_PIONEER);
  const voyagerDone = completed.includes(SCENE_IDS.DS_VOYAGER);
  const climaxDone = completed.includes(SCENE_IDS.CLIMAX);
  const readyForRestrictedSites = pioneerDone && voyagerDone;

  // All 4 Deep Space options appear on the console per original script:
  // DS1 & New Horizons gently redirect to Pioneer/Voyager until both are completed,
  // and choosing either one afterward triggers the Climax sequence.
  return [
    {
      id: 'ds_pioneer',
      label: HUB_LABELS.deepSpace.pioneer,
      description: 'Pioneer 10 and 11, the first spacecraft to visit Jupiter and Saturn.',
      targetScene: SCENE_IDS.DS_PIONEER,
      isUnlocked: true,
      isCompleted: pioneerDone
    },
    {
      id: 'ds_voyager',
      label: HUB_LABELS.deepSpace.voyager,
      description: 'Voyager 1 and 2, carrying the Golden Records beyond the heliosphere.',
      targetScene: SCENE_IDS.DS_VOYAGER,
      isUnlocked: true,
      isCompleted: voyagerDone
    },
    {
      id: 'ds_ds1',
      label: HUB_LABELS.deepSpace.ds1,
      description: 'Deep Space 1 — experimental xenon ion-drive deep-space navigator.',
      targetScene: readyForRestrictedSites ? SCENE_IDS.CLIMAX : SCENE_IDS.DS_BLOCKED,
      isUnlocked: true,
      isCompleted: climaxDone,
      badgeText: readyForRestrictedSites ? undefined : 'Save for Last'
    },
    {
      id: 'ds_new_horizons',
      label: HUB_LABELS.deepSpace.newHorizons,
      description: 'New Horizons — first probe to explore Pluto and the Kuiper Belt.',
      targetScene: readyForRestrictedSites ? SCENE_IDS.CLIMAX : SCENE_IDS.DS_BLOCKED,
      isUnlocked: true,
      isCompleted: climaxDone,
      badgeText: readyForRestrictedSites ? undefined : 'Save for Last'
    }
  ];
}
