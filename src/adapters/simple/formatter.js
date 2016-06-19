/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";
import type { SimpleIncomingMessageType, SimpleOutgoingMessageType } from "../../types";

export function parseIncomingMessage(message: SimpleIncomingMessageType) : IncomingMessageType {
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

export function formatOutgoingMessage(message: OutgoingMessageType) : SimpleOutgoingMessageType {
  const _message: SimpleOutgoingMessageType = message;
  return _message;
}
