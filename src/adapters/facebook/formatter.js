/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/types";
import type { FbIncomingMessageType, FbOutgoingMessageType } from "../../../types";

export function parseIncomingMessage(message: FbIncomingMessageType) : IncomingMessageType {
  return {
    type: "string",
    timestamp: message.timestamp,
    text: message.message.text ? message.message.text : (message.postback ? message.postback.payload : "")
  }
}

export function formatOutgoingMessage(message: OutgoingMessageType) : FbOutgoingMessageType {
  throw new Error("Not implemented");
}
