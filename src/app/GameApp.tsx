"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Context providers & hooks
import { useTranscript } from "@/app/contexts/TranscriptContext";
import { useEvent } from "@/app/contexts/EventContext";
import { useContest } from "@/app/contexts/ContestContext";
import { useHandleServerEvent } from "./hooks/useHandleServerEvent";

// Utilities
import { createRealtimeConnection } from "./lib/realtimeConnection";

// Agent configs
import { allAgentSets, defaultAgentSetKey, getHydratedAgentSets } from "@/app/agentConfigs";

// Types
import { AgentConfig, SessionStatus, TranscriptItem } from "@/app/types";

// Agent avatar images for each character
const AGENT_AVATARS = {
  didi: "/avatars/didi.png", // Survivor-style host
  theStrategist: "/avatars/strategist.png", // Cutthroat advisor
  glitch: "/avatars/glitch.png", // Cyberpunk tech support
};

// Default avatar for unknown agents
const DEFAULT_AVATAR = "/avatars/default.png";

function GameApp() {
  // Get the search params from the URL
  const searchParams = useSearchParams();

  // Transcript
  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript();
  const { logClientEvent, logServerEvent } = useEvent();
  const [displayItems, setDisplayItems] = useState<TranscriptItem[]>([]);

  // Agent
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [selectedAgentConfigSet, setSelectedAgentConfigSet] = useState<AgentConfig[] | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentConfig | null>(null);
  
  // Animation state for agent transition
  const [isAgentLeaving, setIsAgentLeaving] = useState(false);
  const [isAgentEntering, setIsAgentEntering] = useState(false);
  const [previousAgentName, setPreviousAgentName] = useState<string>("");

  // Real-time connection
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Session
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");

  // UI
  const [userText, setUserText] = useState<string>("");
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState<boolean>(true);
  const [showTranscriptPane, setShowTranscriptPane] = useState(false);
  const [showEventsPane, setShowEventsPane] = useState(false);
  
  // Handler for audio playback toggle
  const handleAudioPlaybackToggle = () => {
    setIsAudioPlaybackEnabled(prev => !prev);
  };

  // Send a client event to the server
  const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      // Log the event if the data channel is open
      logClientEvent(eventObj, eventNameSuffix);
      // Send the event to the server
      dcRef.current.send(JSON.stringify(eventObj));
    } else {
      // Log an error if the data channel is not open
      logClientEvent(
        { attemptedEvent: eventObj.type },
        "error.data_channel_not_open"
      );
      console.error(
        "Failed to send message - no data channel available",
        eventObj
      );
    }
  };

  // Custom handler for agent transfers
  const handleAgentTransfer = (targetAgent: string) => {
    if (selectedAgentName === targetAgent) return;
    
    // Find the new agent
    const newAgent = selectedAgentConfigSet?.find(a => a.name === targetAgent);
    if (!newAgent) return;
    
    // Set animation states
    setPreviousAgentName(selectedAgentName);
    setIsAgentLeaving(true);
    
    // After a delay, change the agent and start the entering animation
    setTimeout(() => {
      setSelectedAgentName(targetAgent);
      setCurrentAgent(newAgent);
      setIsAgentLeaving(false);
      setIsAgentEntering(true);
      
      // Then reset the entering animation after it completes
      setTimeout(() => {
        setIsAgentEntering(false);
      }, 500);
    }, 500);
  };

  // Handle server events with modified transfer logic
  const handleServerEvent = (serverEvent: any) => {
    // Check for transfer function calls
    if (serverEvent.type === "response.done" && serverEvent.response?.output) {
      serverEvent.response.output.forEach((outputItem: any) => {
        if (
          outputItem.type === "function_call" && 
          outputItem.name === "transferAgents" && 
          outputItem.arguments
        ) {
          try {
            const args = JSON.parse(outputItem.arguments);
            if (args.targetAgent) {
              console.log("Transfer detected to:", args.targetAgent);
              handleAgentTransfer(args.targetAgent);
            }
          } catch (e) {
            console.error("Error parsing transfer arguments:", e);
          }
        }
      });
    }
    
    // Pass the event to the standard handler
    handleServerEventRef.current(serverEvent);
  };

  // The standard event handler reference
  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    selectedAgentName,
    selectedAgentConfigSet,
    sendClientEvent,
    setSelectedAgentName: (agent) => {
      // This is a passthrough that allows the standard handler to work
      // But our UI will use the handleAgentTransfer function for animations
      setSelectedAgentName(agent);
    },
  });

  // Use effect to set the agent config with contest data
  useEffect(() => {
    let finalAgentConfig = searchParams.get("agentConfig");
    if (!finalAgentConfig || !allAgentSets[finalAgentConfig]) {
      finalAgentConfig = defaultAgentSetKey;
    }

    // Just use the base agents when initializing, we'll update when contest changes
    const agents = allAgentSets[finalAgentConfig];
    
    // Set the first agent as the selected agent
    const agentKeyToUse = agents[0]?.name || "";
    const initialAgent = agents.find(a => a.name === agentKeyToUse) || null;

    // Set the selected agent and config set
    setSelectedAgentName(agentKeyToUse);
    setSelectedAgentConfigSet(agents);
    setCurrentAgent(initialAgent);
  }, [searchParams]); // Only run once when search params change
  
  // Separate effect for contest changes
  const { selectedContest, setSelectedContest } = useContest();
  
  useEffect(() => {
    // Skip if we don't have a selected contest yet
    if (!selectedContest) return;
    
    // Get the current agent config
    const finalAgentConfig = searchParams.get("agentConfig") || defaultAgentSetKey;
    
    // Get the hydrated agents with contest data
    const hydratedAgentSets = getHydratedAgentSets(selectedContest);
    const agents = hydratedAgentSets[finalAgentConfig];
    
    // Update the agent config set with hydrated agents
    setSelectedAgentConfigSet(agents);
    
    // Update the current agent with the hydrated version
    const updatedCurrentAgent = agents.find(a => a.name === selectedAgentName) || null;
    setCurrentAgent(updatedCurrentAgent);
    
    console.log("Updated agent with contest data for:", selectedContest.name);
  }, [selectedContest, searchParams, selectedAgentName]);

  // Use effect to connect to realtime
  useEffect(() => {
    if (selectedAgentName && sessionStatus === "DISCONNECTED") {
      connectToRealtime();
    }
  }, [selectedAgentName]);

  // Use effect to add a transcript breadcrumb
  useEffect(() => {
    if (
      sessionStatus === "CONNECTED" &&
      selectedAgentConfigSet &&
      selectedAgentName &&
      selectedContest // Only proceed if contest is selected
    ) {
      // Get the current agent
      const agent = selectedAgentConfigSet.find(
        (a) => a.name === selectedAgentName
      );
      // Add a transcript breadcrumb
      addTranscriptBreadcrumb(
        `Agent: ${selectedAgentName}`,
        agent
      );
      // Update the session
      updateSession(true);
    }
  }, [selectedAgentConfigSet, selectedAgentName, sessionStatus, selectedContest]);

  // Update display items when transcript changes
  useEffect(() => {
    // Filter out hidden and breadcrumb items for the main chat display
    const filtered = transcriptItems.filter(item => 
      !item.isHidden && item.type === "MESSAGE"
    );
    setDisplayItems(filtered);
    
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [transcriptItems]);

  // Fetch the ephemeral key
  const fetchEphemeralKey = async (): Promise<string | null> => {
    logClientEvent({ url: "/session" }, "fetch_session_token_request");
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    logServerEvent(data, "fetch_session_token_response");

    if (!data.client_secret?.value) {
      logClientEvent(data, "error.no_ephemeral_key");
      console.error("No ephemeral key provided by the server");
      setSessionStatus("DISCONNECTED");
      return null;
    }

    return data.client_secret.value;
  };

  // Connect to realtime
  const connectToRealtime = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");

    try {
      const EPHEMERAL_KEY = await fetchEphemeralKey();
      if (!EPHEMERAL_KEY) {
        return;
      }

      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }
      audioElementRef.current.autoplay = isAudioPlaybackEnabled;

      const { pc, dc } = await createRealtimeConnection(
        EPHEMERAL_KEY,
        audioElementRef
      );
      pcRef.current = pc;
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        logClientEvent({}, "data_channel.open");
      });
      dc.addEventListener("close", () => {
        logClientEvent({}, "data_channel.close");
      });
      dc.addEventListener("error", (err: any) => {
        logClientEvent({ error: err }, "data_channel.error");
      });
      dc.addEventListener("message", (e: MessageEvent) => {
        handleServerEvent(JSON.parse(e.data));
      });

      setDataChannel(dc);
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      setSessionStatus("DISCONNECTED");
    }
  };

  // Disconnect from realtime
  const disconnectFromRealtime = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      pcRef.current.close();
      pcRef.current = null;
    }
    setDataChannel(null);
    setSessionStatus("DISCONNECTED");

    logClientEvent({}, "disconnected");
  };

  // Send a simulated user message
  const sendSimulatedUserMessage = (text: string) => {
    const id = uuidv4().slice(0, 32);
    addTranscriptMessage(id, "user", text, true);

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          id,
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      },
      "(simulated user text message)"
    );
    sendClientEvent(
      { type: "response.create" },
      "(trigger response after simulated user text message)"
    );
  };

  // Update the session
  const updateSession = (shouldTriggerResponse: boolean = false) => {
    sendClientEvent(
      { type: "input_audio_buffer.clear" },
      "clear audio buffer on session update"
    );

    // Get instructions and tools
    const instructions = currentAgent?.instructions || "";
    const tools = currentAgent?.tools || [];

    const sessionUpdateEvent = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions,
        voice: "coral",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 200,
          create_response: true,
        },
        tools
      },
    };

    sendClientEvent(sessionUpdateEvent);

    if (shouldTriggerResponse) {
      // Use the selectedContest from the context
      if (selectedContest) {
        sendSimulatedUserMessage(`Hi, I'm here for the ${selectedContest.name} contest (${selectedContest.contest_code}).`);
      } else {
        sendSimulatedUserMessage("Hi there!");
      }
    }
  };

  // Cancel assistant speech
  const cancelAssistantSpeech = async () => {
    const mostRecentAssistantMessage = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");

    if (!mostRecentAssistantMessage) {
      console.warn("can't cancel, no recent assistant message found");
      return;
    }
    if (mostRecentAssistantMessage.status === "DONE") {
      console.log("No truncation needed, message is DONE");
      return;
    }

    sendClientEvent({
      type: "conversation.item.truncate",
      item_id: mostRecentAssistantMessage?.itemId,
      content_index: 0,
      audio_end_ms: Date.now() - mostRecentAssistantMessage.createdAtMs,
    });
    sendClientEvent(
      { type: "response.cancel" },
      "(cancel due to user interruption)"
    );
  };

  // Handle send text message
  const handleSendTextMessage = () => {
    if (!userText.trim()) return;
    cancelAssistantSpeech();

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: userText.trim() }],
        },
      },
      "(send user text message)"
    );
    setUserText("");

    sendClientEvent({ type: "response.create" }, "trigger response");
  };

  // Get avatar image for current agent
  const getAgentAvatar = (agentName: string) => {
    return AGENT_AVATARS[agentName as keyof typeof AGENT_AVATARS] || DEFAULT_AVATAR;
  };

  // Format message text with markdown and emojis (simplified version)
  const formatMessage = (text: string | undefined) => {
    // Handle undefined case
    if (!text) return "";
    
    // For now, just return the text as is - we'd implement markdown formatting later
    return text;
  };

  // Contest selector UI
  const ContestSelector = () => {
    const { contests, selectedContest, setSelectedContest } = useContest();
    
    if (contests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center bg-gray-900 text-white h-full">
          <div className="text-xl mb-4">Loading available contests...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white h-full p-6">
        <h1 className="text-3xl font-bold mb-8">Select a Contest</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {contests.map(contest => (
            <div 
              key={contest.id}
              onClick={() => setSelectedContest(contest)}
              className={`p-6 rounded-lg cursor-pointer transition-all ${
                contest.status === 'active' 
                  ? 'bg-gradient-to-br from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } border-2 ${
                selectedContest?.id === contest.id 
                  ? 'border-green-500 shadow-lg shadow-green-500/20' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{contest.name}</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contest.status === 'active' ? 'bg-green-900 text-green-300' :
                  contest.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                  contest.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {contest.status.toUpperCase()}
                </div>
              </div>
              
              <div className="text-sm text-gray-300 mb-4">{contest.description}</div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Code:</span> {contest.contest_code}
                </div>
                <div>
                  <span className="text-gray-400">Participants:</span> {contest.participant_count}/{contest.max_participants}
                </div>
                <div>
                  <span className="text-gray-400">Entry Fee:</span> {contest.entry_fee} SOL
                </div>
                <div>
                  <span className="text-gray-400">Prize Pool:</span> {contest.current_prize_pool} SOL
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedContest && (
          <button
            onClick={() => {
              // This button is a bit redundant, since clicking a contest already selects it
              // But we keep it as a clear action for the user
              console.log("Contest selected:", selectedContest.name);
            }}
            className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-md font-bold text-white"
          >
            Enter {selectedContest.name} Contest
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative overflow-hidden">
      {/* Show contest selector if no contest is selected yet */}
      {!selectedContest ? (
        <ContestSelector />
      ) : (
        /* Main Game UI */
        <div className="flex flex-col h-screen">
          {/* Header with contest info and agent name */}
          <header className="bg-gradient-to-r from-purple-900 to-indigo-800 p-4 shadow-lg flex justify-between items-center">
            <div className="text-white text-lg font-bold flex items-center space-x-2">
              <span>{selectedContest.name}</span>
              <span className="text-sm bg-indigo-700 px-2 py-0.5 rounded-full">{selectedContest.contest_code}</span>
            </div>
            
            <div className="flex space-x-4">
              {/* Contest change button */}
              <button 
                onClick={() => {
                  // Reset the selected contest so the selector shows again
                  setSelectedContest(null); 
                  // Disconnect if connected
                  if (sessionStatus === "CONNECTED") {
                    disconnectFromRealtime();
                  }
                }}
                className="px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded text-xs text-white"
              >
                Change Contest
              </button>
              
              {/* Toggle Debug Panels Buttons */}
              <button 
                onClick={() => setShowTranscriptPane(!showTranscriptPane)}
                className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs text-white"
              >
                {showTranscriptPane ? "Hide Transcript" : "Show Transcript"}
              </button>
              
              <button 
                onClick={() => setShowEventsPane(!showEventsPane)}
                className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs text-white"
              >
                {showEventsPane ? "Hide Events" : "Show Events"}
              </button>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Conversation display */}
            <div
              ref={chatContainerRef}
              className="h-full overflow-y-auto px-4 py-6 bg-gray-900"
            >
              <div className="max-w-4xl mx-auto space-y-6">
                {displayItems.map((item) => {
                  const isUser = item.role === "user";
                  const avatarSrc = isUser ? "/avatars/user.png" : getAgentAvatar(selectedAgentName);
                  
                  return (
                    <div 
                      key={item.itemId} 
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3`}
                    >
                      {!isUser && (
                        <div className={`relative ${isAgentLeaving && selectedAgentName !== previousAgentName ? 'animate-slideout' : ''} ${isAgentEntering ? 'animate-slidein' : ''}`}>
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={avatarSrc} 
                              alt={isUser ? "You" : selectedAgentName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs text-center mt-1 text-indigo-300 font-medium">
                            {isUser ? "You" : selectedAgentName}
                          </div>
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isUser 
                            ? 'bg-indigo-700 text-white rounded-tr-none' 
                            : 'bg-gray-800 text-gray-100 rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{formatMessage(item.title)}</div>
                      </div>
                      
                      {isUser && (
                        <div>
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={avatarSrc} 
                              alt={isUser ? "You" : selectedAgentName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs text-center mt-1 text-indigo-300 font-medium">
                            {isUser ? "You" : selectedAgentName}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && sessionStatus === "CONNECTED") {
                    handleSendTextMessage();
                  }
                }}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message..."
                disabled={sessionStatus !== "CONNECTED"}
              />
              <button
                onClick={handleSendTextMessage}
                disabled={sessionStatus !== "CONNECTED" || !userText.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  if (sessionStatus === "CONNECTED") {
                    disconnectFromRealtime();
                  } else {
                    connectToRealtime();
                  }
                }}
                className={`rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  sessionStatus === "CONNECTED" 
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
                } text-white`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    sessionStatus === "CONNECTED" 
                      ? "M6 18L18 6M6 6l12 12" // X for disconnect
                      : "M5 12h14" // Power icon for connect
                  } />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Debug Panels */}
      {showTranscriptPane && (
        <div className="absolute top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-800 border-r border-gray-700 p-2 z-50">
          <div className="text-white font-bold mb-2">Full Transcript</div>
          <div className="space-y-2">
            {transcriptItems.map((item) => (
              <div 
                key={item.itemId}
                className="text-xs bg-gray-900 p-2 rounded"
              >
                <div className="text-gray-400">{item.type} - {item.role}</div>
                <div className="text-white">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEventsPane && (
        <div className="absolute top-16 right-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-800 border-l border-gray-700 p-2 z-50">
          <div className="text-white font-bold mb-2">Events Log</div>
          <div className="text-xs text-gray-300">
            Event logs would display here
          </div>
        </div>
      )}

      {/* Connection status indicator */}
      <div className={`absolute bottom-20 left-4 px-3 py-1 rounded-full text-xs font-medium ${
        sessionStatus === "CONNECTED" 
          ? "bg-green-900 text-green-300" 
          : sessionStatus === "CONNECTING" 
            ? "bg-yellow-900 text-yellow-300"
            : "bg-red-900 text-red-300"
      }`}>
        {sessionStatus}
      </div>

      {/* Add necessary CSS for animations */}
      <style jsx global>{`
        @keyframes slidein {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideout {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-50px); opacity: 0; }
        }
        
        .animate-slidein {
          animation: slidein 0.5s forwards;
        }
        
        .animate-slideout {
          animation: slideout 0.5s forwards;
        }
      `}</style>
    </div>
  );
}

export default GameApp;