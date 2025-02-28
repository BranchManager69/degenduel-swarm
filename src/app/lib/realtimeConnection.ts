import { RefObject } from "react";
import { OPENAI_API_BASE_URL, OPENAI_REALTIME_MODEL } from "./constants";

/**
 * Create an OpenAI Realtime Voice API connection
 * @param EPHEMERAL_KEY - The ephemeral key
 * @param audioElement - The audio element
 * @returns The peer connection and data channel
 */

// Create a realtime connection
export async function createRealtimeConnection(
  EPHEMERAL_KEY: string,
  audioElement: RefObject<HTMLAudioElement | null>
): Promise<{ pc: RTCPeerConnection; dc: RTCDataChannel }> {
  
  // Create a peer connection
  const pc = new RTCPeerConnection();

  // On track event
  pc.ontrack = (e) => {
    if (audioElement.current) {
        audioElement.current.srcObject = e.streams[0];
    }
  };

  // Get the user media
  const ms = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Add the track to the peer connection
  pc.addTrack(ms.getTracks()[0]);

  // Create a data channel
  const dc = pc.createDataChannel("oai-events");

  // Create an offer
  const offer = await pc.createOffer();

  // Set the local description
  await pc.setLocalDescription(offer);

  // Get the base URL from constants
  const baseUrl = `${OPENAI_API_BASE_URL}/realtime`;

  // Get the model from constants
  const model = OPENAI_REALTIME_MODEL;

  // Get the SDP response
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp",
    },
  });

  // Get the answer SDP
  const answerSdp = await sdpResponse.text();

  // Create an answer
  const answer: RTCSessionDescriptionInit = {
    type: "answer",
    sdp: answerSdp,
  };

  // Set the remote description
  await pc.setRemoteDescription(answer);

  // Return the peer connection and data channel
  return { pc, dc };
} 