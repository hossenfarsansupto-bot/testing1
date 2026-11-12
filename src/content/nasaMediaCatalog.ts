import type { VisualizationId } from '../components/RetroreflectorVisualizations';
import type { AlsepVisualizationId } from '../components/AlsepVisualizations';
import type { VikingVisualizationId } from '../components/VikingVisualizations';
import type { SojournerVisualizationId } from '../components/SojournerVisualizations';
import type { PhoenixVisualizationId } from '../components/PhoenixVisualizations';
import type { PioneerVisualizationId } from '../components/PioneerVisualizations';
import type { VoyagerVisualizationId } from '../components/VoyagerVisualizations';
import type { FinalActVisualizationId } from '../components/FinalActVisualizations';
import type { Scene, StoryNode } from '../types';

export interface MediaSourceRef {
  label: string;
  url: string;
}

export interface InstrumentThumbItem {
  id: string;
  label: string;
  image?: string;
  badge: string;
  credit: string;
}

export interface DualPanelItem {
  label: string;
  sublabel: string;
  image: string;
  altText: string;
  credit: string;
  sourceUrl: string;
}

export interface NasaCueMedia {
  cueId: string;
  missionTag: string;
  title: string;
  caption: string;
  altText: string;
  credit: string;
  missionDate?: string;
  scaleNote?: string;
  objectFit?: 'cover' | 'contain';
  /** Local verified NASA asset path (only set when genuinely retrieved) */
  localImage?: string;
  localVideo?: string;
  localPoster?: string;
  captionsVtt?: string;
  videoTranscript?: string;
  visualizationId?: VisualizationId;
  alsepVizId?: AlsepVisualizationId;
  vikingVizId?: VikingVisualizationId;
  sojournerVizId?: SojournerVisualizationId;
  phoenixVizId?: PhoenixVisualizationId;
  pioneerVizId?: PioneerVisualizationId;
  voyagerVizId?: VoyagerVisualizationId;
  finalActVizId?: FinalActVisualizationId;
  instrumentThumbnails?: InstrumentThumbItem[];
  dualPanels?: DualPanelItem[];
  sources: MediaSourceRef[];
}

export interface GalleryMissionEntry {
  id: 'apollo11' | 'apollo14' | 'apollo15' | 'lunokhod' | 'blue_ghost';
  missionName: string;
  dateLabel: string;
  title: string;
  caption: string;
  credit: string;
  altText: string;
  localImage?: string;
  source: MediaSourceRef;
}

