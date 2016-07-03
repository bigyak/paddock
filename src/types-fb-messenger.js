/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";

/* Incoming Messages */
export type FbMessengerIncomingStringType = {
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

export type FbMessengerIncomingMediaType = {
  sender: { id: string },
  recipient: { id: string},
  timestamp: number,
  message?: {
    mid: string,
    seq: number,
    attachments: Array<{ type: string, payload: { url: string } }>
  },
  postback?: { payload: string }
}
export type FbMessengerIncomingType = FbMessengerIncomingStringType | FbMessengerIncomingMediaType;

/* Fb Message Batch */
type FbMessengerBatchItemType = {
  [key: string]: {
    [key: string]: Array<FbMessengerIncomingType>
  }
}

/* Outgoing Messages */
export type FbMessengerOutgoingStringType = { text: string };
export type FbMessengerOutgoingButtonType = {
  type: string,
  url?: string,
  title: string,
  payload?: string
};
export type FbMessengerOutgoingElementType = {
  title: string,
  subtitle: string,
  image_url: string,
  buttons: Array<FbMessengerOutgoingButtonType>
};

export type FbMessengerOutgoingOptionType = {
  attachment: {
    type: string,
    payload: {
      template_type: string,
      text: ?string,
      buttons: Array<FbMessengerOutgoingButtonType>
    }
  }
};
export type FbMessengerOutgoingElementsType = {
  attachment: {
    type: string,
    payload: {
      template_type: string,
      elements: Array<FbMessengerOutgoingElementType>
    }
  }
};

export type FbMessengerOutgoingType = FbMessengerOutgoingStringType | FbMessengerOutgoingOptionType | FbMessengerOutgoingElementsType;

/* Options */
export type FbMessengerOptionsType = {
  verifyToken: string,
  pageAccessTokens: { [key: string ]: string },
  request: (opts: Object) => void,
  processIncomingMessages?: (msgs: Array<IncomingType>) => Array<IncomingType>,
  processOutgoingMessages?: (msgs: Array<OutgoingType>) => Array<OutgoingType>
}
