// src/app/agentConfigs/utils.ts

// Dynamically import fs and path only on server
let fs: any = null;
let path: any = null;

// Using dynamic import with ESM syntax for Node.js modules
if (typeof window === 'undefined') {
  // This is a workaround for ESLint rules
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  path = require('path');
}

import { AgentConfig, Tool } from '@/app/types';

/**
 * Reads a component file from the _components directory
 * @param componentPath Path to component file relative to _components directory
 * @returns The component content as a string
 */
export const readComponent = (componentPath: string): string => {
  try {
    // If running on server, use fs to read actual file
    if (typeof window === 'undefined' && fs && path) {
      const fullPath = path.join(process.cwd(), 'src/app/agentConfigs/_components', componentPath);
      return fs.readFileSync(fullPath, 'utf8');
    }
    
    // If on client or fs is not available, return mock content for now
    // In a real implementation, you'd want to include these in the build or load via API
    console.warn(`Client-side component reading for ${componentPath} - using mock content`);
    return `# Mock component content for ${componentPath}\nThis is placeholder content for client-side rendering.`;
  } catch (error) {
    console.error(`Error reading component at ${componentPath}:`, error);
    return '';
  }
};

/**
 * Template replacer function that substitutes placeholders in a template
 * @param template Template string with {{PLACEHOLDER}} placeholders
 * @param replacements Object mapping placeholder names to replacement values
 * @returns The processed template with replacements
 */
export const processTemplate = (template: string, replacements: Record<string, string>): string => {
  let result = template;
  
  Object.entries(replacements).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value);
  });
  
  return result;
};

/**
 * Reads tool definitions from component files
 * @param toolsFile Name of the tools file in _components/tools directory
 * @returns The parsed tools array
 */
export const readTools = (toolsFile: string): Tool[] => {
  try {
    const toolsContent = readComponent(`tools/${toolsFile}`);
    // Using eval is not ideal but it's a simple way to parse the tools definition which is in JS format
    // A better approach would be to store tools in JSON format
    const tools = eval(toolsContent) as Tool[];
    return tools;
  } catch (error) {
    console.error(`Error loading tools from ${toolsFile}:`, error);
    return [];
  }
};

/**
 * Creates a transfer tool and adds it to the tools array
 * @param tools Existing tools array
 * @returns Updated tools array with transfer tool added
 */
export const addTransferTool = (tools: Tool[]): Tool[] => {
  try {
    const transferToolContent = readComponent('transferTool.txt');
    const transferTool = eval(`(${transferToolContent})`) as Tool;
    return [...tools, transferTool];
  } catch (error) {
    console.error('Error adding transfer tool:', error);
    return tools;
  }
};

/**
 * Combines agent instructions from modular components
 * @param agentModule Name of the agent module file 
 * @param additionalComponents Additional component files to include
 * @param replacements Key-value pairs for template replacements
 * @returns Combined instruction string
 */
export const buildAgentInstructions = (
  agentModule: string,
  additionalComponents: string[] = [],
  replacements: Record<string, string> = {}
): string => {
  try {
    // Read the base agent module
    const moduleContent = readComponent(`agentModules/${agentModule}.txt`);
    
    // Read additional components
    const components = additionalComponents.map(comp => readComponent(comp));
    
    // Combine all content
    const combinedContent = [moduleContent, ...components].join('\n\n');
    
    // Process any template replacements
    return processTemplate(combinedContent, replacements);
  } catch (error) {
    console.error(`Error building agent instructions for ${agentModule}:`, error);
    return '';
  }
};

/**
 * Hydrates an agent config with contest-specific information
 * @param agent The base agent configuration
 * @param contestInfo Contest information to inject
 * @returns Updated agent with contest info added to instructions
 */
export const hydrateAgentWithContestInfo = (
  agent: AgentConfig, 
  contestInfo: { id: string; name: string; description: string; rules: string; }
): AgentConfig => {
  const contestSection = `
# Contest Information
- Contest ID: ${contestInfo.id}
- Contest Name: ${contestInfo.name}
- Description: ${contestInfo.description}
- Rules: ${contestInfo.rules}
`;

  return {
    ...agent,
    instructions: `${agent.instructions}\n\n${contestSection}`
  };
};

/**
 * Hydrates an agent with contest data from the Contest context
 * @param agent The agent to hydrate
 * @param contest Contest data from the context
 * @returns Hydrated agent
 */
export const hydrateAgentWithContestData = (
  agent: AgentConfig,
  contest: any
): AgentConfig => {
  // Extract relevant fields and provide default values for missing ones
  const contestInfo = {
    id: contest.id?.toString() || 'unknown',
    name: contest.name || 'Unknown Contest',
    description: contest.description || 'No description available',
    rules: contest.settings?.rules || 'Contest rules not specified'
  };
  
  return hydrateAgentWithContestInfo(agent, contestInfo);
};

/**
 * Injects transfer tools to a list of agents
 * @param agents Array of agents to inject transfer tools to
 * @returns Array of agents with transfer tools
 */
export const injectTransferTools = (agents: AgentConfig[]): AgentConfig[] => {
  // The transfer tools are already added in the agent configs
  // This function is kept for backward compatibility
  return agents;
};

const utils = {
  readComponent,
  processTemplate,
  readTools,
  addTransferTool,
  buildAgentInstructions,
  hydrateAgentWithContestInfo,
  hydrateAgentWithContestData,
  injectTransferTools
};

export default utils;