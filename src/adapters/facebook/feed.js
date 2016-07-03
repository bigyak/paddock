/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";

function getPostId(pageId, postId) {
  return postId.split('_').length > 1 ? postId : pageId + '_' + postId;
}

function getConversationId(pageId, feedChange) {
  if (feedChange.item === 'comment') {
    const isReply = feedChange.parent_id.split('_')[0] !== pageId;
    const postId = isReply ? getPostId(pageId, feedChange.parent_id.split('_')[0]) : getPostId(pageId, feedChange.parent_id);
    return postId;
  }
  throw new Error("Invalid conversation id");
}

function getMessageBatches(body: Object) : Array<FbFeedBatchItemType> {
  const batches = {};

  for (let i = 0; i < body.entry.length; i++) {
    let entry = body.entry[i];
    let pageId = entry.id;

    batches[pageId] = batches[pageId] || {};

    if (entry.changes) {
      for (let k = 0; k < entry.changes.length; k++) {
        let change = entry.changes[k];
        if (
          change.value &&
          change.field === 'feed' &&
          change.value.sender_id &&
          change.value.item === 'comment' &&
          change.value.verb === 'add'
        ) {
          let senderId = `${change.value.sender_id}`);
          if (senderId && senderId !== pageId) {
            batches[pageId][senderId] = batches[pageId][senderId] || [];
            let conversationId = getConversationId(pageId, change.value);
            batches[pageId][senderId].push(change.value)
          }
        }
      }
    }
  }
  return batches;
}

export default {
  getMessageBatches
}
