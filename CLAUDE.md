# DegenDuel Swarm Development Guidelines

## Commands

### Development (for making changes)
- `npm run dev` - Start development server on port 3009 (foreground, locks terminal) 
- `npm run dev-bg` - Start development server in background (keeps terminal free)
- `npm run dev-alt` - Start development server on alternative port 3019 (foreground)
- `npm run dev-alt-bg` - Start development server on alternative port 3019 (background)

### Production (after code is ready)
- `npm run deploy` - Build and start production server (foreground, locks terminal)
- `npm run deploy-bg` - Build and start production server in background (keeps terminal free)

### Individual Build & Start Commands
- `npm run build` - Build for production only
- `npm run start` - Start production server only (foreground)
- `npm run start-bg` - Start production server in background

### Utilities
- `npm run kill` - Stop any processes using ports 3009 or 3019 (automatically run before starting servers)
- `npm run logs` - View the last 30 lines of server output (doesn't lock terminal)
- `npm run logs-follow` - Watch server output in real-time (locks terminal until Ctrl+C)
- `npm run clear-logs` - Empty the log file (automatically run before all background commands)
- `npm run lint` - Run ESLint for code checking

### Process Management
- To check server status: `npm run status` (checks logs and both ports 3009 and 3019)
- To check if primary port is in use: `npm run port-check`
- To check running servers: `ps aux | grep "next"`
- All commands that could lock your terminal now have "-bg" alternatives
- All start commands automatically kill previous instances first

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