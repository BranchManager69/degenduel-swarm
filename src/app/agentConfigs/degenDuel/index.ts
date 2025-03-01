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
import { injectTransferTools } from '../utils';

// Define agent connections
gameMaster.downstreamAgents = [playerAgent, customerSupport];
playerAgent.downstreamAgents = [gameMaster, customerSupport];
customerSupport.downstreamAgents = [gameMaster, playerAgent];

// Inject transfer tools
const agents = injectTransferTools([gameMaster, playerAgent, customerSupport]);

export default agents;