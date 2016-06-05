/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/types";
import type { HttpContext, WebIncomingBodyType, WebOptionsType } from "../../../types";

import { parseIncomingMessage, formatOutgoingMessage } from "./formatter";

export async function webhookHttpPost({ session, body }: HttpContext<WebIncomingBodyType>, options: WebOptionsType, topicsHandler: TopicsHandler) {
  let incomingMessages = body.messages.map(m => parseIncomingMessage(m));

  if (options.processIncomingMessages) {
    incomingMessages = options.processIncomingMessages(incomingMessages);
  }

  let outgoingMessages = [];
  for (let _msg of incomingMessages) {
    outgoingMessages = outgoingMessages.concat(await topicsHandler(session, _msg));
  }

  if (options.processOutgoingMessages) {
    outgoingMessages = options.processOutgoingMessages(outgoingMessages);
  }

  return {
    status: 200,
    messages: outgoingMessages.map(m => formatOutgoingMessage(m))
  }
}
