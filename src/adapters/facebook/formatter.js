/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/dist/types";
import type { FbIncomingMessageType, FbOutgoingMessageType, FbIncomingStringMessageType } from "../../types";

export function parseIncomingMessage(incoming: FbIncomingMessageType) : IncomingMessageType {
  if (incoming.message && incoming.message.text) {
    return {
      type: "string",
      timestamp: incoming.timestamp,
      text: incoming.message.text
    }
  } else if (incoming.postback) {
    return {
      type: "string",
      timestamp: incoming.timestamp,
      text: incoming.postback.payload
    }
  } else {
    throw new Error("Unknown message type.");
  }
}

export function formatOutgoingMessage(message: OutgoingMessageType) : FbOutgoingMessageType {
  throw new Error("Not implemented");
}
