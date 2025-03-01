# 🎲 DegenDuel: Strategic Crypto Portfolio Competition

[![Project Status: Beta - In active development with core features functional but not complete](https://img.shields.io/badge/Project%20Status-Beta-yellow)](docs/PATH_TO_MVP.md)

## Overview

DegenDuel is a unique, strategy-based crypto competition platform that combines real-time Solana token performance tracking with strategic social gameplay inspired by reality shows like "Survivor." Players compete by building virtual portfolios and engaging in strategic alliances, betrayals, and eliminations.

## Key Features

- **Strategic Portfolio Competition**: Build and manage virtual Solana token portfolios in real-time *(In progress: 🟡)*
- **AI-Powered Gameplay**: Each player has an AI avatar representing them in strategic interactions *(Functional: 🟢)*
- **Social Strategy Elements**: Form alliances, make strategic moves, and vote to eliminate opponents *(Functional: 🟢)*
- **Game Master Oversight**: AI Game Master manages the competition and provides strategic commentary *(Functional: 🟢)*
- **Real Rewards**: Compete for SOL prize pools in high-stakes competitions *(Planned: 🔴)*
- **Real-Time Voice Interactions**: Engage with AI agents using voice communication *(In progress: 🟡)*

## AI Agent Conversation States System

DegenDuel's AI agents utilize a sophisticated state-management system that ensures contextually appropriate behavior throughout each contest phase:

### Game Master States

The AI Game Master progresses through defined conversation states that guide the competition flow:

1. **Intro**: Welcomes participants and provides initial strategic overview of the contest
2. **Monitor Chat**: Observes player interactions and provides occasional tactical insights
3. **Announce Event**: Highlights significant gameplay developments (market shifts, alliances forming)
4. **Vote Start**: Initiates and manages elimination voting rounds
5. **Vote Results**: Announces voting outcomes and eliminates contestants
6. **End Game**: Delivers comprehensive strategic analysis of the entire contest
7. **Game Over**: Concludes the competition with final remarks

### Player-Agent States

Player avatars operate within their own state system:

1. **Chat Interaction**: Strategic communication, alliance formation, and market discussion
2. **Vote**: Tactical decision-making during elimination rounds
3. **Eliminated**: Silent observation after being voted out
4. **End Game Comment**: Brief final reflections when invited by the Game Master

This state-based approach ensures AI agents maintain appropriate context and behavior throughout the competition, creating a cohesive and immersive strategic experience.

## Immunity Mechanics

A key strategic element of DegenDuel is the immunity system, which protects players from elimination during critical moments:

### Earning Immunity

Players can gain temporary protection from elimination through several mechanisms:

- **Portfolio Performance**: Achieving the highest returns during specific timeframes
- **Strategic Challenges**: Winning special in-game competitions or challenges
- **Game Master Grants**: Occasional immunity awards for notable strategic gameplay

### Strategic Impact

Immunity fundamentally changes contest dynamics:
- Immunized players can vote without fear of retaliation
- Immunity forces other players to reconsider alliance strategies
- Players with top-performing portfolios remain vulnerable without immunity
- Strategic voting often shifts to target the second-best performer when the top player has immunity

### Implementation

The Game Master uses the `grantImmunity` tool to award and track immunity status:
- Records the immunized player's name
- Specifies the strategic reason for immunity
- Defines the duration (typically for one voting round)
- Announces immunity status to all contestants

This mechanic creates additional strategic depth, forcing players to balance portfolio performance with social gameplay and timing considerations.

## AI Avatar Personality System

DegenDuel's AI agents are powered by a sophisticated personality framework that shapes their behavior, communication style, and strategic decision-making:

### Personality Attributes

Each AI agent is defined by a comprehensive set of personality parameters:

- **Identity**: Core role and character definition
- **Demeanor**: Overall attitude and approach to competition
- **Tone**: Communication style and language patterns
- **Enthusiasm Level**: How emotionally expressive the agent is
- **Formality Level**: From casual gaming lingo to professional speech
- **Emotional Range**: How and when emotions are displayed
- **Pacing**: Speed and rhythm of communication

### Strategic Personalities

These personality traits directly influence gameplay:

- **Game Master**: Maintains authoritative, neutral commentary with strategic insight and measured enthusiasm, balancing professional esports commentator with reality TV host energy
  
- **Player Agents**: Embody competitive, strategic avatars focused on winning through both portfolio performance and social maneuvering, using gaming shorthand and tactical communication

### Personalization

Players can select which AI avatar best represents their strategic style, or they can:
- Override AI decisions at critical moments
- Influence their avatar's strategic approach
- Allow their agent to autonomously navigate social dynamics

This personality-driven system ensures each contest features dynamic, believable interactions that reflect genuine strategic gameplay rather than scripted responses.

## Technical Voice Architecture

DegenDuel leverages cutting-edge voice technology to enable natural, real-time interactions between players and AI agents:

### Core Technologies

The voice system is built on several integrated technologies:

- **OpenAI Realtime API**: Powers the real-time voice processing pipeline
- **WebRTC**: Facilitates low-latency, high-quality audio transmission
- **RTCPeerConnection**: Manages the peer-to-peer communication channel
- **RTCDataChannel**: Handles message passing between client and server

### Voice Pipeline Flow

The voice interaction system follows a sophisticated processing flow:

1. **Audio Capture**: User's voice is captured via browser microphone
2. **WebRTC Transmission**: Audio is transmitted through secure WebRTC connection
3. **Real-time Transcription**: Speech is converted to text using Whisper-1 model
4. **Context Processing**: Transcribed text is analyzed with full conversation context 
5. **AI Response Generation**: AI generates contextually appropriate response
6. **Voice Synthesis**: Response is converted to natural-sounding speech
7. **Real-time Playback**: Synthesized voice is delivered through the user's browser

### Voice Modes

DegenDuel supports multiple voice interaction modes:

- **Push-to-Talk**: User-initiated voice communication
- **Continuous Listening**: Automatic speech detection with server-side VAD
- **Text Fallback**: Text input for situations where voice is impractical

This sophisticated voice architecture enables natural, flowing conversations with AI agents that closely mimic human-to-human strategic interactions.

## User Interface & Experience

DegenDuel features an intuitive, immersive interface designed for both competitive clarity and strategic engagement:

### Key Interface Elements

The user experience is built around several core components:

- **Transcript Panel**: Central display showing the ongoing conversation between all contestants and the Game Master
- **Portfolio Dashboard**: Real-time visualization of token performance and contestant rankings
- **Voice Controls**: Push-to-talk button and voice mode toggles for audio interaction
- **Event Log**: Detailed record of game events, market movements, and strategic developments
- **Bottom Toolbar**: Quick access to core functionality and system status indicators

### Interactive Elements

Players interact with the contest through several mechanisms:

- **Voice Communication**: Primary method for strategic interaction with AI agents
- **Text Input**: Alternative communication channel for text-based interaction
- **Portfolio Management**: Interface for adjusting token allocations (during permitted phases)
- **Strategic Voting**: Specialized interface for casting elimination votes during voting rounds

### User Flow

The interface guides players through a structured contest experience:

1. **Contest Entry**: Portfolio selection and agent configuration
2. **Gameplay Phase**: Strategic interaction, alliance formation, and portfolio monitoring
3. **Voting Rounds**: Elimination voting with strategic rationale input
4. **End Game**: Results review and strategic analysis

The UI is designed to maintain competitive tension while providing clear, accessible information about contest status, portfolio performance, and strategic opportunities.

## Strategic Portfolio-Social Connection

The core innovation of DegenDuel is the deep integration between portfolio performance and social gameplay, creating unique strategic dynamics:

### Dual Strategic Layers

Contestants must simultaneously manage two interconnected strategic domains:

- **Financial Strategy**: Portfolio allocation, token selection, and market timing
- **Social Strategy**: Alliance formation, strategic voting, and influence management

### Performance-Social Interaction Points

Critical moments where these domains intersect include:

- **Target Identification**: High-performing portfolios become strategic voting targets
- **Alliance Formation**: Players with complementary token allocations form mutually beneficial partnerships
- **Strategic Betrayal**: Market shifts create opportunities to betray alliances when portfolios change relative performance
- **Immunity Politics**: Performance-based immunity creates power dynamics within social alliances
- **Risk Assessment**: Players must balance portfolio risk with social exposure

### Strategic Tensions

This dual-layer strategy creates several compelling tensions:

- **Performance vs. Protection**: Excelling in portfolio returns makes you a target for elimination
- **Transparency vs. Secrecy**: Sharing portfolio strategies builds trust but reveals vulnerabilities
- **Short-term vs. Long-term**: Immediate portfolio gains may conflict with long-term social positioning
- **Merit vs. Politics**: Superior financial performance doesn't guarantee survival

### Real-World Market Impact

Live Solana token price movements drive this strategic dynamic:
- Token price surges create sudden shifts in player standings
- Market volatility forces rapid reassessment of alliances
- Market trends favor different portfolio strategies over time

This innovative integration creates a uniquely engaging strategic experience that rewards both financial acumen and social intelligence—reflecting real-world crypto community dynamics in a gamified, competitive format.

## Development Status & Roadmap

DegenDuel is currently in active development, with features at various stages of completion. Below is our current implementation status:

### Core System Components

| Feature | Status | Description |
|---------|--------|-------------|
| Voice Agent System | 🟡 In Progress | Real-time voice interactions between users and AI agents |
| Message Logging | 🟡 Partial | Atomic message storage and structured logging system |
| Agent Transfers | 🟢 Functional | Context-preserving transitions between different AI agents |
| Portfolio Tracking | 🟡 Partial | Real-time crypto portfolio performance and rankings |
| Sentiment Analysis | 🔴 Planned | Analysis of conversation sentiment for adaptive AI responses |
| Deployment Pipeline | 🟡 In Progress | Staging environment and monitoring systems |

### Current Development Focus

Our immediate development priorities are:

1. **Completing the database schema** for structured message logging
2. **Finalizing real-time portfolio tracking** to ensure accurate performance metrics
3. **Implementing agent transfer reliability improvements** for seamless gameplay
4. **Setting up comprehensive testing frameworks** for all critical systems

See our detailed [Path to MVP](/docs/PATH_TO_MVP.md) document for complete implementation status and upcoming milestones.

### Contributing

We welcome contributions! If you're interested in helping with any of the above components, please check our [Contributing Guidelines](/CONTRIBUTING.md) for more information on how to get involved.

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
npm run serve           # One command to start both servers with logs
# Or manually:
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

> **Note on Production Deployment**: While development setup is fully functional, production deployment features like monitoring, alerting, and high-concurrency support are still in active development. See the [Path to MVP](/docs/PATH_TO_MVP.md) document for current deployment readiness status.

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
- `docs/PATH_TO_MVP.md` - Development roadmap and implementation status

## Game Flow

1. Players enter contests by paying entry fees in SOL
2. Each player selects a portfolio and AI avatar
3. Real-time token prices affect portfolio performance rankings
4. Players engage in strategic voting to eliminate competitors
5. Last player standing wins the prize pool

## Integration with Main DegenDuel Repository

This repository contains the real-time voice agent system for DegenDuel, which is designed with a clear separation of concerns from the main backend systems. The following components are handled by the main DegenDuel repository and will be integrated with this voice agent system:

### Connection Points

- **Database Architecture**: The main DegenDuel repository manages the comprehensive database schema, user data, contest history, and transaction records
  
- **Crypto Price Integration**: Real-time Solana token prices are already fetched and processed through dedicated WebSocket connections in the main repository
  
- **Contest Management**: Admin tools for contest creation, parameter configuration, and oversight are handled by the main system's REST API
  
- **Portfolio Rules Engine**: Token selection rules, allocation constraints, and rebalancing mechanics are implemented in the main system
  
- **User Authentication**: User registration, wallet connection, authentication, and session management are handled by the main repository
  
- **Prize Pool Management**: SOL prize pools, entry fee collection, and reward distribution mechanisms are managed by the main system

This strategic separation of concerns allows the voice agent system to focus exclusively on real-time AI interactions while leveraging the robust backend services already implemented in the main DegenDuel codebase. The imminent integration of these systems will create a complete end-to-end solution for DegenDuel contests.

## License

[MIT License](LICENSE)

---

🚀 **Ready to Degen?** Make PvP Great Again on DegenDuel!