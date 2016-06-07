/* @flow */

import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/types";

/*
  Message Formats coming in from external systems.
    a) facebook
    b) web
    c) Twitter //todo
*/

type FbIncomingMessageBaseType = {
  sender: { id: string },
  recipient: { id: string},
  timestamp: number,
  message: {
    mid: string,
    seq: number
  },
  postback?: {
    payload: string
  }
};
export type FbIncomingStringMessageType = FbIncomingMessageBaseType & { message: { text: string } }
type FbMediaAttachmentType = { type: string, payload: { url: string } };
export type FbIncomingMediaMessageType = FbIncomingMessageBaseType & { message: { attachments: Array<FbMediaAttachmentType> } }
export type FbIncomingMessageType = FbIncomingStringMessageType | FbIncomingMediaMessageType;
export type FbIncomingBodyType = { entry: Array<{ messaging: Array<FbIncomingMessageType> }> }

type WebIncomingMessageBaseType = {
  timestamp: number
};
export type WebIncomingStringMessageType = WebIncomingMessageBaseType & { text: string };
type WebMediaAttachmentType = { type: string, url: string };
export type WebIncomingMediaMessageType = WebIncomingMessageBaseType & { message: { attachments: Array<WebMediaAttachmentType> } }
export type WebIncomingMessageType = WebIncomingStringMessageType | WebIncomingMediaMessageType;
export type WebIncomingBodyType = { messages: Array<WebIncomingMessageType> }

/*
  Message Formats which we send to external systems.
    a) facebook
    b) web
    c) Twitter //todo
*/
export type FbOutgoingStringMessageType = { type: "string", text: string };
export type FbOutgoingOptionMessageType = { type: "option", values: Array<string> };
export type FbOutgoingMessageType = FbOutgoingStringMessageType | FbOutgoingOptionMessageType;

export type WebOutgoingStringMessageType = { type: "string", text: string };
export type WebOutgoingOptionMessageType = { type: "option", values: Array<string> };
export type WebOutgoingMessageType = WebOutgoingStringMessageType | WebOutgoingOptionMessageType;

export type ExternalOutgoingMessageType = FbOutgoingMessageType | WebOutgoingMessageType;

export type FbOptionsType = {
  verifyToken: string,
  pageAccessToken: string,
  request: Function,
  processIncomingMessages?: (msgs: Array<IncomingMessageType>) => Array<IncomingMessageType>,
  processOutgoingMessages?: (msgs: Array<OutgoingMessageType>) => Array<OutgoingMessageType>
}

export type WebOptionsType = {
  processIncomingMessages?: (msgs: Array<IncomingMessageType>) => Array<IncomingMessageType>,
  processOutgoingMessages?: (msgs: Array<OutgoingMessageType>) => Array<OutgoingMessageType>
}

export type HttpContext<TBody> = { query: Object, body: TBody, session: Object }
