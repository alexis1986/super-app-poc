# Super App POC

Prueba de concepto de micro-frontends en React Native usando **Module Federation** con **Rspack** via [@callstack/repack](https://github.com/callstack/repack).

Multiples apps host independientes comparten componentes UI en tiempo de ejecucion sin necesidad de recompilar. Demuestra que distintas apps pueden consumir los mismos modulos federados con branding propio.

## Arquitectura

```
super-app-poc/
├── package.json             # Scripts centralizados, devDependencies compartidas, overrides
├── pnpm-workspace.yaml      # Workspaces + catalog: (versiones centralizadas)
├── pnpm-lock.yaml           # Lock file unico del monorepo
├── .npmrc                   # shamefully-hoist=true, node-linker=hoisted
├── .gitignore               # Gitignore consolidado (raiz unica)
│
├── AppA/                    # App host - Corporativa (puerto 8081, theme azul)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── theme/
│   │   │   └── appATheme.ts
│   │   └── @types/
│   │       └── remote-modules.d.ts
│   ├── App.tsx
│   ├── index.js
│   └── rspack.config.mjs
│
├── AppB/                    # App host - Fintech (puerto 8081, theme verde)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── theme/
│   │   │   └── appBTheme.ts
│   │   └── @types/
│   │       └── remote-modules.d.ts
│   ├── App.tsx
│   ├── index.js
│   └── rspack.config.mjs
│
└── shared_module/           # Proveedor remoto (puerto 9000)
    ├── src/
    │   ├── design-system/
    │   │   ├── components/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Input.tsx
    │   │   │   └── Text.tsx
    │   │   ├── theme.ts
    │   │   └── index.ts
    │   ├── components/
    │   │   └── Login.tsx
    │   └── types/
    │       └── auth.ts
    ├── server.js
    └── rspack.config.mjs
```

### Module Federation

**shared_module** expone dos modulos federados:

| Modulo | Ruta | Exporta |
|--------|------|---------|
| `./DesignSystem` | `src/design-system/index.ts` | Button, Card, Input, Text, theme |
| `./Login` | `src/components/Login.tsx` | Componente Login con auth simulado |

**AppA** y **AppB** los consumen como `SharedModule/DesignSystem` y `SharedModule/Login` mediante carga lazy con `React.lazy()`.

React y React Native se comparten como singletons para evitar instancias duplicadas.

### Design System

Theme centralizado (`theme.ts`) con colores, espaciado, borderRadius y tipografia. Todos los componentes aceptan un prop opcional `theme` para personalizacion. Cada app sobreescribe el theme por defecto con su propia paleta: AppA usa azul corporativo (`appATheme.ts`), AppB usa verde fintech (`appBTheme.ts`).

### Gestion de dependencias

Monorepo con **pnpm workspaces**. Las versiones de `react`, `react-native` y `@callstack/repack` se definen una sola vez en `pnpm-workspace.yaml` mediante **pnpm catalog:**. Cada `package.json` local referencia `"catalog:"` en vez de la version.

Las devDependencies compartidas (babel, eslint, rspack, typescript, jest, prettier, etc.) viven unicamente en el `package.json` raiz y se resuelven via hoisting (`node-linker=hoisted`).

## Prerequisitos

- Node.js >= 18
- pnpm >= 9.5 (soporte para `catalog:`)
- Android SDK con emulador configurado
- Java 17+ (para Gradle)

## Inicio rapido

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Compilar y servir shared_module

```bash
cd shared_module
npm run build:serve
```

Esto compila el bundle con Rspack e inicia un servidor Express en el puerto 9000 sirviendo `mf-manifest.json` y todos los chunks federados.

### 3. Iniciar el emulador Android

Listar AVDs disponibles:

```bash
emulator -list-avds
```

Iniciar el emulador (elegir uno):

```bash
emulator -avd Medium_Phone_API_36.1
# o
emulator -avd Pixel_9
```

> **Windows**: si `emulator` no esta en el PATH, usar la ruta completa:
> ```bash
> "$LOCALAPPDATA/Android/Sdk/emulator/emulator" -avd Medium_Phone_API_36.1
> ```

Esperar a que el emulador arranque completamente antes de continuar.

### 4. Iniciar dev server de AppA o AppB

Ambas apps usan el puerto 8081. No ejecutar simultáneamente.

```bash
cd AppA && npm start    # o
cd AppB && npm start
```

### 5. Ejecutar en emulador Android

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:9000 tcp:9000

# AppA (theme azul)
cd AppA/android && ./gradlew.bat app:installDebug
adb shell am start -n com.appa/.MainActivity

# AppB (theme verde)
cd AppB/android && ./gradlew.bat app:installDebug
adb shell am start -n com.appb/.MainActivity
```

O usando React Native CLI:

```bash
cd AppA && npm run android
# o
cd AppB && npm run android
```

### Credenciales de prueba

- **Email:** `user@app.com`
- **Password:** `123456`

## Scripts

### Monorepo (desde raiz)

| Script | Descripcion |
|--------|-------------|
| `pnpm install` | Instala dependencias de todos los workspaces |
| `pnpm build:shared` | Compila shared_module para Android |
| `pnpm serve:shared` | Sirve shared_module en puerto 9000 |
| `pnpm start:appA` | Dev server AppA en puerto 8081 |
| `pnpm start:appB` | Dev server AppB en puerto 8081 |
| `pnpm lint:all` | Lint en todos los modulos |
| `pnpm test:all` | Tests en todos los modulos |

### AppA

| Script | Descripcion |
|--------|-------------|
| `npm start` | Inicia dev server Rspack en puerto 8081 |
| `npm run android` | Instala y lanza en emulador Android |
| `npm run bundle:android` | Bundle de produccion para Android |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Jest |

### AppB

| Script | Descripcion |
|--------|-------------|
| `npm start` | Inicia dev server Rspack en puerto 8081 |
| `npm run android` | Instala y lanza en emulador Android |
| `npm run bundle:android` | Bundle de produccion para Android |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Jest |

### shared_module

| Script | Descripcion |
|--------|-------------|
| `npm run build:android:dev` | Compila bundle Rspack para Android |
| `npm run serve` | Inicia servidor Express en puerto 9000 |
| `npm run build:serve` | Compila + sirve en un solo paso |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Jest |

## Stack tecnologico

- **React Native** 0.76.5
- **Rspack** 1.5+ via **@callstack/repack** 5.2.3
- **Module Federation** via `@module-federation/enhanced` 0.13.1
- **TypeScript** 5.x
- **SWC** (via `@callstack/repack/babel-swc-loader`)
- **pnpm** workspaces con `catalog:` para gestion centralizada de versiones
