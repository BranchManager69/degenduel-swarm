import { AllAgentConfigsType } from "@/app/types";
import degenDuel from "./degenDuel";
import degenDuel_SUPERADMIN from "./degenDuel_SUPERADMIN";

// All agent sets - only showing our primary scenarios
export const allAgentSets: AllAgentConfigsType = {
  degenDuel,
  degenDuel_SUPERADMIN,
};

// Default agent set = degenDuel
export const defaultAgentSetKey = "degenDuel";
