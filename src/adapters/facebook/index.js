/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext, FbMessageBatchItemType } from "../../types";

import deepmerge from "../../vendor/deepmerge";

import { verify, hook } from "./handlers";
import messenger from "./messenger";
import feed from "./feed";

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
    messenger,
    feed
  }
}
