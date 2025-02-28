# Logging System in DegenDuel

This document explains the logging system in DegenDuel, which helps with debugging, monitoring, and tracking server activity.

## Log Directory Structure

Logs are organized by environment and date for easy access and management:

```
logs/
├── dev/
│   ├── 2025-02-28.log  # Development logs from February 28, 2025
│   └── ...             # Other development log files
├── prod/
│   ├── 2025-02-28.log  # Production logs from February 28, 2025
│   └── ...             # Other production log files
└── archive/
    └── 2025-02-28/     # Optional archive directory for rollbacks
        ├── some-old.log
        └── ...
```

## Log File Format

Each log file is named using the date format `YYYY-MM-DD.log` and contains entries with timestamps for each server event.

Example log content:
```
   ▲ Next.js 15.1.4
   - Local:        http://localhost:3009
   - Network:      http://147.79.74.67:3009
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1482ms
```

## Log Management Commands

DegenDuel provides several commands to work with logs:

| Command | Description |
|---------|-------------|
| `npm run logs-dev` | View the latest development logs for today |
| `npm run logs-prod` | View the latest production logs for today |
| `npm run logs-dev-follow` | Watch development logs in real-time |
| `npm run logs-prod-follow` | Watch production logs in real-time |
| `npm run logs-all` | List all log files in the system |
| `npm run clear-logs-dev` | Clear today's development log |
| `npm run clear-logs-prod` | Clear today's production log |

## Log Rotation

Logs are automatically rotated by date. Each day, a new log file is created with the current date as the filename. This prevents log files from growing too large and makes it easier to find logs from a specific date.

## Log Archiving

For important deployments or rollbacks, you can archive the current logs:

```bash
# Archive logs for a specific date
mkdir -p logs/archive/$(date +%Y-%m-%d)
cp logs/prod/*.log logs/archive/$(date +%Y-%m-%d)/
```

## Viewing Logs

To view logs, you can use the provided npm commands or standard Unix tools:

```bash
# Using npm commands
npm run logs-dev
npm run logs-prod

# Using Unix tools
tail -n 100 logs/dev/$(date +%Y-%m-%d).log  # View last 100 lines
grep "Error" logs/prod/$(date +%Y-%m-%d).log  # Search for errors
```

## Excluding Logs from Git

All log files are excluded from Git through the `.gitignore` file to prevent cluttering the repository with operational data.

## Log Analysis

For analyzing logs, you can use standard Unix tools:

```bash
# Count occurrences of 'error' in logs
grep -c "error" logs/prod/$(date +%Y-%m-%d).log

# Find all log entries related to a specific path or feature
grep "/api/session" logs/prod/$(date +%Y-%m-%d).log
```