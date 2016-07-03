/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext, FbMessageBatchItemType } from "../../types";

/*
  Returns a result batched by page-id, user-id
*/
function getMessageBatches(body: Object) : Array<FbMessengerBatchItemType> {
  const batches = {};

  for (let i = 0; i < body.entry.length; i++) {
    let entry = body.entry[i];
    let pageId = entry.id;

    batches[pageId] = batches[pageId] || {};

    if (entry.messaging) {
      for (let j = 0; j < entry.messaging.length; j++) {
        let message = entry.messaging[j];
        batches[pageId][message.sender.id] = batches[pageId][message.sender.id] || [];
        batches[pageId][message.sender.id].push(message);
      }
    }
  }
  return batches;
}

export default {
  getMessageBatches
}
