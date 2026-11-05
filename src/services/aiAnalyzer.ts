import { ShotAnalysis, VideoInfo, AnalysisStage, ShotKey, ShotPresetOption } from '../types/badminton';

export const SHOT_PRESETS: ShotPresetOption[] = [
  {
    key: 'jump_smash',
    name: 'Jump Smash',
    category: 'Smash',
    icon: 'flash',
    badge: 'Kracht & Hoek',
    description: 'Explosieve verticale sprong met steile neerwaartse baan',
  },
  {
    key: 'backhand_smash',
    name: 'Backhand Smash',
    category: 'Smash',
    icon: 'rocket',
    badge: 'Verrassend & Dodelijk',
    description: 'Zeldzaam aanvallend wapen met snelle onderarmsupinatie',
  },
  {
    key: 'backhand_clear',
    name: 'Backhand Clear',
    category: 'Clear',
    icon: 'arrow-up-circle',
    badge: 'Achterveld Herstel',
    description: 'Hoge verdedigende of aanvallende clear vanuit de verre achterhoek',
  },
  {
    key: 'backhand_drop',
    name: 'Backhand Drop',
    category: 'Drop',
    icon: 'water',
    badge: 'Gevoel & Vermomming',
    description: 'Zacht gesneden dropshot die strak over de netrand tuimelt',
  },
  {
    key: 'forehand_smash',
    name: 'Forehand Smash',
    category: 'Smash',
    icon: 'flame',
    badge: 'Pure Snelheid',
    description: 'Klassieke harde smash met krachtige onderarmpronatie',
  },
  {
    key: 'overhead_clear',
    name: 'Overhead Clear',
    category: 'Clear',
    icon: 'cloud-upload',
    badge: 'Baancontrole',
    description: 'Hoge boogbal die de tegenstander diep naar de baseline drijft',
  },
  {
    key: 'slice_drop',
    name: 'Slice Dropshot',
    category: 'Drop',
    icon: 'leaf',
    badge: 'Scherpe Hoek',
    description: 'Snelle cross-court slice met een plotselinge duik voorin',
  },
  {
    key: 'flat_drive',
    name: 'Vlakke Drive',
    category: 'Drive',
    icon: 'speedometer',
    badge: 'Dubbelspel Tempo',
    description: 'Snelle vlakke slagwisseling rakelings over het net',
  },
  {
    key: 'net_kill',
    name: 'Net Kill / Tap',
    category: 'Netslag',
    icon: 'flash-outline',
    badge: 'Direct Punt',
    description: 'Bliksemsnelle tik op een net boven de netband opduikende shuttle',
  },
];

export const ANALYSIS_STAGES: AnalysisStage[] = [
  {
    title: 'Shuttlebaan Traceren',
    description: 'Scannen van het 60fps vluchtpad, balsnelheid & de baanboog...',
    durationMs: 800,
  },
  {
    title: 'Speler Biomechanica Analyseren',
    description: 'Beoordelen van ellebooghoogte, schouderhoek & heuprotatie...',
    durationMs: 1000,
  },
  {
    title: 'Impactdynamica Meten',
    description: 'Berekenen van de racketbladoppervlak-hoek, polssnap & raakpunthoogte...',
    durationMs: 950,
  },
  {
    title: 'AI Rapport Samenstellen',
    description: 'Genereren van sterke punten, verbeterpunten en trainingsvormen...',
    durationMs: 750,
  },
];

