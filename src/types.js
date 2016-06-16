/* @flow */

import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/dist/types";

/*
  Message Formats coming in from external systems.
    a) facebook
    b) web
    c) Twitter //todo
*/

/* Facebook */
export type FbIncomingStringMessageType = {
  sender: { id: string },
  recipient: { id: string},
  timestamp: number,
  postback?: {
    payload: string
  },
  message?: {
    mid: string,
    seq: number,
    text: string,
  }
}

type FbMediaAttachmentType = { type: string, payload: { url: string } };
export type FbIncomingMediaMessageType = {
  sender: { id: string },
  recipient: { id: string},
  timestamp: number,
  message: {
    mid: string,
    seq: number,
    attachments: Array<FbMediaAttachmentType>
  }
}
export type FbIncomingMessageType = FbIncomingStringMessageType | FbIncomingMediaMessageType;
export type FbIncomingBodyType = Array<FbIncomingMessageType>

/* Web */
export type WebIncomingStringMessageType = {
  timestamp: number,
  text: string
};
type WebMediaAttachmentType = { type: string, url: string };
export type WebIncomingMediaMessageType = {
  timestamp: number,
  attachments: Array<WebMediaAttachmentType>
}
export type WebIncomingMessageType = WebIncomingStringMessageType | WebIncomingMediaMessageType;
export type WebIncomingBodyType = { messages: Array<WebIncomingMessageType> }

/*
  Message Formats which we send to external systems.
    a) facebook
    b) web
    c) Twitter //todo
*/

/* Facebook */
export type FbOutgoingStringMessageType = { text: string };
export type FbOutgoingMessageButtonType = {
  type: string,
  url?: string,
  title: string,
  payload?: string
};
export type FbOutgoingElementType = {
  title: string,
  subtitle: string,
  image_url: string,
  buttons: Array<FbOutgoingMessageButtonType>
};

export type FbOutgoingOptionMessageType = {
  attachment: {
    type: string,
    payload: {
      template_type: string,
      text: ?string,
      buttons: Array<FbOutgoingMessageButtonType>
    }
  }
};
export type FbOutgoingElementsMessageType = {
  attachment: {
    type: string,
    payload: {
      template_type: string,
      elements: Array<FbOutgoingElementType>
    }
  }
};

export type FbOutgoingMessageType = FbOutgoingStringMessageType | FbOutgoingOptionMessageType | FbOutgoingElementsMessageType;

/* Web */
export type WebOutgoingStringMessageType = { type: "string", text: string };
export type WebOutgoingOptionMessageType = { type: "option", values: Array<string> };
export type WebOutgoingMessageType = WebOutgoingStringMessageType | WebOutgoingOptionMessageType;

export type ExternalOutgoingMessageType = FbOutgoingMessageType | WebOutgoingMessageType;

export type FbOptionsType = {
  verifyToken: string,
  pageAccessToken: string,
  request: (opts: Object) => void,
  processIncomingMessages?: (msgs: Array<IncomingMessageType>) => Array<IncomingMessageType>,
  processOutgoingMessages?: (msgs: Array<OutgoingMessageType>) => Array<OutgoingMessageType>
}

export type WebOptionsType = {
  processIncomingMessages?: (msgs: Array<IncomingMessageType>) => Array<IncomingMessageType>,
  processOutgoingMessages?: (msgs: Array<OutgoingMessageType>) => Array<OutgoingMessageType>
}

export type HttpContext<TBody> = { query: { [key: string]: string }, body: TBody, session: Object }
