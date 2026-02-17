# CLAUDE.md

Este archivo provee guia a Claude Code (claude.ai/code) al trabajar con el codigo de este repositorio.

## Descripcion del proyecto

POC de micro-frontends en React Native usando **Rspack Module Federation** via **@callstack/repack**. Monorepo con pnpm. Tres modulos independientes comparten React y React Native como singletons:

- **AppA/** — App host/consumidora (puerto 8081). Importa modulos federados de shared_components. Theme azul/corporativo.
- **AppB/** — Segunda app host/consumidora (puerto 8081). Mismos modulos federados, theme verde/fintech. No ejecutar simultaneamente con AppA.
- **shared_components/** — Proveedor remoto (puerto 9000). Expone `./DesignSystem` y `./Login` via Module Federation.

## Comandos de build y desarrollo

### Monorepo (pnpm)

```bash
# Instalar dependencias (todas las apps)
pnpm install

# Comandos desde raiz
pnpm build:shared       # Compila shared_components para Android
pnpm serve:shared       # Sirve shared_components en :9000
pnpm start:appA         # Dev server AppA en :8081
pnpm start:appB         # Dev server AppB en :8081
pnpm lint:all           # Lint en todos los modulos
pnpm test:all           # Tests en todos los modulos
```

### Por modulo (npm/pnpm)

Ejecutar comandos desde `AppA/`, `AppB/` o `shared_components/`.

```bash
# Compilar bundle rspack (shared_components, Android)
npm run build:android:dev

# Iniciar dev server
npm start              # AppA y AppB en :8081 (Repack/Rspack), shared_components usa npm run serve en :9000

# Compilar + servir en un paso (shared_components)
npm run build:serve

# Ejecutar en emulador Android (AppA)
cd AppA/android && ./gradlew.bat app:installDebug
adb shell am start -n com.appa/.MainActivity

# Ejecutar en emulador Android (AppB)
cd AppB/android && ./gradlew.bat app:installDebug
adb shell am start -n com.appb/.MainActivity

# Lint
npm run lint

# Tests
npm test
```

**Flujo de desarrollo**: Iniciar shared_components primero (`npm run build:serve` en puerto 9000), luego iniciar dev server de AppA o AppB (`npm start` en puerto 8081, no simultaneamente). Configurar adb reverse (`adb reverse tcp:9000 tcp:9000`, `adb reverse tcp:8081 tcp:8081`). Ambas apps obtienen `mf-manifest.json` de `http://10.0.2.2:9000/` (alias de localhost del emulador Android).

## Arquitectura

### Module Federation

- **shared_components** expone:
  - `./DesignSystem` → `src/design-system/index.ts` (ThemeProvider, useTheme, Button, Card, Input, Text, theme)
  - `./Login` → `src/components/Login.tsx`
- **AppA** y **AppB** los consumen como `SharedComponents/DesignSystem` y `SharedComponents/Login`
- Los tipos de modulos federados se declaran en `AppA/src/@types/remote-modules.d.ts` y `AppB/src/@types/remote-modules.d.ts`
- React y React Native se comparten como singletons eager (host) / non-eager (remote), con `requiredVersion` fijado

### Theming con Context

- `ThemeProvider` y `useTheme()` en `shared_components/src/design-system/ThemeContext.tsx`
- **IMPORTANTE**: No importar modulos federados (`SharedComponents/*`) de forma sincrona en `App.tsx` (entry point). Module Federation requiere que el container remoto se cargue primero. Solo `import type` es seguro en el entry point.
- Cada screen (lazy-loaded) envuelve su contenido en `<ThemeProvider theme={appXTheme}>` con un patron de componente wrapper + content
- Los componentes DS (Button, Card, Input, Text) usan `useTheme()` internamente con fallback a prop `theme?` por retrocompatibilidad
- Login.tsx envuelve su contenido en `<ThemeProvider>` para propagar el theme a hijos sin prop-drilling
- WelcomeScreen y LoginScreen usan `useTheme()` hook en vez de importar theme directamente

### Comunicacion Inter-Modulo

- `NavigationActions` interface en `shared_components/src/types/navigation.ts` define contrato formal (`onLoginSuccess`, `onLoginError?`)
- `LoginProps extends NavigationActions` — los hosts implementan los callbacks

### Flujo de las apps

- `AppA/App.tsx` y `AppB/App.tsx` gestionan el estado de autenticacion, cargan lazy `LoginScreen` y `WelcomeScreen`
- `LoginScreen` envuelve el componente federado `Login` de shared_components
- Credenciales mock: `user@app.com` / `123456`
- AppA usa theme azul/corporativo (`src/theme/appATheme.ts`), AppB usa theme verde/fintech (`src/theme/appBTheme.ts`)

### Design System (shared_components)

Objeto theme centralizado en `src/design-system/theme.ts` con colores, espaciado, borderRadius y tipografia. ThemeProvider + useTheme en `ThemeContext.tsx`. Componentes: Button, Card, Input, Text. Todos usan `useTheme()` internamente y aceptan prop opcional `theme?` por retrocompatibilidad. Se exportan desde `src/design-system/index.ts`. AppA sobreescribe el theme via `src/theme/appATheme.ts`, AppB via `src/theme/appBTheme.ts`.

### Alias de rutas TypeScript

- **AppA**: `@screens/*` → `src/screens/`, `@theme/*` → `src/theme/`, `SharedComponents/*` → federado
- **AppB**: `@screens/*` → `src/screens/`, `@theme/*` → `src/theme/`, `SharedComponents/*` → federado
- **shared_components**: `@components/*` → `src/components/`, `@design-system/*` → `src/design-system/`

### Configuracion Rspack

Los tres modulos usan `rspack.config.mjs` (ES modules) con plugins de Repack:
- **Bundler**: Rspack 1.5+ via `@callstack/repack` 5.2.3
- **Loader**: `@callstack/repack/babel-swc-loader` (basado en SWC)
- **Assets**: `Repack.getAssetTransformRules()`
- **MF**: `@module-federation/enhanced` fijado en `0.13.1` (v2.x tiene breaking changes con RN)
- **Output de build**: `build/generated/android/`
- **shared_components** define `publicPath: 'http://10.0.2.2:9000/'` para generacion del manifest
- **shared_components** usa `entry: {}` (vacio — solo expone modulos via MF)
- **react-native.config.js** en los tres modulos apunta a `@callstack/repack/commands/rspack`
- Shared dependencies usan `requiredVersion` para react (`18.3.1`) y react-native (`0.76.5`)

### Monorepo

- **pnpm workspaces** con `pnpm-workspace.yaml` en raiz
- `.npmrc` con `shamefully-hoist=true` y `node-linker=hoisted` (requerido por React Native)
- `package.json` raiz con scripts centralizados y overrides de versiones

## Repositorio

- **Remote**: `git@github.com:alexis1986/super-app-poc.git`
- **Rama principal**: `main`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)

## Estilo de codigo

- Prettier: singleQuote, trailingComma=all, arrowParens=avoid, bracketSameLine=true, sin bracketSpacing
- ESLint: configuracion @react-native
- Texto mixto espanol/ingles en UI y comentarios
