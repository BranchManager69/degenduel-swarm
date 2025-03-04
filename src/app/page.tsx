'use client';

import React, { Suspense, useState, useEffect } from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import { ContestProvider } from "@/app/contexts/ContestContext";
import App from "./App";
import GameApp from "./GameApp";

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <div className="text-xl">Loading DegenDuel...</div>
  </div>
);

export default function Page() {
  // State to track which UI to show
  const [useGameUI, setUseGameUI] = useState<boolean>(true);

  // Check localStorage for UI preference on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('useGameUI');
    if (storedPreference !== null) {
      setUseGameUI(storedPreference === 'true');
    }
  }, []);

  // Update localStorage when preference changes
  useEffect(() => {
    localStorage.setItem('useGameUI', useGameUI.toString());
  }, [useGameUI]);

  return (
    <ContestProvider>
      <TranscriptProvider>
        <EventProvider>
          <Suspense fallback={<Loading />}>
            {/* UI selector button */}
            <div className="fixed top-2 right-2 z-50">
              <button
                onClick={() => setUseGameUI(!useGameUI)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg"
              >
                Switch to {useGameUI ? 'Classic' : 'Game'} UI
              </button>
            </div>
            
            {/* Render selected UI */}
            {useGameUI ? <GameApp /> : <App />}
          </Suspense>
        </EventProvider>
      </TranscriptProvider>
    </ContestProvider>
  );
}
