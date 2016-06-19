/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext } from "../../types";
import { verify, hook } from "./handlers";


function getMessageBatches(body: Object) : Array<{ object: Object, id: string, user_messages: {[key: string]: string}}> {
  let batches = [];
  if (body.entry) {
    for (let i=0; i<body.entry.length; i++) {
      let entry = body.entry[i];
      let userBatches = {}
      for (let j=0; j<entry.messaging.length; j++) {
        let message = entry.messaging[j];
        if (!(message.sender.id in userBatches)) {
          userBatches[message.sender.id] = [message];
        } else {
          userBatches[message.sender.id].push(message);
        }
      }
      batches.push({object: body.object, id: entry.id, user_messages: userBatches });
    }
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
    verify: async (ctx: HttpContext<Object>) => await verify(ctx, options),
    hook: async (ctx: HttpContext<FbIncomingBodyType>) => await hook(ctx, options, topicsHandler),
    getMessageBatches
  }
}
