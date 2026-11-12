export const NARRATOR_NAME = 'Felice';
export const NARRATOR_FULL_NAME = 'FELI LIC ZRSNT67';
export const STORAGE_KEY = 'story-progress-v1';

export const FEATURE_FLAGS = {
  enforceOrderWithinDestination: false
};

export const HUB_PROMPTS = {
  main: "Please pick the destination you'd like to visit:",
  moon: 'Lunar Operations Hub - Select a landing site:',
  mars: 'Martian Surface Console - Select a research station:',
  deep_space: 'Deep Space Array - Select an outbound probe:'
};

export const HUB_LABELS = {
  main: {
    moon: 'Moon',
    mars: 'Mars',
    deepSpace: 'Deep space'
  },
  moon: {
    retroreflectors: 'Retroreflectors',
    alsep: 'ALSEP'
  },
  mars: {
    viking: 'Viking 1 and 2',
    sojourner: "Sojourner's_APXS",
    phoenix: 'TEGA&MECA'
  },
  deepSpace: {
    pioneer: 'Pioneer',
    voyager: 'Voyager',
    ds1: 'DS1',
    newHorizons: 'New Horizons'
  }
};

export const LOCKED_MESSAGES = {
  deepSpaceUnavailable: 'Deep space operations are temporarily unavailable. Let us explore the Moon and Mars first!',
  moonOrder: 'Ah, explorer! Let us start with the Retroreflectors before we inspect the ALSEP array.',
  marsOrderSojourner: 'Patience, fellow explorer! Let us visit Viking 1 and 2 before rolling over to Sojourner.',
  marsOrderPhoenix: 'Let us check on Sojourner before we head to the arctic plains for TEGA&MECA.',
  deepSpaceDs1Nh: 'Those deep space pioneers are venturing far out into the cosmos! Let us study Pioneer and Voyager first before we examine Deep Space 1 and New Horizons.'
};

export const PLACEHOLDER_TEXTS = {
  systemLine: (sceneId: string) => `[Placeholder: ${sceneId} — script not added yet]`,
  feliceLine: (sceneId: string) => `The data packet for ${sceneId} is being transcribed by the cartography team. Everything is operating smoothly!`
};

export const TYPING_SPEED_MS = {
  normal: 25,
  fast: 10,
  instant: 0
};
