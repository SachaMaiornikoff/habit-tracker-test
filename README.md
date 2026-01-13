# Habit Tracker

A modern habit tracking web application built with Vue 3 and TypeScript. Track your daily habits, build streaks, and stay accountable to your goals.

## Features

- **Habit Management** - Create, edit, and delete habits with custom colors
- **Weekly Calendar View** - Track habit completion day by day
- **Streak Tracking** - View your consecutive weeks of habit completion
- **User Authentication** - Secure registration and login system
- **Account Management** - Update profile information and settings
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client for API requests

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- Backend API running on `http://localhost:3000`

## Installation

```sh
npm install
```

## Development

Start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

Or use the quick start script:

```sh
./start.sh
```

## Production Build

Compile and minify for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page components
├── stores/         # Pinia state stores
├── services/       # API communication layer
├── types/          # TypeScript interfaces
├── utils/          # Utility functions
├── router/         # Vue Router configuration
└── assets/         # Static assets and styles
```

## IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur if installed).

## Browser DevTools

- **Chrome/Chromium**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## License

See [LICENSE](./LICENSE) file for details.
