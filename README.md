# Canastra Score Tracker

A Progressive Web App (PWA) for tracking scores in Canastra card games. Built with Vue 3, TypeScript, and Tailwind CSS, this app helps players keep track of points across multiple rounds with an intuitive, mobile-friendly interface.

## 🎯 Features

- **Multi-team support**: Track scores for 2 or 3 teams
- **Persistent storage**: Game state is automatically saved locally
- **Score tracking**: Add, view, and remove scores for each round
- **Win conditions**: Automatic detection when a team reaches the winning points (default: 3000)
- **Obrigação tracking**: Visual indicators when teams reach the obrigação threshold (default: 1500)
- **Game management**: Start new games or play a rematch
- **Progressive Web App**: Install on your device and use offline
- **Responsive design**: Optimized for mobile and tablet devices

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API and `<script setup>`
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia with persistence plugin
- **Build Tool**: Vite
- **PWA Support**: vite-plugin-pwa
- **Testing**: Vitest (unit) and Playwright (e2e)
- **Utilities**: VueUse

## 📋 Requirements

- Node.js v20.19.0 or v22.12.0+
- pnpm (recommended package manager)

## 🚀 Getting Started

### Installation

```sh
pnpm install
```

### Development

Run the development server with hot-reload:

```sh
pnpm dev
```

### Production Build

Type-check, compile and minify for production:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

## 🧪 Testing

### Unit Tests

Run unit tests with [Vitest](https://vitest.dev/):

```sh
pnpm test:unit
```

### End-to-End Tests

Run E2E tests with [Playwright](https://playwright.dev):

```sh
# Install browsers for the first run
npx playwright install

# Build the project first (required for CI)
pnpm build

# Run all E2E tests
pnpm test:e2e

# Run tests only on Chromium
pnpm test:e2e --project=chromium

# Run tests for a specific file
pnpm test:e2e tests/example.spec.ts

# Run tests in debug mode
pnpm test:e2e --debug
```

## 🔧 Development Tools

### Linting

Lint and fix code with [ESLint](https://eslint.org/):

```sh
pnpm lint
```

### Code Formatting

Format code with Prettier:

```sh
pnpm format
```

### Type Checking

Run TypeScript type checking:

```sh
pnpm type-check
```

## 💻 Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension
- Disable Vetur if you have it installed (conflicts with Vue Official)

## 🌐 Browser Extensions (Recommended)

### Chromium-based browsers (Chrome, Edge, Brave, etc.)
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Enable Custom Object Formatters](http://bit.ly/object-formatters) in DevTools

### Firefox
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Enable Custom Object Formatters](https://fxdx.dev/firefox-devtools-custom-object-formatters/) in DevTools

## 📱 PWA Installation

Once deployed, users can install the app on their devices:
- **Mobile**: Tap the "Add to Home Screen" option in your browser
- **Desktop**: Look for the install icon in the address bar

## 📄 License

See [LICENSE](LICENSE) file for details.
