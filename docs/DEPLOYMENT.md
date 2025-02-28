# DegenDuel Deployment Guide

This document outlines the steps to deploy the DegenDuel application to a production environment.

## Prerequisites

1. Node.js 18+ and npm installed on the server
2. NGINX installed for reverse proxy
3. A domain name pointed to your server
4. Basic knowledge of Linux server administration

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/degenduel-swarm.git
cd degenduel-swarm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application for Production

```bash
npm run build
```

### 4. Start the Production Server

For foreground operation (locks terminal):
```bash
npm run start
```

For background operation (recommended for production):
```bash
npm run start-bg
```

The production server will run on port 3010.

### 5. Configure NGINX as a Reverse Proxy

See the `docs/NGINX_SETUP.md` file for detailed instructions on setting up NGINX.

## Deployment Scripts

The following scripts are available for deployment management:

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server on port 3010 (foreground) |
| `npm run start-bg` | Start the production server on port 3010 (background) |
| `npm run deploy` | Build and start the production server (foreground) |
| `npm run deploy-bg` | Build and start the production server (background) |
| `npm run kill-dev` | Stop processes on development port (3009) |
| `npm run kill-prod` | Stop processes on production port (3010) |
| `npm run kill-all` | Stop processes on both ports |
| `npm run logs-dev` | View development server logs for today |
| `npm run logs-prod` | View production server logs for today |
| `npm run logs-all` | List all log files |
| `npm run status` | Check the status of development and production servers |

## Directory Structure

- `.next/`: Contains the built production application
- `public/`: Static assets
- `src/`: Source code
- `logs/`: Server logs organized by environment and date
  - `logs/dev/`: Development server logs (YYYY-MM-DD.log)
  - `logs/prod/`: Production server logs (YYYY-MM-DD.log)

## Environment Variables

The application uses environment variables for configuration. See the `docs/ENVIRONMENT_SETUP.md` file for detailed information on required variables.

Basic setup:

1. Copy the `.env.example` file to create your environment files:
   ```bash
   # For local development
   cp .env.example .env.local

   # For production
   cp .env.example .env.production
   ```

2. Edit the files to add your actual values:
   ```
   # OpenAI API configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_API_BASE_URL=https://api.openai.com/v1
   OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
   
   # Application environment
   NODE_ENV=production
   
   # Next.js configuration
   NEXT_PUBLIC_APP_URL=https://game.degenduel.me
   ```

## Updates and Maintenance

To update the application:

1. Pull the latest changes: `git pull`
2. Install any new dependencies: `npm install`
3. Rebuild the application: `npm run build`
4. Restart the server: `npm run start-bg`

## Monitoring

- Use `npm run status` to check if servers are running
- Use `npm run logs-dev` or `npm run logs-prod` to view server logs
- Use `npm run logs-all` to list all available log files
- Check NGINX logs in `/var/log/nginx/` for access and error information

The log files are organized by environment and date in the `logs` directory:
```
logs/
├── dev/
│   └── YYYY-MM-DD.log  # Development server logs
└── prod/
    └── YYYY-MM-DD.log  # Production server logs
```

## Troubleshooting

### Server Not Starting

Check if ports are already in use:
```bash
npm run port-check
```

Kill existing processes if needed:
```bash
# Kill all servers
npm run kill-all

# Or kill specific servers
npm run kill-dev    # For development server (port 3009)
npm run kill-prod   # For production server (port 3010)
```

### Build Failures

If the build fails, check for:
- Syntax errors in code
- Missing dependencies
- TypeScript errors

### NGINX Configuration

If you have issues with NGINX, verify:
- Your configuration is correctly set up
- NGINX is running: `sudo systemctl status nginx`
- The proxy connection to port 3010 is working

## Rollback Procedure

To rollback to a previous version:

1. Stop the current servers: `npm run kill-all`
2. Check out the previous version: `git checkout <commit-hash>`
3. Install dependencies: `npm install`
4. Rebuild: `npm run build`
5. Start the server: `npm run start-bg`

You can also keep logs of previous deployments for reference:

```bash
# Archive the current logs before rollback
mkdir -p logs/archive/$(date +%Y-%m-%d)
cp logs/prod/*.log logs/archive/$(date +%Y-%m-%d)/
```

## Security Considerations

- Keep Node.js and npm updated
- Regularly update dependencies: `npm audit fix`
- Use HTTPS with proper SSL certificates
- Configure security headers in NGINX