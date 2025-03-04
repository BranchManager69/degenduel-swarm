import React, { Suspense } from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import { ContestProvider } from "@/app/contexts/ContestContext";
import App from "./App";

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <div className="text-xl">Loading DegenDuel...</div>
  </div>
);

export default function Page() {
  return (
    <ContestProvider>
      <TranscriptProvider>
        <EventProvider>
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        </EventProvider>
      </TranscriptProvider>
    </ContestProvider>
  );
}
