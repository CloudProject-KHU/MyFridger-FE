# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyFridger is a React Native mobile application built with Expo Router for managing refrigerator ingredients. The app allows users to add ingredients (via camera or manual entry), track expiration dates, and manage their inventory across different categories (vegetables, fruits, meat, seafood, dairy, etc.).

## Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## Architecture

### Navigation Structure (Expo Router)

The app uses file-based routing with Expo Router:

- `app/_layout.tsx` - Root layout with theme provider and SafeAreaProvider
- `app/(tabs)/` - Tab-based navigation (home, settings)
- `app/add/` - Ingredient addition flow (camera, select, form)
- `app/ingredients/` - Ingredient management (list, remove)

Routes are automatically generated from the file structure. Typed routes are enabled via `experiments.typedRoutes: true` in [app.json](app.json).

### Project Structure

```
src/features/          # Feature-based modules
  ├── add/            # Ingredient addition feature
  │   ├── components/ # Feature-specific components
  │   ├── screens/    # Screen components
  │   └── state/      # State management (pure functions)
  ├── ingredients/    # Ingredient management feature
  │   ├── components/
  │   ├── screens/
  │   ├── services/   # API and storage services
  │   ├── state/      # State management
  │   └── types.ts    # Type definitions
  └── settings/       # Settings feature

shared/               # Shared resources
  ├── components/     # Reusable UI components (badges, buttons, navigation)
  ├── constants/      # Constants (colors, ingredient categories/icons)
  ├── hooks/          # Custom hooks (colorScheme, clientOnlyValue)
  ├── libs/           # Libraries (storage abstraction)
  └── utils/          # Utility functions
```

### Path Aliases

Configured in [tsconfig.json](tsconfig.json) and [babel.config.js](babel.config.js):

- `@/*` - Project root
- `@features/*` - `src/features/*`
- `@settings/*` - `src/features/settings/*`
- `@shared/*` - `shared/*`

### State Management Pattern

State is managed using pure reducer functions (not Redux, not Zustand):

- State files export types and pure functions (see [ingredients.store.ts](src/features/ingredients/state/ingredients.store.ts))
- Functions take state and return new state: `(state, ...args) => newState`
- Examples: `addIngredient()`, `removeIngredient()`, `updateIngredient()`

### Storage Layer

The app uses an in-memory storage abstraction ([mmkv.ts](shared/libs/storage/mmkv.ts)) that provides a consistent API:

```typescript
type StorageNamespace = {
  getString: (key: string) => string | undefined;
  get<T>(key: string): T | undefined;
  set: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  clear: () => void;
};
```

Currently implemented as in-memory Map storage. Can be swapped with MMKV or AsyncStorage without changing consumer code.

### Ingredient System

- **Categories**: Pre-defined categories with Korean labels (채소, 과일, 고기류, etc.) in [ingredientCategories.ts](shared/constants/ingredientCategories.ts)
- **Types**: Core `Ingredient` type defined in [types.ts](src/features/ingredients/types.ts) with optional fields for category, expiration, memo, and image
- **Icons**: Ingredient icons are managed via constants in `shared/constants/`

### Multi-Screen Flows

Ingredient addition follows a multi-step flow:
1. Camera screen (`add/camera.tsx`) - Capture ingredient photo
2. Select screen (`add/select.tsx`) - Choose recognized ingredients
3. Form screen (`add/form.tsx`) - Enter/edit details (name, category, expiration, memo)

Draft state is maintained via [add.store.ts](src/features/add/state/add.store.ts) across navigation.

## Platform Configuration

- **React Native New Architecture**: Enabled (`newArchEnabled: true` in [app.json](app.json))
- **TypeScript**: Strict mode enabled
- **Expo SDK**: ~54.0
- **React**: 19.1.0
- **React Native**: 0.81.5
