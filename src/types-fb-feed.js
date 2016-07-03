/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";

/* Incoming */
export type FbIncomingFeedStringMessageType = {
  created_time: number,
  item: string,
  sender_id: string,
  comment_id: string
}
export type FbIncomingFeedMessageType = FbIncomingFeedStringMessageType;

/* FB All types */
export type FbIncomingMessageType = FbMessengerIncomingType | FbIncomingFeedMessageType;
export type FbIncomingBodyType = Array<FbIncomingMessageType>

/* Fb Comment Object */
export type FbCommentObjectType = {
  message: string,
  from: {
    name: string
  }
}

/* Outgoing */
export type FbOutgoingFeedStringMessageType = { text: string };

/* Options */
export type FbFeedOptionsType = {
  verifyToken: string,
  pageAccessTokens: { [key: string ]: string },
  request: (opts: Object) => void,
  processIncomingMessages?: (msgs: Array<IncomingType>) => Array<IncomingType>,
  processOutgoingMessages?: (msgs: Array<OutgoingType>) => Array<OutgoingType>
}
