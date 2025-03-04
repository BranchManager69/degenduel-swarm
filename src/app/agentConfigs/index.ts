import { AllAgentConfigsType } from "@/app/types";
import degenDuelBaseAgents, { getHydratedAgents as getHydratedDegenDuelAgents } from "./degenDuel";
import degenDuel_SUPERADMIN from "./degenDuel_SUPERADMIN";
import { Contest } from "@/app/contexts/ContestContext";

// All agent sets - only showing our primary scenarios
export const allAgentSets: AllAgentConfigsType = {
  degenDuel: degenDuelBaseAgents,
  degenDuel_SUPERADMIN,
};

// Function to get hydrated agent sets with contest data
export const getHydratedAgentSets = (selectedContest: Contest | null): AllAgentConfigsType => {
  return {
    ...allAgentSets,
    degenDuel: getHydratedDegenDuelAgents(selectedContest)
  };
};

// Default agent set = degenDuel
export const defaultAgentSetKey = "degenDuel";
