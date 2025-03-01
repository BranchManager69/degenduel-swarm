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