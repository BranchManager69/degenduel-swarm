# DegenDuel Script Guide

## Understanding Your DegenDuel Scripts

### NPM vs NPX
- **npm (Node Package Manager)**: Installs and manages packages
  - Used for: `npm install`, `npm run script-name`
  - Runs scripts defined in your package.json
  
- **npx (Node Package eXecute)**: Runs packages without permanent installation
  - Used for: running commands directly (`npx next dev`)
  - Can access locally installed packages in node_modules
  - Always uses the latest version

### Port Configuration
- **Development Server**: Port 3009
- **Production Server**: Port 3010

### Your Script Ecosystem

#### Kill Scripts (Foundation)
```
"kill-dev": "fuser -k 3009/tcp || true"
"kill-prod": "fuser -k 3010/tcp || true"
"kill-all": "npm run kill-dev && npm run kill-prod"
```
- Finds and terminates processes using specific ports
- The `|| true` ensures script continues even if no processes found
- **Called by all server scripts** to ensure clean start

#### Clear Logs
```
"clear-logs-dev": "mkdir -p logs/dev && > logs/dev/$(date +%Y-%m-%d).log"
"clear-logs-prod": "mkdir -p logs/prod && > logs/prod/$(date +%Y-%m-%d).log"
```
- Creates log directories if they don't exist
- Empties the day's log file
- **Called by all background scripts** to start with fresh logs

#### Development Scripts

##### Foreground (Locks Terminal)
```
"dev": "npm run kill-dev && npm run clear-logs-dev && sleep 1 && npx next dev -p 3009"
```
1. Kill existing processes on port 3009
2. Clear development logs
3. Wait 1 second
4. Start development server on port 3009
5. Shows output in terminal (ctrl+c to stop)

##### Background (Keeps Terminal Free)
```
"dev-bg": "npm run kill-dev && npm run clear-logs-dev && sleep 1 && nohup npx next dev -p 3009 > logs/dev/$(date +%Y-%m-%d).log 2>&1 &"
```
1. Same first steps
2. Uses `nohup` to keep process running after terminal closes
3. Redirects all output (`2>&1`) to date-based log file
4. `&` runs in background

#### Production Scripts

##### Build (Create Optimized Version)
```
"build": "npx next build"
```
- Simply builds application for production
- Creates optimized assets in .next folder
- Doesn't start a server

##### Start (Run Production Version)
```
"start": "npm run kill-prod && npm run clear-logs-prod && sleep 1 && npx next start -p 3010"
"start-bg": "npm run kill-prod && npm run clear-logs-prod && sleep 1 && nohup npx next start -p 3010 > logs/prod/$(date +%Y-%m-%d).log 2>&1 &"
```
- Kills processes on port 3010, clears logs
- Starts the pre-built production application on port 3010
- Similar to dev but uses optimized code
- Background version keeps terminal free

##### Deploy (Combined Build+Start)
```
"deploy": "npm run kill-all && npm run clear-logs-prod && sleep 1 && npx next build && npx next start -p 3010"
"deploy-bg": "npm run kill-all && npm run clear-logs-prod && sleep 1 && nohup bash -c 'npx next build && npx next start -p 3010' > logs/prod/$(date +%Y-%m-%d).log 2>&1 &"
```
- Kills all processes, clears logs
- Builds the application
- Immediately starts it after building on port 3010
- All-in-one command for production

#### Running Both Servers Simultaneously

##### Combined Command (Recommended)
```
"serve": "npm run kill-all && npm run build && npm run dev-bg && npm run start-bg && echo '✅ Both servers started!' && npm run status && npm run logs-dev && npm run logs-prod"
```
- Kills any existing servers
- Builds the production version
- Starts development server in background (port 3009)
- Starts production server in background (port 3010)
- Shows status of both servers
- Displays recent logs

##### Manual Approach
```
npm run build           # First build production assets
npm run dev-bg          # Start development server in background
npm run start-bg        # Start production server in background
npm run status          # Check status of both servers
```

### Utility Commands

#### Log Management
```
"logs-dev": "tail -n 30 logs/dev/$(date +%Y-%m-%d).log"
"logs-prod": "tail -n 30 logs/prod/$(date +%Y-%m-%d).log"
"logs-dev-follow": "tail -f logs/dev/$(date +%Y-%m-%d).log"
"logs-prod-follow": "tail -f logs/prod/$(date +%Y-%m-%d).log"
"logs-all": "find logs -type f -name \"*.log\" | sort"
```
- View recent logs for dev or prod servers
- Follow logs in real-time
- List all available log files

#### Status Checking
```
"status": "echo '=== DEV LOG STATUS ===' && grep 'Ready' logs/dev/$(date +%Y-%m-%d).log && echo '=== PROD LOG STATUS ===' && grep 'Ready' logs/prod/$(date +%Y-%m-%d).log && echo '=== PORT STATUS ===' && npm run port-check"
"port-check": "echo '3009 (dev): ' && (fuser 3009/tcp && echo 'IN USE') || echo 'FREE' && echo '3010 (prod): ' && (fuser 3010/tcp && echo 'IN USE') || echo 'FREE'"
```
- Check if servers are running properly
- Check which ports are in use

### Which Commands To Use?

1. **For Development Only**: 
   ```
   npm run dev-bg
   ```
   - Runs in background on port 3009
   - Check logs with `npm run logs-dev`
   - Stop with `npm run kill-dev`

2. **For Production Only**: 
   ```
   npm run deploy-bg
   ```
   - Builds and runs optimized version
   - Runs in background on port 3010
   - Check logs with `npm run logs-prod`

3. **For Both Environments**:
   ```
   npm run serve
   ```
   - Runs both development (3009) and production (3010) servers
   - Shows status and logs automatically
   - Ideal for testing changes in both environments

Remember: Always use `npm run kill-all` between attempts to ensure clean slate.