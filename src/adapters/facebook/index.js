/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/dist/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext } from "../../types";
import { webhookHttpGet, webhookHttpPost } from "./handlers";


function getMessageBatches(payload) {
  let batches = [];
  for (let i=0; i<payload.entry.length; i++) {
    let entry = payload.entry[i];
    let userBatches = {}
    for (let j=0; j<entry.messaging.length; j++) {
      let message = entry.messaging[j];
      if (!(message.sender.id in userBatches)) {
        userBatches[message.sender.id] = [message];
      } else {
        userBatches[message.sender.id].push(message);
      }
    }
    batches.push({object: payload.object, id:entry['id'], user_messages: userBatches });
  }
  return batches;
}

export default function(options: FbOptionsType, topicsHandler: TopicsHandler) {
  if (!options.verifyToken) {
    throw new Error("verifyToken was empty.")
  }
  if (!options.pageAccessToken) {
    throw new Error("pageAccessToken was empty.")
  }
  return {
    webhookHttpGet: async (ctx: HttpContext<Object>) => await webhookHttpGet(ctx, options),
    webhookHttpPost: async (ctx: HttpContext<FbIncomingBodyType>) => await webhookHttpPost(ctx, options, topicsHandler),
    getMessageBatches
  }
}
