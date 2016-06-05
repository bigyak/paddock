/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/types";
import type { HttpContext, FbIncomingBodyType, FbOptionsType, FbIncomingMessageType } from "../../../types";

import { parseIncomingMessage, formatOutgoingMessage } from "./formatter";

export async function webhookHttpGet({ query }: HttpContext<Object>, options: FbOptionsType) {
  return (query['hub.verify_token'] === options.verifyToken) ?
    { text: query['hub.challenge'] } : { status: 500, messages: ['Error, wrong validation token'] }
}

export async function webhookHttpPost({ session, body }: HttpContext<FbIncomingBodyType>, options: FbOptionsType, topicsHandler: TopicsHandler) {
  const messagingEvents = body.entry[0].messaging;

  let eventsBySender: { [key: string]: Array<FbIncomingMessageType> }  = messagingEvents
    .filter(ev => ev.message)
    .reduce((acc, ev) => {
      acc[ev.sender.id] = acc[ev.sender.id] ? acc[ev.sender.id].concat(ev) : [ev];
      return acc;
    }, {});

  for (let sender in eventsBySender) {
    let incomingMessages = eventsBySender[sender].map(ev => parseIncomingMessage(ev));

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

    for (let _msg of outgoingMessages) {
      const outgoingMsg = formatOutgoingMessage(_msg);
      const requestOpts = {
        method: 'POST',
        qs: { access_token: options.pageAccessToken },
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        body: {
          recipient: { id: sender },
          message: outgoingMsg
        },
        json: true // Automatically stringifies the body to JSON
      };
      await options.request(requestOpts);
    }
  }



  return { status: 200 };
}
