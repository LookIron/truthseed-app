# Install TruthSeed PWA

Install all dependencies and set up the development environment for TruthSeed.

## Instructions

Execute the following steps in order:

### 1. Initialize Git (if not already initialized)

```bash
git init
```

### 2. Copy environment file

```bash
./scripts/copy_dot_env.sh
```

This creates `.env` from `.env.sample` if it doesn't exist.

### 3. Install pnpm dependencies

```bash
pnpm install
```

### 4. Verify installation

```bash
# Check that Next.js is installed
pnpm next --version

# Check that all scripts are executable
ls -la scripts/
```

## Environment Variables

After installation, update `.env` with your API keys:

```bash
# Required for Bible API (optional - app works with mock provider)
BIBLE_API_BASE_URL=https://api.scripture.api.bible/v1
BIBLE_API_KEY=your_api_key_here
BIBLE_DEFAULT_TRANSLATION=RVR60

# Required for ADW system
ANTHROPIC_API_KEY=sk-ant-...

# Optional for GitHub integration
GITHUB_PAT=ghp_...

# Optional for Claude Code
CLAUDE_CODE_PATH=claude
```

## Post-Installation

After installation, you can:

1. **Start the app**: `/start`
2. **Run tests**: `/test`
3. **Build for production**: `pnpm build`
4. **Generate PWA icons**: `./scripts/generate-icons.sh` (requires ImageMagick)

## Worktree Installation

When installing in a worktree, the ADW system handles:

- Port allocation (9000-9014)
- Creating `.ports.env`
- Installing dependencies
- Environment setup

## Troubleshooting

If installation fails:

```bash
# Clean and reinstall
rm -rf node_modules .next
pnpm install

# Verify pnpm version
pnpm --version  # Should be 10.x

# Check for errors in logs
ls -la logs/
```

## Notes

- Uses `pnpm` as package manager (v10.x)
- Node.js 18.18.0+ required
- Scripts are automatically made executable
- `.env` file is git-ignored for security