const DETAILED_SHOT_DATABASE: Record<ShotKey, Omit<ShotAnalysis, 'id' | 'analyzedAt' | 'video'>> = {
  jump_smash: {
    shotKey: 'jump_smash',
    shotName: 'Explosieve Jump Smash',
    shotCategory: 'Smash',
    score: 92,
    tagline: 'Grote sprongkracht met een verwoestende neerwaartse penetratie',
    metrics: {
      speedKmh: 365,
      contactHeightM: 2.96,
      impactAngleDeg: 21.3,
      kineticChainEfficiency: 94,
    },
    goodPoints: [
      'Uitstekende verticale afzet: het raakpunt werd bereikt op een piekhoogte van 2,96 m.',
      'Schaarsprong (scissor kick) voetenwerk perfect gesynchroniseerd met onderarmpronatie.',
      'Krachtige ontspanning van schouder en heup leidde tot een hoge racketsnelheid (365 km/u).',
      'Het raakpunt lag ruim vóór het lichaam, wat resulteerde in een agressieve steile hoek.',
    ],
    badPoints: [
      'De niet-racket balansarm zakte te vroeg omlaag tijdens de sprongpiek, wat rotatiekracht kostte.',
      'Landeringsimpact te stijf opgevangen op de rechterhiel in plaats van soepel door de knieën.',
      'Herstelverplaatsing (split-step) terug naar het baancentrum vertraagde met 0,32s.',
      'Het racketblad stond 3° te open, waardoor de bal net te veel richting de zijlijn dreef.',
    ],
    coachTips: [
      'Voeg plyometrische box-jumps met schaduwslagen toe om zachtere landingen aan te leren.',
      'Blijf met je niet-racketarm naar de shuttle wijzen tot het exacte moment van de heuprotatie.',
      'Train schaarsprong multi-shuttle oefeningen gericht op direct voetenwerkherstel naar het T-punt.',
    ],
  },

  backhand_smash: {
    shotKey: 'backhand_smash',
    shotName: 'Backhand Smash (Taufik-stijl)',
    shotCategory: 'Smash',
    score: 87,
    tagline: 'Verrassende aanvallende winner geslagen vanuit het diepe achterveld',
    metrics: {
      speedKmh: 268,
      contactHeightM: 2.58,
      impactAngleDeg: 16.8,
      kineticChainEfficiency: 90,
    },
    goodPoints: [
      'Voorbeeldige backhand-facetgreep: duimdruk zuiver geplaatst op de schuine rand van de grip.',
      'Hoge elleboogleiding gevolgd door explosieve onderarmsupinatie voor een zweepslageffect.',
      'Maximaal verrassingselement: de tegenstander rekende op een verdedigende clear.',
      'Zuivere impact in de sweet-spot van het racketblad zonder merkbare torsietrilling.',
    ],
    badPoints: [
      'Raakpunt lag iets te ver achter het lichaam in plaats van op 10 uur voor de schouder.',
      'Bovenlichaam draaide te ver door, waardoor het zicht op de tegenstander kort verloren ging.',
      'Verhoogd blessurerisico: het schoudergewricht ving te veel abrupte remkracht op.',
    ],
    coachTips: [
      'Zorg ervoor dat je de shuttle raakt wanneer deze zich net vóór je slagschouder bevindt.',
      'Laat de racketkop na de klap op een natuurlijke manier terugveren in plaats van abrupt af te remmen.',
    ],
  },

  backhand_clear: {
    shotKey: 'backhand_clear',
    shotName: 'Hoge Backhand Clear',
    shotCategory: 'Clear',
    score: 85,
    tagline: 'Diepe herstelclear die de druk op de achterhandhoek neutraliseert',
    metrics: {
      speedKmh: 232,
      contactHeightM: 2.64,
      impactAngleDeg: 9.5,
      kineticChainEfficiency: 86,
    },
    goodPoints: [
      'Rechtervoet stapte diep in de achterhoek voor een stabiele, solide slagbasis.',
      'Goede ontspannen greepvoorbereiding gevolgd door een krachtige duimduw bij balcontact.',
      'Vluchtbaan bereikte uitstekende hoogte en landde keurig binnen de achterste tramrails.',
    ],
    badPoints: [
      'Bovenlichaam draaide een fractie te vroeg terug naar het net vóór het shuttlecontact.',
      'Elleboog zakte tijdens de achterzwaai zo’n 8 cm onder de aanbevolen hoogte.',
      'Knijpkracht in de vingers was te strak tijdens de voorbereiding, wat elasticiteit wegnam.',
    ],
    coachTips: [
      'Houd je rug volledig naar het net gedraaid tot het exacte moment van shuttlecontact.',
      'Houd je vingers losjes om de grip tot de laatste 5 milliseconden vóór de duimversnelling.',
      'Oefen met weerstandsbanden om specifieke onderarmkracht voor de backhand op te bouwen.',
    ],
  },

  backhand_drop: {
    shotKey: 'backhand_drop',
    shotName: 'Misleidende Backhand Drop',
    shotCategory: 'Drop',
    score: 90,
    tagline: 'Zachte gesneden dropshot die strak over de netrand tuimelt',
    metrics: {
      speedKmh: 104,
      contactHeightM: 2.52,
      impactAngleDeg: 29.4,
      kineticChainEfficiency: 88,
    },
    goodPoints: [
      'Uitzonderlijke vermomming: de slagvoorbereiding leek identiek aan een diepe clear.',
      'Vloeiend aangesneden contact langs de veren zorgde voor een snelle snelheidsafname.',
      'De shuttle passeerde het net op slechts 6 cm hoogte met een steil dalende curve.',
    ],
    badPoints: [
      'De zwaaisnelheid vertraagde merkbaar net vóór contact, wat de slag deels weggaf.',
      'Uitzwaai bevroor te krampachtig in plaats van ontspannen door te lopen.',
      'Trage afzet met de linkervoet: ontbrak aan directe dreiging om het net over te nemen.',
    ],
    coachTips: [
      'Behoud een volle zwaaisnelheid en vertrouw puur op het schuine snijvlak om vaart te remmen.',
      'Maak direct na balcontact een agressieve voorwaartse stap om een net-return af te straffen.',
    ],
  },

  forehand_smash: {
    shotKey: 'forehand_smash',
    shotName: 'Steile Forehand Smash',
    shotCategory: 'Smash',
    score: 89,
    tagline: 'Harde smash vanaf de baseline met een krachtige onderarmpronatie',
    metrics: {
      speedKmh: 342,
      contactHeightM: 2.78,
      impactAngleDeg: 18.6,
      kineticChainEfficiency: 91,
    },
    goodPoints: [
      'Vloeiende overbrenging van lichaamsgewicht via heuprotatie naar het racketblad.',
      'Felle onderarmpronatie veroorzaakte een loepzuiver en hard impactgeluid.',
      'Borstkas opende goed met de niet-racketarm die de shuttle nauwgezet peilde.',
    ],
    badPoints: [
      'Raakpunt lag 10 cm lager dan de maximale reikwijdte, wat 2° aan steilheid kostte.',
      'Uitzwaai liep horizontaal rond het middel in plaats van diagonaal omlaag naar de heup.',
    ],
    coachTips: [
      'Reik hoger met een hoge elleboog om de shuttle op het absolute toppunt te raken.',
      'Stuur de uitzwaai langs de tegenoverliggende knie om een neerwaarts traject te garanderen.',
    ],
  },

  overhead_clear: {
    shotKey: 'overhead_clear',
    shotName: 'Aanvallende Overhead Clear',
    shotCategory: 'Clear',
    score: 86,
    tagline: 'Hoge baan die de tegenstander diep in de achterste hoeken drukt',
    metrics: {
      speedKmh: 248,
      contactHeightM: 2.82,
      impactAngleDeg: 8.8,
      kineticChainEfficiency: 87,
    },
    goodPoints: [
      'Volledige armstrekking benutte de maximale hefboomlengte van het racket.',
      'Hoog raakpunt direct boven de slagschouder.',
      'Shuttle landde consistent binnen 20 cm van de achterste servicelijn.',
    ],
    badPoints: [
      'Speler leunde bij impact licht achterover, wat zorgde voor een kleine balansverstoring.',
      'Greep bleef te verkrampt in een hamergreep in plaats van een ontspannen V-greep.',
    ],
    coachTips: [
      'Houd de buikspieren aangespannen en verplaats je gewicht naar je voorste voet.',
      'Ontspan je vingers tot het raakmoment om moeiteloze diepte te genereren.',
    ],
  },

  slice_drop: {
    shotKey: 'slice_drop',
    shotName: 'Cross-Court Slice Dropshot',
    shotCategory: 'Drop',
    score: 93,
    tagline: 'Flinterdunne netpassage met een misleidende lichaamspositie',
    metrics: {
      speedKmh: 118,
      contactHeightM: 2.74,
      impactAngleDeg: 27.5,
      kineticChainEfficiency: 92,
    },
    goodPoints: [
      'Prachtige snijbeweging over de dop in een scherpe hoek van 45°.',
      'Lichaamshouding veinsde tot het laatste moment een harde rechtdoor smash.',
      'Shuttle daalde steil en landde diep binnen het voorste servicevak.',
    ],
    badPoints: [
      'Racketblad draaide iets te vroeg naar binnen, waardoor oplettende spelers de hoek lazen.',
      'Herstelstap naar voren richting de netzone was 0,2s te afwachtend.',
    ],
    coachTips: [
      'Wissel de standaardslice af met een reverse-slice om tegenstanders op het verkeerde been te zetten.',
      'Schaduwtraining: beweeg direct na het raken van de drop door naar de netband.',
    ],
  },

  flat_drive: {
    shotKey: 'flat_drive',
    shotName: 'Snelle Vlakke Drive',
    shotCategory: 'Drive',
    score: 84,
    tagline: 'Vlakke raket-snelle drive om het tempo in dubbelspel rallies te domineren',
    metrics: {
      speedKmh: 205,
      contactHeightM: 1.68,
      impactAngleDeg: 3.4,
      kineticChainEfficiency: 85,
    },
    goodPoints: [
      'Korte compacte achterzwaai waardoor snel herladen in snelle rallys mogelijk was.',
      'Scherpe vingerknijpkracht op het raakmoment zorgde voor een venijnige versnelling.',
      'Lage, gebalanceerde atletische basishouding.',
    ],
    badPoints: [
      'Shuttle passeerde het net af en toe 30 cm te hoog, wat uitnodigde tot onderschepping.',
      'Racketkop zakte tussen opeenvolgende slagen onder polshoogte.',
    ],
    coachTips: [
      'Houd het racketblad te allen tijde boven polshoogte in het midveld.',
      'Stuur de shuttle omlaag richting de heup of de racket-schouder van de tegenstander.',
    ],
  },

  net_kill: {
    shotKey: 'net_kill',
    shotName: 'Explosieve Net Kill / Tap',
    shotCategory: 'Netslag',
    score: 94,
    tagline: 'Bliksemsnelle tik op een net boven de netrand tuimelende shuttle',
    metrics: {
      speedKmh: 178,
      contactHeightM: 1.58,
      impactAngleDeg: 42.1,
      kineticChainEfficiency: 95,
    },
    goodPoints: [
      'Geen achterzwaai: voorkwam netfouten en hield de reactietijd ultrakort.',
      'Anticipeerde perfect op de tuimelende shuttle op het vroegst mogelijke moment.',
      'Korte pols- en vingertik duwde de shuttle direct naar de vloer.',
    ],
    badPoints: [
      'De slagbeweging raakte bijna het netkoord: de marge was minder dan 2 cm.',
      'Voorwaarts lichaamsmomentum schoot te wild door, wat ten koste ging van de balans.',
    ],
    coachTips: [
      'Gebruik een ruitenwisser-beweging evenwijdig aan het net om netfouten te voorkomen.',
      'Rem actief af met de uitvallende voorvoet zodat je hoofd rechtop en in evenwicht blijft.',
    ],
  },
};

