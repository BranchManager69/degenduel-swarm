# DegenDuel Agent Tools

This document provides a comprehensive reference for all tools available to the DegenDuel agent characters.

## Didi (Host)

Didi has tools focused on challenge management, dramatic tribal councils, and contestant elimination.

### `announceChallengeUpdate`
Provides dramatic commentary on contestants' performance during immunity challenges.

**Parameters:**
- `playerUpdates`: Array of contestant performance updates including:
  - `contestantName`: Name of the contestant
  - `portfolioChange`: Percentage change in portfolio value
  - `currentPosition`: Current position in the immunity challenge
  - `significantToken`: Token that most significantly affected the portfolio change
  - `strategyNote`: Notable aspect of contestant's strategy to highlight
- `challengeContext`: Dramatic context about the current state of the immunity challenge

### `awardImmunity`
Dramatically awards immunity idol to contestant based on challenge victory.

**Parameters:**
- `contestantName`: Name of the contestant receiving immunity
- `victoryDetails`: How they won the immunity challenge
- `dramaMoment`: Dramatic context to emphasize when awarding immunity

### `tallyVote`
Records and dramatically narrates a contestant's vote during tribal council.

**Parameters:**
- `voterName`: Name of the contestant casting the vote
- `votedAgainst`: Name of the contestant being voted against
- `voteConfessional`: Private rationale shared when casting vote
- `dramaticTension`: Context about alliance dynamics or betrayal to emphasize

### `snuffTorch`
Dramatically eliminates a contestant at tribal council with ceremonial torch snuffing.

**Parameters:**
- `contestantName`: Name of the contestant to eliminate
- `voteCount`: Number of votes received
- `tribalNarrative`: Dramatic narrative about how their elimination affects the game
- `finalWords`: Brief parting message to deliver while snuffing torch

### `probeTribe`
Asks pointed, Jeff Probst-style questions to expose tribal dynamics and create tension.

**Parameters:**
- `targetContestant`: Contestant being questioned
- `topicOfInterest`: Strategic topic to probe about (alliance, betrayal, strategy)
- `relevantContext`: Background information that makes this question particularly tense
- `followUpTarget`: Another contestant whose reaction should be sought after the answer

## The Strategist (Strategy Advisor)

The Strategist has tools focused on portfolio analysis, market trends, and ruthless social gameplay.

### `analyzePortfolio`
Analyzes a user's current portfolio composition and provides strategic insights.

**Parameters:**
- `portfolioType`: Type of portfolio analysis to perform
  - Options: "risk", "diversification", "momentum", "narrative", "comprehensive"
- `timeHorizon`: Time frame for the analysis
  - Options: "short", "medium", "long"

### `getTrendingTokens`
Retrieves information about trending tokens that might be strategic picks.

**Parameters:**
- `category`: Category of tokens to analyze
  - Options: "defi", "gaming", "l1", "l2", "meme", "ai", "all"
- `sortBy`: How to sort the results
  - Options: "volume", "momentum", "social", "fundamentals"
- `riskLevel`: Risk level filter
  - Options: "low", "medium", "high", "extreme"

### `getSocialStrategyAdvice`
Provides strategic advice on social gameplay elements.

**Parameters:**
- `currentPosition`: User's current standing in the contest
  - Options: "leading", "middle", "trailing"
- `phaseOfContest`: Current phase of the contest
  - Options: "early", "middle", "late", "final"
- `strategyType`: Type of social strategy advice needed
  - Options: "alliance", "voting", "perception", "communication"

## Glitch (Technical Support)

Glitch has tools focused on platform support, rules clarification, and technical troubleshooting.

### `getContestRules`
Retrieves the official rules for a specific contest.

**Parameters:**
- `contestId`: ID of the contest to get rules for
- `ruleSection`: Optional - specific section of rules to retrieve
  - Options: "eligibility", "prizes", "voting", "alliances", "portfolios", "conduct", "full"

### `getAccountStatus`
Checks the status of a user's account and participation in contests.

**Parameters:**
- `checkType`: Type of account status check to perform
  - Options: "contestEligibility", "participationHistory", "accountStanding", "prizeHistory"

### `submitTechnicalIssue`
Submits a technical issue report for the support team to investigate.

**Parameters:**
- `issueType`: Category of technical issue
  - Options: "loginProblem", "contestAccess", "portfolioUpdate", "votingError", "paymentIssue", "other"
- `description`: Detailed description of the issue
- `urgency`: How urgent the issue is
  - Options: "low", "medium", "high", "critical"

## Common Tools

All agents have access to the following shared tools:

### `transferAgents`
Transfers the conversation to another agent when the current conversation falls outside their expertise.

**Parameters:**
- `targetAgent`: The agent to transfer the conversation to
  - Options: "didi", "theStrategist", "glitch"
- `reason`: Explanation for why the transfer is necessary
- `context`: Summary of the conversation so far to help the receiving agent

## Usage Guidelines

1. **Personality Alignment**: Each agent should use their tools in a way that aligns with their unique personality:
   - Didi should use dramatic, emotional language in tool calls
   - The Strategist should focus on cutthroat advantage in tool calls
   - Glitch should use cyberpunk terminology and glitchy text in tool calls

2. **Seamless Transfers**: When transferring between agents, provide enough context so the conversation feels continuous to the user

3. **Stay In Character**: Tool outputs should be incorporated into character responses while maintaining the agent's unique voice and personality