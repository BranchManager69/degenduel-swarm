"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEvent } from "@/app/contexts/EventContext";
import { LoggedEvent } from "@/app/types";

export interface EventsProps {
  isExpanded: boolean;
}

function Events({ isExpanded }: EventsProps) {
  const [prevEventLogs, setPrevEventLogs] = useState<LoggedEvent[]>([]);
  const eventLogsContainerRef = useRef<HTMLDivElement | null>(null);

  const { loggedEvents, toggleExpand } = useEvent();

  const getDirectionArrow = (direction: string) => {
    if (direction === "client") return { symbol: "▲", color: "#7f5af0" };
    if (direction === "server") return { symbol: "▼", color: "#2cb67d" };
    return { symbol: "•", color: "#555" };
  };

  useEffect(() => {
    const hasNewEvent = loggedEvents.length > prevEventLogs.length;

    if (isExpanded && hasNewEvent && eventLogsContainerRef.current) {
      eventLogsContainerRef.current.scrollTop =
        eventLogsContainerRef.current.scrollHeight;
    }

    setPrevEventLogs(loggedEvents);
  }, [loggedEvents, isExpanded]);

  return (
    <div
      className={
        (isExpanded ? "w-1/2 overflow-auto" : "w-0 overflow-hidden opacity-0") +
        " transition-all rounded-xl duration-200 ease-in-out flex flex-col bg-white"
      }
      ref={eventLogsContainerRef}
    >
      {isExpanded && (
        <div>
          <div className="font-semibold px-6 py-4 sticky top-0 z-10 text-base border-b bg-white">
            Logs
          </div>
          <div>
            {loggedEvents.map((log) => {
              const arrowInfo = getDirectionArrow(log.direction);
              const isError =
                log.eventName.toLowerCase().includes("error") ||
                log.eventData?.response?.status_details?.error != null;
              
              // Check if this is a function call (tool use) event
              const isFunctionCall = 
                log.eventName.includes("function_call") || 
                (log.eventData && 
                  (log.eventData.item?.type === "function_call" || 
                   log.eventData.item?.type === "function_call_output" ||
                   log.eventData.output?.some((item: any) => item.type === "function_call")));

              return (
                <div
                  key={log.id}
                  className={`${isFunctionCall 
                    ? "my-2 bg-purple-50 border border-purple-200 rounded-lg shadow-sm" 
                    : "border-t border-gray-200"} py-2 px-6 font-mono`}
                >
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center flex-1">
                      <span
                        style={{ color: arrowInfo.color }}
                        className="ml-1 mr-2"
                      >
                      {arrowInfo.symbol}
                      </span>
                      {isFunctionCall && <span className="mr-2">🛠️</span>}
                      <span
                        className={
                          "flex-1 text-sm " +
                          (isError 
                            ? "text-red-600" 
                            : (isFunctionCall ? "text-purple-700 font-semibold" : "text-gray-800"))
                        }
                      >
                        {log.eventName}
                      </span>
                    </div>
                    <div className="text-gray-500 ml-1 text-xs whitespace-nowrap">
                      {log.timestamp}
                    </div>
                  </div>

                  {log.expanded && log.eventData && (
                    <div className={`${isFunctionCall ? "text-purple-800 bg-purple-50" : "text-gray-800"} text-left`}>
                      <pre className={`border-l-2 ml-1 ${
                        isFunctionCall ? "border-purple-300" : "border-gray-200"
                      } whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2`}>
                        {JSON.stringify(log.eventData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
