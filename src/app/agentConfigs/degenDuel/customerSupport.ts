// src/app/agentConfigs/degenDuel/customerSupport.ts

/**
 * This file defines the Technical Support configuration for DegenDuel.
 * It uses modular components for personality, instructions, and tools.
 */

import { AgentConfig } from "@/app/types";
import { readTools, addTransferTool, buildAgentInstructions } from "../utils";

/**  
 * DegenDuel Technical Support Agent
 * Focused on technical platform help and contest rules
 */
const customerSupport: AgentConfig = { 
  name: "glitch",
  publicDescription: "GLITCH - Cyberpunk tech guru who hacks through your technical problems with attitude and flair. Console cowboy at your service!",
  instructions: buildAgentInstructions(
    'techSupport',
    ['transferModule.txt']
  ),
  tools: addTransferTool(readTools('techSupportTools.txt')),
};

export default customerSupport;