"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types for contest data
export interface Contest {
  id: string;
  name: string;
  status: "pending" | "active" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  description?: string;
}

// Mock data for contests if the API is not available
export const MOCK_CONTESTS: Contest[] = [
  {
    id: "contest-001",
    name: "Solana Summer Showdown",
    status: "active",
    startDate: "2025-02-25T00:00:00Z",
    endDate: "2025-03-25T00:00:00Z",
    description: "Compete with your best Solana token picks in this month-long battle."
  },
  {
    id: "contest-002",
    name: "Arbitrum Adventure",
    status: "pending",
    startDate: "2025-03-15T00:00:00Z",
    endDate: "2025-04-15T00:00:00Z",
    description: "Build the best portfolio using Arbitrum ecosystem tokens."
  },
  {
    id: "contest-003",
    name: "Ethereum Elite",
    status: "completed",
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-02-01T00:00:00Z",
    description: "Previous competition featuring Ethereum-based tokens."
  },
  {
    id: "contest-004",
    name: "Meme Coin Madness",
    status: "cancelled",
    startDate: "2025-02-10T00:00:00Z",
    endDate: "2025-03-10T00:00:00Z",
    description: "This contest was cancelled due to excessive market volatility."
  }
];

interface ContestContextType {
  contests: Contest[];
  selectedContest: Contest | null;
  isLoading: boolean;
  error: string | null;
  fetchContests: () => Promise<void>;
  setSelectedContest: (contest: Contest) => void;
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
      // Ensure we're working with an array of contests
      if (Array.isArray(data)) {
        setContests(data);
      } else if (data && typeof data === 'object' && data.contests && Array.isArray(data.contests)) {
        // Handle case where API returns { contests: [...] }
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
        const savedContest = contestsList.find((c: Contest) => c.id === savedContestId);
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
        const savedContest = contestsList.find((c) => c.id === savedContestId);
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

  const handleSetSelectedContest = (contest: Contest) => {
    setSelectedContest(contest);
    localStorage.setItem("selectedContestId", contest.id);
  };

  // Fetch contests on initial load
  useEffect(() => {
    fetchContests();
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