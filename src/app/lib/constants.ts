/**
 * Constants for the DegenDuel application
 */

// Environment-related constants
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

// Development vs Production ports
export const DEV_PORT = 3009;
export const PROD_PORT = 3010;

// OpenAI API constants
export const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
export const OPENAI_REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2024-12-17';

// Application defaults
export const DEFAULT_AGENT_SET = 'degenDuel';