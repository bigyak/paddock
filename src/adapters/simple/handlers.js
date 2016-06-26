/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { HttpContext, SimpleIncomingBodyType, SimpleOptionsType } from "../../types";

import { parseIncomingMessage, formatOutgoingMessage } from "./formatter";

export async function hook(conversationId, conversationType, { session, body }: HttpContext<SimpleIncomingBodyType>, options: SimpleOptionsType, topicsHandler: TopicsHandler) {
  let incomingMessages = body.messages.map(m => parseIncomingMessage(m));

  if (options.processIncomingMessages) {
    incomingMessages = options.processIncomingMessages(incomingMessages);
  }

  let outgoingMessages = [];
  for (let _msg of incomingMessages) {
    outgoingMessages = outgoingMessages.concat(await topicsHandler(conversationId, conversationType, session, _msg));
  }

  if (options.processOutgoingMessages) {
    outgoingMessages = options.processOutgoingMessages(outgoingMessages);
  }

  return {
    status: 200,
    messages: outgoingMessages.map(m => formatOutgoingMessage(m))
  }
}
