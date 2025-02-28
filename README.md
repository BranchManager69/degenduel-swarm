# 🎲 DegenDuel: Strategic Crypto Portfolio Competition

## Overview

DegenDuel is a unique, strategy-based crypto competition platform that combines real-time Solana token performance tracking with strategic social gameplay inspired by reality shows like "Survivor." Players compete by building virtual portfolios and engaging in strategic alliances, betrayals, and eliminations.

## Key Features

- **Strategic Portfolio Competition**: Build and manage virtual Solana token portfolios in real-time
- **AI-Powered Gameplay**: Each player has an AI avatar representing them in strategic interactions
- **Social Strategy Elements**: Form alliances, make strategic moves, and vote to eliminate opponents
- **Game Master Oversight**: AI Game Master manages the competition and provides strategic commentary
- **Real Rewards**: Compete for SOL prize pools in high-stakes competitions

## Development Setup

```bash
# Install dependencies
npm install

# Run development server (port 3009)
npm run dev
# Or run in background
npm run dev-bg

# Build for production
npm run build

# Start production server (port 3010)
npm run start
# Or run in background (recommended)
npm run start-bg

# Deploy (build + start) in one command
npm run deploy-bg

# Run both environments simultaneously
npm run build           # First build production assets
npm run dev-bg          # Start development server in background
npm run start-bg        # Start production server in background
npm run status          # Check status of both servers

# Utility commands
npm run kill-dev        # Stop development server (port 3009)
npm run kill-prod       # Stop production server (port 3010)
npm run kill-all        # Stop all servers
npm run logs-dev        # View development server logs
npm run logs-prod       # View production server logs
npm run logs-all        # List all log files
npm run status          # Check server status
npm run port-check      # Check port availability
```

## Project Structure

- **Frontend**: Next.js app router with React components
- **Communication**: WebRTC with data channels for real-time messaging
- **Agent Configurations**: Located in `src/app/agentConfigs` directory
- **Voice Interactions**: OpenAI Realtime API for audio processing
- **Environment Management**:
  - Development server runs on port 3009
  - Production server runs on port 3010
- **Logging**:
  - Organized in `logs/` directory
  - Separate subdirectories for development and production
  - Date-based log files (YYYY-MM-DD.log)

## Documentation

For more detailed information, see these documentation files:

- `CLAUDE.md` - Core development guidelines and commands
- `docs/DEPLOYMENT.md` - Production deployment instructions
- `docs/NGINX_SETUP.md` - NGINX configuration for production
- `docs/ENVIRONMENT_SETUP.md` - Environment variable configuration
- `docs/LOGGING.md` - Logging system details
- `docs/WHAT_IS_DEGENDUEL.md` - Game concept overview
- `docs/DEGENDUEL_GAME_FLOW.md` - Detailed gameplay mechanics

## Game Flow

1. Players enter contests by paying entry fees in SOL
2. Each player selects a portfolio and AI avatar
3. Real-time token prices affect portfolio performance rankings
4. Players engage in strategic voting to eliminate competitors
5. Last player standing wins the prize pool

## License

[MIT License](LICENSE)

---

🚀 **Ready to Degen?** Make PvP Great Again on DegenDuel!