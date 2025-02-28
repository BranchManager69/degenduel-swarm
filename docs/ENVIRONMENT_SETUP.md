# Environment Setup for DegenDuel

This document explains how to set up the environment variables for the DegenDuel application.

## Environment Files

The application uses the following environment files:

- `.env.local`: For local development
- `.env.production`: For production deployment

## Required Environment Variables

Copy the `.env.example` file to create your environment files:

```bash
# For local development
cp .env.example .env.local

# For production
cp .env.example .env.production
```

Then edit the files to add your actual values.

### Basic Configuration

These variables are required for the application to function properly:

```
# OpenAI API configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE_URL=https://api.openai.com/v1
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17

# Application environment
NODE_ENV=development|production

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3009|https://game.degenduel.me
```

### OpenAI API Key

You must provide a valid OpenAI API key with access to the GPT-4o Realtime Preview model. This key is used for:

1. Creating realtime voice sessions
2. Connecting to the OpenAI Realtime API
3. Making completions requests

### Development vs Production

The application uses different ports for development and production:

- Development: Port 3009
- Production: Port 3010

These values are defined in the `src/app/lib/constants.ts` file and used throughout the application.

## Loading Environment Variables in Next.js

Next.js automatically loads environment variables from:

- `.env.local` (always loaded)
- `.env.development` (loaded when NODE_ENV is 'development')
- `.env.production` (loaded when NODE_ENV is 'production')

## Environment-Specific API Endpoints

The application now uses constants from `src/app/lib/constants.ts` to handle environment-specific values:

```typescript
export const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
export const OPENAI_REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2024-12-17';
```

This allows you to override API endpoints and model versions without changing code.

## NGINX Configuration

When deploying with NGINX, make sure your proxy settings correctly pass along the host headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

This ensures that the Next.js application can generate correct absolute URLs when needed.