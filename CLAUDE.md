# DegenDuel Swarm Development Guidelines

## Commands

### Development (for making changes)
- `npm run dev` - Start development server on port 3009 (foreground, locks terminal) 
- `npm run dev-bg` - Start development server in background (keeps terminal free)

### Production (after code is ready)
- `npm run deploy` - Build and start production server on port 3010 (foreground, locks terminal)
- `npm run deploy-bg` - Build and start production server on port 3010 in background (keeps terminal free)

### Individual Build & Start Commands
- `npm run build` - Build for production only
- `npm run start` - Start production server on port 3010 only (foreground)
- `npm run start-bg` - Start production server on port 3010 in background

### Running Both Servers Simultaneously
- First build the production version: `npm run build`
- Then start development server: `npm run dev-bg`
- Then start production server: `npm run start-bg`
- Check both servers: `npm run status`

### Utilities
- `npm run kill-dev` - Stop processes on development port (3009)
- `npm run kill-prod` - Stop processes on production port (3010)
- `npm run kill-all` - Stop processes on both ports
- `npm run logs-dev` - View development server logs for today
- `npm run logs-prod` - View production server logs for today
- `npm run logs-dev-follow` - Watch development logs in real-time
- `npm run logs-prod-follow` - Watch production logs in real-time
- `npm run logs-all` - List all log files
- `npm run port-check` - Check if ports 3009 and 3010 are in use
- `npm run clear-logs-dev` - Empty development log file for today
- `npm run clear-logs-prod` - Empty production log file for today
- `npm run lint` - Run ESLint for code checking

### Process Management
- To check server status: `npm run status` (checks logs and ports 3009/3010)
- To check running servers: `ps aux | grep "next"`
- All commands that could lock your terminal have "-bg" alternatives

## Code Style
- **TypeScript**: Strict typing with interfaces for props and state
- **Components**: React functional components with hooks
- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **Imports**: React first, then third-party, then local components
- **Styling**: Tailwind CSS with className strings
- **State**: Context API for global state, useState for component state
- **Error Handling**: try/catch blocks, console.error logging
- **Async**: Use async/await pattern with proper error handling
- **Event Handlers**: Prefix with "handle" (handleClick, handleSubmit)
- **Boolean Variables**: Prefix with "is" or "has" (isLoading, hasError)

## Project Structure
- Next.js app router with React components
- WebRTC communication with data channels
- Agent configurations in `src/app/agentConfigs` directory
- OpenAI Realtime API for voice interactions

## Deployment Information
- **Development Server**: Port 3009
- **Production Server**: Port 3010
- **NGINX Configuration**: Located in `nginx/game.degenduel.me`
- **Domain**: game.degenduel.me
- **Deployment Guide**: See `docs/DEPLOYMENT.md`
- **NGINX Setup**: See `docs/NGINX_SETUP.md`