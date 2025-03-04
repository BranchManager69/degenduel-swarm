"use client";

import React, { useState } from "react";
import { useContest, Contest } from "@/app/contexts/ContestContext";

const ContestSelector: React.FC = () => {
  const { contests, selectedContest, setSelectedContest, isLoading, error, fetchContests } = useContest();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!selectedContest);

  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-blue-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle contest selection
  const handleSelectContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Contest Selection Button */}
      <div className="relative inline-block">
        <div className="flex flex-col items-end">
          {error && error.includes("mock data") && (
            <span className="text-xs text-yellow-500 mb-1">Using mock data</span>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
          >
            {selectedContest ? (
              <>
                <span>{selectedContest.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(selectedContest.status)}`}>
                  {selectedContest.status}
                </span>
              </>
            ) : (
              "Select Contest"
            )}
          </button>
        </div>
      </div>

      {/* Contest Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col ${!selectedContest ? 'border-2 border-indigo-500 animate-pulse-slow' : ''}`}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {!selectedContest ? 'Please Select a Contest to Begin' : 'Select a Contest'}
              </h3>
              
              {/* Only show close button if a contest is already selected */}
              {selectedContest && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">
                  <p>{error}</p>
                  <p className="text-gray-400 mt-2 text-sm">
                    The API might be temporarily unavailable or experiencing issues.
                  </p>
                  <button
                    onClick={fetchContests}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : !Array.isArray(contests) ? (
                <div className="text-red-500 text-center p-4">
                  Invalid response format. Please try again.
                  <button
                    onClick={fetchContests}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : contests.length === 0 ? (
                <div className="text-gray-400 text-center p-4">No contests available</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contests.map((contest) => (
                    <div
                      key={contest.id}
                      onClick={() => handleSelectContest(contest)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedContest?.id === contest.id
                          ? "border-indigo-500 bg-indigo-900"
                          : "border-gray-700 bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-white">{contest.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(contest.status)}`}>
                          {contest.status}
                        </span>
                      </div>
                      
                      {contest.description && (
                        <p className="text-gray-300 mt-2">{contest.description}</p>
                      )}
                      
                      <div className="flex gap-4 mt-3 text-sm text-gray-400">
                        <div>
                          <span className="font-medium">Start:</span> {formatDate(contest.start_time)}
                        </div>
                        <div>
                          <span className="font-medium">End:</span> {formatDate(contest.end_time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              {selectedContest && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={fetchContests}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Refresh Contests
              </button>
              
              {!selectedContest && (
                <div className="flex-grow text-left mr-4">
                  <p className="text-amber-400 text-sm font-medium">
                    ⚠️ You must select a contest to continue
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestSelector;