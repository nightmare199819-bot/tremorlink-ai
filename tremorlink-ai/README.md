# TremorLink AI

A frontend-only, offline-first disaster-awareness **simulation prototype**. It demonstrates a command center for synthetic sensor observations, local classifier outputs, a simulated peer mesh, event quorum, and community reports.

> **Important:** This is not a real earthquake detector, not a validated safety system, and not a real phone-to-phone radio mesh. All readings, predictions, packets, and events are simulated. Do not use it for emergency decisions.

## Features

- Responsive dark command-center interface (near-black, emerald, subtle crimson).
- Animated page transitions and interactive visual feedback.
- Six modules: Command Center, Sensor Intelligence, AI Detection Engine, Mesh Network, Event Verification, Community Pulse.
- Five scenarios: Normal activity, Isolated impact, Corroborated event, Network interruption, Duplicate packet.
- Shared scenario state across modules.
- Simulated waveform, feature values, classifier scores, mesh topology, packet handling, and quorum.
- Add community reports locally in the current browser session.
- Reduced-motion accessibility support.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Push to your GitHub repository

Your repository: `https://github.com/nightmare199819-bot/tremorlink-ai`

### Option A — GitHub Desktop

1. Extract the downloaded ZIP.
2. Open GitHub Desktop and choose **File → Add Local Repository**.
3. Select the extracted `tremorlink-ai` folder.
4. If GitHub Desktop says it is not a repository, choose **Create a repository** and use the extracted folder.
5. Commit all files with a message such as `Build TremorLink AI prototype`.
6. Choose **Publish repository** or **Push origin**.
7. If publishing a new repository, select the existing GitHub repository only if GitHub Desktop offers the correct matching destination. Do not create a second repository with a different name.

### Option B — Terminal

If you have already cloned the empty GitHub repository, copy the extracted project files into that clone, then run:

```bash
git add .
git commit -m "Build TremorLink AI prototype"
git push origin main
```

If you have not cloned it yet:

```bash
git clone https://github.com/nightmare199819-bot/tremorlink-ai.git
```

Copy the extracted project files into the cloned folder, then run the three Git commands above from inside that folder.

GitHub may ask you to sign in through your browser. Never paste a GitHub password or personal access token into this project.

## Technical notes

- React + TypeScript + Vite
- Framer Motion for page and modal transitions
- Recharts for signal visualization
- Lucide React icons
- No external API, API key, backend, paid database, or external AI service
- Community reports are kept in component state and are not persisted to a server.

## Suggested next improvements

1. Add automated tests for scenario transitions and quorum rules.
2. Replace illustrative classifier scores with a properly trained and independently evaluated model.
3. Implement a real backend and device protocol only after defining a safe, testable hardware/network design.
4. Add persistence and authentication if the project later needs multiple users.
