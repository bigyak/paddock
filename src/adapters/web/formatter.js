/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/dist/types";
import type { WebIncomingMessageType, WebOutgoingMessageType } from "../../types";

export function parseIncomingMessage(message: WebIncomingMessageType) : IncomingMessageType {
  if (message.text) {
    return {
      type: "string",
      timestamp: message.timestamp,
      text: message.text || ""
    }
  } else if (message.attachments) {
    return {
      type: "media",
      timestamp: message.timestamp,
      attachments: message.attachments.map(a => ({ url: a.url }))
    }
  } else {
    throw new Error("Unsupported message type");
  }
}

export function formatOutgoingMessage(message: OutgoingMessageType) : WebOutgoingMessageType {
  const _message: WebOutgoingMessageType = message;
  return _message;
}
