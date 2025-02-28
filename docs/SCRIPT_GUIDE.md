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

### Your Script Ecosystem

#### Kill Script (Foundation)
```
"kill": "fuser -k 3009/tcp || true"
```
- Finds and terminates any process using port 3009
- The `|| true` ensures script continues even if no processes found
- **Called by all server scripts** to ensure clean start

#### Clear Logs
```
"clear-logs": "echo '' > degenduel.log"
```
- Empties the log file
- **Called by all background scripts** to start with fresh logs

#### Development Scripts

##### Foreground (Locks Terminal)
```
"dev": "npm run kill && npm run clear-logs && sleep 1 && npx next dev -p 3009"
```
1. Kill existing processes
2. Clear logs
3. Wait 1 second
4. Start development server on port 3009
5. Shows output in terminal (ctrl+c to stop)

##### Background (Keeps Terminal Free)
```
"dev-bg": "npm run kill && npm run clear-logs && sleep 1 && nohup npx next dev -p 3009 > degenduel.log 2>&1 &"
```
1. Same first steps
2. Uses `nohup` to keep process running after terminal closes
3. Redirects all output (`2>&1`) to degenduel.log
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
"start": "npm run kill && npm run clear-logs && sleep 1 && npx next start -p 3009"
```
- Kills processes, clears logs
- Starts the pre-built production application
- Similar to dev but uses optimized code

##### Deploy (Combined Build+Start)
```
"deploy": "npm run kill && npm run clear-logs && sleep 1 && npx next build && npx next start -p 3009"
```
- Kills processes, clears logs
- Builds the application
- Immediately starts it after building
- All-in-one command for production

### Which To Use?

1. **For Development (Recommended)**: 
   ```
   npm run dev-bg
   ```
   - Runs in background on port 3009
   - Check logs with `npm run logs`
   - Stop with `npm run kill`

2. **For Production**: 
   ```
   npm run deploy-bg
   ```
   - Builds and runs optimized version
   - Runs in background on port 3009
   - Check logs with `npm run logs`

Remember: Always use `npm run kill` between attempts to ensure clean slate.