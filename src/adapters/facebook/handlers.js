/* @flow */
import type { TopicsHandler, IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";
import type {
  HttpContext, FbIncomingBodyType, FbOptionsType, FbIncomingMessageType, FbMessengerIncomingType, FbIncomingFeedMessageType,
  FbMessengerOutgoingType, FbOutgoingFeedMessageType
} from "../../types";

import { parseIncomingMessage, formatOutgoingChatMessage, formatOutgoingFeedMessage } from "./formatter";

export async function verify({ query }: HttpContext<Object>, options: FbOptionsType) : Promise<{ status: number, text: any }> {
  return (query['hub.verify_token'] === options.verifyToken) ?
    { status: 200, text: query['hub.challenge'] } : { status: 500, text: 'Error, wrong validation token' }
}

async function sendChatResponse(session: Object, outgoingMsg: FbMessengerOutgoingType, options: FbOptionsType) {
  const requestOpts = {
    method: 'POST',
    qs: { access_token: options.pageAccessTokens[session.pageId] },
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    body: {
      recipient: { id: session.user.id },
      message: outgoingMsg
    },
    json: true // Automatically stringifies the body to JSON
  };
  console.log(JSON.stringify(requestOpts));
  try {
    console.log(await options.request(requestOpts));
  } catch(e){
    console.log("ERROR:", e);
    await options.request({
      method: 'POST',
      qs: { access_token: options.pageAccessTokens[session.pageId] },
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      body: {
        recipient: { id: session.user.id },
        message: {"text":"we had an unknown error.. please start again."}
      },
      json: true // Automatically stringifies the body to JSON
    });
  }
}

async function sendFeedResponse(postToObjectId: string, session: Object, outgoingMsg: FbOutgoingFeedMessageType, options: FbOptionsType) {
  const requestOpts = {
    method: 'POST',
    qs: { access_token: options.pageAccessTokens[session.pageId] },
    uri: 'https://graph.facebook.com/v2.6/' + postToObjectId + '/comments',
    body: {
      message: outgoingMsg
    },
    json: true // Automatically stringifies the body to JSON
  };
  console.log(JSON.stringify(requestOpts));
  try {
    console.log(await options.request(requestOpts));
  } catch(e){
    console.log("ERROR:", e);
  }
}

export async function hook(
  conversationId: string,
  conversationType: string,
  { session, body }: HttpContext<FbIncomingBodyType>,
  options: FbOptionsType,
  topicsHandler: TopicsHandler
) {
  let validEvents = body.filter((ev: any) =>
    (conversationType === "messaging") ? (ev.message || ev.postback) : (ev => ev.item && ev.sender_id)
  );

  let incomingMessages: Array<IncomingMessageType> = [];
  for (let i = 0; i < validEvents.length; i++) {
    const message: ?IncomingMessageType = await parseIncomingMessage(session.pageId, conversationType, validEvents[i], options);
    if (message) {
      incomingMessages.push(message);
    }
  }

  if (options.processIncomingMessages) {
    incomingMessages = options.processIncomingMessages(incomingMessages);
  }

  let outgoingMessages: Array<OutgoingMessageType> = [];
  for (let message of incomingMessages) {
    const outgoing: OutgoingMessageType | Array<OutgoingMessageType> = await topicsHandler(conversationId, conversationType, session, message);
    outgoingMessages = outgoingMessages.concat(outgoing);
  }

  if (options.processOutgoingMessages) {
    outgoingMessages = options.processOutgoingMessages(outgoingMessages);
  }

  for(let message of outgoingMessages) {
    if (conversationType === 'messaging') {
      const outgoingMsg: ?FbMessengerOutgoingType = formatOutgoingChatMessage(session.pageId, message);
      if (outgoingMsg) {
        await sendChatResponse(session, outgoingMsg, options);
      }
    } else if (conversationType === 'feed') {
      const outgoingMsg: ?FbOutgoingFeedMessageType = formatOutgoingFeedMessage(session.pageId, message)
      if (outgoingMsg) {
        let postToObjectId = outgoingMsg.parent_id.split('_')[0] !== session.pageId ? outgoingMsg.parent_id : outgoingMsg.comment_id;
        await sendFeedResponse(postToObjectId, session, outgoingMsg, options);
      }
    }
  }

  return { status: 200 };
}
