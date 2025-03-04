# DegenDuel Agent Modularity Guide

This document explains how the modular personality system works for DegenDuel agents and how to customize or create new agents.

## Overview

The DegenDuel agent system uses a modular component architecture to enable:

1. Easy personality changes without affecting functionality
2. Consistent transfer behavior across all agents
3. Reusable components for new agent development
4. Cleaner, more maintainable agent configurations

## Agent Directory Structure

```
src/app/agentConfigs/
├── _components/             # Shared components used across agents
│   ├── agentModules/        # Core personality files for each agent
│   │   ├── gameMaster.txt   # Didi (Host) personality
│   │   ├── strategyAdvisor.txt # The Strategist personality
│   │   ├── techSupport.txt  # Glitch personality
│   ├── tools/               # Tool definitions for each agent role
│   │   ├── gameMasterTools.txt
│   │   ├── strategyAdvisorTools.txt
│   │   ├── techSupportTools.txt
│   │   ├── transferTool.txt # Shared transfer tool definition
│   ├── transferModule.txt   # Shared transfer logic/instructions
├── degenDuel/               # Main agent configuration files
│   ├── gameMaster.ts        # Didi (Host) agent configuration
│   ├── playerAgent.ts       # The Strategist agent configuration  
│   ├── customerSupport.ts   # Glitch agent configuration
├── utils.ts                 # Utility functions for building agents
```

## Personality Structure

Each agent personality file in `_components/agentModules/` follows a standard structure:

```
# Personality Components
## Identity
[Who the agent is and their core character traits]

## Task
[The agent's primary responsibilities]

## Demeanor
[How the agent generally conducts themselves]

## Tone
[The agent's speech patterns and communication style]

## Enthusiasm
[How and when the agent shows excitement or passion]

## Formality
[The agent's level of formality or casualness]

## Emotion
[How the agent expresses or handles emotions]

## Pacing
[The rhythm and flow of the agent's communication]

# Domain Definition
## Expertise
[Areas where the agent is knowledgeable and confident]

## Not Domain
[Areas outside the agent's expertise where they should transfer]

# Instructions
[Specific guidelines for how the agent should behave]
```

## Customizing Existing Agents

To modify an existing agent's personality:

1. Edit the corresponding file in `_components/agentModules/`
2. Make sure to maintain the same section structure
3. Ensure the agent's expertise domains remain aligned with their tools
4. Update the agent's name and description in their configuration file (e.g., `degenDuel/gameMaster.ts`)

## Creating New Agents

To create a new agent:

1. Create a new personality file in `_components/agentModules/`
2. Create tool definitions in `_components/tools/`
3. Create a new configuration file in the appropriate directory
4. Use the `buildAgentInstructions` and `addTransferTool` utility functions

Example of a new agent configuration:

```typescript
import { AgentConfig } from "@/app/types";
import { readTools, addTransferTool, buildAgentInstructions } from "../utils";

const newAgent: AgentConfig = {
  name: "newAgentName",
  publicDescription: "Brief description of the agent for users",
  instructions: buildAgentInstructions(
    'newAgentModule',
    ['transferModule.txt'],
    {
      // Optional additional replacements
      CUSTOM_FIELD: `Custom content that will replace {{CUSTOM_FIELD}} in the template`
    }
  ),
  tools: addTransferTool(readTools('newAgentTools.txt')),
};

export default newAgent;
```

## Template Replacements

The `buildAgentInstructions` function supports template replacements using double curly braces:

```
// In template file
This is a template with a {{PLACEHOLDER}}

// In agent configuration
buildAgentInstructions(
  'templateName',
  [],
  {
    PLACEHOLDER: "replacement value"
  }
)
```

## Transfer Functionality

All agents use the shared `transferModule.txt` which ensures consistent transfer behavior. The transfer tool is automatically added to each agent's toolset using the `addTransferTool` function.

## Best Practices

1. **Maintain Character Consistency**: Ensure all sections of a personality align with the core character concept
2. **Keep Expertise Aligned with Tools**: An agent's defined expertise should match what their tools can actually do
3. **Preserve Transfer Logic**: Always include the transfer module in new agents
4. **Use Template Placeholders**: For variable content that might change frequently
5. **Test New Personalities**: Verify that new personalities don't break the underlying functionality

## Current Character Roster

1. **Didi (Host)** - Charismatic Survivor-style host who manages challenges and tribal councils with Jeff Probst-like dramatic flair
2. **The Strategist** - Cold, calculating advisor focused on winning at any cost through manipulation and strategic betrayal
3. **Glitch** - Quirky cyberpunk tech support guru who speaks in hacker slang and glitchy text

These characters work together to create a cohesive game experience while maintaining distinct personalities and expertise domains.