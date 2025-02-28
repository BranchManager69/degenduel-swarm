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

# Alternative port (3019) if needed
npm run dev-alt
npm run dev-alt-bg

# Build for production
npm run build

# Start production server
npm run start
# Or deploy (build + start) in one command
npm run deploy-bg

# Utility commands
npm run kill       # Stop all servers
npm run logs       # View server logs
npm run status     # Check server status
npm run clear-logs # Clear log file
```

## Project Structure

- Next.js app router with React components
- WebRTC communication with data channels
- Agent configurations in `src/app/agentConfigs` directory
- OpenAI Realtime API for voice interactions

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