export const NASA_MEDIA_CATALOG: Record<string, NasaCueMedia> = {
  earth_moon_distance: {
    cueId: 'earth_moon_distance',
    missionTag: 'LUNAR LASER RANGING // DISTANCE',
    title: 'Earth–Moon Laser Pulse Timing',
    caption: 'Scientific visualization: Laser pulses traverse ~384,400 km from Earth to the Moon and return in ~2.5 seconds.',
    altText: 'Scientific diagram showing a laser pulse traveling from Earth to a lunar reflector and back in 2.5 seconds.',
    credit: 'App scientific visualization // NASA LRO reference',
    visualizationId: 'earth_moon_distance',
    sources: [
      {
        label: 'NASA LRO Laser-Ranging Explainer',
        url: 'https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/'
      }
    ]
  },
  lunar_vista: {
    cueId: 'lunar_vista',
    missionTag: 'SEA OF TRANQUILITY // LUNAR WALK',
    title: 'Tranquility Base Surface Traverse',
    caption: 'Subtle lunar vista during the EVA traverse toward the Apollo 11 Laser Ranging Retroreflector.',
    altText: 'Lunar surface archive reference from the Apollo 11 Lunar Surface Journal.',
    credit: 'NASA / Apollo 11 Lunar Surface Journal',
    missionDate: 'July 20, 1969',
    localImage: '/media/nasa/apollo11-tranquility-vista.jpg',
    sources: [
      {
        label: 'NASA Apollo 11 Image Archive',
        url: 'https://nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html'
      }
    ]
  },
  walk_earth_from_moon: {
    cueId: 'walk_earth_from_moon',
    missionTag: 'LUNAR LIBRATION // VIEW OF EARTH',
    title: 'Earth Over the Lunar Landscape',
    caption: 'From Earth’s near-side Moon, Earth hangs nearly stationary in the sky, wobbling slightly due to lunar libration.',
    altText: 'Earth seen from lunar vantage in official NASA Apollo photography.',
    credit: 'NASA Apollo Image Archive',
    missionDate: 'Apollo Era',
    localImage: '/media/nasa/earth-from-moon.jpg',
    sources: [
      {
        label: 'NASA Apollo 11 Image Archive',
        url: 'https://nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html'
      },
      {
        label: 'NASA NSSDC Apollo 11',
        url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html'
      }
    ]
  },
  apollo11_flyover: {
    cueId: 'apollo11_flyover',
    missionTag: 'SVS 4185 // SITE ARRIVAL',
    title: 'Apollo 11 Landing-Site Flyover',
    caption: 'NASA Scientific Visualization Studio 3D flyover approaching the Apollo 11 Sea of Tranquility landing area.',
    altText: '3D flyover visualization of the Apollo 11 Sea of Tranquility landing site.',
    credit: 'NASA Scientific Visualization Studio (SVS 4185)',
    missionDate: 'July 20, 1969 site',
    localVideo: '/media/nasa/apollo11-landing-site-flyover.mp4',
    localPoster: '/media/nasa/apollo11-flyover-poster.jpg',
    videoTranscript: '3D orbital approach descending toward the Sea of Tranquility landing area where Buzz Aldrin deployed the Passive Seismic Experiment Package and Laser Ranging Retroreflector.',
    sources: [
      {
        label: 'NASA SVS 4185: Apollo 11 Flyover',
        url: 'https://svs.gsfc.nasa.gov/4185/'
      },
      {
        label: 'NASA Apollo 50th Video Collection',
        url: 'https://www.nasa.gov/specials/apollo50th/videos-download.html'
      }
    ]
  },
  apollo11_reflector: {
    cueId: 'apollo11_reflector',
    missionTag: 'APOLLO 11 // JULY 20, 1969',
    title: 'Apollo 11 Lunar Laser Ranging Retroreflector',
    caption: 'Apollo 11 Lunar Laser Ranging Retroreflector — 100 corner-cube prisms.',
    altText: 'Astronaut Buzz Aldrin deploying the Early Apollo Scientific Experiments Package including the 100-prism Laser Ranging Retroreflector on the Moon.',
    credit: 'NASA / Neil Armstrong (AS11-40-5952 / LRRR)',
    missionDate: 'July 20, 1969',
    localImage: '/media/nasa/apollo11-reflector.jpg',
    sources: [
      {
        label: 'NASA Apollo 11 Image Archive',
        url: 'https://nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html'
      },
      {
        label: 'NASA/JPL Experiment History',
        url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/'
      }
    ]
  },
  corner_cube_diagram: {
    cueId: 'corner_cube_diagram',
    missionTag: 'OPTICS // GEOMETRY',
    title: 'Corner-Cube Prism & Array Cutaway',
    caption: 'Scientific visualization: Three perpendicular glass faces reflect any incoming laser ray back parallel to its arrival direction.',
    altText: 'Interactive cutaway diagram showing three perpendicular bounces inside a corner-cube prism and 10×10 array toggle.',
    credit: 'App scientific visualization // NASA LRO source reference',
    visualizationId: 'corner_cube_diagram',
    sources: [
      {
        label: 'NASA LRO Laser-Ranging Explainer',
        url: 'https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/'
      }
    ]
  },
  total_internal_reflection: {
    cueId: 'total_internal_reflection',
    missionTag: 'OPTICS // FUSED SILICA',
    title: 'Total Internal Reflection Cross-Section',
    caption: 'Scientific visualization: Uncoated fused silica reflects internally at the glass–vacuum boundary with minimal heat absorption.',
    altText: 'Cross-section diagram illustrating total internal reflection inside an uncoated fused-silica prism.',
    credit: 'App scientific visualization // NASA/JPL reference',
    visualizationId: 'total_internal_reflection',
    sources: [
      {
        label: 'NASA/JPL Apollo Experiment History',
        url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/'
      }
    ]
  },
  lick_timeline: {
    cueId: 'lick_timeline',
    missionTag: 'FIRST LIGHT ECHO // 1969',
    title: 'Apollo 11 Deployment → Lick Observatory Echo',
    caption: 'Historical timeline from July 20, 1969 deployment on the Moon to August 1, 1969 first laser return at Lick Observatory.',
    altText: 'Historical context timeline linking Apollo 11 deployment and Lick Observatory first successful lunar laser return.',
    credit: 'App historical timeline // NASA/JPL archive reference',
    missionDate: 'July 20 – August 1, 1969',
    visualizationId: 'lick_timeline',
    sources: [
      {
        label: 'NASA/JPL Apollo Experiment History',
        url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/'
      }
    ]
  },
  apollo14_fra_mauro: {
    cueId: 'apollo14_fra_mauro',
    missionTag: 'APOLLO 14 // FEBRUARY 5, 1971',
    title: 'Fra Mauro Highlands Twin 100-Prism Array',
    caption: 'Apollo 14 deployed a second 100-prism retroreflector at Fra Mauro, enabling measurements of lunar orientation and libration.',
    altText: 'Apollo 14 Lunar Laser Ranging Retroreflector deployed in the Fra Mauro highlands.',
    credit: 'NASA Apollo 14 Archive',
    missionDate: 'February 5, 1971',
    localImage: '/media/nasa/apollo14-reflector.jpg',
    sources: [
      {
        label: 'NASA Apollo 14 Mission Archive',
        url: 'https://www.nasa.gov/mission/apollo-14/'
      },
      {
        label: 'ILRS Reflector Reference',
        url: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html'
      }
    ]
  },
  apollo15_array: {
    cueId: 'apollo15_array',
    missionTag: 'APOLLO 15 // JULY 30, 1971',
    title: 'Apollo 15 300-Prism Retroreflector Array',
    caption: 'Apollo 15 array at Hadley-Apennine — 300 fused-silica corner cubes (~1 m × 0.6 m), 3× the prism count of Apollo 11 and 14.',
    altText: 'NASA photograph of the large 300-prism Apollo 15 Laser Ranging Retroreflector on the lunar surface near Hadley Rille.',
    credit: 'NASA Photojournal / Apollo 15 Hadley-Apennine Archive',
    missionDate: 'July 30, 1971',
    scaleNote: 'Panel scale: ~1.0 m × 0.6 m (300 prisms) vs. 100-prism Apollo 11 & 14 arrays',
    localImage: '/media/nasa/apollo15-array.jpg',
    sources: [
      {
        label: 'NASA Apollo 15 Reflector Photojournal',
        url: 'https://science.nasa.gov/photojournal/the-apollo-15-lunar-laser-ranging-retroreflector-a-fundamental-point-on-the-moon/'
      },
      {
        label: 'NASA Apollo 15 Hadley-Apennine Coverage',
        url: 'https://www.nasa.gov/history/50-years-ago-apollo-15-on-the-moon-at-hadley-apennine/'
      }
    ]
  },
  laser_ranging_anim: {
    cueId: 'laser_ranging_anim',
    missionTag: 'EARTH OBSERVATORY // PHOTON TIMING',
    title: 'Earth–Moon Single-Photon Laser Ranging',
    caption: 'Scientific visualization: Kilometre-wide outbound beam yields only a few returning photons timed to calculate d = c × t / 2.',
    altText: 'Animated diagram of laser beam divergence from Earth observatory and photon return timing.',
    credit: 'App scientific visualization // NASA LRO explainer reference',
    visualizationId: 'laser_ranging_anim',
    sources: [
      {
        label: 'NASA LRO Laser-Ranging Explainer',
        url: 'https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/'
      }
    ]
  },
  lunar_recession: {
    cueId: 'lunar_recession',
    missionTag: 'TIDAL EVOLUTION // +3.8 CM/YR',
    title: 'Lunar Orbital Recession (~3.8 cm/year)',
    caption: 'Scientific visualization: Tidal bulges pulled ahead of the Moon transfer angular momentum, lifting it by ~3.8 cm per year.',
    altText: 'Top-down orbital diagram showing tidal bulge offset and ~3.8 cm per year outward drift of the Moon.',
    credit: 'App scientific visualization // NASA LRO explainer reference',
    visualizationId: 'lunar_recession',
    sources: [
      {
        label: 'NASA LRO Laser-Ranging Explainer',
        url: 'https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/'
      }
    ]
  },
  hammer_feather_video: {
    cueId: 'hammer_feather_video',
    missionTag: 'APOLLO 15 // EQUIVALENCE PRINCIPLE',
    title: 'Apollo 15 Hammer-and-Feather Drop',
    caption: 'Commander David Scott drops a falcon feather and geology hammer in lunar vacuum — both land simultaneously.',
    altText: 'Archival video of Apollo 15 Commander David Scott performing the hammer-and-feather drop on the Moon.',
    credit: 'NASA / Apollo 15 Mission Footage',
    missionDate: 'August 2, 1971',
    localVideo: '/media/nasa/apollo15-hammer-feather.mp4',
    localPoster: '/media/nasa/hadley-rille.jpg',
    videoTranscript: 'In the airless lunar vacuum during Apollo 15, David Scott drops a 1.32 kg aluminum hammer and a 0.03 kg falcon feather from the same height; both hit the regolith at the exact same instant, illustrating Galileo and Einstein’s equivalence principle.',
    sources: [
      {
        label: 'NASA Apollo 15 Hammer-and-Feather Video',
        url: 'https://science.nasa.gov/resource/the-apollo-15-hammer-feather-drop-2/'
      }
    ]
  },
  moon_interior_libration: {
    cueId: 'moon_interior_libration',
    missionTag: 'GEOPHYSICS // CORE & LIBRATION',
    title: 'Moon Interior Cross-Section & Libration',
    caption: 'Scientific visualization: Tidal flexing and rotational libration hint at a partly molten core inside the Moon.',
    altText: 'Cross-section diagram showing lunar crust, mantle, and partly molten core with rotational wobble.',
    credit: 'App scientific visualization // NASA LRO explainer reference',
    visualizationId: 'moon_interior_libration',
    sources: [
      {
        label: 'NASA LRO Laser-Ranging Explainer',
        url: 'https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/'
      }
    ]
  },
  lunokhod_reveal: {
    cueId: 'lunokhod_reveal',
    missionTag: 'LUNA 17 & LUNA 21 // 1970 & 1973',
    title: 'Lunokhod 1 (1970) & Lunokhod 2 (1973) Reflectors',
    caption: 'Soviet Lunokhod 1 (Luna 17, 1970) and Lunokhod 2 (Luna 21, 1973) rovers also carried laser retroreflectors to the Moon.',
    altText: 'Archival image and technical reference for the Lunokhod 1 and Lunokhod 2 laser retroreflectors.',
    credit: 'ILRS / NASA CDDIS / LRO Archive',
    missionDate: 'Nov 1970 & Jan 1973',
    localImage: '/media/nasa/lunokhod-reflector.jpg',
    sources: [
      {
        label: 'ILRS Apollo & Luna Reflector Reference',
        url: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html'
      }
    ]
  },
  dust_degradation: {
    cueId: 'dust_degradation',
    missionTag: 'SIGNAL AGEING // UNDER STUDY',
    title: 'Possible Explanations Under Study: Dust & Ageing',
    caption: 'Returning laser signals have weakened over decades; suspected lunar dust kicked up by micrometeorites and thermal effects remain under study.',
    altText: 'Scientific diagram illustrating suspected micrometeorite dust and thermal cycling on retroreflector prisms.',
    credit: 'App scientific visualization // NASA/JPL reference',
    visualizationId: 'dust_degradation',
    sources: [
      {
        label: 'NASA/JPL Apollo Experiment History',
        url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/'
      }
    ]
  },
  modern_observatories: {
    cueId: 'modern_observatories',
    missionTag: 'ILRS & NASA CDDIS // GLOBAL NETWORK',
    title: 'Modern International Observatories & Archive',
    caption: 'Observatories in the US, France, Germany, and worldwide coordinate through ILRS, archiving data with NASA CDDIS.',
    altText: 'Archive data card summarizing global lunar laser ranging stations, ILRS coordination, and NASA CDDIS.',
    credit: 'International Laser Ranging Service (ILRS) / NASA CDDIS',
    visualizationId: 'modern_observatories',
    sources: [
      {
        label: 'ILRS Apollo & Luna Reflector Reference',
        url: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html'
      }
    ]
  },
  blue_ghost_nglr: {
    cueId: 'blue_ghost_nglr',
    missionTag: 'CLPS // BLUE GHOST 2025',
    title: 'Firefly Blue Ghost & Next Generation Lunar Retroreflector',
    caption: 'Blue Ghost delivered NASA’s Next Generation Lunar Retroreflector (NGLR) to Mare Crisium in 2025.',
    altText: 'NASA-hosted Firefly Blue Ghost lunar lander imagery on the Moon.',
    credit: 'NASA / Firefly Aerospace (Blue Ghost CLPS)',
    missionDate: 'March 2025',
    localImage: '/media/nasa/blue-ghost-moon.jpg',
    sources: [
      {
        label: 'NASA Blue Ghost Landing Footage',
        url: 'https://www.nasa.gov/general/nasa-cameras-on-blue-ghost-capture-first-of-its-kind-moon-landing-footage/'
      },
      {
        label: 'NASA Blue Ghost Science Update',
        url: 'https://www.nasa.gov/blogs/missions/2025/03/14/nasa-science-data-received-blue-ghost-captures-eclipse-from-moon/'
      }
    ]
  },
  three_array_quiz: {
    cueId: 'three_array_quiz',
    missionTag: 'CHECKPOINT QUIZ // APOLLO NETWORK',
    title: 'Apollo 11, 14 & 15 Retroreflector Network',
    caption: 'Compare the three Apollo arrays: Apollo 11 (100 prisms), Apollo 14 (100 prisms), and Apollo 15 (300 prisms).',
    altText: 'Comparison thumbnails of Apollo 11 (100), Apollo 14 (100), and Apollo 15 (300) prism arrays.',
    credit: 'NASA/JPL & Science Photojournal Reference',
    visualizationId: 'three_array_quiz',
    sources: [
      {
        label: 'NASA/JPL Apollo Experiment History',
        url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/'
      },
      {
        label: 'NASA Apollo 15 Photojournal',
        url: 'https://science.nasa.gov/photojournal/the-apollo-15-lunar-laser-ranging-retroreflector-a-fundamental-point-on-the-moon/'
      }
    ]
  },
  three_array_quiz_revealed: {
    cueId: 'three_array_quiz_revealed',
    missionTag: 'CHECKPOINT QUIZ // ANSWER',
    title: 'Three-Array Total: 500 Prisms',
    caption: '100 prisms (Apollo 11) + 100 prisms (Apollo 14) + 300 prisms (Apollo 15) = 500 fused-silica prisms.',
    altText: 'Quiz answer breakdown showing 100 + 100 + 300 = 500 prisms.',
    credit: 'NASA/JPL & Science Photojournal Reference',
    visualizationId: 'three_array_quiz_revealed',
    sources: [
      {
        label: 'NASA Apollo 15 Photojournal',
        url: 'https://science.nasa.gov/photojournal/the-apollo-15-lunar-laser-ranging-retroreflector-a-fundamental-point-on-the-moon/'
      }
    ]
  },
  closing_earth_horizon: {
    cueId: 'closing_earth_horizon',
    missionTag: 'TRANQUILITY BASE // LOOKING HOMEWARD',
    title: 'Earth Over the Lunar Horizon',
    caption: 'Apollo captured humanity looking back at Earth while leaving silent optical instruments still facing home.',
    altText: 'Lunar horizon looking toward Earth in the Apollo archive.',
    credit: 'NASA Apollo 11 Image Archive',
    missionDate: 'Apollo Archive',
    localImage: '/media/nasa/earthrise-horizon.jpg',
    sources: [
      {
        label: 'NASA Apollo 11 Image Archive',
        url: 'https://nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html'
      }
    ]
  },

  /* ============================================================
     MOON: ALSEP (APOLLO 15 / HADLEY RILLE)
     ============================================================ */

  alsep_hadley_opening: {
    cueId: 'alsep_hadley_opening',
    missionTag: 'APOLLO 15 // HADLEY-APENNINE',
    title: 'Mount Hadley & Stand-Up EVA Panorama',
    caption: 'View of Mount Hadley at Hadley-Apennine photographed during Apollo 15 EVA.',
    altText: 'Apollo 15 photograph looking across the Hadley-Apennine valley toward Mount Hadley.',
    credit: 'NASA / Johnson Space Center (AS15-87-11849)',
    missionDate: 'July–August 1971',
    localImage: '/media/moon/hadley-apennine.jpg',
    localPoster: '/media/moon/apollo15-standup-eva-poster.jpg',
    captionsVtt: '/media/moon/apollo15-standup-eva.vtt',
    videoTranscript: 'Apollo 15 Commander David Scott conducts a Stand-Up EVA from the Lunar Module hatch, surveying Mount Hadley and the Hadley-Apennine terrain before deploying ALSEP.',
    sources: [
      {
        label: 'NASA Apollo 15 Gallery',
        url: 'https://www.nasa.gov/gallery/apollo-15/'
      },
      {
        label: 'NASA SVS 4918: Stand-Up EVA',
        url: 'https://svs.gsfc.nasa.gov/4918/'
      }
    ]
  },

  alsep_hero_reveal: {
    cueId: 'alsep_hero_reveal',
    missionTag: 'APOLLO 15 // ALSEP DEPLOYMENT',
    title: 'Apollo 15 Surface Operations & Instruments',
    caption: 'Astronaut David R. Scott, commander, in the Lunar Roving Vehicle during Apollo 15 surface operations at Hadley-Apennine.',
    altText: 'Apollo 15 Commander David Scott in the Lunar Roving Vehicle during Apollo 15 surface operations (NASA Science ALSEP archive resource).',
    credit: 'NASA Science (AS15-85-11471)',
    missionDate: 'July 31, 1971',
    objectFit: 'contain',
    localImage: '/media/moon/alsep-apollo15.jpg',
    sources: [
      {
        label: 'NASA Science: Apollo 15 ALSEP Resource',
        url: 'https://science.nasa.gov/resource/apollo-15-mission-image-view-of-the-apollo-lunar-surface-experiments-package-alsep/'
      }
    ]
  },

  alsep_orbital_context: {
    cueId: 'alsep_orbital_context',
    missionTag: 'APOLLO 17 ALSEP EXAMPLE // LRO SVS 10818',
    title: 'Orbital ALSEP Context (Apollo 17 Example)',
    caption: 'NASA LRO visualization showing the Apollo 17 ALSEP station and astronaut traverse tracks (labeled explicitly as an Apollo 17 example, not Apollo 15).',
    altText: 'NASA SVS LRO orbital video showing the Apollo 17 ALSEP site and tracks.',
    credit: 'NASA Scientific Visualization Studio (SVS 10818 — Apollo 17)',
    missionDate: 'LRO Orbital Data',
    localVideo: '/media/moon/apollo17-alsep-lro.mp4',
    localPoster: '/media/moon/apollo17-alsep-lro-poster.jpg',
    videoTranscript: 'Lunar Reconnaissance Orbiter imagery reveals the Apollo 17 ALSEP station layout and astronaut footpaths across Taurus-Littrow (shown as a general ALSEP example).',
    sources: [
      {
        label: 'NASA SVS 10818 (Apollo 12/14/17 LRO)',
        url: 'https://svs.gsfc.nasa.gov/10818/'
      }
    ]
  },

  alsep_snap27: {
    cueId: 'alsep_snap27',
    missionTag: 'POWER SYSTEM // SNAP-27 RTG',
    title: 'SNAP-27 Radioisotope Thermoelectric Generator',
    caption: 'Technical schematic based on verified Apollo SNAP-27 specifications (~70 W DC initial output from Pu-238 decay).',
    altText: 'Technical schematic showing Pu-238 heat converted by thermoelectric elements into ~70 W steady power.',
    credit: 'App technical schematic // NASA Images Archive checked',
    alsepVizId: 'snap27_schematic',
    sources: [
      {
        label: 'NASA Image Library (SNAP-27 Search)',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20SNAP-27'
      }
    ]
  },

  alsep_fuel_transfer: {
    cueId: 'alsep_fuel_transfer',
    missionTag: 'SNAP-27 // FUEL CAPSULE TRANSFER',
    title: 'Pu-238 Fuel-Capsule Handling Schematic',
    caption: 'Explanatory diagram: transferring the hot plutonium-238 capsule from its protective graphite cask using a long-handled tool.',
    altText: 'Explanatory diagram of removing the Pu-238 fuel capsule from its cask and inserting it into SNAP-27.',
    credit: 'App explanatory diagram // NASA Images Archive checked',
    alsepVizId: 'snap27_fuel_transfer',
    sources: [
      {
        label: 'NASA Image Library (Fuel Capsule Search)',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20SNAP-27%20fuel%20capsule'
      }
    ]
  },

  alsep_quiz_night: {
    cueId: 'alsep_quiz_night',
    missionTag: 'CHECKPOINT QUIZ // LUNAR NIGHT',
    title: 'Lunar Day & Night Terminator',
    caption: 'Explanatory illustration of the Moon’s ~29.5-Earth-day day/night cycle (~14 Earth days of continuous darkness).',
    altText: 'Subtle lunar day/night terminator illustration.',
    credit: 'App explanatory illustration',
    alsepVizId: 'lunar_night_terminator',
    sources: [
      {
        label: 'NASA Apollo 15 ALSEP Resource',
        url: 'https://science.nasa.gov/resource/apollo-15-mission-image-view-of-the-apollo-lunar-surface-experiments-package-alsep/'
      }
    ]
  },

  alsep_instrument_menu: {
    cueId: 'alsep_instrument_menu',
    missionTag: 'APOLLO 15 ALSEP // 4 PRIMARY INSTRUMENTS',
    title: 'Select an ALSEP Instrument to Inspect',
    caption: 'Verified mission archival previews & instrument schematics. Inspect all four to unlock the Lunar Dust Detector.',
    altText: 'Thumbnails for Passive Seismic Experiment, Lunar Surface Magnetometer, Solar Wind Spectrometer, and Heat Flow Experiment.',
    credit: 'NASA JSC / KSC Archives & Instrument Schematics',
    instrumentThumbnails: [
      {
        id: 'pse',
        label: 'Passive Seismic (PSE)',
        image: '/media/moon/instruments/passive-seismic-a14.jpg',
        badge: 'Apollo 14 Photo Example',
        credit: 'NASA JSC (AS14-67-09362)'
      },
      {
        id: 'lsm',
        label: 'Magnetometer (LSM)',
        image: '/media/moon/instruments/magnetometer-a12.jpg',
        badge: 'Apollo 12 Photo Example',
        credit: 'NASA JSC (AS12-46-6813)'
      },
      {
        id: 'sws',
        label: 'Solar Wind (SWS)',
        badge: 'Scientific Schematic',
        credit: 'Illustrative Diagram'
      },
      {
        id: 'hfe',
        label: 'Heat Flow (HFE)',
        image: '/media/moon/instruments/heat-flow-drill-a15.jpg',
        badge: 'Apollo 15 Training',
        credit: 'NASA KSC (71pc0468)'
      }
    ],
    sources: [
      {
        label: 'NASA Image Library: ALSEP',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20passive%20seismic%20experiment'
      }
    ]
  },

  alsep_pse_photo: {
    cueId: 'alsep_pse_photo',
    missionTag: 'PASSIVE SEISMIC EXPERIMENT // PSE',
    title: 'Passive Seismic Experiment & Apollo 15 Readings',
    caption: 'Passive Seismic Experiment unit deployed on the Moon (Apollo 14 example shown; Apollo 15 Saturn S-IVB impact readings studied at JSC).',
    altText: 'View of the Passive Seismic Experiment deployed on the lunar surface.',
    credit: 'NASA Johnson Space Center (AS14-67-09362)',
    missionDate: 'Apollo PSE Archive',
    objectFit: 'contain',
    localImage: '/media/moon/instruments/passive-seismic-a14.jpg',
    sources: [
      {
        label: 'NASA PSE Image Archive',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20passive%20seismic%20experiment'
      }
    ]
  },

  alsep_pse_seismogram: {
    cueId: 'alsep_pse_seismogram',
    missionTag: 'CONTROLLED IMPACT // SEISMIC RINGING',
    title: 'Illustrative Lunar Seismogram Wave Trace',
    caption: 'Illustrative visualization (not an original NASA trace): Dry, fractured lunar regolith scatters artificial impact vibrations for long durations.',
    altText: 'Animated waveform illustrating long scattered seismic ringing after a Saturn S-IVB impact.',
    credit: 'App illustrative visualization // NASA S71-41422 context',
    alsepVizId: 'seismogram_wave_trace',
    sources: [
      {
        label: 'NASA Apollo 15 Seismometer Telemetry Archive',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20passive%20seismic%20experiment'
      }
    ]
  },

  alsep_lsm: {
    cueId: 'alsep_lsm',
    missionTag: 'LUNAR SURFACE MAGNETOMETER // LSM',
    title: 'Lunar Surface Magnetometer & Magnetic Crust',
    caption: 'Astronaut Alan Bean deploying the Lunar Surface Magnetometer (Apollo 12 photo example; Apollo 12, 15, and 16 tracked three-axis local crustal fields).',
    altText: 'Apollo astronaut deploying the three-axis Lunar Surface Magnetometer boom on the Moon.',
    credit: 'NASA Johnson Space Center (AS12-46-6813)',
    missionDate: 'Apollo LSM Archive',
    objectFit: 'contain',
    localImage: '/media/moon/instruments/magnetometer-a12.jpg',
    alsepVizId: 'magnetometer_field_illustration',
    sources: [
      {
        label: 'NASA LSM Image Library Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20lunar%20surface%20magnetometer'
      }
    ]
  },

  alsep_sws_anim: {
    cueId: 'alsep_sws_anim',
    missionTag: 'SOLAR WIND SPECTROMETER // SWS',
    title: 'Solar Wind Charged-Particle Stream Illustration',
    caption: 'Illustration: Unshielded by a thick atmosphere or global magnetosphere, solar protons and electrons strike lunar grains and enter SWS collectors.',
    altText: 'Animated particle flow illustration showing solar wind protons and electrons reaching the Moon.',
    credit: 'App illustrative scientific animation',
    alsepVizId: 'solar_wind_illustration',
    sources: [
      {
        label: 'NASA SWS Image Library Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20solar%20wind%20spectrometer'
      }
    ]
  },

  alsep_hfe_photo: {
    cueId: 'alsep_hfe_photo',
    missionTag: 'HEAT FLOW EXPERIMENT // APOLLO 15 DRILL',
    title: 'Apollo 15 Lunar Surface Drill (Heat Flow Prep)',
    caption: 'Apollo 15 Commander David R. Scott operates the battery-powered Lunar Surface Drill at a Hadley-Apennine replica site ahead of flight.',
    altText: 'David Scott operating the Apollo 15 Lunar Surface Drill during pre-flight geological training.',
    credit: 'NASA Kennedy Space Center (71pc0468)',
    missionDate: 'July 7, 1971 training',
    objectFit: 'contain',
    localImage: '/media/moon/instruments/heat-flow-drill-a15.jpg',
    sources: [
      {
        label: 'NASA Heat Flow Experiment Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20heat%20flow%20experiment'
      }
    ]
  },

  alsep_hfe_schematic: {
    cueId: 'alsep_hfe_schematic',
    missionTag: 'HEAT FLOW EXPERIMENT // SCHEMATIC',
    title: '2.3-Metre Borehole & Depth Sensor Schematic',
    caption: 'Schematic cutaway: Apollo 15 and 17 probes sat inside ~2.3 m deep holes to measure soil conductivity and escaping internal heat.',
    altText: 'Labeled cutaway schematic of lunar regolith borehole with depth temperature probes.',
    credit: 'App technical schematic',
    alsepVizId: 'heat_flow_schematic',
    sources: [
      {
        label: 'NASA Heat Flow Experiment Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20heat%20flow%20experiment'
      }
    ]
  },

  alsep_dust_unlock: {
    cueId: 'alsep_dust_unlock',
    missionTag: 'SPECIAL UNLOCK // LUNAR DUST DETECTOR',
    title: 'Lunar Dust Detector Schematic (Apollo 12 & 15)',
    caption: 'Schematic: Three small solar cells and temperature sensors atop Central Station monitored electrostatic dust accumulation and radiation exposure.',
    altText: 'Technical schematic showing the Lunar Dust Detector reference solar cells.',
    credit: 'App technical schematic // NASA Archive checked',
    alsepVizId: 'dust_detector_schematic',
    sources: [
      {
        label: 'NASA Dust Detector Image Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20lunar%20dust%20detector'
      }
    ]
  },

  alsep_dust_accumulation: {
    cueId: 'alsep_dust_accumulation',
    missionTag: 'LUNAR DUST // CONCEPTUAL ILLUSTRATION',
    title: 'Electrostatic Dust Accumulation on Solar Cell',
    caption: 'Conceptual illustration (not measured detector output): Sharp, jagged dust grains cling to exposed cells and reduce electrical power.',
    altText: 'Conceptual before/after illustration showing fine dust grains dulling solar cell output.',
    credit: 'App conceptual illustration',
    alsepVizId: 'dust_detector_accumulation',
    sources: [
      {
        label: 'NASA Dust Detector Image Search',
        url: 'https://images.nasa.gov/search?q=Apollo%2015%20lunar%20dust%20detector'
      }
    ]
  },

  alsep_closing_hadley: {
    cueId: 'alsep_closing_hadley',
    missionTag: 'HADLEY-APENNINE // SHUTDOWN SEPTEMBER 30, 1977',
    title: 'Silent ALSEP Sites Across Hadley',
    caption: 'Mount Hadley above the plain where Apollo 15’s silent ALSEP station remains powered off since September 30, 1977.',
    altText: 'Mount Hadley rising over the Apollo 15 landing plain.',
    credit: 'NASA JSC (AS15-87-11849)',
    missionDate: 'Apollo 15',
    localImage: '/media/moon/hadley-apennine.jpg',
    sources: [
      {
        label: 'NASA Apollo 15 Gallery',
        url: 'https://www.nasa.gov/gallery/apollo-15/'
      }
    ]
  },

  alsep_lro_retracing: {
    cueId: 'alsep_lro_retracing',
    missionTag: 'MODERN LRO ORBITAL VIEW // PIA13058',
    title: 'Retracing the Steps of Apollo 15 (LRO)',
    caption: 'Modern Lunar Reconnaissance Orbiter orbital view showing the Apollo 15 ALSEP site, Falcon descent stage, LRV, and rover tracks from orbit (not an astronaut-eye view).',
    altText: 'Modern LRO orbital photograph revealing the Apollo 15 ALSEP deployment area and rover tracks.',
    credit: 'NASA / GSFC / Arizona State University (LRO PIA13058)',
    missionDate: 'LRO Orbital Archive',
    objectFit: 'contain',
    localImage: '/media/moon/apollo15-lro-retracing.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Retracing Apollo 15',
        url: 'https://science.nasa.gov/photojournal/retracing-the-steps-of-apollo-15/'
      }
    ]
  },

  /* ============================================================
     MARS: VIKING 1 & 2 (ANNOTATED FULL SCRIPT CUES)
     ============================================================ */

  viking_arrival: {
    cueId: 'viking_arrival',
    missionTag: 'CHRYSE PLANITIA // VIKING 1 LANDING SITE',
    title: 'Chryse Planitia — Viking 1 First Surface View',
    caption: 'Chryse Planitia — Viking 1 landing site. First clear surface photograph returned on July 20, 1976.',
    altText: 'Rocky rusty plain at Chryse Planitia captured by NASA Viking 1 lander.',
    credit: 'NASA / JPL-Caltech (Viking 1 Archive)',
    missionDate: 'July 20, 1976',
    localImage: '/media/mars/viking/viking1-first-surface.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      },
      {
        label: 'NASA Viking 1 Page',
        url: 'https://science.nasa.gov/mission/viking-1/'
      }
    ]
  },

  viking_landing_date: {
    cueId: 'viking_landing_date',
    missionTag: 'JULY 20, 1976 // LANDING ANNIVERSARY',
    title: 'Viking 1 Touchdown — 20 July 1976',
    caption: 'Seven years to the day after Apollo 11 landed on the Moon, Viking 1 touched down on Mars (Viking Lander view, July 20, 1976).',
    altText: 'Viking Lander surface scene commemorating the July 20, 1976 Mars touchdown.',
    credit: 'NASA / JPL (PIA09703)',
    missionDate: 'July 20, 1976',
    localImage: '/media/mars/viking-lander.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_architecture: {
    cueId: 'viking_architecture',
    missionTag: 'VIKING ARCHITECTURE // 2 ORBITERS + 2 LANDERS',
    title: 'Viking Mission Pair Architecture',
    caption: 'Official Viking spacecraft visual & interactive schematic showing the uncrewed Orbiter-Lander-Relay system.',
    altText: 'Viking spacecraft overview and orbiter-lander relay diagram.',
    credit: 'NASA / Viking Spacecraft and Science',
    objectFit: 'contain',
    localImage: '/media/mars/viking/viking-orbiter-craft.jpg',
    vikingVizId: 'viking_architecture',
    sources: [
      {
        label: 'NASA Viking Spacecraft and Science',
        url: 'https://science.nasa.gov/mission/viking/spacecraft-and-science/'
      }
    ]
  },

  viking_lander_reveal: {
    cueId: 'viking_lander_reveal',
    missionTag: 'VIKING LANDER // HARDWARE DIAGRAM',
    title: 'Viking Lander (~657 kg Hexagon & RTG Power)',
    caption: 'NASA line drawing of the hexagonal uncrewed Viking Lander, sampler boom, antennas, and RTG windscreens.',
    altText: 'Labeled technical drawing of the NASA Viking Mars Lander.',
    credit: 'NASA / Viking Project Archive',
    objectFit: 'contain',
    localImage: '/media/mars/viking/viking-lander-diagram.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      },
      {
        label: 'NASA Viking 2 Resource',
        url: 'https://science.nasa.gov/mission/viking-2/'
      }
    ]
  },

  viking_edl_sequence: {
    cueId: 'viking_edl_sequence',
    missionTag: 'EDL // AUTONOMOUS DESCENT',
    title: 'Viking Entry, Descent & Landing Sequence',
    caption: 'Sequence illustration: autonomous braking from atmospheric entry to parachute, heat-shield release, radar scan, and retrorocket touchdown.',
    altText: 'Six-stage autonomous Mars entry, descent, and landing sequence strip.',
    credit: 'App sequence illustration // NASA Viking reference',
    vikingVizId: 'viking_edl_sequence',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_1_2_compare: {
    cueId: 'viking_1_2_compare',
    missionTag: 'CHRYSE VS UTOPIA PLANITIA // 6,460 KM APART',
    title: 'Viking 1 (July 20) & Viking 2 (September 3, 1976)',
    caption: 'Side-by-side comparison of NASA’s Viking 1 (Chryse Planitia, July 20, 1976) and Viking 2 (Utopia Planitia, Sept 3, 1976) landing sites.',
    altText: 'Dual surface views contrasting Viking 1 at Chryse Planitia and Viking 2 at Utopia Planitia.',
    credit: 'NASA / JPL-Caltech (Viking 1 & Viking 2)',
    dualPanels: [
      {
        label: 'Viking 1 — Chryse Planitia',
        sublabel: 'Landed July 20, 1976',
        image: '/media/mars/viking/viking1-first-surface.jpg',
        altText: 'Viking 1 first surface view at Chryse Planitia.',
        credit: 'NASA / JPL',
        sourceUrl: 'https://science.nasa.gov/mission/viking-1/'
      },
      {
        label: 'Viking 2 — Utopia Planitia',
        sublabel: 'Landed Sept 3, 1976 (~6,460 km away)',
        image: '/media/mars/viking/viking2-utopia-surface.jpg',
        altText: 'Viking 2 surface view of rocky Utopia Planitia (PIA01522).',
        credit: 'NASA / JPL (PIA01522)',
        sourceUrl: 'https://science.nasa.gov/mission/viking-2/'
      }
    ],
    sources: [
      {
        label: 'NASA Viking 1 Page',
        url: 'https://science.nasa.gov/mission/viking-1/'
      },
      {
        label: 'NASA Viking 2 Page',
        url: 'https://science.nasa.gov/mission/viking-2/'
      }
    ]
  },

  viking_impact_scale: {
    cueId: 'viking_impact_scale',
    missionTag: 'VIKING ORBITER MOSAIC // 97% MAPPED',
    title: 'Mars Global Mapping & Mission Scale',
    caption: 'Viking Orbiter mosaic of Mars paired with the mission counts (~4,500 surface frames, 52,000+ orbiter images, ~97% mapped).',
    altText: 'Mars digital mosaic captured by NASA Viking Orbiter 1 (PIA00180).',
    credit: 'NASA / JPL-Caltech / USGS (PIA00180)',
    localImage: '/media/mars/viking/viking-orbiter-mosaic.jpg',
    vikingVizId: 'viking_impact_scale',
    sources: [
      {
        label: 'NASA Viking 1 Mission Stats',
        url: 'https://science.nasa.gov/mission/viking-1/'
      }
    ]
  },

  viking_met_boom: {
    cueId: 'viking_met_boom',
    missionTag: 'INSTRUMENT 1 // METEOROLOGY BOOM',
    title: 'Viking Meteorology Boom (1.6 m Mast)',
    caption: 'Lander hardware diagram showing the 1.6-metre meteorology boom that measured temperature, air pressure, wind speed, and direction.',
    altText: 'Viking Lander technical drawing showing the forward meteorology boom.',
    credit: 'NASA Viking Mission Resources',
    objectFit: 'contain',
    localImage: '/media/mars/viking/viking-lander-diagram.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_weather_seasonal: {
    cueId: 'viking_weather_seasonal',
    missionTag: 'VIKING WEATHER STATION // SEASONAL CYCLE',
    title: 'Mars Daily & Seasonal Atmosphere',
    caption: 'Viking weather station context across Chryse Planitia — recording daily temperature swings and CO₂ polar freeze cycles.',
    altText: 'Viking Lander panorama across Chryse Planitia.',
    credit: 'NASA / JPL (PIA09703)',
    localImage: '/media/mars/viking-lander.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_seismometer_insight: {
    cueId: 'viking_seismometer_insight',
    missionTag: 'INSTRUMENT 2 // VIKING TO INSIGHT (PIA25282)',
    title: 'Seismology Evolution: Viking to InSight',
    caption: 'NASA InSight infographic (PIA25282): unlike Viking’s lander-mounted seismometer, InSight placed its sensor directly on Mars ground and recorded 1,000+ Marsquakes.',
    altText: 'NASA PIA25282 infographic showing how InSight studies Martian inner layers on the ground.',
    credit: 'NASA / JPL-Caltech (PIA25282)',
    objectFit: 'contain',
    localImage: '/media/mars/viking/insight-pia25282.jpg',
    sources: [
      {
        label: 'NASA Photojournal: InSight PIA25282',
        url: 'https://science.nasa.gov/photojournal/how-insight-studies-mars-inner-layers/'
      }
    ]
  },

  viking_gcms_diagram: {
    cueId: 'viking_gcms_diagram',
    missionTag: 'INSTRUMENT 3 // GCMS CHEMISTRY LAB',
    title: 'Gas Chromatograph–Mass Spectrometer Sample Flow',
    caption: 'Explanatory illustration: soil sample path from robotic scoop through heating ovens (150° / 300° / 500 °C), GC column, and mass spectrometer.',
    altText: 'Interactive four-stage explanatory diagram of the Viking GCMS pipeline.',
    credit: 'App explanatory illustration // NASA Viking Science reference',
    vikingVizId: 'viking_gcms_diagram',
    sources: [
      {
        label: 'NASA Viking Spacecraft & Science',
        url: 'https://science.nasa.gov/mission/viking/spacecraft-and-science/'
      }
    ]
  },

  viking_phoenix_perchlorate: {
    cueId: 'viking_phoenix_perchlorate',
    missionTag: 'PHOENIX, 2008 — LATER EVIDENCE',
    title: 'Phoenix Perchlorate Clue (Later Reinterpretation)',
    caption: 'Phoenix, 2008 — later evidence: Phoenix detected soil perchlorates that can destroy organic compounds during high-temperature GCMS heating.',
    altText: 'Archival Phoenix Mars Lander deck comparison image (PIA11373).',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA11373)',
    missionDate: '2008 Archival Context',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-deck-meca.jpg',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/phoenix/'
      }
    ]
  },

  viking_biology_lab: {
    cueId: 'viking_biology_lab',
    missionTag: 'BIOLOGY LAB // INCONCLUSIVE RESULTS',
    title: 'Viking Labeled Release & Chemistry Debate',
    caption: 'Evidence, not proof: Labeled Release detected gas release, yet reactive soil chemistry and negative GCMS organics leave no consensus for life.',
    altText: 'Summary card distinguishing Viking Labeled Release reaction from unresolved biological interpretation.',
    credit: 'App scientific summary // NASA Viking Project',
    vikingVizId: 'viking_biology_lab',
    sources: [
      {
        label: 'NASA Viking Overview',
        url: 'https://science.nasa.gov/mission/viking/'
      }
    ]
  },

  viking_comms_relay: {
    cueId: 'viking_comms_relay',
    missionTag: 'INSTRUMENT 4 // RELAY ARCHITECTURE',
    title: 'Viking ~20 W Lander → Orbiter → Earth Relay',
    caption: 'Explanatory schematic of the three-antenna relay architecture (high-gain dish, low-gain, and UHF orbiter relay) still used by rovers today.',
    altText: 'Silent schematic tracing telemetry from Viking Lander via Orbiter to Earth.',
    credit: 'App explanatory schematic // NASA Viking Spacecraft & Science',
    vikingVizId: 'viking_comms_relay',
    sources: [
      {
        label: 'NASA Viking Spacecraft & Science',
        url: 'https://science.nasa.gov/mission/viking/spacecraft-and-science/'
      }
    ]
  },

  viking_summary_archive: {
    cueId: 'viking_summary_archive',
    missionTag: 'VIKING ARCHIVE // MISSION SYNTHESIS',
    title: 'Viking Legacy & Orbital Survey',
    caption: 'Orbiter mosaic paired with surface exploration context: Viking found life’s basic elemental ingredients without confirming living organisms.',
    altText: 'Viking Orbiter mosaic of Mars (PIA00180).',
    credit: 'NASA / JPL-Caltech / USGS (PIA00180)',
    localImage: '/media/mars/viking/viking-orbiter-mosaic.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_color_trivia: {
    cueId: 'viking_color_trivia',
    missionTag: 'CHRYSE PLANITIA // COLOUR BALANCE',
    title: 'Colour Calibration & Butterscotch Sky',
    caption: 'Viking 1’s first colour view was briefly balanced too blue before engineers calibrated it to Mars’s true rusty-butterscotch sky.',
    altText: 'Calibrated butterscotch Mars sky photographed by NASA Viking Lander (PIA09703).',
    credit: 'NASA / JPL-Caltech (PIA09703)',
    localImage: '/media/mars/viking-lander.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      }
    ]
  },

  viking_end_reflection: {
    cueId: 'viking_end_reflection',
    missionTag: 'THOMAS A. MUTCH MEMORIAL STATION // END OF TOUR',
    title: 'Silent Landers in the Martian Dust',
    caption: 'Viking 1 (renamed Thomas A. Mutch Memorial Station) transmitted until November 1982; both silent landers remain where they touched down.',
    altText: 'Utopia Planitia surface scene and Mars Viking landing heritage.',
    credit: 'NASA / JPL-Caltech (PIA01522)',
    localImage: '/media/mars/viking/viking2-utopia-surface.jpg',
    sources: [
      {
        label: 'NASA Viking 1 Page',
        url: 'https://science.nasa.gov/mission/viking-1/'
      },
      {
        label: 'NASA Viking Overview',
        url: 'https://science.nasa.gov/mission/viking/'
      }
    ]
  },

  /* ============================================================
     OTHER DESTINATIONS: MARS & DEEP SPACE & REMOTE PHOENIX
     ============================================================ */

  mars_viking_surface: {
    cueId: 'mars_viking_surface',
    missionTag: 'VIKING 1 & 2 // CHRYSE PLANITIA 1976',
    title: 'Viking Mars Lander Surface Panorama',
    caption: 'NASA Viking Lander surface view on Mars (Viking 1 touched down in Chryse Planitia on July 20, 1976).',
    altText: 'Historic photograph of the rocky Martian plain captured by NASA’s Viking Lander.',
    credit: 'NASA / JPL / Viking Project (PIA09703)',
    missionDate: 'July 1976',
    localImage: '/media/mars/viking-lander.jpg',
    sources: [
      {
        label: 'NASA Viking Mission Resources',
        url: 'https://science.nasa.gov/mars/resources/viking-mission-resources/'
      },
      {
        label: 'NASA Viking Mission Overview',
        url: 'https://science.nasa.gov/mission/viking/'
      }
    ]
  },

  mars_sojourner_apxs: {
    cueId: 'mars_sojourner_apxs',
    missionTag: 'MARS PATHFINDER // SOJOURNER APXS 1997',
    title: 'Sojourner Rover Deploying APXS on Mars',
    caption: 'Mars Pathfinder’s Sojourner rover deploying its Alpha Proton X-ray Spectrometer against Martian rock in Ares Vallis (1997).',
    altText: 'Sojourner rover inspecting a Martian boulder using its rear APXS sensor on the Pathfinder mission.',
    credit: 'NASA / JPL (PIA01120 — Mars Pathfinder)',
    missionDate: 'Summer 1997',
    localImage: '/media/mars/sojourner-apxs.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      },
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  /* ============================================================
     MARS SOJOURNER & APXS TARGET CUES (5.Mars2 ANNOTATED SCRIPT)
     ============================================================ */

  sojourner_arrival: {
    cueId: 'sojourner_arrival',
    missionTag: 'ARES VALLIS // MARS PATHFINDER LANDING SITE',
    title: 'Ares Vallis — Rocky Flood-Carved Plain',
    caption: 'Terrain at the Mars Pathfinder landing site imaged on Sol 1 (July 5, 1997): a rock-strewn plain in Ares Vallis with distant hills on the horizon.',
    altText: 'Rocky Martian terrain around the Mars Pathfinder landing site showing deflated airbags in foreground.',
    credit: 'NASA / JPL (PIA00615)',
    missionDate: 'July 4, 1997',
    localImage: '/media/mars/pathfinder/ares-vallis-terrain-pia00615.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  pathfinder_lander_reveal: {
    cueId: 'pathfinder_lander_reveal',
    missionTag: 'MARS PATHFINDER LANDER // PETALS & AIRBAGS',
    title: 'Pathfinder Lander Petals & Deflated Airbags',
    caption: 'Imager for Mars Pathfinder (IMP) Sol 1 view of an opened lander solar petal and retracted landing airbags that cushioned Pathfinder’s bounce across Ares Vallis.',
    altText: 'Mars Pathfinder lander opened petal alongside retracted white airbags and Martian soil furrows.',
    credit: 'NASA / JPL (PIA00616)',
    missionDate: 'July 5, 1997',
    localImage: '/media/mars/pathfinder/pathfinder-airbags-petal-pia00616.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_rover_reveal: {
    cueId: 'sojourner_rover_reveal',
    missionTag: 'SOJOURNER ROVER // JULY 5, 1997 ROLLOUT',
    title: 'Sojourner Drives Onto Mars (~10.5 kg, 6 Wheels)',
    caption: 'Mars Pathfinder lander camera shows the microwave-sized Sojourner rover immediately after rolling down its ramp onto the Martian soil.',
    altText: 'Six-wheeled Sojourner rover resting on Martian dirt in front of the Mars Pathfinder lander ramp.',
    credit: 'NASA / JPL (PIA00623)',
    missionDate: 'July 5, 1997',
    localImage: '/media/mars/pathfinder/sojourner-touchdown-ramp-pia00623.jpg',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_duration_quiz: {
    cueId: 'sojourner_duration_quiz',
    missionTag: 'SOJOURNER // MISSION PLANNING CHECK',
    title: 'Mars Pathfinder & Sojourner Sol Check',
    caption: 'Pathfinder lander (Sagan Memorial Station) & Sojourner rover operations context at Ares Vallis.',
    altText: 'Sojourner rover after driving onto the Martian surface from Pathfinder.',
    credit: 'NASA / JPL (PIA00623)',
    localImage: '/media/mars/pathfinder/sojourner-touchdown-ramp-pia00623.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_traverse: {
    cueId: 'sojourner_traverse',
    missionTag: 'SURFACE TRAVERSE // 83 SOLS, ~100 METRES',
    title: '83 Sols (~100 m) & 16 Chemical Test Sites',
    caption: 'Over 83 sols instead of its planned 7, Sojourner drove ~100 metres around Pathfinder at roughly 1 cm/s, sending back hundreds of images and 16 chemical analyses.',
    altText: 'Sojourner rover inspecting boulders near Pathfinder on Mars.',
    credit: 'NASA / JPL (PIA01120)',
    missionDate: 'July – September 1997',
    localImage: '/media/mars/sojourner-apxs.jpg',
    sojournerVizId: 'sojourner_mobility',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_mobility: {
    cueId: 'sojourner_mobility',
    missionTag: 'MOBILITY & RELAY // ROCKER-BOGIE SUSPENSION',
    title: 'Rocker-Bogie Wheels & Lander Relay',
    caption: 'Illustrative schematic paired with Pathfinder surface photography: Sojourner’s six-wheel rocker-bogie suspension climbed uneven rocks while relaying through the lander.',
    altText: 'Interactive explanatory diagram of Sojourner six-wheel rocker-bogie suspension and Pathfinder relay.',
    credit: 'App explanatory diagram // NASA/JPL Pathfinder reference',
    sojournerVizId: 'sojourner_mobility',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_apxs_intro: {
    cueId: 'sojourner_apxs_intro',
    missionTag: 'INSTRUMENT // REAR-MOUNTED APXS HEAD',
    title: 'Alpha Proton X-ray Spectrometer (APXS)',
    caption: 'IMP camera view showing the APXS sensor cylinder mounted on Sojourner’s rear deployable arm before rollout (Max Planck Institute / U.S.–German–Russian heritage).',
    altText: 'Rear view of Sojourner on the lander showing the APXS instrument extending from the back.',
    credit: 'NASA / JPL (PIA00614)',
    missionDate: 'July 4, 1997',
    localImage: '/media/mars/pathfinder/sojourner-rear-apxs-pia00614.jpg',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      },
      {
        label: 'Max Planck Institute for Chemistry',
        url: 'https://www.mpic.de/'
      }
    ]
  },

  sojourner_apxs_principle: {
    cueId: 'sojourner_apxs_principle',
    missionTag: 'HOW APXS WORKS // CURIUM-244 SOURCE',
    title: 'Alpha Particles, Knocked Protons & X-rays',
    caption: 'Conceptual illustration: Curium-244 emits alpha particles into the rock, producing backscattered alphas, knocked protons, and characteristic X-rays.',
    altText: 'Silent conceptual flow diagram showing Curium-244 bombardment and three emitted radiation signals.',
    credit: 'App conceptual illustration // NASA/JPL APXS reference',
    sojournerVizId: 'apxs_principle',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_apxs_spectroscopy: {
    cueId: 'sojourner_apxs_spectroscopy',
    missionTag: 'SPECTROSCOPY // THREE RADIATION CHANNELS',
    title: 'Reading Elemental Fingerprints (Alpha / Proton / X-ray)',
    caption: 'Conceptual guide to the three APXS detection channels. Measurements took hours and often ran during the cold Martian night.',
    altText: 'Interactive three-channel guide comparing APXS alpha, proton, and X-ray fluorescence channels.',
    credit: 'App conceptual illustration // NASA/JPL APXS reference',
    sojournerVizId: 'apxs_spectroscopy',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_target_barnacle: {
    cueId: 'sojourner_target_barnacle',
    missionTag: 'TARGET 1 // BARNACLE BILL',
    title: 'Barnacle Bill — First Rover-Analysed Mars Rock',
    caption: 'Super-resolution IMP image of “Barnacle Bill,” the small rock west-northwest of Pathfinder that became the first rock chemically tested by a Mars rover.',
    altText: 'Mars Pathfinder IMP close-up image of the small angular rock Barnacle Bill.',
    credit: 'NASA / JPL (PIA01409)',
    objectFit: 'contain',
    localImage: '/media/mars/pathfinder/sojourner-barnacle-bill-pia01409.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_barnacle_chem: {
    cueId: 'sojourner_barnacle_chem',
    missionTag: 'BARNACLE BILL // ELEMENTS VS INTERPRETATION',
    title: 'High Silica & Andesite-Like Interpretation',
    caption: 'Distinguishing named elemental findings (silica, aluminium, iron, magnesium, calcium) from the andesite-like volcanic rock interpretation (dust/weathering caveats apply).',
    altText: 'Qualitative summary separating measured elements from andesite-like geological interpretation.',
    credit: 'App scientific summary // NASA/JPL Mars Pathfinder',
    sojournerVizId: 'barnacle_bill_chem',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_target_yogi: {
    cueId: 'sojourner_target_yogi',
    missionTag: 'TARGET 2 // YOGI ROCK',
    title: 'Sojourner Pressing APXS Against “Yogi”',
    caption: 'Mars Pathfinder close-up showing Sojourner backed up against the meter-scale boulder “Yogi” with its APXS sensor head placed directly on the rock surface.',
    altText: 'Sojourner rover deploying its rear APXS instrument onto the large rock Yogi.',
    credit: 'NASA / JPL (PIA00766)',
    missionDate: 'July 1997',
    localImage: '/media/mars/pathfinder/sojourner-yogi-pia00766.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_yogi_compare: {
    cueId: 'sojourner_yogi_compare',
    missionTag: 'YOGI VS BARNACLE BILL // ROCK DIVERSITY',
    title: 'Basaltic Yogi vs. Andesite-Like Barnacle Bill',
    caption: 'Qualitative compositional comparison: Yogi’s basaltic character vs. Barnacle Bill’s silica-rich character pointed to flood-carried rocks from diverse origins.',
    altText: 'Side-by-side qualitative comparison of Barnacle Bill and Yogi rock compositions.',
    credit: 'App scientific summary // NASA/JPL Mars Pathfinder',
    sojournerVizId: 'yogi_compare',
    sources: [
      {
        label: 'JPL Mars Pathfinder',
        url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder'
      }
    ]
  },

  sojourner_target_wedge_moe_soil: {
    cueId: 'sojourner_target_wedge_moe_soil',
    missionTag: 'TARGET 3 // WEDGE, MOE & SURFACE ARCHIVE',
    title: 'Rock Garden Targets: Wedge & Moe',
    caption: 'Verified Pathfinder target frames: Sojourner nearing “Wedge” near the Rock Garden (PIA04318) and deploying its APXS onto “Moe” on Sol 65 (PIA00967).',
    altText: 'Gallery pairing NASA Pathfinder photographs of Wedge and Moe APXS operations.',
    credit: 'NASA / JPL (PIA04318, PIA00967)',
    instrumentThumbnails: [
      {
        id: 'pf_wedge',
        label: 'Sojourner Nearing “Wedge” (PIA04318)',
        image: '/media/mars/pathfinder/sojourner-wedge-garden-pia04318.jpg',
        badge: 'Target: Wedge & Rock Garden',
        credit: 'NASA / JPL-Caltech'
      },
      {
        id: 'pf_moe',
        label: 'APXS at “Moe” — Sol 65 (PIA00967)',
        image: '/media/mars/pathfinder/sojourner-moe-color-pia00967.jpg',
        badge: 'Target: Moe (Half Dome behind)',
        credit: 'NASA / JPL'
      }
    ],
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_soil_compare: {
    cueId: 'sojourner_soil_compare',
    missionTag: 'REGIONAL SOIL // ARES VALLIS & VIKING SITES',
    title: 'Ares Vallis (Pathfinder) & Chryse Plains (Viking 1)',
    caption: 'Mars Global Surveyor regional view covering Ares Vallis and the Chryse Plains — where Pathfinder (1997) and Viking 1 (1976) sampled broadly similar Martian soils thousands of kilometres apart.',
    altText: 'Orbital Mars Global Surveyor map of Acidalia and Chryse Plains including Viking 1 and Pathfinder regions.',
    credit: 'NASA / JPL / MSSS (PIA02000)',
    objectFit: 'contain',
    localImage: '/media/mars/pathfinder/pathfinder-viking-region-pia02000.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_wheel_tracks: {
    cueId: 'sojourner_wheel_tracks',
    missionTag: 'TARGET 4 // SOJOURNER WHEEL TRACKS',
    title: 'Rover Wheel Tracks on Mars (Sol 3)',
    caption: 'Monochrome view from Sojourner’s own camera on Sol 3 capturing rover wheel tracks while maneuvering toward Barnacle Bill. Wheels also carried soil/adhesion mechanics studies.',
    altText: 'Wheel tracks stamped in Martian soil behind Sojourner on Sol 3.',
    credit: 'NASA / JPL (PIA00633)',
    missionDate: 'Sol 3 (July 1997)',
    objectFit: 'contain',
    localImage: '/media/mars/pathfinder/sojourner-wheel-tracks-pia00633.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_summary: {
    cueId: 'sojourner_summary',
    missionTag: 'APXS SUMMARY // FOUR-TARGET SYNTHESIS',
    title: 'Ingredients vs. Cake: Diverse Flood-Plains Crust',
    caption: 'Recap across Barnacle Bill, Yogi, Wedge/Moe, and wheel tracks: APXS revealed elemental ingredients across a flood-sorted Martian plain.',
    altText: 'Recap gallery of Barnacle Bill, Yogi, Moe, and Sojourner wheel tracks.',
    credit: 'NASA / JPL (PIA01409, PIA00766, PIA00967, PIA00633)',
    instrumentThumbnails: [
      {
        id: 'sum_bb',
        label: 'Barnacle Bill (Andesite-like)',
        image: '/media/mars/pathfinder/sojourner-barnacle-bill-pia01409.jpg',
        badge: 'High Silica Elements',
        credit: 'NASA / JPL'
      },
      {
        id: 'sum_yogi',
        label: 'Yogi Rock (Basaltic)',
        image: '/media/mars/pathfinder/sojourner-yogi-pia00766.jpg',
        badge: 'Fe/Mg Lava Character',
        credit: 'NASA / JPL'
      },
      {
        id: 'sum_moe',
        label: 'Wedge, Moe & Soil',
        image: '/media/mars/pathfinder/sojourner-moe-color-pia00967.jpg',
        badge: 'Catalogue & Widespread Soil',
        credit: 'NASA / JPL'
      },
      {
        id: 'sum_tracks',
        label: 'Wheel Tracks (Sol 3)',
        image: '/media/mars/pathfinder/sojourner-wheel-tracks-pia00633.jpg',
        badge: 'Soil Mechanics',
        credit: 'NASA / JPL'
      }
    ],
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_legacy: {
    cueId: 'sojourner_legacy',
    missionTag: 'ROVER DYNASTY // SOJOURNER → MER → CURIOSITY',
    title: 'Three Generations of NASA Mars Rovers (PIA11431)',
    caption: 'Full-scale JPL rover models in chronological lineage: tiny Sojourner (1997), twin Mars Exploration Rovers Spirit & Opportunity (2004), and Curiosity (MSL) — each carrying evolved APXS instruments.',
    altText: 'Full-scale models of Sojourner, Spirit/Opportunity test rover, and Curiosity side by side.',
    credit: 'NASA / JPL-Caltech (PIA11431)',
    objectFit: 'contain',
    localImage: '/media/mars/pathfinder/rover-generations-pia11431.jpg',
    sources: [
      {
        label: 'NASA Mars Exploration Rovers',
        url: 'https://science.nasa.gov/mission/mars-exploration-rovers/'
      }
    ]
  },

  sojourner_mission_end: {
    cueId: 'sojourner_mission_end',
    missionTag: 'END OF TRANSMISSION // SEPT 27, 1997',
    title: 'Pathfinder Relay Loss & Mission Completion',
    caption: 'Pathfinder transmitted its final message at 10:23 UTC on September 27, 1997; NASA formally declared the mission complete on March 10, 1998.',
    altText: 'Mars Pathfinder mission timeline paired with surface view of Sojourner on Mars.',
    credit: 'NASA / JPL (PIA01120)',
    localImage: '/media/mars/sojourner-apxs.jpg',
    sojournerVizId: 'pathfinder_timeline',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  sojourner_closing: {
    cueId: 'sojourner_closing',
    missionTag: 'ARES VALLIS // LEGACY AT REST',
    title: 'Still Waiting Quietly in Ares Vallis',
    caption: 'Both Pathfinder and Sojourner remain where they stopped in Ares Vallis — humanity’s first mobile geologist on another planet.',
    altText: 'Wide Mars Pathfinder view of the rocky Ares Vallis landing plain.',
    credit: 'NASA / JPL (PIA00615)',
    localImage: '/media/mars/pathfinder/ares-vallis-terrain-pia00615.jpg',
    sources: [
      {
        label: 'NASA Mars Pathfinder Mission',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/'
      }
    ]
  },

  mars_phoenix_deck: {
    cueId: 'mars_phoenix_deck',
    missionTag: 'MARS PHOENIX // TEGA & MECA DECK',
    title: 'Phoenix Lander Deck & MECA Chemistry Cells',
    caption: 'Phoenix Mars Lander deck (Oct 2008) showing Martian soil and upper-left MECA wet chemistry cells alongside TEGA thermal oven inlets.',
    altText: 'Phoenix Mars Lander deck photograph showing scooped arctic soil and MECA cells.',
    credit: 'NASA / JPL-Caltech / University of Arizona (PIA11373)',
    missionDate: 'October 19, 2008',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-deck-meca.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Soil on Phoenix Deck',
        url: 'https://science.nasa.gov/photojournal/soil-on-phoenix-deck/'
      },
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/mars-phoenix/'
      }
    ]
  },

  mars_phoenix_meca: {
    cueId: 'mars_phoenix_meca',
    missionTag: 'MARS PHOENIX // MECA MICROSCOPE SAMPLE',
    title: 'Phoenix MECA Optical & Atomic Force Sample',
    caption: 'Microscopic MECA instrument image and 3D representation of Martian arctic sample "Sorceress" delivered to Phoenix on July 2, 2008.',
    altText: 'Phoenix MECA microscope image of fine Martian arctic soil grains.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA11036)',
    missionDate: 'July 2, 2008',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-meca-sample.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Phoenix MECA Instruments',
        url: 'https://science.nasa.gov/photojournal/images-from-phoenixs-meca-instruments/'
      }
    ]
  },

  /* ============================================================
     MARS PHOENIX ARCTIC LANDER (6.Mars3 ANNOTATED SCRIPT)
     ============================================================ */

  phoenix_arrival: {
    cueId: 'phoenix_arrival',
    missionTag: 'VASTITAS BOREALIS (~68° N) // MAY 25, 2008',
    title: 'Phoenix Mars Lander — Martian Arctic Panorama',
    caption: 'NASA’s Phoenix Mars Lander solar panel and robotic arm overlooking the cold pale plains of Vastitas Borealis at ~68° N latitude.',
    altText: 'Panorama showing Phoenix solar panel wing and 2.35 m robotic arm above icy arctic Martian soil.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Texas A&M University (PIA10793)',
    missionDate: 'May 25, 2008 Landing',
    localImage: '/media/mars/phoenix/phoenix-panorama-arm-pia10793.jpg',
    sources: [
      {
        label: 'NASA History: Phoenix Mars Lander',
        url: 'https://www.nasa.gov/history/15-years-ago-phoenix-mars-lander-launches-to-the-red-planet/'
      }
    ]
  },

  phoenix_lander_arm: {
    cueId: 'phoenix_lander_arm',
    missionTag: 'PHOENIX HARDWARE // 2.35 m ROBOTIC ARM',
    title: 'Solar Wings & Articulated Trenching Arm',
    caption: 'Phoenix spread twin circular solar arrays and extended its 2.35-metre robotic arm with scoop-mounted camera to dig into shallow arctic permafrost.',
    altText: 'Phoenix Mars Lander solar wing and robotic arm scoop loaded with Martian soil.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Texas A&M University (PIA10793)',
    localImage: '/media/mars/phoenix/phoenix-panorama-arm-pia10793.jpg',
    sources: [
      {
        label: 'NASA History: Phoenix Mars Lander',
        url: 'https://www.nasa.gov/history/15-years-ago-phoenix-mars-lander-launches-to-the-red-planet/'
      }
    ]
  },

  phoenix_trench_ice: {
    cueId: 'phoenix_trench_ice',
    missionTag: 'DODO-GOLDILOCKS TRENCH // SOL 20',
    title: 'Ice on Mars — Now You See It (PIA10910)',
    caption: 'Surface Stereo Imager view (Sol 20, June 15, 2008): bright pale chunks uncovered inside the lower corner of trench Dodo-Goldilocks.',
    altText: 'Color Phoenix trench photo showing pale white lumps exposed beneath Martian dust.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Texas A&M University (PIA10910)',
    missionDate: 'June 15, 2008',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-ice-trench-pia10910.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Ice on Mars — Now You See It',
        url: 'https://science.nasa.gov/photojournal/ice-on-mars-now-you-see-it/'
      }
    ]
  },

  phoenix_disappearing_ice: {
    cueId: 'phoenix_disappearing_ice',
    missionTag: 'DODO-GOLDILOCKS // 4-DAY OBSERVATION',
    title: 'Disappearing Bright Material (PIA10906)',
    caption: 'Phoenix Surface Stereo Imager pair comparing the Dodo-Goldilocks trench across four sols as the exposed white material vanished without forming liquid puddles.',
    altText: 'Before-and-after Phoenix SSI trench frames over four days showing white lumps disappearing.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Texas A&M University (PIA10906)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-disappearing-ice-pia10906.jpg',
    phoenixVizId: 'sublimation_comparison',
    sources: [
      {
        label: 'NASA Photojournal: Disappearing Ice',
        url: 'https://science.nasa.gov/photojournal/disappearing-ice/'
      }
    ]
  },

  phoenix_deepens_trenches: {
    cueId: 'phoenix_deepens_trenches',
    missionTag: 'SUBSURFACE ICE LAYER // PIA11383',
    title: 'Phoenix Deepens Arctic Trenches Into Water Ice',
    caption: 'False-colour / SSI trench archive showing hard bright subsurface water ice resting just centimetres beneath the loose surface dust.',
    altText: 'Phoenix trenches carved into icy Martian Arctic ground revealing shallow water ice.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Texas A&M University (PIA11383)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-deepens-trenches-pia11383.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Phoenix Deepens Trenches',
        url: 'https://science.nasa.gov/photojournal/phoenix-deepens-trenches-on-mars-2/'
      }
    ]
  },

  phoenix_meca_lab: {
    cueId: 'phoenix_meca_lab',
    missionTag: 'PHOENIX DECK // MECA & TEGA LABORATORIES',
    title: 'MECA Instrument Suite on Phoenix Deck (PIA09954)',
    caption: 'Phoenix Microscopy, Electrochemistry, and Conductivity Analyzer (MECA) hardware — four soil-testing laboratories operating alongside TEGA on the lander deck.',
    altText: 'Phoenix MECA chemistry and microscopy hardware unit prior to deployment.',
    credit: 'NASA / JPL-Caltech / University of Arizona (PIA09954)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-meca-lab-pia09954.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Chemistry Lab for Phoenix (PIA09954)',
        url: 'https://science.nasa.gov/photojournal/chemistry-lab-for-phoenix-mars-lander/'
      }
    ]
  },

  phoenix_tega_furnace: {
    cueId: 'phoenix_tega_furnace',
    missionTag: 'INSTRUMENT 1 // TEGA THERMAL FURNACE',
    title: 'Thermal and Evolved Gas Analyzer — 8 Ovens (PIA10784)',
    caption: 'Computer-aided CAD illustration of TEGA: eight single-use micro-ovens reaching ~1,000 °C paired with a scanning calorimeter and mass spectrometer (confirmed H₂O vapour July 31, 2008).',
    altText: 'CAD illustration of Phoenix TEGA furnace module with eight oven cells and spectrometer.',
    credit: 'NASA / JPL / University of Arizona (PIA10784)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-tega-diagram-pia10784.jpg',
    phoenixVizId: 'tega_furnace',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/phoenix/'
      }
    ]
  },

  phoenix_tega_soil_screen: {
    cueId: 'phoenix_tega_soil_screen',
    missionTag: 'TEGA DELIVERY CHALLENGE // PIA10782',
    title: 'Clumpy Martian Soil Above TEGA Oven Screen',
    caption: 'Archival Phoenix image showing cohesive, clumpy soil resting atop a narrow TEGA oven inlet screen — requiring scoop vibration tricks to feed the sample.',
    altText: 'Clumpy Martian soil sample resting on the mesh inlet screen of a TEGA oven.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Max Planck Institute (PIA10782)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-tega-soil-screen-pia10782.jpg',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/phoenix/'
      }
    ]
  },

  phoenix_meca_microscopes: {
    cueId: 'phoenix_meca_microscopes',
    missionTag: 'INSTRUMENT 2 // MECA OPTICAL MICROSCOPE',
    title: 'MECA Microscope Soil-Grain Study (PIA11036)',
    caption: 'Phoenix MECA microscope observation of soil grains down to human-hair width — rounded, angular, and dusty grains record abrasion and wind transport.',
    altText: 'MECA microscope image and 3D particle analysis of Martian arctic sample Sorceress.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA11036)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-meca-sample.jpg',
    phoenixVizId: 'meca_microscopes',
    sources: [
      {
        label: 'NASA Photojournal: Phoenix MECA Instruments',
        url: 'https://science.nasa.gov/photojournal/images-from-phoenixs-meca-instruments/'
      }
    ]
  },

  phoenix_afm_operation: {
    cueId: 'phoenix_afm_operation',
    missionTag: 'MECA ATOMIC FORCE MICROSCOPE // PIA11040',
    title: 'How the Atomic Force Microscope “Feels” Soil Grains',
    caption: 'Scientific illustration showing MECA’s AFM dragging an ultra-sharp cantilever tip across soil grains while a reflected laser maps nanoscale surface relief.',
    altText: 'Scientific diagram of Phoenix MECA Atomic Force Microscope cantilever tip and laser readout.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona / Univ. of Neuchatel / Imperial College London (PIA11040)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-afm-operation-pia11040.jpg',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/phoenix/'
      }
    ]
  },

  phoenix_wcl_procedure: {
    cueId: 'phoenix_wcl_procedure',
    missionTag: 'INSTRUMENT 3 // MECA WET CHEMISTRY LAB (PIA10915)',
    title: 'Phoenix Wet Chemistry Laboratory Procedure',
    caption: 'Scientific illustration showing how MECA dissolved Martian arctic soil in Earth-brought water to test pH (7.7–8.3), soluble salts, and perchlorates.',
    altText: 'Scientific illustration of the four-step Wet Chemistry Laboratory sample dissolution process.',
    credit: 'NASA / JPL-Caltech / University of Arizona (PIA10915)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-wcl-procedure-pia10915.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Phoenix’s Wet Chemistry Lab',
        url: 'https://science.nasa.gov/photojournal/phoenixs-wet-chemistry-lab-2/'
      }
    ]
  },

  phoenix_wcl_cell: {
    cueId: 'phoenix_wcl_cell',
    missionTag: 'WCL SENSOR BEAKER // PIA10916',
    title: 'A Single-Use Wet Chemistry Laboratory Cell',
    caption: 'Labelled photograph of a Phoenix WCL disposable beaker with ion-selective sensors for chloride, bromide, magnesium, calcium, potassium, and pH.',
    altText: 'Labeled photograph of a Phoenix Wet Chemistry Laboratory test beaker cell.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Max Planck Institute (PIA10916)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-wcl-cell-pia10916.jpg',
    sources: [
      {
        label: 'NASA Photojournal: A Wet Chemistry Laboratory Cell',
        url: 'https://science.nasa.gov/photojournal/a-wet-chemistry-laboratory-cell/'
      }
    ]
  },

  phoenix_tecp_probe: {
    cueId: 'phoenix_tecp_probe',
    missionTag: 'INSTRUMENT 4 // MECA CONDUCTIVITY PROBE (TECP)',
    title: 'Thermal & Electrical Conductivity Probe Needles',
    caption: 'Illustrative schematic of the 4-needle TECP on Phoenix’s robotic arm measuring ground heat transfer, soil electrical conductivity, and near-surface humidity.',
    altText: 'Illustrative diagram of the four TECP needles pressed into Martian permafrost soil.',
    credit: 'App illustrative schematic // NASA Mars Phoenix TECP reference',
    phoenixVizId: 'tecp_probe',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/phoenix/'
      }
    ]
  },

  phoenix_arctic_summary: {
    cueId: 'phoenix_arctic_summary',
    missionTag: 'PHOENIX SUMMARY // ARCTIC WATER & PERCHLORATES',
    title: 'Ice Beneath Dust & Alkaline Perchlorate Soil',
    caption: 'Combined TEGA + MECA summary: subsurface water ice centimetres down, alkaline pH (~7.7–8.3), and perchlorates that reshaped how Viking organics results were interpreted.',
    altText: 'Summary card paired with Phoenix robotic-arm panorama and science findings.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA10793)',
    localImage: '/media/mars/phoenix/phoenix-panorama-arm-pia10793.jpg',
    phoenixVizId: 'arctic_water_cycle',
    sources: [
      {
        label: 'NASA History: Phoenix Mars Lander',
        url: 'https://www.nasa.gov/history/15-years-ago-phoenix-mars-lander-launches-to-the-red-planet/'
      }
    ]
  },

  phoenix_lidar_snow: {
    cueId: 'phoenix_lidar_snow',
    missionTag: 'PHOENIX LIDAR // MARTIAN ARCTIC SNOWFALL (PIA11200)',
    title: 'Snow Falling From High Martian Clouds',
    caption: 'Phoenix lidar laser atmospheric profile showing ice crystals falling from high clouds — revealing an active water-vapour, frost, and snowfall cycle.',
    altText: 'NASA Phoenix lidar scientific profile showing ice-crystal streaks descending from Martian clouds.',
    credit: 'NASA / JPL-Caltech / University of Arizona / Canadian Space Agency (PIA11200)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-lidar-snow-pia11200.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Lidar Snow Measurements',
        url: 'https://science.nasa.gov/photojournal/lidar-measurements-of-snow-falling-from-martian-clouds/'
      }
    ]
  },

  phoenix_end_reflection: {
    cueId: 'phoenix_end_reflection',
    missionTag: 'END OF ARCTIC SUMMER // NOVEMBER 2008',
    title: 'Quiet Slumber Beneath Martian Winter Frost',
    caption: 'Solar-powered Phoenix worked ~5 months instead of 90 sols before fading winter sunlight and frost silenced her in November 2008.',
    altText: 'Phoenix Arctic mission timeline alongside Phoenix lander deck photograph.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA11373)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-deck-meca.jpg',
    phoenixVizId: 'phoenix_timeline',
    sources: [
      {
        label: 'NASA History: Phoenix Mars Lander',
        url: 'https://www.nasa.gov/history/15-years-ago-phoenix-mars-lander-launches-to-the-red-planet/'
      }
    ]
  },

  ds_pioneer_jupiter: {
    cueId: 'ds_pioneer_jupiter',
    missionTag: 'PIONEER 10 // ARTIST ILLUSTRATION',
    title: 'Pioneer 10 Jupiter Encounter (Artist’s Concept)',
    caption: 'Artist’s illustration of NASA’s spin-stabilized Pioneer 10 spacecraft sweeping past Jupiter (December 1973). Not an optical spacecraft photograph.',
    altText: 'Artist concept showing the parabolic dish and long RTG booms of Pioneer 10 passing Jupiter.',
    credit: 'NASA Ames Research Center (Artist’s Concept)',
    missionDate: 'Launch March 1972',
    localImage: '/media/deep-space/pioneer-10-jupiter-illus.jpg',
    sources: [
      {
        label: 'NASA Science: Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ]
  },

  ds_voyager_craft: {
    cueId: 'ds_voyager_craft',
    missionTag: 'VOYAGER 1 & 2 // HARDWARE PROFILE',
    title: 'Voyager Spacecraft Science & Golden Record Profile',
    caption: 'Labeled Voyager spacecraft diagram highlighting its 3.7 m high-gain antenna, magnetometer boom, RTG power source, and Golden Record.',
    altText: 'NASA diagram of the Voyager spacecraft anatomy and science scan platform.',
    credit: 'NASA / JPL-Caltech',
    missionDate: 'Launched 1977',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager-profile.jpg',
    sources: [
      {
        label: 'NASA Gallery: Images of Voyager',
        url: 'https://science.nasa.gov/gallery/images-of-voyager/'
      }
    ]
  },

  ds_voyager_pbd: {
    cueId: 'ds_voyager_pbd',
    missionTag: 'VOYAGER 1 // PALE BLUE DOT (1990)',
    title: 'Pale Blue Dot — Earth From 6 Billion Kilometres',
    caption: 'Actual Voyager 1 photograph taken February 14, 1990: Earth appears as a tiny bright speck suspended in a scattered sunbeam.',
    altText: 'Voyager 1 Pale Blue Dot photograph showing tiny Earth inside a sunlit camera ray.',
    credit: 'NASA / JPL-Caltech (PIA00452)',
    missionDate: 'February 14, 1990',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager-pale-blue-dot.jpg',
    sources: [
      {
        label: 'NASA Science: Voyager Mission',
        url: 'https://science.nasa.gov/mission/voyager/'
      }
    ]
  },

  ds_blocked_pair: {
    cueId: 'ds_blocked_pair',
    missionTag: 'DEEP SPACE ARCHIVE // TWO SEPARATE MISSIONS',
    title: 'Deep Space 1 & New Horizons Reference',
    caption: 'Deep Space 1 tested ion propulsion (1998–2001); New Horizons explored Pluto (2015). Shown separately as mission references.',
    altText: 'Separate reference cards for NASA Deep Space 1 spacecraft and New Horizons Pluto imagery.',
    credit: 'NASA / JPL-Caltech & JHUAPL / SwRI',
    dualPanels: [
      {
        label: 'Deep Space 1 (Ion Engine)',
        sublabel: 'New Millennium test flight (1998–2001)',
        image: '/media/deep-space/deep-space-1.jpg',
        altText: 'Artist/engineering view of Deep Space 1 with blue xenon ion thrust.',
        credit: 'NASA / JPL',
        sourceUrl: 'https://science.nasa.gov/mission/deep-space-1/'
      },
      {
        label: 'New Horizons — Pluto (2015)',
        sublabel: 'Separate Kuiper Belt flyby mission',
        image: '/media/deep-space/new-horizons-pluto.jpg',
        altText: 'True-color enhanced New Horizons portrait of Pluto and Tombaugh Regio.',
        credit: 'NASA / JHUAPL / SwRI (PIA20291)',
        sourceUrl: 'https://science.nasa.gov/gallery/pluto/'
      }
    ],
    sources: [
      {
        label: 'NASA Deep Space 1',
        url: 'https://science.nasa.gov/mission/deep-space-1/'
      },
      {
        label: 'NASA Pluto Gallery (New Horizons)',
        url: 'https://science.nasa.gov/gallery/pluto/'
      }
    ]
  },

  remote_phoenix_observation: {
    cueId: 'remote_phoenix_observation',
    missionTag: 'REMOTE OBSERVATION // ARCHIVAL PHOENIX SITE VIEW',
    title: 'Phoenix Lander Orbital Status (MRO)',
    caption: 'Archival orbital view from NASA’s Mars Reconnaissance Orbiter comparing Phoenix in 2008 and 2010 — solar panels likely collapsed under Martian CO₂ winter ice.',
    altText: 'Before and after Mars Reconnaissance Orbiter views of the Phoenix Mars Lander site.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA13158)',
    missionDate: 'May 2010 Archival Observation',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-orbit-collapsed.jpg',
    sources: [
      {
        label: 'NASA Mars Phoenix Mission',
        url: 'https://science.nasa.gov/mission/mars-phoenix/'
      },
      {
        label: 'NASA Photojournal: Phoenix Lander Archive',
        url: 'https://science.nasa.gov/science-org-term/photojournal-spacecraft-phoenix-mars-lander/'
      }
    ]
  },

  deep_space_earth_message: {
    cueId: 'deep_space_earth_message',
    missionTag: 'EARTH MISSION CONTROL // PRIORITY CLEARANCE',
    title: 'Earth Clearance for Deep Space Exploration',
    caption: 'Earth glowing across the void—sending Mission Control authorization for the Aeroship console to depart Mars and chart Deep Space.',
    altText: 'View of Earth across dark space symbolizing Mission Control transmission.',
    credit: 'NASA',
    objectFit: 'contain',
    localImage: '/media/nasa/earth-from-moon.jpg',
    sources: [
      {
        label: 'NASA Deep Space Exploration',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ]
  },

  pioneer_arrival_deep_space: {
    cueId: 'pioneer_arrival_deep_space',
    missionTag: 'PIONEER 10 // DEEP SPACE ESTABLISHING VIEW',
    title: 'Pioneer Heading Into Deep Interstellar Space (Artist’s Concept)',
    caption: 'Artist’s concept of Pioneer cruising silently through the dark beyond 12 billion kilometres from Earth with a telemetry radio delay over eleven hours.',
    altText: 'NASA/JPL artist concept showing the Pioneer spacecraft drifting into a dark deep-space star field.',
    credit: 'NASA / JPL-Caltech',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-deep-space-galaxy-nasa.jpg',
    sources: [
      {
        label: 'NASA JPL: Pioneer Anomaly Article',
        url: 'https://www.jpl.nasa.gov/news/study-finds-heat-is-source-of-pioneer-anomaly/'
      },
      {
        label: 'NASA Science: Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ]
  },

  pioneer_spacecraft_diagram: {
    cueId: 'pioneer_spacecraft_diagram',
    missionTag: 'PIONEER 10 & 11 // SPACECRAFT DIAGRAM',
    title: 'Pioneer Spacecraft Hardware Layout',
    caption: 'Official NASA technical diagram identifying the 2.74 m high-gain antenna dish, six-sided equipment bay, twin RTG booms, and magnetometer boom.',
    altText: 'Labelled NASA technical diagram of the Pioneer 10 spacecraft layout.',
    credit: 'NASA',
    missionDate: 'Launched March 2, 1972',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer-spacecraft-diagram-nasa.jpg',
    pioneerVizId: 'pioneer_spacecraft_hotspots',
    sources: [
      {
        label: 'NASA Science: Pioneer Spacecraft Diagram',
        url: 'https://science.nasa.gov/resource/pioneer-spacecraft-diagram/'
      }
    ]
  },

  pioneer_asteroid_belt: {
    cueId: 'pioneer_asteroid_belt',
    missionTag: 'PIONEER 10 // HISTORICAL ILLUSTRATION',
    title: 'Pioneer 10 Crosses the Main Asteroid Belt',
    caption: 'Historical NASA illustration (not a photograph) depicting Pioneer 10 safely pioneering the corridor through the Asteroid Belt toward Jupiter.',
    altText: 'Historical NASA illustration of Pioneer 10 travelling through the asteroid belt.',
    credit: 'NASA',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-asteroid-belt-nasa.jpg',
    pioneerVizId: 'asteroid_route',
    sources: [
      {
        label: 'NASA: Pioneer 10 Crosses the Asteroid Belt',
        url: 'https://www.nasa.gov/image-article/pioneer-10-crosses-the-asteroid-belt/'
      }
    ]
  },

  pioneer_jupiter_flyby: {
    cueId: 'pioneer_jupiter_flyby',
    missionTag: 'PIONEER 10 AT JUPITER // DECEMBER 1973',
    title: 'Pioneer 10 Jupiter Flyby Imagery',
    caption: 'Authentic Pioneer 10 view captured during the historic December 1973 Jupiter encounter — the first close-up images of an outer gas giant.',
    altText: 'Pioneer 10 spacecraft view of Jupiter and its banded atmosphere from December 1973.',
    credit: 'NASA',
    missionDate: 'December 1973',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Science: Pioneer 10 at Jupiter',
        url: 'https://science.nasa.gov/resource/pioneer-10-at-jupiter/'
      }
    ]
  },

  pioneer_last_signal: {
    cueId: 'pioneer_last_signal',
    missionTag: 'PIONEER 10 // 30+ YEARS OF TELEMETRY',
    title: 'Nearly 31 Years Operating Beyond Mars',
    caption: 'Built for a 21-month plan, Pioneer 10 continued transmitting faint radio signals until January 23, 2003 — nearly 31 years after launch.',
    altText: 'Artist concept and mission timeline showing Pioneer 10 operating until January 23, 2003.',
    credit: 'NASA Science (Artist’s Concept)',
    missionDate: '1972 – 2003 (Final Attempt 2006)',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-deep-space-galaxy-nasa.jpg',
    pioneerVizId: 'pioneer_last_signal_timeline',
    sources: [
      {
        label: 'NASA Science: Pioneer 10 Sends Last Signal',
        url: 'https://science.nasa.gov/missions/pioneer/pioneer-10-sends-last-signal/'
      }
    ]
  },

  pioneer_spin_stabilization: {
    cueId: 'pioneer_spin_stabilization',
    missionTag: 'PIONEER // SPIN STABILIZATION (CONCEPTUAL)',
    title: 'Spin Stabilization at 4.8 RPM',
    caption: 'NASA Pioneer spacecraft diagram paired with a conceptual explanation of how 4.8 turns per minute kept the dish pointed steadily toward Earth.',
    altText: 'Pioneer spacecraft diagram and conceptual spin stabilization graphic.',
    credit: 'NASA (Diagram); Conceptual explanatory animation',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer-spacecraft-diagram-nasa.jpg',
    pioneerVizId: 'spin_stabilization',
    sources: [
      {
        label: 'NASA Science: Pioneer Spacecraft Diagram',
        url: 'https://science.nasa.gov/resource/pioneer-spacecraft-diagram/'
      }
    ]
  },

  pioneer_rtg_power: {
    cueId: 'pioneer_rtg_power',
    missionTag: 'PIONEER // RTG NUCLEAR POWER & THERMAL LOUVERS',
    title: 'Pu-238 Radioisotope Generators & Automatic Louvers',
    caption: 'Conceptual Pu-238 decay heat conversion and passive thermal louvers alongside NASA’s Pioneer hardware layout (~155 W at launch; sunlight is 25x weaker at Jupiter).',
    altText: 'Pioneer hardware diagram with Radioisotope Power System and thermal control conceptual graphic.',
    credit: 'NASA',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer-spacecraft-diagram-nasa.jpg',
    pioneerVizId: 'rtg_thermal_control',
    sources: [
      {
        label: 'NASA Radioisotope Power Systems Missions',
        url: 'https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/missions/'
      },
      {
        label: 'NASA Science: Pioneer Spacecraft Diagram',
        url: 'https://science.nasa.gov/resource/pioneer-spacecraft-diagram/'
      }
    ]
  },

  pioneer_plaque_closeup: {
    cueId: 'pioneer_plaque_closeup',
    missionTag: 'PIONEER PLAQUE // GOLD-ANODIZED INTERSTELLAR MESSAGE',
    title: 'The Pioneer Plaque (Sagan, Drake & Salzman Sagan)',
    caption: 'Official NASA plaque graphic carrying the 21 cm hydrogen transition ruler, 14-pulsar map to our Sun, solar-system trajectory, and human silhouettes.',
    altText: 'Official NASA image of the gold-anodized Pioneer Plaque with interactive region guide.',
    credit: 'NASA / NASA Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer-plaque-original-nasa.jpg',
    pioneerVizId: 'pioneer_plaque_guide',
    sources: [
      {
        label: 'NASA Science: Pioneer Plaque',
        url: 'https://science.nasa.gov/resource/pioneer-plaque/'
      }
    ]
  },

  pioneer11_jupiter: {
    cueId: 'pioneer11_jupiter',
    missionTag: 'PIONEER 11 AT JUPITER // ~34,000 KM CLOUD-TOP PASS',
    title: 'Pioneer 11 Closest Polar Encounter With Jupiter',
    caption: 'Authentic Pioneer 11 Jupiter photograph captured during its daring ~34,000 km altitude pass above Jupiter’s cloud tops before gravity flung it toward Saturn.',
    altText: 'Historical Pioneer 11 image of Jupiter taken during its polar gravity-assist flyby.',
    credit: 'NASA',
    missionDate: 'December 1974',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer11-jupiter-nasa.jpg',
    pioneerVizId: 'pioneer11_comparison',
    sources: [
      {
        label: 'NASA Science: Pioneer 11 at Jupiter',
        url: 'https://science.nasa.gov/image-detail/amf-40d16944-3a46-4ddd-8f0c-e369db2cd3c1/'
      }
    ]
  },

  pioneer11_saturn_fring: {
    cueId: 'pioneer11_saturn_fring',
    missionTag: 'PIONEER 11 AT SATURN // SEPTEMBER 1, 1979',
    title: 'Saturn, Its Rings, and Titan From Pioneer 11',
    caption: 'Historic Pioneer 11 photograph from the very first spacecraft visit to Saturn (Sept 1, 1979), revealing the braided F ring and blazing a safe crossing for Voyager 2.',
    altText: 'Historical Pioneer 11 image showing Saturn, its rings, and Titan from September 1, 1979.',
    credit: 'NASA / Ames Research Center',
    missionDate: 'September 1, 1979',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer11-saturn-rings-titan-nasa.jpg',
    sources: [
      {
        label: 'NASA Science: Saturn, Its Rings, and Titan From Pioneer 11',
        url: 'https://science.nasa.gov/image-detail/amf-cf2ae57d-b5f0-42ea-b5e3-c955208bc278/'
      }
    ]
  },

  pioneer_anomaly_mystery: {
    cueId: 'pioneer_anomaly_mystery',
    missionTag: 'PIONEER ANOMALY // CONCEPTUAL PHYSICS MYSTERY',
    title: 'Unexplained Deceleration in Deep Space',
    caption: 'Artist concept alongside conceptual force diagram: both Pioneers slowed slightly faster than gravity alone predicted — about ten billionths of Earth gravity.',
    altText: 'Pioneer deep-space artist concept paired with conceptual deceleration mystery diagram.',
    credit: 'NASA / JPL-Caltech (July 17, 2012)',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-deep-space-galaxy-nasa.jpg',
    pioneerVizId: 'pioneer_anomaly_mystery',
    sources: [
      {
        label: 'NASA JPL: Study Finds Heat is Source of Pioneer Anomaly',
        url: 'https://www.jpl.nasa.gov/news/study-finds-heat-is-source-of-pioneer-anomaly/'
      }
    ]
  },

  pioneer_thermal_recoil: {
    cueId: 'pioneer_thermal_recoil',
    missionTag: 'PIONEER ANOMALY SOLVED // THERMAL RECOIL (JPL 2012)',
    title: 'Infrared Heat Bouncing Off the Dish Solved the Mystery',
    caption: 'Conceptual thermal recoil diagram: asymmetric infrared photons emitted from plutonium RTGs & electronics bounced off the dish back, nudging Pioneer gently backward.',
    altText: 'Conceptual physics diagram showing asymmetric infrared heat emission causing thermal recoil.',
    credit: 'NASA / JPL-Caltech (July 17, 2012)',
    pioneerVizId: 'pioneer_thermal_recoil',
    sources: [
      {
        label: 'NASA JPL: Study Finds Heat is Source of Pioneer Anomaly',
        url: 'https://www.jpl.nasa.gov/news/study-finds-heat-is-source-of-pioneer-anomaly/'
      }
    ]
  },

  pioneer_final_comms: {
    cueId: 'pioneer_final_comms',
    missionTag: 'PIONEER 10 & 11 // FINAL SIGNALS CHRONOLOGY',
    title: 'Pioneer 11 (1995) & Pioneer 10 (2003) Final Transmissions',
    caption: 'Separate NASA mission timelines: Pioneer 11 last contact 30 Sep 1995 (engineering data 24 Nov 1995); Pioneer 10 last signal 23 Jan 2003 at 12.23 billion km.',
    altText: 'Two-lane interactive timeline distinguishing Pioneer 10 and Pioneer 11 final transmissions.',
    credit: 'NASA Science',
    missionDate: '1995 – 2006',
    pioneerVizId: 'pioneer_final_comms_timeline',
    sources: [
      {
        label: 'NASA Science: Pioneer 11',
        url: 'https://science.nasa.gov/mission/pioneer-11/'
      },
      {
        label: 'NASA Science: Pioneer 10 Sends Last Signal',
        url: 'https://science.nasa.gov/missions/pioneer/pioneer-10-sends-last-signal/'
      }
    ]
  },

  pioneer_h_backup: {
    cueId: 'pioneer_h_backup',
    missionTag: 'PIONEER H // SMITHSONIAN ARCHIVE RECORD',
    title: 'The Backup Pioneer Twin That Stayed on Earth',
    caption: 'Text archive record for Pioneer H, built as a flight spare whose proposed out-of-ecliptic mission never flew; now displayed at the Smithsonian National Air and Space Museum.',
    altText: 'Archival record card describing the Pioneer H backup spacecraft preserved at the Smithsonian.',
    credit: 'NASA / Smithsonian reference',
    pioneerVizId: 'pioneer_h_museum',
    sources: [
      {
        label: 'NASA History: 50 Years Ago Pioneer 10 Launches',
        url: 'https://www.nasa.gov/history/50-years-ago-pioneer-10-launches-to-explore-jupiter/'
      }
    ]
  },

  pioneer_star_trajectories: {
    cueId: 'pioneer_star_trajectories',
    missionTag: 'SCHEMATIC TRAJECTORY // TAURUS & AQUILA',
    title: 'Multi-Million-Year Interstellar Directions',
    caption: 'Schematic projection (not real-time ephemeris): Pioneer 10 heads toward Taurus/Aldebaran (~2 million yrs) and Pioneer 11 toward Aquila/Lambda Aquilae (~4 million yrs).',
    altText: 'Schematic deep-space trajectory toggle comparing Pioneer 10 and Pioneer 11 starward directions.',
    credit: 'NASA (Trajectory Data)',
    pioneerVizId: 'star_trajectories',
    sources: [
      {
        label: 'NASA Science: Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      },
      {
        label: 'NASA Science: Pioneer 11',
        url: 'https://science.nasa.gov/mission/pioneer-11/'
      }
    ]
  },

  pioneer_closing_plaque: {
    cueId: 'pioneer_closing_plaque',
    missionTag: 'A MESSAGE FOR ETERNITY // PIONEER LEGACY',
    title: 'Silent Scouts Carrying Earth’s Golden Postcard',
    caption: 'Their cameras and radios are quiet, yet the gold-anodized Pioneer Plaque glides silently through interstellar space beside our drifting Pioneer scouts.',
    altText: 'Official Pioneer Plaque beside artist concept of Pioneer spacecraft gliding into dark star field.',
    credit: 'NASA / NASA Ames / JPL-Caltech',
    objectFit: 'contain',
    dualPanels: [
      {
        label: 'Pioneer Golden Plaque',
        sublabel: 'Permanent interstellar star map & greeting',
        image: '/media/deep-space/pioneer/pioneer-plaque-original-nasa.jpg',
        altText: 'Gold-anodized Pioneer Plaque with hydrogen clock, pulsar map, and humans.',
        credit: 'NASA / NASA Ames',
        sourceUrl: 'https://science.nasa.gov/resource/pioneer-plaque/'
      },
      {
        label: 'Silent Cruise Beyond 12 Billion km',
        sublabel: 'Cameras & radios quiet; gliding between stars',
        image: '/media/deep-space/pioneer/pioneer10-deep-space-galaxy-nasa.jpg',
        altText: 'Artist concept of Pioneer drifting peacefully into a dark star field.',
        credit: 'NASA / JPL-Caltech',
        sourceUrl: 'https://www.jpl.nasa.gov/news/study-finds-heat-is-source-of-pioneer-anomaly/'
      }
    ],
    sources: [
      {
        label: 'NASA Science: Pioneer Plaque',
        url: 'https://science.nasa.gov/resource/pioneer-plaque/'
      },
      {
        label: 'NASA JPL: Pioneer Anomaly Article',
        url: 'https://www.jpl.nasa.gov/news/study-finds-heat-is-source-of-pioneer-anomaly/'
      }
    ]
  },

  voyager_grand_tour: {
    cueId: 'voyager_grand_tour',
    missionTag: 'VOYAGER 1 & 2 // GRAND TOUR ALIGNMENT (176-YR WINDOW)',
    title: 'Voyager’s Grand Tour Across the Giant Planets',
    caption: 'NASA planetary montage paired with a conceptual trajectory graphic illustrating how Voyager 1 & 2 rode rare planetary gravity assists toward Neptune.',
    altText: 'NASA Voyager Planetary Voyage collage alongside interactive conceptual Grand Tour trajectory.',
    credit: 'NASA / JPL-Caltech (PIA01482)',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-planetary-voyage-pia01482.jpg',
    voyagerVizId: 'grand_tour_diagram',
    sources: [
      {
        label: 'NASA Science: Voyager Planetary Voyage',
        url: 'https://science.nasa.gov/mission/voyager/planetary-voyage/'
      }
    ]
  },

  voyager_spacecraft_reveal: {
    cueId: 'voyager_spacecraft_reveal',
    missionTag: 'VOYAGER 1 & 2 // SPACECRAFT ARCHITECTURE',
    title: 'Three-Axis Stabilized Voyager Spacecraft Profile',
    caption: 'Labeled NASA diagram of the Voyager spacecraft (3.66 m / 3.7 m dish, 10-sided bus, steerable scan platform, and extended booms) with interactive callouts.',
    altText: 'NASA diagram of the Voyager spacecraft with inspectable component pins.',
    credit: 'NASA / JPL-Caltech',
    missionDate: 'Launched Aug & Sep 1977',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager-profile.jpg',
    voyagerVizId: 'voyager_inspection_panel',
    sources: [
      {
        label: 'NASA Science: Voyager Spacecraft',
        url: 'https://science.nasa.gov/mission/voyager/spacecraft/'
      }
    ]
  },

  voyager_computers_69kb: {
    cueId: 'voyager_computers_69kb',
    missionTag: 'EXPLANATORY SCHEMATIC // 1970S FLIGHT COMPUTERS',
    title: 'Voyager Onboard Computing (~69 KB Scale Comparison)',
    caption: 'Explanatory schematic highlighting Voyager’s ~69 KB total onboard computer memory (~815 kg spacecraft) and 67 MB digital 8-track tape recorder.',
    altText: 'Explanatory diagram comparing Voyager 69 kilobyte onboard memory with 67 MB tape buffer.',
    credit: 'NASA / JPL-Caltech (Voyager Spacecraft Documentation)',
    voyagerVizId: 'computers_69kb',
    sources: [
      {
        label: 'NASA Science: Voyager Spacecraft',
        url: 'https://science.nasa.gov/mission/voyager/spacecraft/'
      }
    ]
  },

  voyager_comms_reprogram: {
    cueId: 'voyager_comms_reprogram',
    missionTag: 'DEEP SPACE NETWORK // RADIO REPROGRAMMING',
    title: 'Teaching Voyager New Tricks Across Billions of Kilometres',
    caption: 'Simplified signal path (Earth Deep Space Network → ~24-hour radio link → Voyager dish → reprogrammable onboard computer).',
    altText: 'Conceptual diagram showing Deep Space Network signal latency and remote computer reprogramming.',
    credit: 'NASA / JPL-Caltech',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-spacecraft-timeline-nasa.jpg',
    voyagerVizId: 'comms_latency_reprogram',
    sources: [
      {
        label: 'NASA Science: Voyager Spacecraft',
        url: 'https://science.nasa.gov/mission/voyager/spacecraft/'
      }
    ]
  },

  voyager_rtg_power: {
    cueId: 'voyager_rtg_power',
    missionTag: 'VOYAGER POWER SYSTEM // THREE PU-238 RTGS',
    title: 'Declining Nuclear Power (~470 W Launch Output)',
    caption: 'Three plutonium-238 Radioisotope Thermoelectric Generators provide power (~470 W at launch, dropping ~4 W/yr; ~225 We as of 2023) while systems operate below −79 °C.',
    altText: 'Schematic comparison of Voyager RTG launch output versus gradual radioactive power decay.',
    credit: 'NASA / JPL-Caltech',
    voyagerVizId: 'voyager_rtg_decay',
    sources: [
      {
        label: 'NASA Science: Voyager Spacecraft',
        url: 'https://science.nasa.gov/mission/voyager/spacecraft/'
      }
    ]
  },

  voyager_io_volcano: {
    cueId: 'voyager_io_volcano',
    missionTag: 'VOYAGER 1 AT JUPITER // MARCH 4, 1979 (PIA00373)',
    title: 'Io – First Active Volcano Beyond Earth',
    caption: 'Authentic Voyager 1 optical navigation limb image captured March 4, 1979 (PIA00373): Linda Morabito’s discovery of a 300 km volcanic plume rising above Io’s limb.',
    altText: 'Historic Voyager 1 photograph (PIA00373) of Io showing a faint volcanic plume rising 300 kilometres above the moon limb.',
    credit: 'NASA / JPL (PIA00373)',
    missionDate: 'March 4, 1979',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-1-io-volcanic-eruption-pia00373.jpg',
    sources: [
      {
        label: 'NASA Photojournal: Io Volcanic Eruption (PIA00373)',
        url: 'https://science.nasa.gov/photojournal/io-volcanic-eruption/'
      }
    ]
  },

  voyager_outer_moons: {
    cueId: 'voyager_outer_moons',
    missionTag: 'VOYAGER 1 & 2 // OUTER MOONS & GIANT WORLDS',
    title: 'Active Outer Solar System Discoveries',
    caption: 'Voyager revealed dynamic outer worlds across Jupiter, Saturn, Uranus (1986), and Neptune (1989): Io plumes, Europa fractures, Miranda cliffs, and Triton nitrogen geysers.',
    altText: 'Summary grid of Voyager outer moon discoveries alongside NASA Planetary Voyage montage.',
    credit: 'NASA / JPL-Caltech (PIA01482)',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-planetary-voyage-pia01482.jpg',
    voyagerVizId: 'outer_moons_summary',
    sources: [
      {
        label: 'NASA Science: Voyager Planetary Voyage',
        url: 'https://science.nasa.gov/mission/voyager/planetary-voyage/'
      }
    ]
  },

  voyager_pale_blue_dot: {
    cueId: 'voyager_pale_blue_dot',
    missionTag: 'VOYAGER 1 // PALE BLUE DOT ORIGINAL (FEB 14, 1990)',
    title: 'Pale Blue Dot — Earth Suspended in a Sunbeam',
    caption: 'Original 1990 Voyager 1 photograph (PIA00452) from ~6 billion km away: Earth is a tiny sub-pixel point along a scattered sunbeam before Voyager retired its cameras forever.',
    altText: 'Authentic 1990 Voyager 1 Pale Blue Dot photograph with optional text locator explanation.',
    credit: 'NASA / JPL-Caltech (Original 1990 PIA00452)',
    missionDate: 'February 14, 1990',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager-pale-blue-dot.jpg',
    voyagerVizId: 'pale_blue_dot_locator',
    dualPanels: [
      {
        label: 'Original 1990 Transmission (PIA00452)',
        sublabel: 'Preserved original Voyager 1 pixels (~6B km)',
        image: '/media/deep-space/voyager-pale-blue-dot.jpg',
        altText: 'Original 1990 Pale Blue Dot frame showing sub-pixel Earth inside scattered sunlight.',
        credit: 'NASA / JPL-Caltech',
        sourceUrl: 'https://science.nasa.gov/resource/voyager-pale-blue-dot-download/'
      },
      {
        label: '2020 Revisited Processing (PIA23645)',
        sublabel: 'Modern image-processing tribute (labelled alternate)',
        image: '/media/deep-space/voyager/voyager-1-pale-blue-dot-revisited-pia23645.jpg',
        altText: 'Revisited 2020 NASA/JPL reprocessing of Voyager 1 Pale Blue Dot.',
        credit: 'NASA / JPL-Caltech (PIA23645)',
        sourceUrl: 'https://science.nasa.gov/resource/voyager-pale-blue-dot-download/'
      }
    ],
    sources: [
      {
        label: 'NASA Science: Pale Blue Dot Download',
        url: 'https://science.nasa.gov/resource/voyager-pale-blue-dot-download/'
      }
    ]
  },

  voyager_heliopause: {
    cueId: 'voyager_heliopause',
    missionTag: 'INTERSTELLAR MISSION // HELIOPAUSE CROSSINGS',
    title: 'Crossing the Heliopause Into Interstellar Space',
    caption: 'Conceptual cutaway diagram contrasting solar wind inside the heliosphere with interstellar medium crossed by Voyager 1 (Aug 25, 2012, 121 AU) and Voyager 2 (Nov 5, 2018).',
    altText: 'Conceptual scientific diagram showing heliosphere, heliosheath, heliopause, and Voyager paths.',
    credit: 'NASA / JPL-Caltech & STScI',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-interstellar-medium-stsci.png',
    voyagerVizId: 'heliopause_cutaway',
    sources: [
      {
        label: 'NASA Science: Voyager Interstellar Mission',
        url: 'https://science.nasa.gov/mission/voyager/interstellar-mission/'
      }
    ]
  },

  voyager_plasma_wave: {
    cueId: 'voyager_plasma_wave',
    missionTag: 'PLASMA WAVE INSTRUMENT // INDIRECT DENSITY EVIDENCE',
    title: 'Space’s Singing Hum Jumped Key (~40× Denser Plasma)',
    caption: 'Silent illustrative waveform representation of Voyager 1 plasma wave oscillation frequency jumping as it sampled interstellar plasma ~40 times denser than the solar bubble.',
    altText: 'Silent illustrative representation of higher-frequency plasma wave oscillations beyond the heliopause.',
    credit: 'NASA / JPL-Caltech',
    voyagerVizId: 'plasma_wave_waveform',
    sources: [
      {
        label: 'NASA Science: Voyager Interstellar Mission',
        url: 'https://science.nasa.gov/mission/voyager/interstellar-mission/'
      }
    ]
  },

  voyager_2023_crisis: {
    cueId: 'voyager_2023_crisis',
    missionTag: 'VOYAGER 1 // NOV 2023 – APR 2024 COMMUNICATIONS CRISIS',
    title: '45-Hour Round-Trip Diagnostic From Earth',
    caption: 'Timeline of Voyager 1’s November 2023 unreadable telemetry crisis and slow-motion troubleshooting across 24+ billion kilometres.',
    altText: 'Timeline recording unreadable data in Nov 2023, March 2024 fault isolation, and April 2024 restoration.',
    credit: 'NASA / JPL-Caltech',
    missionDate: 'Nov 2023 – May 2024',
    voyagerVizId: 'crisis_2023_timeline',
    sources: [
      {
        label: 'NASA JPL: Voyager 1 Resumes Engineering Updates',
        url: 'https://www.jpl.nasa.gov/news/nasas-voyager-1-resumes-sending-engineering-updates-to-earth/'
      }
    ]
  },

  voyager_fds_repair: {
    cueId: 'voyager_fds_repair',
    missionTag: 'FLIGHT DATA SUBSYSTEM REPAIR // SPRING 2024',
    title: 'Remote Software Relocation Across 24 Billion Kilometres',
    caption: 'Simplified explanatory block diagram illustrating how JPL engineers split affected code around a failed memory chip and uplinked the patch in April & May 2024.',
    altText: 'Interactive before-and-after block diagram explaining FDS memory relocation.',
    credit: 'NASA / JPL-Caltech',
    voyagerVizId: 'fds_repair_diagram',
    sources: [
      {
        label: 'NASA JPL: Voyager 1 Resumes Engineering Updates',
        url: 'https://www.jpl.nasa.gov/news/nasas-voyager-1-resumes-sending-engineering-updates-to-earth/'
      }
    ]
  },

  voyager_thrusters_37yr: {
    cueId: 'voyager_thrusters_37yr',
    missionTag: 'BACKUP TRAJECTORY-CORRECTION THRUSTERS // NOV 28, 2017',
    title: 'Voyager 1 Fires Backup Thrusters After 37 Years',
    caption: 'Unused since 1980, four backup trajectory-correction (TCM) thrusters fired cleanly in November 2017 to take over gentle millisecond attitude pointing.',
    altText: 'Explanatory panel detailing reactivation of Voyager 1 backup trajectory-correction thrusters.',
    credit: 'NASA / JPL-Caltech',
    missionDate: 'November 28, 2017',
    voyagerVizId: 'thrusters_37yr',
    sources: [
      {
        label: 'NASA Science: Voyager 1 Fires Thrusters After 37 Years',
        url: 'https://science.nasa.gov/missions/voyager-program/voyager-1-fires-up-thrusters-after-37-years/'
      }
    ]
  },

  voyager_light_day: {
    cueId: 'voyager_light_day',
    missionTag: 'DISTANCE MILESTONE // ONE LIGHT-DAY (NOV 18, 2026)',
    title: 'Approaching One Full Light-Day From Earth',
    caption: 'Voyager 1’s ~22 W refrigerator-bulb radio still carries data home across >25 billion km as it approaches one light-day from Earth (milestone listed Nov 18, 2026).',
    altText: 'Snapshot card explaining one-light-day distance milestone and instrument power shutdown timeline.',
    credit: 'NASA / JPL-Caltech',
    missionDate: 'Nov 18, 2026 Milestone',
    voyagerVizId: 'one_light_day_milestone',
    sources: [
      {
        label: 'NASA Science: Where Are Voyager 1 and 2 Now?',
        url: 'https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/'
      }
    ]
  },

  voyager_star_trajectory: {
    cueId: 'voyager_star_trajectory',
    missionTag: 'LONG-TERM PROJECTION // OORT CLOUD & NEARBY STARS',
    title: '40,000-Year Interstellar Trajectory Projections',
    caption: 'Projected outward courses (not a live navigable chart): Voyager 1 enters the Oort Cloud in ~300 yrs and passes near Gliese 445 in ~40,000 yrs; Voyager 2 passes near Ross 248.',
    altText: 'Projected trajectory toggle comparing Voyager 1 and Voyager 2 stellar paths.',
    credit: 'NASA / JPL-Caltech',
    voyagerVizId: 'voyager_star_trajectories',
    sources: [
      {
        label: 'NASA Science: Where Are Voyager 1 and 2 Now?',
        url: 'https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/'
      }
    ]
  },

  voyager_golden_record_cover: {
    cueId: 'voyager_golden_record_cover',
    missionTag: 'VOYAGER GOLDEN RECORD // PROTECTIVE COVER DIAGRAM',
    title: 'The Golden Record Cover & Uranium-238 Clock',
    caption: 'Full, uncropped official NASA diagram of the 30 cm gold-plated copper Golden Record cover carrying playback instructions and a tiny Uranium-238 radioactive clock.',
    altText: 'Official NASA diagram of the Voyager Golden Record cover with external callout tabs.',
    credit: 'NASA / JPL',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-golden-record-cover-diagram-nasa.jpg',
    voyagerVizId: 'golden_record_cover',
    sources: [
      {
        label: 'NASA Science: Golden Record Cover',
        url: 'https://science.nasa.gov/mission/voyager/golden-record-cover/'
      }
    ]
  },

  voyager_golden_record_contents: {
    cueId: 'voyager_golden_record_contents',
    missionTag: 'GOLDEN RECORD CONTENTS // GREETINGS, SOUNDS & MUSIC',
    title: 'A Time Capsule of Earth (~1 Billion Year Shelf Life)',
    caption: 'Interactive text index covering 55 spoken greetings (including Bengali, Mandarin & Arabic), 12-minute Earth sounds, 90 minutes of music, and NASA gallery index (images copyright protected).',
    altText: 'Tabbed index summarizing Voyager Golden Record greetings, sounds, music, and 115-image catalog note.',
    credit: 'NASA / JPL-Caltech',
    voyagerVizId: 'golden_record_contents',
    sources: [
      {
        label: 'NASA Science: Golden Record Greetings',
        url: 'https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/'
      },
      {
        label: 'NASA Science: Golden Record Images Index',
        url: 'https://science.nasa.gov/mission/voyager/golden-record-contents/images/'
      }
    ]
  },

  voyager_ann_druyan: {
    cueId: 'voyager_ann_druyan',
    missionTag: 'JUNE 3, 1977 // BRAINWAVES & HEARTBEAT RECORDED',
    title: 'A Human Heartbeat Carried Between the Stars',
    caption: 'Silent illustrative motif honoring Ann Druyan’s one-hour brainwave and heartbeat recording (compressed to ~1 minute on the Golden Record, built to endure 1+ billion years).',
    altText: 'Silent illustrative waveform motif honoring the June 3, 1977 Golden Record recording.',
    credit: 'NASA / JPL-Caltech (Story Documentation)',
    missionDate: 'June 3, 1977',
    voyagerVizId: 'ann_druyan_recording',
    sources: [
      {
        label: 'NASA Science: Golden Record Contents',
        url: 'https://science.nasa.gov/mission/voyager/golden-record-contents/'
      }
    ]
  },

  // =====================================================
  // FINAL ACT — SUPERNOVA CLIMAX, RETURN, PHOENIX MET & OUTRO
  // =====================================================
  climax_ds1_departure: {
    cueId: 'climax_ds1_departure',
    missionTag: 'DEEP SPACE COURSE // DS1 & NEW HORIZONS VECTOR',
    title: 'Approaching Deep Space 1 & New Horizons Sector',
    caption: 'Aeroship telemetry locks onto the restricted outer-system beacon vector just before the anomalous radiation surge hits.',
    altText: 'Deep Space 1 and New Horizons archival views prior to emergency diversion.',
    credit: 'NASA / JPL / JHUAPL / SwRI',
    dualPanels: [
      {
        label: 'Deep Space 1',
        sublabel: 'Xenon ion-drive demonstrator',
        image: '/media/deep-space/deep-space-1.jpg',
        altText: 'Deep Space 1 spacecraft artist concept with solar concentrator arrays and xenon ion thruster.',
        credit: 'NASA / JPL',
        sourceUrl: 'https://science.nasa.gov/mission/deep-space-1/'
      },
      {
        label: 'New Horizons (Pluto)',
        sublabel: 'Kuiper Belt flyby probe',
        image: '/media/deep-space/new-horizons-pluto.jpg',
        altText: 'True-color enhanced New Horizons portrait of Pluto and Tombaugh Regio.',
        credit: 'NASA / JHUAPL / SwRI (PIA20291)',
        sourceUrl: 'https://science.nasa.gov/gallery/pluto/'
      }
    ],
    sources: [
      {
        label: 'NASA Deep Space 1',
        url: 'https://science.nasa.gov/mission/deep-space-1/'
      },
      {
        label: 'NASA Pluto Gallery (New Horizons)',
        url: 'https://science.nasa.gov/gallery/pluto/'
      }
    ]
  },

  climax_radiation_alert: {
    cueId: 'climax_radiation_alert',
    missionTag: 'EMERGENCY ALERT // THREAT LEVEL 7 RADIATION SURGE',
    title: 'Ionising Radiation & Neutrino Surge Detected',
    caption: 'Shipboard sensors register critical neutrinos, alpha particles, heavy nuclei, UV, X-ray and gamma rays while hull erosion accelerates at 47 mm/min.',
    altText: 'Conceptual telemetry schematic of Threat Level 7 radiation surge and hull erosion countdown.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'supernova_radiation_alert',
    sources: [
      {
        label: 'NASA Science: Supernovae',
        url: 'https://science.nasa.gov/universe/stars/'
      }
    ]
  },

  climax_control_room: {
    cueId: 'climax_control_room',
    missionTag: 'CONTROL ROOM // CHAMBER ALARMS MUTED',
    title: 'Bridge Diagnostics & Zero-Gravity-Wave Anomaly',
    caption: 'Felice silences human-chamber alarms and inspects every radiation band—no black hole mass appears on gravitational detectors.',
    altText: 'Conceptual ship bridge telemetry showing full-spectrum ionizing radiation without gravitational source.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'supernova_radiation_alert',
    sources: [
      {
        label: 'NASA Science: Stars & Supernovae',
        url: 'https://science.nasa.gov/universe/stars/'
      }
    ]
  },

  climax_hull_decay: {
    cueId: 'climax_hull_decay',
    missionTag: 'HULL EROSION // 6 MINUTES 07 SECONDS TO DAMAGE',
    title: 'Critical 47 mm/min Protective Layer Decay',
    caption: 'Only 6 minutes 07 seconds before hull damage and 9 minutes 41 seconds before interior radiation reaches lethal levels.',
    altText: 'Conceptual countdown panel showing 47 mm/min hull erosion and chamber radiation window.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'supernova_radiation_alert',
    sources: [
      {
        label: 'NASA Space Radiation Overview',
        url: 'https://www.nasa.gov/Cosmic-Rays/'
      }
    ]
  },

  climax_hyperdrive_escape: {
    cueId: 'climax_hyperdrive_escape',
    missionTag: 'HYPERDRIVE + ALL 6 THRUSTERS // EMERGENCY REVERSAL',
    title: 'Full-Burn Turnaround & Scrap Mass Shielding',
    caption: 'Max-velocity reversal engaged alongside an improvisational mass barrier protecting human chambers, power systems, and hyperdrive.',
    altText: 'Conceptual ship shielding diagram showing automated mobile robots reinforcing the human chambers.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'scrap_shielding_diagram',
    sources: [
      {
        label: 'NASA Radiation Shielding Concepts',
        url: 'https://www.nasa.gov/Cosmic-Rays/'
      }
    ]
  },

  climax_shielding_robots: {
    cueId: 'climax_shielding_robots',
    missionTag: 'AUTOMATED ROBOTS // HULL PLATES, CRATES & TOOLBOX',
    title: 'Emergency Bulk Mass Shielding Wall',
    caption: 'Automated robots haul furniture, spare hull plates, cargo crates, and Felice’s own toolbox onto exterior walls—reaching 82% shielding.',
    altText: 'Conceptual diagram showing improvised scrap mass absorbing ionizing supernova radiation.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'scrap_shielding_diagram',
    sources: [
      {
        label: 'NASA Radiation Protection Research',
        url: 'https://www.nasa.gov/Cosmic-Rays/'
      }
    ]
  },

  climax_supernova_discovery: {
    cueId: 'climax_supernova_discovery',
    missionTag: 'SUPERNOVA DB CROSS-CHECK // MERGED BINARY STAR',
    title: 'Dual-Star Merger Supernova Confirmed',
    caption: 'Archive cross-reference identifies a merged dual-star system detonating nearby as the source of the neutrino and gamma burst.',
    altText: 'Conceptual schematic comparing the merged dual-star supernova source and the ship’s 82% shield.',
    credit: 'Cosmic Saga Astrometry (Conceptual)',
    finalActVizId: 'scrap_shielding_diagram',
    sources: [
      {
        label: 'NASA Science: Supernovae',
        url: 'https://science.nasa.gov/universe/stars/'
      }
    ]
  },

  climax_chamber_comfort: {
    cueId: 'climax_chamber_comfort',
    missionTag: 'HUMAN CHAMBERS // SHIELDING AT 82%',
    title: 'Directing the Escape from Inside the Chamber',
    caption: 'While corridor lights flicker and hull plates groan, Felice holds hands with explorers and refuses to leave them behind.',
    altText: 'Conceptual diagram showing human chamber protection at 82% emergency shielding.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'scrap_shielding_diagram',
    sources: [
      {
        label: 'NASA Spaceflight Human Safety',
        url: 'https://www.nasa.gov/humans-in-space/'
      }
    ]
  },

  climax_narrator_damage: {
    cueId: 'climax_narrator_damage',
    missionTag: 'SYSTEM ALERT // NARRATOR UNIT EXPOSURE CRITICAL',
    title: 'Staying at the Console Despite Optic Sparks',
    caption: 'Felice denies the retreat recommendation so thrusters hold course until radiation drops back to normal.',
    altText: 'Conceptual ship shielding diagram while Felice holds manual thruster control.',
    credit: 'Cosmic Saga Ship Telemetry (Conceptual)',
    finalActVizId: 'scrap_shielding_diagram',
    sources: [
      {
        label: 'NASA Electronics Radiation Hardness',
        url: 'https://www.nasa.gov/Cosmic-Rays/'
      }
    ]
  },

  climax_escape_solar_system: {
    cueId: 'climax_escape_solar_system',
    missionTag: 'SOLAR SYSTEM RE-ENTRY // 30-MIN DECELERATION',
    title: 'Clear of Radiation: Saturn Rings & Jupiter Ahead',
    caption: 'Radiation levels return to normal with only minor narrator circuit damage; cruising too fast to steer, the ship takes the scenic pass past Saturn and Jupiter.',
    altText: 'NASA Pioneer images of Saturn rings and Jupiter cloud belts seen during deceleration.',
    credit: 'NASA / Ames Research Center',
    dualPanels: [
      {
        label: 'Saturn & Rings',
        sublabel: 'Pioneer 11 distant view',
        image: '/media/deep-space/pioneer/pioneer11-saturn-rings-titan-nasa.jpg',
        altText: 'Pioneer 11 image of Saturn and its ring system with moon Titan.',
        credit: 'NASA / Ames',
        sourceUrl: 'https://science.nasa.gov/mission/pioneer-11/'
      },
      {
        label: 'Jupiter Passing By',
        sublabel: 'Gas giant cloud bands ahead',
        image: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
        altText: 'Pioneer 10 color portrait of Jupiter showing banded clouds.',
        credit: 'NASA / Ames',
        sourceUrl: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ],
    sources: [
      {
        label: 'NASA Pioneer 10 & 11 Archive',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ]
  },

  climax_confession: {
    cueId: 'climax_confession',
    missionTag: 'HONEST ACCOUNTABILITY // RETURNING HOMEWARD',
    title: 'Felice’s Apology & Promise',
    caption: 'Beneath Saturn’s distant rings and Jupiter’s glow, Felice confesses to skipping the supernova database check and asks the explorers for forgiveness.',
    altText: 'Saturn rings and Jupiter viewed outside the observation window.',
    credit: 'NASA / Ames Research Center',
    dualPanels: [
      {
        label: 'Saturn’s Rings',
        sublabel: 'Glowing in the distance',
        image: '/media/deep-space/pioneer/pioneer11-saturn-rings-titan-nasa.jpg',
        altText: 'Pioneer 11 portrait of Saturn and its rings.',
        credit: 'NASA / Ames',
        sourceUrl: 'https://science.nasa.gov/mission/pioneer-11/'
      },
      {
        label: 'Jupiter Flyby Window',
        sublabel: 'Deceleration scenic pass',
        image: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
        altText: 'Pioneer 10 image of Jupiter.',
        credit: 'NASA / Ames',
        sourceUrl: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ],
    sources: [
      {
        label: 'NASA Jupiter Overview',
        url: 'https://science.nasa.gov/jupiter/'
      }
    ]
  },

  after_jupiter_intro: {
    cueId: 'after_jupiter_intro',
    missionTag: 'HOME STRETCH // JUPITER FACTS (1,300 EARTHS)',
    title: 'Jupiter — Largest Planet in Our Solar System',
    caption: 'More than twice as massive as all other planets combined, Jupiter could pack ~1,300 Earths inside its volume.',
    altText: 'Pioneer 10 color image of Jupiter cloud bands.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Science: Jupiter Facts',
        url: 'https://science.nasa.gov/jupiter/jupiter-facts/'
      }
    ]
  },

  after_jupiter_surface: {
    cueId: 'after_jupiter_surface',
    missionTag: 'GAS GIANT STRUCTURE // NO SOLID SURFACE',
    title: 'Deep Atmosphere & Crushing Gas Envelope',
    caption: 'With no solid surface to land on—and Rule #2 firmly in effect—explorers observe Jupiter safely through the cockpit window.',
    altText: 'Close view of Jupiter swirls captured by Pioneer 10.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Science: Jupiter',
        url: 'https://science.nasa.gov/jupiter/'
      }
    ]
  },

  after_jupiter_red_spot: {
    cueId: 'after_jupiter_red_spot',
    missionTag: 'JUPITER // THE GREAT RED SPOT STORM',
    title: 'A Storm Wider Than Earth Raging for Centuries',
    caption: 'Pioneer and Voyager imaged Jupiter’s Great Red Spot—an anticyclonic storm larger than Earth swirling for hundreds of years.',
    altText: 'Pioneer 11 closeup of Jupiter showing the Great Red Spot.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer11-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Great Red Spot',
        url: 'https://science.nasa.gov/jupiter/'
      }
    ]
  },

  after_jupiter_spin: {
    cueId: 'after_jupiter_spin',
    missionTag: 'ROTATION SPEED // UNDER 10 HOURS PER DAY',
    title: 'Shortest Day of Any Planet (~9h 55m)',
    caption: 'Spinning completely once in under ten hours, Jupiter has the shortest day in the Solar System—even shorter than a cat’s daily nap.',
    altText: 'Jupiter banded atmosphere flattening slightly at the poles due to rapid spin.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer11-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Science: Jupiter Facts',
        url: 'https://science.nasa.gov/jupiter/jupiter-facts/'
      }
    ]
  },

  after_jupiter_moons: {
    cueId: 'after_jupiter_moons',
    missionTag: 'JOVIAN MOONS // IO VOLCANOES & EUROPA OCEAN',
    title: 'Nearly 100 Moons Orbiting Jupiter',
    caption: 'Voyager 1 captured volcanic plumes erupting on Io, while icy Europa conceals a salty global ocean beneath its crust.',
    altText: 'Voyager 1 photo of an active volcanic plume erupting on Jupiter’s moon Io.',
    credit: 'NASA / JPL (PIA00373)',
    objectFit: 'contain',
    localImage: '/media/deep-space/voyager/voyager-1-io-volcanic-eruption-pia00373.jpg',
    sources: [
      {
        label: 'NASA Science: Jupiter Moons',
        url: 'https://science.nasa.gov/jupiter/jupiter-moons/'
      }
    ]
  },

  after_jupiter_radiation: {
    cueId: 'after_jupiter_radiation',
    missionTag: 'PIONEER 10 KINSHIP // FIERCE RADIATION BELTS',
    title: 'Surviving Jupiter’s Trapped Radiation Belts',
    caption: 'Pioneer 10 braved Jupiter’s brutal magnetospheric radiation belts in December 1973—giving Felice new respect after today’s supernova escape.',
    altText: 'Pioneer 10 portrait of Jupiter.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/'
      }
    ]
  },

  after_deceleration_timer: {
    cueId: 'after_deceleration_timer',
    missionTag: 'DECELERATION IN PROGRESS // 29 MINUTES REMAINING',
    title: 'Cruising Back Inside the Giant Planets',
    caption: 'Reverse deceleration continues smoothly toward the main asteroid belt as passengers snap commemorative photos.',
    altText: 'Jupiter glowing outside the cabin while ship decelerates toward safe steering speed.',
    credit: 'NASA / Ames Research Center',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-jupiter-nasa.jpg',
    sources: [
      {
        label: 'NASA Solar System Overview',
        url: 'https://science.nasa.gov/solar-system/'
      }
    ]
  },

  after_asteroid_belt: {
    cueId: 'after_asteroid_belt',
    missionTag: 'MANUAL NAVIGATION RESTORED // ASTEROID BELT',
    title: 'Crossing the Quiet Asteroid Belt & Dwarf Planet Ceres',
    caption: 'Contrary to sci-fi movies, asteroids lie hundreds of thousands of kilometres apart; total belt mass is under 4% of the Moon, ~1/3 held by Ceres.',
    altText: 'Artist concept of Pioneer 10 traversing the asteroid belt alongside scale mass diagram of Ceres.',
    credit: 'NASA / Ames + Conceptual Scale Comparison',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-asteroid-belt-nasa.jpg',
    finalActVizId: 'asteroid_belt_ceres',
    sources: [
      {
        label: 'NASA Science: Asteroid Belt',
        url: 'https://science.nasa.gov/solar-system/asteroids/'
      }
    ]
  },

  after_asteroid_crackle: {
    cueId: 'after_asteroid_crackle',
    missionTag: 'AUDIO CIRCUIT STATUS // LEFT-EAR STATIC CRACKLE',
    title: 'Talking Through Minor Radiation Static',
    caption: 'Though Felice’s left-ear audio circuit still crackles from radiation exposure, sharing facts keeps worry away on the homeward leg.',
    altText: 'Pioneer 10 asteroid belt illustration and asteroid mass scale comparison.',
    credit: 'NASA / Ames + Conceptual Scale Comparison',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-asteroid-belt-nasa.jpg',
    finalActVizId: 'asteroid_belt_ceres',
    sources: [
      {
        label: 'NASA Dawn Mission (Ceres)',
        url: 'https://science.nasa.gov/mission/dawn/'
      }
    ]
  },

  after_asteroid_joke: {
    cueId: 'after_asteroid_joke',
    missionTag: 'CABIN MORALE // ASTEROID BELT DEPARTURE',
    title: '“Our Universe Totally Rocks!”',
    caption: 'A bad rock-paper-scissors pun fills the passenger chamber with laughter as the spacecraft clears the main belt safely.',
    altText: 'Asteroid belt passage illustration.',
    credit: 'NASA / Ames + Conceptual Scale Comparison',
    objectFit: 'contain',
    localImage: '/media/deep-space/pioneer/pioneer10-asteroid-belt-nasa.jpg',
    finalActVizId: 'asteroid_belt_ceres',
    sources: [
      {
        label: 'NASA Science: Asteroids',
        url: 'https://science.nasa.gov/solar-system/asteroids/'
      }
    ]
  },

  after_mars_distant: {
    cueId: 'after_mars_distant',
    missionTag: 'DISTANT MARS IN SIGHT // NO LANDING CLEARANCE',
    title: 'Mars on the Horizon & One Unvisited Weather Story',
    caption: 'Seen safely from space on the return trajectory: Mars glows red again, reminding Felice of Phoenix’s unvisited weather station.',
    altText: 'Viking Orbiter global mosaic view of Mars seen from approach.',
    credit: 'NASA / JPL / USGS',
    objectFit: 'contain',
    localImage: '/media/mars/viking/viking-orbiter-mosaic.jpg',
    sources: [
      {
        label: 'NASA Mars Exploration',
        url: 'https://science.nasa.gov/mars/'
      }
    ]
  },

  phoenix_met_overview: {
    cueId: 'phoenix_met_overview',
    missionTag: 'INSIDE SHIP // REMOTE PHOENIX ARCHIVE STORYTELLING',
    title: 'Phoenix Meteorological Station (MET) Overview',
    caption: 'Viewed strictly from inside the ship console archive: Phoenix stood on Vastitas Borealis with a 1-meter Canadian-led weather mast built with Finland & Denmark.',
    altText: 'Phoenix Mars Lander archival panorama showing the lander deck and robotic arm on northern Mars plains.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona / Texas A&M (PIA10793)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-panorama-arm-pia10793.jpg',
    sources: [
      {
        label: 'NASA Mars Phoenix MET',
        url: 'https://science.nasa.gov/mission/mars-phoenix/'
      }
    ]
  },

  phoenix_met_thermocouples: {
    cueId: 'phoenix_met_thermocouples',
    missionTag: 'REMOTE ARCHIVE // 1 m THERMOCOUPLE MAST & SEEBECK EFFECT',
    title: 'Three Hair-Thin Thermocouples & Turbulent Mars Air',
    caption: 'Archival spacecraft deck photo paired with a remote conceptual mast diagram: early-mission afternoons peaked near −30 °C, jumping 10 °C in turbulent eddies.',
    altText: 'Phoenix deck archival image paired with conceptual diagram of the three MET thermocouples.',
    credit: 'NASA / JPL-Caltech / UA (PIA09954 Deck Archive)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-deck-meca.jpg',
    finalActVizId: 'phoenix_met_thermocouple',
    sources: [
      {
        label: 'NASA Phoenix Meteorological Data',
        url: 'https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Phoenix/phoenix.html'
      }
    ]
  },

  phoenix_met_pressure: {
    cueId: 'phoenix_met_pressure',
    missionTag: 'REMOTE ARCHIVE // FMI PRESSURE SENSOR (860 → 720 Pa)',
    title: 'Watching Mars Breathe In: CO₂ Freezing & Dust Devils',
    caption: 'Finnish Meteorological Institute barometer logged every 2 seconds as Mars’s thin pressure fell from ~860 Pa to ~720 Pa—plus brief dust-devil dips.',
    altText: 'Phoenix archival atmospheric dust/clouds image paired with seasonal 860 to 720 Pa pressure chart.',
    credit: 'NASA / JPL-Caltech / UA / FMI (PIA11200 Archive)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-lidar-snow-pia11200.jpg',
    finalActVizId: 'phoenix_met_pressure_curve',
    sources: [
      {
        label: 'NASA Phoenix Atmospheric Findings',
        url: 'https://science.nasa.gov/mission/mars-phoenix/'
      }
    ]
  },

  phoenix_met_telltale: {
    cueId: 'phoenix_met_telltale',
    missionTag: 'REMOTE ARCHIVE // TELLTALE KEVLAR-HUNG CYLINDER',
    title: 'Measuring Martian Wind with a Camera & Hanging Cylinder',
    caption: 'Instead of fragile spinning vanes, engineers suspended a lightweight Telltale cylinder on Kevlar fibres and photographed its deflection up to every 50 seconds.',
    altText: 'Phoenix deck archive photo paired with Telltale suspended cylinder diagram.',
    credit: 'NASA / JPL-Caltech / Aarhus Univ. / CSA (Conceptual Diagram)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix-deck-meca.jpg',
    finalActVizId: 'phoenix_met_telltale_wind',
    sources: [
      {
        label: 'NASA Phoenix MET Telltale',
        url: 'https://science.nasa.gov/mission/mars-phoenix/'
      }
    ]
  },

  phoenix_met_winds: {
    cueId: 'phoenix_met_winds',
    missionTag: 'REMOTE ARCHIVE // WIND SPEEDS: 3–6, 8 & 16 m/s (SOL 148)',
    title: 'Quiet Martian Nights & Sol 148 Peak Wind Gust',
    caption: 'Early steady winds ran 3–6 m/s, daytime westerlies later averaged ~8 m/s, and Sol 148 clocked a ~16 m/s gust while nights calmed down.',
    altText: 'Interactive Telltale deflection readout comparing 3–6 m/s, 8 m/s, and Sol 148 16 m/s wind speeds.',
    credit: 'NASA / JPL-Caltech / CSA / Aarhus Univ.',
    finalActVizId: 'phoenix_met_telltale_wind',
    sources: [
      {
        label: 'NASA Planetary Data System (Phoenix Sols 1–150)',
        url: 'https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Phoenix/phoenix.html'
      }
    ]
  },

  phoenix_met_legacy: {
    cueId: 'phoenix_met_legacy',
    missionTag: 'NASA PDS ARCHIVE // SOLS 1–150 FIRST MARTIAN FORECAST',
    title: 'Phoenix Wrote the First Martian Weather Forecast',
    caption: 'Stored in NASA’s Planetary Data System covering Sols 1 to 150, Phoenix MET data underpins weather forecasts for future rovers and astronauts.',
    altText: 'Phoenix lander panorama archive and Telltale weather summary.',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (PIA10793)',
    objectFit: 'contain',
    localImage: '/media/mars/phoenix/phoenix-panorama-arm-pia10793.jpg',
    finalActVizId: 'phoenix_met_telltale_wind',
    sources: [
      {
        label: 'NASA Phoenix Archive (PDS)',
        url: 'https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Phoenix/phoenix.html'
      }
    ]
  },

  outro_earth_approach: {
    cueId: 'outro_earth_approach',
    missionTag: 'EARTH APPROACH // REVERSE THRUSTERS ENGAGED',
    title: 'Home Sweet Home — Living Blue World Ahead',
    caption: 'Gravity captures the ship safely for descent as Felice looks out the forward window at oceans, atmosphere, and life.',
    altText: 'NASA photograph of Earth suspended in the darkness of space.',
    credit: 'NASA',
    objectFit: 'contain',
    localImage: '/media/nasa/earth-from-moon.jpg',
    sources: [
      {
        label: 'NASA Earth Observatory',
        url: 'https://earthobservatory.nasa.gov/'
      }
    ]
  },

  outro_pale_blue_comparison: {
    cueId: 'outro_pale_blue_comparison',
    missionTag: 'PERSPECTIVE // FROM A SINGLE PIXEL BACK TO OCEANS',
    title: 'Pale Blue Dot vs. Close-Up Home',
    caption: 'Comparing Voyager 1’s single-pixel portrait from 6 billion km away with Earth filling our cockpit windshield up close.',
    altText: 'Side-by-side comparison of Voyager Pale Blue Dot and Apollo Earthrise view of Earth.',
    credit: 'NASA / JPL-Caltech & NASA Apollo Archive',
    dualPanels: [
      {
        label: 'Pale Blue Dot (6B km)',
        sublabel: 'Voyager 1 (1990)',
        image: '/media/deep-space/voyager-pale-blue-dot.jpg',
        altText: 'Voyager 1 Pale Blue Dot photograph.',
        credit: 'NASA / JPL-Caltech',
        sourceUrl: 'https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/'
      },
      {
        label: 'Earth Up Close',
        sublabel: 'Oceans & clouds return',
        image: '/media/nasa/earthrise-horizon.jpg',
        altText: 'NASA Apollo photograph of sunlit Earth with blue oceans and white cloud systems.',
        credit: 'NASA',
        sourceUrl: 'https://earthobservatory.nasa.gov/'
      }
    ],
    sources: [
      {
        label: 'NASA Pale Blue Dot',
        url: 'https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/'
      }
    ]
  },

  outro_earth_stewardship: {
    cueId: 'outro_earth_stewardship',
    missionTag: 'EARTH STEWARDSHIP // OZONE, FORESTS & CLEAN ENERGY',
    title: 'Protecting the World Where Dreams Begin',
    caption: 'From ozone recovery and planned afforestation to clean energy science—plus Felice’s paw-sworn promise to keep trash in the bin.',
    altText: 'NASA Apollo portrait of blue Earth with swirling clouds.',
    credit: 'NASA',
    objectFit: 'contain',
    localImage: '/media/nasa/earthrise-horizon.jpg',
    sources: [
      {
        label: 'NASA Climate & Earth Science',
        url: 'https://science.nasa.gov/earth/'
      }
    ]
  },

  outro_reentry_aurora: {
    cueId: 'outro_reentry_aurora',
    missionTag: 'EARTH RE-ENTRY // SECTOR 6A, SLOT 37 (ETA 2 MIN)',
    title: 'Green & Violet Aurora Rippling Across the Windshield',
    caption: 'Atmospheric entry clears cleanly to Sector 6A, Slot 37 while auroral curtains shimmer across the cockpit glass.',
    altText: 'Earth view paired with shimmering green and violet aurora reentry overlay.',
    credit: 'NASA + Conceptual Windshield Overlay',
    objectFit: 'contain',
    localImage: '/media/nasa/earthrise-horizon.jpg',
    finalActVizId: 'earth_aurora_reentry',
    sources: [
      {
        label: 'NASA Aurora Science',
        url: 'https://science.nasa.gov/sun/auroras/'
      }
    ]
  },

  outro_felicette_legacy: {
    cueId: 'outro_felicette_legacy',
    missionTag: '1963 – PRESENT // FÉLICETTE & HUMAN AMBITION',
    title: 'From a Stray Cat in Paris to the Stars Above',
    caption: 'In October 1963, Félicette launched into suborbital space and returned safely—echoing every bold idea from Moon mirrors to hanging cylinders on Mars.',
    altText: 'Earth reentry view with Félicette 1963 tribute overlay.',
    credit: 'NASA + Conceptual Tribute',
    objectFit: 'contain',
    localImage: '/media/nasa/earthrise-horizon.jpg',
    finalActVizId: 'earth_aurora_reentry',
    sources: [
      {
        label: 'NASA Space History',
        url: 'https://www.nasa.gov/history/'
      }
    ]
  },

  outro_the_end: {
    cueId: 'outro_the_end',
    missionTag: 'TRANSMISSION COMPLETE // THE END',
    title: '“In My Eyes, You Guys Are Truly the Stars of the Universe…”',
    caption: 'Touchdown complete at Sector 6A, Slot 37. Thank you for flying with Felice across the Solar System and beyond.',
    altText: 'Earth view paired with final aurora tribute and Félicette dedication.',
    credit: 'NASA + Cosmic Saga Finale',
    objectFit: 'contain',
    localImage: '/media/nasa/earthrise-horizon.jpg',
    finalActVizId: 'earth_aurora_reentry',
    sources: [
      {
        label: 'NASA Exploration Archive',
        url: 'https://science.nasa.gov/'
      }
    ]
  }
};

