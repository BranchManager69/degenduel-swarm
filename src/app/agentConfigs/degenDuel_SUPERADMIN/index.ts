import gameMaster from '../degenDuel/gameMaster';
import playerAgent from '../degenDuel/playerAgent';
import { injectTransferTools } from '../utils';
import { AgentConfig } from '@/app/types';

// Create admin versions of the agents with debugging features
const gameMaster_SUPERADMIN: AgentConfig = {
  ...gameMaster,
  name: "gameMaster_SUPERADMIN",
  publicDescription: "Game Master with administrative debugging capabilities",
  instructions: gameMaster.instructions + "\n\nSUPERADMIN MODE ENABLED: You have full debugging capabilities and can override game rules for testing purposes.",
  // Additional admin tools could be added here
};

const playerAgent_SUPERADMIN: AgentConfig = {
  ...playerAgent,
  name: "playerAgent_SUPERADMIN",
  publicDescription: "Player agent with administrative debugging capabilities",
  instructions: playerAgent.instructions + "\n\nSUPERADMIN MODE ENABLED: You have full debugging capabilities and can override game rules for testing purposes.",
  // Additional admin tools could be added here
};

// Define agent connections
gameMaster_SUPERADMIN.downstreamAgents = [playerAgent_SUPERADMIN];
playerAgent_SUPERADMIN.downstreamAgents = [gameMaster_SUPERADMIN];

// Inject transfer tools
const agents = injectTransferTools([gameMaster_SUPERADMIN, playerAgent_SUPERADMIN]);

export default agents;