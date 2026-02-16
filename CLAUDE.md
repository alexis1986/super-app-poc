# CLAUDE.md

Este archivo provee guia a Claude Code (claude.ai/code) al trabajar con el codigo de este repositorio.

## Descripcion del proyecto

POC de micro-frontends en React Native usando **Rspack Module Federation** via **@callstack/repack**. Dos modulos independientes comparten React y React Native como singletons:

- **AppA/** — App host/consumidora (puerto 8081). Importa modulos federados de shared_components.
- **shared_components/** — Proveedor remoto (puerto 9000). Expone `./DesignSystem` y `./Login` via Module Federation.

## Comandos de build y desarrollo

Cada modulo es un proyecto npm independiente. Ejecutar comandos desde `AppA/` o `shared_components/`.

```bash
# Instalar dependencias (ejecutar en cada modulo por separado)
npm install

# Compilar bundle rspack (shared_components, Android)
npm run build:android:dev

# Iniciar dev server
npm start              # AppA en :8081 (Repack/Rspack), shared_components usa npm run serve en :9000

# Compilar + servir en un paso (shared_components)
npm run build:serve

# Ejecutar en emulador Android
cd AppA/android && ./gradlew.bat app:installDebug
adb shell am start -n com.appa/.MainActivity

# Lint
npm run lint

# Tests
npm test
```

**Flujo de desarrollo**: Iniciar shared_components primero (`npm run build:serve` en puerto 9000), luego iniciar dev server de AppA (`npm start` en puerto 8081). Configurar adb reverse para ambos puertos. AppA obtiene `mf-manifest.json` de `http://10.0.2.2:9000/` (alias de localhost del emulador Android).

## Arquitectura

### Module Federation

- **shared_components** expone:
  - `./DesignSystem` → `src/design-system/index.ts` (Button, Card, Input, Text, theme)
  - `./Login` → `src/components/Login.tsx`
- **AppA** los consume como `SharedComponents/DesignSystem` y `SharedComponents/Login`
- Los tipos de modulos federados se declaran en `AppA/src/@types/remote-modules.d.ts`
- React y React Native se comparten como singletons eager (host) / non-eager (remote)

### Flujo de la app

- `AppA/App.tsx` gestiona el estado de autenticacion, carga lazy `LoginScreen` y `WelcomeScreen`
- `LoginScreen` envuelve el componente federado `Login` de shared_components
- Credenciales mock: `user@app.com` / `123456`

### Design System (shared_components)

Objeto theme centralizado en `src/design-system/theme.ts` con colores, espaciado, borderRadius y tipografia. Componentes: Button, Card, Input, Text. Todos aceptan un prop opcional `theme` para personalizacion. Se exportan desde `src/design-system/index.ts`. AppA sobreescribe el theme via `src/theme/appATheme.ts`.

### Alias de rutas TypeScript

- **AppA**: `@screens/*` → `src/screens/`, `@theme/*` → `src/theme/`, `SharedComponents/*` → federado
- **shared_components**: `@components/*` → `src/components/`, `@design-system/*` → `src/design-system/`

### Configuracion Rspack

Ambos modulos usan `rspack.config.mjs` (ES modules) con plugins de Repack:
- **Bundler**: Rspack 1.5+ via `@callstack/repack` 5.2.3
- **Loader**: `@callstack/repack/babel-swc-loader` (basado en SWC)
- **Assets**: `Repack.getAssetTransformRules()`
- **MF**: `@module-federation/enhanced` fijado en `0.13.1` (v2.x tiene breaking changes con RN)
- **Output de build**: `build/generated/android/`
- **shared_components** define `publicPath: 'http://10.0.2.2:9000/'` para generacion del manifest
- **shared_components** usa `entry: {}` (vacio — solo expone modulos via MF)
- **react-native.config.js** en ambos modulos apunta a `@callstack/repack/commands/rspack`

## Repositorio

- **Remote**: `git@github.com:alexis1986/super-app-poc.git`
- **Rama principal**: `main`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)

## Estilo de codigo

- Prettier: singleQuote, trailingComma=all, arrowParens=avoid, bracketSameLine=true, sin bracketSpacing
- ESLint: configuracion @react-native
- Texto mixto español/ingles en UI y comentarios
