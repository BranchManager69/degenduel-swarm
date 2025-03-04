"use client";

import React from "react";
import { useContest } from "@/app/contexts/ContestContext";

const ContestBanner: React.FC = () => {
  const { selectedContest } = useContest();

  if (!selectedContest) return null;

  // Get status color class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-indigo-900 py-1 px-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-indigo-200 mr-2">Current Contest:</span>
          <span className="text-sm font-bold text-white">{selectedContest.name}</span>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full text-white ${getStatusClass(selectedContest.status)}`}>
          {selectedContest.status}
        </div>
      </div>
    </div>
  );
};

export default ContestBanner;