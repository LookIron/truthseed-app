# TruthSeed PWA

A Progressive Web App (PWA) that displays random biblical truths about identity in Christ. Built with Next.js 15, TypeScript, Tailwind CSS, and the **AI Developer Workflow (ADW) System** for automated feature development.

## Features

- 📱 **Progressive Web App** - Installable on mobile devices (Android/iOS)
- 🔄 **Random Truth Display** - Shows biblical truths with smart selection to avoid repeats
- 📖 **Bible Verse Integration** - Fetches and caches Bible verses
- 🔊 **Text-to-Speech** - Listen to verses with adjustable playback speed
- 🌐 **Offline Support** - Works without internet after initial load
- ♿ **Accessible** - WCAG compliant, keyboard navigable
- 🎨 **Responsive Design** - Beautiful UI on all devices
- 🧪 **Fully Tested** - Unit and E2E tests with >80% coverage

## Tech Stack

### Core

- **Next.js 15** (App Router) - React framework
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Runtime validation

### PWA

- **next-pwa** - Service worker generation
- **IndexedDB** - Client-side caching

### Testing

- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **React Testing Library** - Component testing

### Tooling

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message validation

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- pnpm 10.0.0 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/truthseed-app.git
cd truthseed-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. (Optional) Configure Bible API:

Edit `.env` and add your Bible API credentials:

```env
BIBLE_API_BASE_URL=https://api.scripture.api.bible/v1
BIBLE_API_KEY=your_api_key_here
BIBLE_DEFAULT_TRANSLATION=RVR60
```

