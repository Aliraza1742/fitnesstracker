FitnessTracker — React Native mobile app

FitnessTracker is a modern cross-platform React Native application that helps users track workouts, view fitness statistics, manage nutrition lookups, and maintain progress over time. The project demonstrates a modular architecture, offline-friendly local storage, an optional Node/Express backend for user authentication and persistence, and clean UI patterns suitable for a consumer mobile app.

**Highlights:**
- **Platforms:** Android & iOS (React Native)
- **Navigation:** Stack + Drawer navigation (react-navigation)
- **State management:** Zustand for global stores (`useAuthStore`, `useWorkoutStore`, `useAlertStore`)
- **Authentication:** Local mock auth + optional backend JWT auth (Express + MongoDB)
- **Features:** Onboarding, Auth (Sign in / Sign up), Dashboard with workout tracking & stats, Workouts CRUD, Nutrition lookup, Profile, Settings, Notifications
- **Native integrations:** Local notifications (`@notifee/react-native`), AsyncStorage for persistence, platform-aware API client

**Screenshots / Image placeholders**
- Onboarding: ![Onboarding screen](docs/images/onboarding.png)
- Auth (Sign In / Sign Up): ![Auth screens](docs/images/auth.png)
- Dashboard: ![Dashboard screen](docs/images/dashboard.png)
- Drawer (navigation): ![Drawer screen](docs/images/drawer.png)
- Settings: ![Settings screen](docs/images/settings.png)
- Optional: Workouts / Exercise detail: ![Workouts screen](docs/images/workouts.png)

## Key Features

- **Onboarding flow:** Illustrated, animated onboarding sequence to introduce key app concepts (`src/screens/onboarding`).
- **Authentication & Profiles:** Sign up / Sign in flows with local AsyncStorage-backed mock auth and a paired Node/Express backend for JWT-based authentication (`backend/routes/auth.js`).
- **Workouts tracking:** Create, view and delete workout sessions; each session stores exercises, duration, and estimated calories. Workflows and calculations live in `src/services/workout` and `src/store/useWorkoutStore.ts`.
- **Dashboard & Progress:** Daily/weekly stats, streaks, and goal progress using `StatsCard` and `ProgressCircle` components.
- **Nutrition lookup:** Integration points for Nutritionix and OpenFood APIs to search food items and estimate calories (`src/services/nutritionix.ts`, `src/services/openFood.ts`).
- **Notifications:** Local push notifications for reminders and achievement alerts via Notifee and the app's `Notification` context.
- **Theming & Settings:** Light/dark theming, user preferences, and global settings stored in local context.

## Architecture & Code Organization

Top-level folders you will work with:

- `src/components` — Reusable UI components (common, dashboard, workouts, profile, ui)
- `src/screens` — Screen components organized by flow (auth, dashboard, onboarding, workouts, profile, settings)
- `src/navigation` — App navigation setup: `App.tsx`, `Auth.tsx`, `Main.tsx`, `DrawerContent.tsx`
- `src/store` — Zustand stores (`useAuthStore.ts`, `useWorkoutStore.ts`, `useAlertStore.ts`)
- `src/services` — Business logic and APIs (workoutService, progress, notification, nutrition)
- `backend/` — Optional Express + MongoDB backend for user management and JWT auth

Important files:

- App entry: `App.tsx`
- API client with platform-aware host: `src/api/client.ts`
- Auth store: `src/store/useAuthStore.ts`
- Workout store: `src/store/useWorkoutStore.ts`
- Backend auth route: `backend/routes/auth.js`

## Local development — quickstart

1. Install dependencies in the project root:

```bash
npm install
```

2. (Optional) Install and start the backend (requires MongoDB):

```bash
cd backend
npm install
# set .env with MONGO_URI and JWT_SECRET
node server.js
```

3. Start Metro and run the app on Android or iOS:

```bash
# Start metro
npm start

# Android (emulator/device)
npm run android

# iOS (simulator) — macOS only
npm run ios
```

Notes:
- The mobile app's API base URL is configured in `src/api/client.ts`. For Android emulator use `10.0.2.2` to reach a backend running on your host machine.
- If you do not run the backend, the app uses local AsyncStorage-based mock auth and offline flows.

## Environment & configuration

- Create a `.env` file for the backend with at least:
  - `MONGO_URI` — connection string for MongoDB
  - `JWT_SECRET` — secret used to sign tokens (keep secure)

## Testing & linting

- Unit tests: `npm test` (Jest config is present)
- Linting: `npm run lint`

## Contributing

- Follow the existing code patterns: small, focused components in `src/components`, screens under `src/screens`, business logic in `src/services`, and global state in `src/store` (Zustand).
- Open an issue or create a branch per feature/bug and submit a PR against `main`.

## Where to add screenshots

Place screenshots in the `docs/images/` folder and commit them. The README references the following files as placeholders:

- `docs/images/onboarding.png`
- `docs/images/auth.png`
- `docs/images/dashboard.png`
- `docs/images/drawer.png`
- `docs/images/settings.png`
- `docs/images/workouts.png`

## License

This repository does not contain a license file by default. Add a `LICENSE` if you plan to publish or share the code.

---

If you'd like, I can:

- add the actual screenshots into `docs/images/` (you can provide them or I can capture running emulator frames),
- open a PR for the README change, or
- expand any section (e.g., API reference, data models, or contribution guidelines).

