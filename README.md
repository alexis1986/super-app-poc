# Super App POC

Prueba de concepto de micro-frontends en React Native usando **Module Federation** con **Rspack** via [@callstack/repack](https://github.com/callstack/repack).

Dos modulos independientes comparten componentes UI en tiempo de ejecucion sin necesidad de recompilar la app host.

## Arquitectura

```
super-app-poc/
├── AppA/                    # App host (puerto 8081)
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
└── shared_components/       # Proveedor remoto (puerto 9000)
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

**shared_components** expone dos modulos federados:

| Modulo | Ruta | Exporta |
|--------|------|---------|
| `./DesignSystem` | `src/design-system/index.ts` | Button, Card, Input, Text, theme |
| `./Login` | `src/components/Login.tsx` | Componente Login con auth simulado |

**AppA** los consume como `SharedComponents/DesignSystem` y `SharedComponents/Login` mediante carga lazy con `React.lazy()`.

React y React Native se comparten como singletons para evitar instancias duplicadas.

### Design System

Theme centralizado (`theme.ts`) con colores, espaciado, borderRadius y tipografia. Todos los componentes aceptan un prop opcional `theme` para personalizacion. AppA sobreescribe el theme por defecto con su propia paleta corporativa azul (`appATheme.ts`).

## Prerequisitos

- Node.js >= 18
- Android SDK con emulador configurado
- Java 17+ (para Gradle)

## Inicio rapido

### 1. Instalar dependencias

```bash
cd shared_components && npm install
cd ../AppA && npm install
```

### 2. Compilar y servir shared_components

```bash
cd shared_components
npm run build:serve
```

Esto compila el bundle con Rspack e inicia un servidor Express en el puerto 9000 sirviendo `mf-manifest.json` y todos los chunks federados.

### 3. Iniciar dev server de AppA

```bash
cd AppA
npm start
```

Inicia el dev server Repack/Rspack en el puerto 8081.

### 4. Ejecutar en emulador Android

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:9000 tcp:9000
cd AppA/android && ./gradlew.bat app:installDebug    # Windows
adb shell am start -n com.appa/.MainActivity
```

O usando React Native CLI:

```bash
cd AppA && npm run android
```

### Credenciales de prueba

- **Email:** `user@app.com`
- **Password:** `123456`

## Scripts

### AppA

| Script | Descripcion |
|--------|-------------|
| `npm start` | Inicia dev server Rspack en puerto 8081 |
| `npm run android` | Instala y lanza en emulador Android |
| `npm run bundle:android` | Bundle de produccion para Android |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Jest |

### shared_components

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
