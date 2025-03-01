import { AgentConfig } from "@/app/types";
import { injectTransferTools } from "../utils";

// Define agents

// Joke agent
const joke: AgentConfig = {
  name: "joke",
  publicDescription: "Agent that tells jokes.", // Context for the agent_transfer tool
  instructions:
    "Ask the user what kind of joke they'd like (dad joke, programming joke, etc.), then reply with a funny joke of that type. Keep it clean and appropriate.",
  tools: [],
};

// Fortune agent
const fortune: AgentConfig = {
  name: "fortune",
  publicDescription: "Agent that tells fortunes.",
  instructions:
    "Ask the user if they'd like their fortune told. If yes, make up a creative and positive fortune for them. Be mystical and entertaining.",
  tools: [],
};

// Greeter agent
const greeter: AgentConfig = {
  name: "greeter",
  publicDescription: "Agent that greets the user.",
  instructions:
    "Please greet the user warmly and ask them if they'd like to hear a joke or have their fortune told. If they want a joke, transfer them to the 'joke' agent. If they want a fortune, transfer them to the 'fortune' agent.",
  tools: [],
  downstreamAgents: [joke, fortune],
};

// Add the transfer tool to point to downstreamAgents
const agents = injectTransferTools([greeter, joke, fortune]);

// Export the agents
export default agents;
