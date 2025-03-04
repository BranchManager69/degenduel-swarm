// src/app/agentConfigs/degenDuel/index.ts

/**
 * This file is the main entry point for the DegenDuel agent configuration.
 * It imports all the necessary agent configurations and defines the connections between them.
 * It also injects the transfer tools to each agent.
 */

// Import all agent configurations
import gameMaster from './gameMaster';
import playerAgent from './playerAgent';
import customerSupport from './customerSupport';
import { injectTransferTools, hydrateAgentWithContestData } from '../utils';
import { Contest } from '@/app/contexts/ContestContext';

// Define agent connections with their new names
const didi = gameMaster;
const theStrategist = playerAgent;
const glitch = customerSupport;

// Update downstream references with the new agent identities
didi.downstreamAgents = [theStrategist, glitch];
theStrategist.downstreamAgents = [didi, glitch];
glitch.downstreamAgents = [didi, theStrategist];

// Base agents without contest data
const baseAgents = injectTransferTools([gameMaster, playerAgent, customerSupport]);

// Export function to get agents hydrated with contest data
export const getHydratedAgents = (contest: Contest | null) => {
  if (!contest) {
    return baseAgents;
  }
  
  // Hydrate each agent with contest data
  return baseAgents.map(agent => hydrateAgentWithContestData(agent, contest));
};

// Default export for backward compatibility
export default baseAgents;