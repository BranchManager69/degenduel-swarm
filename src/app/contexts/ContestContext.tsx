"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types for contest data
export interface Contest {
  id: number;
  contest_code: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  entry_fee: string;
  prize_pool: string;
  current_prize_pool: string;
  status: "pending" | "active" | "completed" | "cancelled";
  settings: Record<string, any>;
  created_at: string;
  allowed_buckets: number[];
  participant_count: number;
  min_participants: number;
  max_participants: number;
  cancelled_at: string | null;
  completed_at: string | null;
  cancellation_reason: string | null;
  _count: {
    contest_participants: number;
  };
  is_participating: boolean;
  token_mint: string | null;
}

// Mock data for contests if the API is not available
export const MOCK_CONTESTS: Contest[] = [
  {
    id: 101,
    contest_code: "SOL-1234",
    name: "Solana Summer Showdown",
    description: "Compete with your best Solana token picks in this month-long battle.",
    start_time: "2025-02-25T00:00:00Z",
    end_time: "2025-03-25T00:00:00Z",
    entry_fee: "0.01",
    prize_pool: "10",
    current_prize_pool: "5",
    status: "active",
    settings: {},
    created_at: "2025-02-20T00:00:00Z",
    allowed_buckets: [1, 2, 3, 4, 5],
    participant_count: 12,
    min_participants: 2,
    max_participants: 20,
    cancelled_at: null,
    completed_at: null,
    cancellation_reason: null,
    _count: {
      contest_participants: 12
    },
    is_participating: false,
    token_mint: null
  },
  {
    id: 102,
    contest_code: "ARB-5678",
    name: "Arbitrum Adventure",
    description: "Build the best portfolio using Arbitrum ecosystem tokens.",
    start_time: "2025-03-15T00:00:00Z",
    end_time: "2025-04-15T00:00:00Z",
    entry_fee: "0.01",
    prize_pool: "5",
    current_prize_pool: "2",
    status: "pending",
    settings: {},
    created_at: "2025-03-01T00:00:00Z",
    allowed_buckets: [1, 2, 3, 4, 5],
    participant_count: 5,
    min_participants: 2,
    max_participants: 20,
    cancelled_at: null,
    completed_at: null,
    cancellation_reason: null,
    _count: {
      contest_participants: 5
    },
    is_participating: false,
    token_mint: null
  },
  {
    id: 103,
    contest_code: "ETH-9012",
    name: "Ethereum Elite",
    description: "Previous competition featuring Ethereum-based tokens.",
    start_time: "2025-01-01T00:00:00Z",
    end_time: "2025-02-01T00:00:00Z",
    entry_fee: "0.01",
    prize_pool: "15",
    current_prize_pool: "15",
    status: "completed",
    settings: {},
    created_at: "2024-12-25T00:00:00Z",
    allowed_buckets: [1, 2, 3, 4, 5],
    participant_count: 18,
    min_participants: 2,
    max_participants: 20,
    cancelled_at: null,
    completed_at: "2025-02-01T00:00:00Z",
    cancellation_reason: null,
    _count: {
      contest_participants: 18
    },
    is_participating: false,
    token_mint: null
  },
  {
    id: 104,
    contest_code: "MEME-3456",
    name: "Meme Coin Madness",
    description: "This contest was cancelled due to excessive market volatility.",
    start_time: "2025-02-10T00:00:00Z",
    end_time: "2025-03-10T00:00:00Z",
    entry_fee: "0.01",
    prize_pool: "8",
    current_prize_pool: "0",
    status: "cancelled",
    settings: {},
    created_at: "2025-02-05T00:00:00Z",
    allowed_buckets: [1, 2, 3, 4, 5],
    participant_count: 0,
    min_participants: 2,
    max_participants: 20,
    cancelled_at: "2025-02-12T00:00:00Z",
    completed_at: null,
    cancellation_reason: "Contest cancelled due to excessive market volatility",
    _count: {
      contest_participants: 0
    },
    is_participating: false,
    token_mint: null
  }
];

interface ContestContextType {
  contests: Contest[];
  selectedContest: Contest | null;
  isLoading: boolean;
  error: string | null;
  fetchContests: () => Promise<void>;
  setSelectedContest: (contest: Contest | null) => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a proxy API endpoint to avoid CORS issues
      const response = await fetch("/api/contests");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contests: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log the full structure of the response for debugging
      console.log("Contest API response:", JSON.stringify(data, null, 2));
      
      // Ensure we're working with an array of contests
      if (Array.isArray(data)) {
        console.log("Contest data is an array with structure:", JSON.stringify(data[0], null, 2));
        setContests(data);
      } else if (data && typeof data === 'object' && data.contests && Array.isArray(data.contests)) {
        // Handle case where API returns { contests: [...] }
        console.log("Contest data is in data.contests with structure:", JSON.stringify(data.contests[0], null, 2));
        setContests(data.contests);
      } else {
        console.error("API did not return an array of contests:", data);
        setContests(MOCK_CONTESTS);
        setError("API returned invalid data format - using mock data");
      }
      
      // If there's a selected contest ID in localStorage, try to select it
      const savedContestId = localStorage.getItem("selectedContestId");
      if (savedContestId) {
        const contestsList = contests; // Use the contests state which we just set
        const savedContestIdNumber = parseInt(savedContestId, 10);
        const savedContest = contestsList.find((c: Contest) => c.id === savedContestIdNumber);
        if (savedContest) {
          setSelectedContest(savedContest);
        }
      }
    } catch (err) {
      console.error("Error fetching contests:", err);
      
      // Use mock data if API fails
      console.log("Using mock contest data instead");
      setContests(MOCK_CONTESTS);
      
      // If there's a selected contest ID in localStorage, try to select it from mock data
      const savedContestId = localStorage.getItem("selectedContestId");
      if (savedContestId) {
        const contestsList = MOCK_CONTESTS;
        const savedContestIdNumber = parseInt(savedContestId, 10);
        const savedContest = contestsList.find((c) => c.id === savedContestIdNumber);
        if (savedContest) {
          setSelectedContest(savedContest);
        }
      }
      
      // Show error message but don't block the UI
      setError("Using mock data - API is unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSelectedContest = (contest: Contest | null) => {
    if (contest) {
      console.log("Selected contest full structure:", JSON.stringify(contest, null, 2));
      setSelectedContest(contest);
      localStorage.setItem("selectedContestId", contest.id.toString());
    } else {
      // Clear the selected contest
      setSelectedContest(null);
      localStorage.removeItem("selectedContestId");
    }
  };

  // Fetch contests on initial load
  useEffect(() => {
    fetchContests();
    
    // Check if we should force contest selection
    const savedContestId = localStorage.getItem("selectedContestId");
    if (!savedContestId) {
      console.log("No saved contest found, user will need to select one");
    }
  }, []);

  return (
    <ContestContext.Provider
      value={{
        contests,
        selectedContest,
        isLoading,
        error,
        fetchContests,
        setSelectedContest: handleSetSelectedContest
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error("useContest must be used within a ContestProvider");
  }
  return context;
};