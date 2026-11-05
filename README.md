# 🏸 SmashAI - Badminton AI Shot Analyzer

SmashAI is an intelligent React Native mobile application that analyzes badminton strokes and shots in real time. Players and coaches can record live video of a player hitting a shuttlecock or upload existing footage to receive instant computer vision biomechanical feedback.

---

## ✨ Features

- **🏸 Comprehensive Badminton Shot Support**:
  - **Explosive Jump Smash** (peak elevation, scissor kick timing, downward steepness)
  - **Taufik-Style Backhand Smash** (forearm supination, thumb bevel power, element of surprise)
  - **Overhead Backhand Clear** (rear corner recovery, baseline tramline depth)
  - **Deceptive Backhand Drop** (slice disguise, net tape clearance)
  - **Steep Forehand Smash** (forearm pronation, shoulder turn, velocity)
  - **Attacking Overhead Clear** (deep court control)
  - **Cross-Court Slice Drop** (feather slice angle, sharp descent)
  - **Fast Flat Drive** (doubles tempo, compact backswing)
  - **Explosive Net Kill / Tap** (net tape reflex, zero backswing brush)

- **📱 Three-Screen Flow**:
  1. **Home Screen (`Home`)**:
     - Central container for capturing badminton footage.
     - **Record Video** button: Opens native camera to film a player hitting a shuttlecock.
     - **Upload Video** button: Picks recorded video clips from the gallery.
     - **Quick Shot Selector**: Try any shot type instantly with realistic sample data.
     - **Shooting Guidelines**: Tips for best camera angles, frame rates (60fps), and player positioning.
  2. **Loading Screen (`Loading`)**:
     - Animated badminton shuttlecock visualizer.
     - Dynamic progress bar (0% → 100%).
     - Multi-stage AI pipeline checklist:
       1. Shuttlecock trajectory extraction & flight curve
       2. Player skeletal biomechanics & kinetic chain tracking
       3. Impact dynamics, racket head velocity & impact angle
       4. Feedback synthesis & coaching drill formulation
     - Cycling badminton pro tips and facts.
  3. **Result Screen (`Result`)**:
     - Shot category badge, shot name & technique score (e.g., 92/100).
     - **Biomechanical Metrics**:
       - Estimated smash speed (km/h)
       - Contact point height (m)
       - Downward trajectory impact angle (degrees)
       - Kinetic chain efficiency (%)
     - **Good Points (Technique Strengths)**: Highlighted biomechanical positives.
     - **Bad Points (Areas for Improvement)**: Critical technical flaws to eliminate.
     - **Coach Recommendations & Targeted Drills**: Step-by-step training exercises.
     - **Record New Video Button**: Clears analysis and returns ready for the next shot.
     - **Export Feedback Button**: Native OS share sheet export with formatted coach report.

---

## 🏗️ Project Architecture

```
SmashAI/
├── App.tsx                    # Root app component and screen state manager
├── index.ts                   # Entry point
├── app.json                   # Expo config, camera & media permissions
├── src/
│   ├── types/
│   │   └── badminton.ts       # TypeScript interfaces for shots, metrics, video & progress
│   ├── constants/
│   │   └── theme.ts           # Athletic sports styling, badminton court green & volt palette
│   ├── services/
│   │   ├── aiAnalyzer.ts      # Multi-stage AI stroke analyzer & shot database
│   │   └── exportService.ts   # Formatted feedback report generator & native share utility
│   ├── components/
│   │   ├── Header.tsx         # Brand header with badminton logo and live screen indicator
│   │   ├── MetricCard.tsx     # Biomechanical metric cards (speed, height, angle, efficiency)
│   │   └── FeedbackCard.tsx   # Good Points & Bad Points cards with custom badges
│   └── screens/
│       ├── HomeScreen.tsx     # Central video capture / upload container & shot selector
│       ├── LoadingScreen.tsx  # Animated AI progress bar & stage checklist
│       └── ResultScreen.tsx   # Shot breakdown, good/bad points, Record New & Export buttons
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm or npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd SmashAI

# Install dependencies
pnpm install
# or
npm install
```

### Running the App

```bash
# Start the Expo development server
pnpm start

# Run on Android emulator / device
pnpm run android

# Run on iOS simulator (macOS required)
pnpm run ios

# Run in Web browser
pnpm run web
```

### Type Checking

```bash
pnpm run typecheck
```

---

## 🔒 Permissions Configured

- **iOS (`infoPlist`)**:
  - `NSCameraUsageDescription`: Access required to film badminton strokes.
  - `NSMicrophoneUsageDescription`: Access required for audio in recorded videos.
  - `NSPhotoLibraryUsageDescription`: Access required to upload badminton videos.
- **Android**:
  - `CAMERA`
  - `RECORD_AUDIO`
  - `READ_EXTERNAL_STORAGE`

---

## 🏸 Feedback Report Export Format

When tapping **Export feedback**, SmashAI formats a clean coaching summary:

```text
🏸 SMASHAI BADMINTON SHOT REPORT 🏸
----------------------------------------
Shot Type: Explosive Jump Smash (Smash)
Technique Score: 92/100
Analysis Time: 21:15
Summary: High-altitude contact with devastating downward penetration

KEY METRICS:
- Estimated Smash Speed: 365 km/h
- Contact Height: 2.96 m
- Impact Downward Angle: 21.3°
- Kinetic Chain Efficiency: 94%

GOOD POINTS (STRENGTHS):
  1. [GOOD] Outstanding vertical leap: contact reached at 2.96m peak elevation.
  2. [GOOD] Scissor kick footwork perfectly timed with forearm pronation & wrist snap.
  ...

AREAS FOR IMPROVEMENT (BAD POINTS):
  1. [WORK ON] Non-racket balance arm dropped prematurely during the jump peak.
  2. [WORK ON] Landing impact absorbed heavily on stiff right heel instead of forefoot.
  ...

COACH RECOMMENDATIONS & DRILLS:
  • Incorporate plyometric box jumps with racket shadow swings to cushion landings.
  • Keep your non-racket arm pointing at the shuttle until the split second of rotation.
----------------------------------------
Generated by SmashAI - AI Badminton Technique Coach
```

---

## 📄 License

MIT
