/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext } from "../../types";
import { verify, hook } from "./handlers";
import deepmerge from "../../vendor/deepmerge";

function getPostId(pageId, postId) {
  return postId.split('_').length > 1 ? postId : pageId + '_' + postId;
}

function getConversationId(pageId, feedChange) {
  if (feedChange.item === 'comment') {
    const isReply = feedChange['parent_id'].split('_')[0] !== pageId;
    const postId = isReply ? getPostId(pageId, feedChange['parent_id'].split('_')[0]) : getPostId(pageId, feedChange['parent_id']);
    return postId;
  }
  throw new Error("Invalid conversation id");
}


function addToBatch(userBatches, senderId: string, conversationType: string, conversationId: string, entry: Object) {
  deepmerge(userBatches, { [senderId]: { [conversationType]: { [conversationId]: [entry] } } });
}

type MessageBatchItem = {
  object: Object,
  pageId: string,
  userBatches: { [key: string]: { [ key: string]: { [ key: string ]: Array<Object> } } }
}

function getMessageBatches(body: Object) : Array<MessageBatchItem> {
  let batches = [];
  if (body.entry) {
    for (let i=0; i<body.entry.length; i++) {
      let entry = body.entry[i];
      let pageId = entry.id;
      let userBatches = {};
      if (entry.messaging) {
        for (let j=0; j<entry.messaging.length; j++) {
          let message = entry.messaging[j];
          addToBatch(userBatches, message.sender.id, pageId, "messaging", message);
        }
      }
      if (entry.changes) {
        for (let k=0; k<entry.changes.length; k++) {
          let change = entry.changes[k];
          if (change.value && change.field === 'feed' && change.value.sender_id
            && change.value.item === 'comment' && change.value.verb === 'add') {
            let senderId = String(change.value.sender_id);
            if (senderId && senderId !== pageId) {
              let conversationId = getConversationId(pageId, change.value);
              addToBatch(userBatches, senderId, conversationId, "feed", change.value);
            }
          }
        }
      }
      batches.push({ object: body.object, pageId, userBatches });
    }
  }
  return batches;
}

export default function(options: FbOptionsType, topicsHandler: TopicsHandler) {
  if (!options.verifyToken) {
    throw new Error("verifyToken was empty.")
  }
  if (!options.pageAccessTokens) {
    throw new Error("pageAccessTokens were empty.")
  }
  return {
    verify: async (ctx: HttpContext<Object>) => await verify(ctx, options),
    hook: async (conversationId: string, conversationType: string, ctx: HttpContext<FbIncomingBodyType>) => await hook(conversationId, conversationType, ctx, options, topicsHandler),
    getMessageBatches
  }
}
