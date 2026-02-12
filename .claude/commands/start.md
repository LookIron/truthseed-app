# Start TruthSeed PWA

Start the TruthSeed Progressive Web App (Next.js development server).

## Instructions

1. Check if `.ports.env` exists to determine the port
2. If `.ports.env` exists, use `FRONTEND_PORT` from it
3. Otherwise, use default port 3000
4. Kill any existing process on that port
5. Start Next.js dev server on the determined port

## Implementation

```bash
# Execute the start script
./scripts/start.sh
```

## Expected Output

```
Starting TruthSeed PWA on port 3000...
Starting Next.js development server...
   ▲ Next.js 15.5.12
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 4.7s
```

## Ports

- **Default**: 3000
- **Worktree**: Read from `.ports.env` (FRONTEND_PORT)
- **Range**: 9000-9014 for isolated worktrees

## Notes

- This command works in both main repo and worktrees
- Worktrees get dedicated ports (9000-9014)
- Port conflicts are handled automatically
- PWA features are disabled in development mode
