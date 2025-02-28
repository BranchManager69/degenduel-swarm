import gameMaster from './gameMaster';
import playerAgent from './playerAgent';
import { injectTransferTools } from '../utils';

// Define agent connections
gameMaster.downstreamAgents = [playerAgent];
playerAgent.downstreamAgents = [gameMaster];

// Inject transfer tools
const agents = injectTransferTools([gameMaster, playerAgent]);

export default agents;