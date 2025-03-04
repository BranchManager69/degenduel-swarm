// src/app/agentConfigs/degenDuel/playerAgent.ts

/**
 * This file defines the Strategy Advisor configuration for DegenDuel.
 * It uses modular components for personality, instructions, and tools.
 */

import { AgentConfig } from "@/app/types";
import { readTools, addTransferTool, buildAgentInstructions } from "../utils";

/**
 * Strategy Advisor configuration for DegenDuel
 * Focused on portfolio strategy and competitive gameplay advice
 */
const playerAgent: AgentConfig = {
  name: "theStrategist",
  publicDescription: "THE STRATEGIST - Cold, calculating advisor who will help you win at any cost. Alliances, betrayal, manipulation - it's all just strategy.",
  instructions: buildAgentInstructions(
    'strategyAdvisor',
    ['transferModule.txt']
  ),
  tools: addTransferTool(readTools('strategyAdvisorTools.txt')),
};

export default playerAgent;