export function getSceneMediaCue(
  scene: Scene,
  node: StoryNode,
  nodeIndex: number
): string | undefined {
  if (
    (node.type === 'say' ||
      node.type === 'stage' ||
      node.type === 'choice' ||
      node.type === 'menu') &&
    node.mediaCue
  ) {
    return node.mediaCue;
  }

  switch (scene.id) {
    case 'mars_viking':
      return 'mars_viking_surface';
    case 'mars_sojourner':
      return 'mars_sojourner_apxs';
    case 'mars_phoenix':
      return nodeIndex >= 2 ? 'mars_phoenix_meca' : 'mars_phoenix_deck';
    case 'ds_pioneer':
      return 'ds_pioneer_jupiter';
    case 'ds_voyager':
      return nodeIndex >= 2 ? 'ds_voyager_pbd' : 'ds_voyager_craft';
    case 'ds_ds1_nh_blocked':
      return 'ds_blocked_pair';
    case 'mars_phoenix_met':
      return 'remote_phoenix_observation';
    default:
      return undefined;
  }
}

export const GALLERY_MISSIONS: GalleryMissionEntry[] = [
  {
    id: 'apollo11',
    missionName: 'Apollo 11',
    dateLabel: 'July 20, 1969',
    title: 'Sea of Tranquility — 100-Prism Array',
    caption: 'Apollo 11 Lunar Laser Ranging Retroreflector — 100 corner-cube prisms deployed by Buzz Aldrin.',
    credit: 'NASA / Apollo 11 Lunar Surface Journal',
    altText: 'Apollo 11 Laser Ranging Retroreflector deployed at Tranquility Base.',
    localImage: '/media/nasa/apollo11-reflector.jpg',
    source: {
      label: 'Apollo 11 Image Archive',
      url: 'https://nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html'
    }
  },
  {
    id: 'apollo14',
    missionName: 'Apollo 14',
    dateLabel: 'February 5, 1971',
    title: 'Fra Mauro Highlands — 100-Prism Twin',
    caption: 'Apollo 14 deployed the second 100-prism retroreflector, widening the triangular baseline across the Moon.',
    credit: 'NASA Apollo 14 Mission Archive',
    altText: 'Apollo 14 Fra Mauro Lunar Laser Ranging Retroreflector.',
    localImage: '/media/nasa/apollo14-reflector.jpg',
    source: {
      label: 'NASA Apollo 14 Archive',
      url: 'https://www.nasa.gov/mission/apollo-14/'
    }
  },
  {
    id: 'apollo15',
    missionName: 'Apollo 15',
    dateLabel: 'July 30, 1971',
    title: 'Hadley-Apennine — 300-Prism Array',
    caption: 'The largest Apollo retroreflector (~1 m × 0.6 m, 300 prisms) deployed beside Hadley Rille.',
    credit: 'NASA Photojournal / Hadley-Apennine',
    altText: 'Apollo 15 300-prism Laser Ranging Retroreflector on the Moon.',
    localImage: '/media/nasa/apollo15-array.jpg',
    source: {
      label: 'NASA Apollo 15 Photojournal',
      url: 'https://science.nasa.gov/photojournal/the-apollo-15-lunar-laser-ranging-retroreflector-a-fundamental-point-on-the-moon/'
    }
  },
  {
    id: 'lunokhod',
    missionName: 'Lunokhod 1 & 2',
    dateLabel: 'Nov 1970 & Jan 1973',
    title: 'Luna 17 / Luna 21 Rover Retroreflectors',
    caption: 'Soviet lunar rovers carried French-built corner-cube arrays; Lunokhod 1 was relocated by NASA LRO in 2010.',
    credit: 'ILRS / NASA CDDIS Reference',
    altText: 'Lunokhod rover retroreflector reference image.',
    localImage: '/media/nasa/lunokhod-reflector.jpg',
    source: {
      label: 'ILRS Reflector Reference',
      url: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html'
    }
  },
  {
    id: 'blue_ghost',
    missionName: 'Blue Ghost (NGLR)',
    dateLabel: 'March 2025',
    title: 'Mare Crisium — Next Generation Retroreflector',
    caption: 'Firefly Aerospace’s Blue Ghost lander carried NASA’s Next Generation Lunar Retroreflector to continue precision ranging.',
    credit: 'NASA / Firefly Aerospace',
    altText: 'Blue Ghost lunar lander carrying the Next Generation Lunar Retroreflector.',
    localImage: '/media/nasa/blue-ghost-moon.jpg',
    source: {
      label: 'NASA Blue Ghost Mission Media',
      url: 'https://www.nasa.gov/general/nasa-cameras-on-blue-ghost-capture-first-of-its-kind-moon-landing-footage/'
    }
  }
];
