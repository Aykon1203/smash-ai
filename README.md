# 🏸 SmashAI - Badminton AI Shot Analyzer

SmashAI is een intelligente React Native mobiele applicatie die badminton-slagen in real-time analyseert met behulp van een **on-device Google MediaPipe Pose (BlazePose 33-punts)** computervisie-pipeline. Spelers en trainers kunnen live video opnemen van een speler die de shuttle raakt of bestaande videobeelden uploaden om directe biomechanische feedback te ontvangen.

---

## 🧠 On-Device AI Computer Vision Pipeline

SmashAI gebruikt geen statische mock data meer, maar verwerkt video's via een 4-traps on-device analyse-pipeline:

```
[ Videobestand (Camera / Galerij) ]
             │
             ▼
 1. Frame Extraheerder (expo-video-thumbnails)
    Bemonstert 6 opeenvolgende frames over het slagtraject
             │
             ▼
 2. Google MediaPipe BlazePose On-Device Model
    Detecteert 33 3D-lichaamslandmarks (schouders, ellebogen, polsen, heupen, knieën, enkels)
             │
             ▼
 3. Kinematica & Vluchtbaan Engine (kinematics.ts)
    • Elleboogstrekking (schouder - elleboog - pols vectorhoek)
    • Schouderheffingshoek (heup - schouder - elleboog)
    • Sprongapex (heupverplaatsing in meters)
    • Racketsnelheid & polsversnelling (Δd / Δt met hefboomfactor)
    • Neerwaartse impacthoek (invalshoek in graden)
    • Kniebuiging bij landing & schokabsorptie
    • Herstelsnelheid (split-step timing)
             │
             ▼
 4. Slagclassificatie & Dynamisch Biomechanisch Rapport (shotClassifier.ts)
    Berekent de werkelijke techniekscore (0–100) en formuleert dynamische
    sterke en zwakke punten direct afgeleid van de gedetecteerde gewrichtshoeken.
```

---

## ✨ Functionaliteiten

- **🏸 Volledige Slagondersteuning**:
  - **Explosieve Jump Smash** (verticale sprongkracht, schaarsprong, steile hoek)
  - **Backhand Smash (Taufik-stijl)** (onderarmsupinatie, duimdruk op het brede facet)
  - **Hoge Backhand Clear** (herstel vanuit de achterste hoek, diepe baselinebaan)
  - **Misleidende Backhand Drop** (gesneden balcontact, strakke netpassage)
  - **Steile Forehand Smash** (onderarmpronatie, harde smash)
  - **Aanvallende Overhead Clear** (diepe boogbal ter controle)
  - **Cross-Court Slice Dropshot** (snijdende hoek met plotselinge duik)
  - **Snelle Vlakke Drive** (dubbelspel tempo, compacte achterzwaai)
  - **Explosieve Net Kill / Tap** (snelle netreactie zonder achterzwaai)

- **📱 Drie Hoofdschermen**:
  1. **Start (`Home`)**:
     - Centrale video invoer container met **Video Opnemen** (camera) en **Video Uploaden** (galerij).
     - Slagen-selector om specifieke slagpatronen te testen.
     - Richtlijnen voor optimale camera-opstelling (zijaanzicht, 3–4m afstand, 60fps).
  2. **Analyseren (`Loading`)**:
     - Geanimeerde shuttlecock en voortgangsbalk (0% → 100%).
     - Stappenoverzicht met de status van de MediaPipe visie-pipeline.
     - Wisselende professionele badmintontips en feiten.
  3. **Resultaat (`Result`)**:
     - Gedetecteerd slagtype, categorie en berekende techniekscore.
     - Biomechanische metrieken: snelheid (km/u), raakpunthoogte (m), invalshoek (°) en kinetische efficiëntie (%).
     - **Goede punten**: concrete sterke punten op basis van gemeten hoeken.
     - **Verbeterpunten**: concrete aandachtspunten (bijv. gebogen elleboog, stijve knielanding).
     - **Aanbevolen trainingsvormen**: oefeningen afgestemd op de gevonden fouten.
     - **Nieuwe video opnemen** knop & **Feedback exporteren** knop via native deelscherm.

---

## 🏗️ Projectstructuur

```
SmashAI/
├── App.tsx                               # Schermcontroller (Start ⇄ Analyseren ⇄ Resultaat)
├── app.json                              # Expo configuratie & cameratoestemmingen
├── src/
│   ├── types/
│   │   └── badminton.ts                  # TypeScript interfaces voor slagen, metrieken & video
│   ├── constants/
│   │   └── theme.ts                      # Baangroen & volt-geel kleurenpalet
│   ├── services/
│   │   ├── aiAnalyzer.ts                 # Hoofd AI vision service pipeline
│   │   ├── exportService.ts              # Nederlands feedbackrapport & native delen
│   │   └── poseEstimation/
│   │       ├── types.ts                  # 33 MediaPipe landmarks & biomechanische interfaces
│   │       ├── frameExtractor.ts         # Frame sampling via expo-video-thumbnails
│   │       ├── mediaPipeModel.ts         # On-device MediaPipe BlazePose 33-punts model
│   │       ├── kinematics.ts             # Vectorhoeken, sprongapex & snelheidscalculaties
│   │       └── shotClassifier.ts         # Slagclassificatie & dynamische feedbackgenerator
│   ├── components/
│   │   ├── Header.tsx                    # Merkheader met live schermstatus
│   │   ├── MetricCard.tsx                # Kaarten voor snelheid, hoogte, hoek & keten
│   │   └── FeedbackCard.tsx              # Visuele kaarten voor Goede en Slechte punten
│   └── screens/
│       ├── HomeScreen.tsx                # Video invoer container & slagenbibliotheek
│       ├── LoadingScreen.tsx             # Geanimeerde AI voortgang & stappencontrole
│       └── ResultScreen.tsx              # Resultaten, goede/slechte punten & actieknoppen
```

---

## 🚀 Aan de Slag

```bash
cd SmashAI

# Dependencies installeren
pnpm install

# Start in tunnel-modus (voorkomt netwerk- & firewallproblemen in Expo Go)
pnpm run start:tunnel

# Of standaard lokale start
pnpm start

# Typecheck verifiëren
pnpm run typecheck
```
