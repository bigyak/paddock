/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { HttpContext, FbIncomingBodyType, FbOptionsType, FbIncomingMessageType, FbChatIncomingMessageType, FbFeedIncomingMessageType } from "../../types";

import { parseIncomingMessage, formatOutgoingMessage } from "./formatter";

export async function verify({ query }: HttpContext<Object>, options: FbOptionsType) : Promise<{ status: number, text: any }> {
  return (query['hub.verify_token'] === options.verifyToken) ?
    { status: 200, text: query['hub.challenge'] } : { status: 500, text: 'Error, wrong validation token' }
}

async function sendMessageResponse(session, outgoingMsg, options) {
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

async function sendFeedResponse(postToObjectId, session, outgoingMsg, options) {
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

  let incomingMessages = [];
  for (let i = 0; i < validEvents.length; i++) {
    const _msg = await parseIncomingMessage(session.pageId, conversationType, validEvents[i], options);
    if (_msg) {
      incomingMessages.push();
    }
  }

  if (options.processIncomingMessages) {
    incomingMessages = options.processIncomingMessages(incomingMessages);
  }

  let outgoingMessages = [];
  for (let _msg of incomingMessages) {
    if (_msg) {
      outgoingMessages = outgoingMessages.concat(await topicsHandler(conversationId, conversationType, session, _msg));
    }
  }

  if (options.processOutgoingMessages) {
    for (let _msg of outgoingMessages) {
      outgoingMessages = options.processOutgoingMessages(_msg);
    }
  }

  for(let _msg of outgoingMessages) {
    let postToObjectId = validEvents[_idx].parent_id.split('_')[0] !== session.pageId ? validEvents[_idx].parent_id : validEvents[_idx].comment_id;
    for (let _msg of outgoingMessages[_idx]) {
      const outgoingMsg = formatOutgoingMessage(session.pageId, conversationType, _msg);
      if (conversationType == 'messaging') {
        await sendMessageResponse(session, outgoingMsg, options);
      } else if (conversationType == 'feed') {
        await sendFeedResponse(postToObjectId, session, outgoingMsg, options);
      }
    }
  }

  return { status: 200 };
}