export async function analyzeBadmintonVideo(
  video: VideoInfo,
  onProgress?: (progress: number, stageIndex: number) => void
): Promise<ShotAnalysis> {
  const totalDuration = ANALYSIS_STAGES.reduce((sum, stage) => sum + stage.durationMs, 0);
  let elapsed = 0;

  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    const stage = ANALYSIS_STAGES[i];
    const stepInterval = 100;
    const steps = Math.floor(stage.durationMs / stepInterval);

    for (let step = 0; step < steps; step++) {
      await new Promise((resolve) => setTimeout(resolve, stepInterval));
      elapsed += stepInterval;
      const progressPercent = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
      if (onProgress) {
        onProgress(progressPercent, i);
      }
    }
  }

  // Complete progress to 100%
  if (onProgress) {
    onProgress(100, ANALYSIS_STAGES.length - 1);
  }

  // Match shot preset or detect
  let selectedKey: ShotKey = 'jump_smash';

  if (video.samplePreset && DETAILED_SHOT_DATABASE[video.samplePreset]) {
    selectedKey = video.samplePreset;
  } else if (video.name) {
    const lower = video.name.toLowerCase();
    if (lower.includes('backhand smash') || lower.includes('backhand-smash')) selectedKey = 'backhand_smash';
    else if (lower.includes('backhand clear') || lower.includes('backhand-clear')) selectedKey = 'backhand_clear';
    else if (lower.includes('backhand drop') || lower.includes('backhand-drop')) selectedKey = 'backhand_drop';
    else if (lower.includes('jump smash') || lower.includes('jump-smash') || lower.includes('sprongsmash')) selectedKey = 'jump_smash';
    else if (lower.includes('smash')) selectedKey = 'forehand_smash';
    else if (lower.includes('clear')) selectedKey = 'overhead_clear';
    else if (lower.includes('drop')) selectedKey = 'slice_drop';
    else if (lower.includes('drive')) selectedKey = 'flat_drive';
    else if (lower.includes('net') || lower.includes('kill')) selectedKey = 'net_kill';
    else selectedKey = 'jump_smash';
  } else {
    const keys: ShotKey[] = ['jump_smash', 'backhand_smash', 'backhand_clear', 'backhand_drop', 'forehand_smash', 'slice_drop'];
    selectedKey = keys[Math.floor(Math.random() * keys.length)];
  }

  const base = DETAILED_SHOT_DATABASE[selectedKey];

  return {
    id: `smash-${Date.now()}`,
    shotKey: base.shotKey,
    shotName: base.shotName,
    shotCategory: base.shotCategory,
    score: base.score,
    tagline: base.tagline,
    metrics: { ...base.metrics },
    goodPoints: [...base.goodPoints],
    badPoints: [...base.badPoints],
    coachTips: [...base.coachTips],
    analyzedAt: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    video,
  };
}
