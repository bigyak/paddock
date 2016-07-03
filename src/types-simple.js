/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";

/* Incoming */
export type SimpleIncomingStringMessageType = {
  timestamp: number,
  text: string
};
type SimpleMediaAttachmentType = { type: string, url: string };
export type SimpleIncomingMediaMessageType = {
  timestamp: number,
  attachments: Array<SimpleMediaAttachmentType>
}
export type SimpleIncomingMessageType = SimpleIncomingStringMessageType | SimpleIncomingMediaMessageType;
export type SimpleIncomingBodyType = { messages: Array<SimpleIncomingMessageType> }

/* Outgoing */
export type SimpleOutgoingStringMessageType = { type: "string", text: string };
export type SimpleOutgoingOptionMessageType = { type: "option", values: Array<string> };
export type SimpleOutgoingMessageType = SimpleOutgoingStringMessageType | SimpleOutgoingOptionMessageType;

/* Options */
export type SimpleOptionsType = {
  processIncomingMessages?: (msgs: Array<IncomingMessageType>) => Array<IncomingMessageType>,
  processOutgoingMessages?: (msgs: Array<OutgoingMessageType>) => Array<OutgoingMessageType>
}