Get your API key from [scripture.api.bible](https://scripture.api.bible).

**Note:** The app works without a Bible API key by using mock data.

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm clean` - Clean build artifacts

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm validate:content` - Validate truths.json

### Testing

- `pnpm test` - Run all tests in watch mode
- `pnpm test:unit` - Run unit tests
- `pnpm test:unit:watch` - Run unit tests in watch mode
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:e2e:ui` - Run E2E tests in UI mode
- `pnpm test:coverage` - Generate coverage report

## Project Structure

```
truthseed-app/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── public/
│   ├── icons/              # PWA icons
│   ├── manifest.webmanifest # PWA manifest
│   └── icon.svg            # Source icon
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── TruthCard.tsx
│   │   └── ListenButton.tsx
│   ├── content/
│   │   └── truths.json     # Truth dataset
│   ├── domain/             # Domain layer
│   │   ├── models/         # Types and schemas
│   │   └── services/       # Service interfaces
│   ├── infrastructure/     # Infrastructure layer
│   │   ├── bible/          # Bible providers
│   │   ├── cache/          # Caching
│   │   └── audio/          # Text-to-speech
│   ├── lib/                # Utilities
│   └── hooks/              # React hooks
├── tests/
│   ├── unit/               # Unit tests
│   ├── e2e/                # E2E tests
│   └── setup.ts            # Test setup
└── scripts/                # Build scripts

```

## Architecture

The project follows Clean Architecture principles:

### Domain Layer

Core business logic, independent of frameworks:

- **Models**: TypeScript types with Zod schemas (`Truth`, `Reference`)
- **Services**: Interface definitions (`BibleProvider`)

### Application Layer

Use cases and business rules:

- **Random Selector**: Smart selection with repeat avoidance
- **Environment Config**: Type-safe env variable access

### Infrastructure Layer

External integrations:

- **Bible Providers**: API and mock implementations
- **Cache**: IndexedDB for verse caching
- **Audio**: Web Speech API wrapper

### Presentation Layer

UI components and pages:

- **Components**: React components with Tailwind CSS
- **Hooks**: Custom React hooks (`useSpeech`)
- **Pages**: Next.js App Router pages

## PWA Setup

### Generating Icons

The app requires PWA icons in multiple sizes. You have three options:

#### Option 1: ImageMagick (Local)

If you have ImageMagick installed:

```bash
./scripts/generate-icons.sh
```

Install ImageMagick:

```bash
brew install imagemagick  # macOS
apt-get install imagemagick  # Ubuntu/Debian
```

#### Option 2: Online Generators

Upload `public/icon.svg` to one of these services:

- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

#### Option 3: Manual Creation

Create PNG files in these sizes and place in `public/icons/`:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Also create `public/apple-touch-icon.png` (180x180).

### Installing the PWA

Once icons are generated and the app is deployed:

**Android (Chrome):**

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home screen"

**iOS (Safari):**

1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"

**Desktop (Chrome/Edge):**

1. Look for the install icon in the address bar
2. Click it and confirm installation

## Testing

### Unit Tests

Run with:

```bash
pnpm test:unit
```

Tests cover:

- Schema validation
- Random selector logic
- Web Speech Service
- Bible providers

Coverage thresholds: 80% (lines, functions, branches, statements)

### E2E Tests

Run with:

```bash
pnpm test:e2e
```

Tests verify:

- Truth loading and display
- "Another truth" functionality
- Verse fetching
- Audio controls
- Mobile responsiveness
- Accessibility

### Running Tests in CI

The GitHub Actions workflow automatically:

- Runs all unit tests
- Generates coverage reports
- Runs E2E tests (on Node 20.x)
- Validates commits

## Environment Variables

| Variable                    | Required | Default       | Description                  |
| --------------------------- | -------- | ------------- | ---------------------------- |
| `BIBLE_API_BASE_URL`        | No       | -             | Bible API base URL           |
| `BIBLE_API_KEY`             | No       | -             | Bible API key                |
| `BIBLE_DEFAULT_TRANSLATION` | No       | `RVR60`       | Default Bible translation    |
| `NEXT_PUBLIC_APP_NAME`      | No       | `TruthSeed`   | App name (visible to client) |
| `NODE_ENV`                  | No       | `development` | Node environment             |

**Note:** Bible API variables are optional. The app uses mock data if not configured.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Railway](https://railway.app/)
- [Fly.io](https://fly.io/)

Build command: `pnpm build`
Output directory: `.next`

## Adding New Truths

1. Edit `src/content/truths.json`
2. Follow the schema:

```json
{
  "id": "unique-id-with-hyphens",
  "title": "Category: Truth Statement",
  "renounceStatement": "Renunciation and affirmation",
  "category": "accepted|secure|significant|identity|freedom|loved",
  "references": [
    {
      "book": "Book Name",
      "chapter": 1,
      "verseStart": 1,
      "verseEnd": 2,
      "display": "Book 1:1-2",
      "translation": "RVR60"
    }
  ],
  "tags": ["tag1", "tag2"]
}
```

3. Validate:

```bash
pnpm validate:content
```

4. Update mock provider if needed:
   - Edit `src/infrastructure/bible/MockBibleProvider.ts`
   - Add verse text to `mockVerses` map

## Git Workflow

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

Husky hooks enforce this automatically.

### Pre-commit Checks

Automatic checks before each commit:

- ESLint
- Prettier
- Type checking

### Pull Requests

CI runs on all PRs:

- Linting
- Type checking
- Unit tests
- Build verification
- E2E tests (on main)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Troubleshooting

### App won't install as PWA

1. Verify icons exist in `public/icons/`
2. Check `public/manifest.webmanifest` is accessible
3. Ensure HTTPS in production
4. Check browser console for errors

### Audio not working

1. Check browser supports Web Speech API
2. Try different browser (Chrome recommended)
3. Check system audio/volume settings
4. Grant microphone permissions if prompted

### Tests failing

1. Clear caches: `pnpm clean`
2. Reinstall: `rm -rf node_modules && pnpm install`
3. Check Node version: `node --version` (need 18.18.0+)

### Build errors

1. Run type check: `pnpm typecheck`
2. Run lint: `pnpm lint`
3. Check for missing dependencies
4. Clear `.next`: `pnpm clean`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test:unit`
5. Commit: `git commit -m "feat: add amazing feature"`
6. Push: `git push origin feat/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Bible verses from [scripture.api.bible](https://scripture.api.bible)
- Built with [Next.js](https://nextjs.org/)
- Icons designed with [Figma](https://www.figma.com/)

## Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/yourusername/truthseed-app/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/truthseed-app/discussions)

## AI Developer Workflow (ADW) System

TruthSeed utiliza el **ADW System**, un sistema automatizado de desarrollo que permite:

- 🤖 **Desarrollo Aislado**: Cada feature en su propio worktree con puerto dedicado
- 🔄 **Workflows Automatizados**: Plan → Build → Test → Review → Document → Ship
- 🎯 **Zero Touch Execution**: PRs que se mergean automáticamente si pasan todos los checks
- 📊 **KPI Tracking**: Métricas de desarrollo y performance
- 🔧 **Claude Code Integration**: Comandos personalizados y hooks

### Quick Start con ADW

```bash
# Ver comandos disponibles
/tools

# Planificar una feature
/feature

# Implementar un plan
/implement

# Ejecutar SDLC completo
python3 adws/adw_sdlc_iso.py --issue-number 123 --model-set opus

# Ejecutar tests
/test

# Revisar trabajo
/review
```

### Estructura ADW

```
├── adws/                        # AI Developer Workflow System
│   ├── adw_modules/             # Módulos reutilizables
│   ├── adw_triggers/            # Triggers (webhook, cron)
│   ├── adw_*.py                 # Workflow scripts
│   └── README.md                # Documentación completa
├── .claude/                     # Claude Code configuration
│   ├── commands/                # ~30 comandos personalizados
│   ├── hooks/                   # Event hooks
│   └── settings.json            # Permisos
├── agents/                      # Output de workflows
├── trees/                       # Git worktrees aislados
└── specs/                       # Especificaciones de features
```

### Workflows Disponibles

| Workflow              | Descripción                    |
| --------------------- | ------------------------------ |
| `adw_plan_iso.py`     | Crear plan en worktree aislado |
| `adw_build_iso.py`    | Implementar feature            |
| `adw_test_iso.py`     | Ejecutar tests                 |
| `adw_review_iso.py`   | Revisar con screenshots        |
| `adw_sdlc_iso.py`     | SDLC completo                  |
| `adw_sdlc_zte_iso.py` | SDLC con auto-merge            |

### Documentación ADW

Para documentación completa del sistema ADW:

- **Guía Completa**: Ver [AGENTIC_CODING.md](./AGENTIC_CODING.md)
- **Sistema ADW**: Ver [adws/README.md](./adws/README.md)
- **KPIs**: Ver [app_docs/agentic_kpis.md](./app_docs/agentic_kpis.md)

---

Made with ❤️ for the body of Christ | Powered by Claude Code & ADW System
