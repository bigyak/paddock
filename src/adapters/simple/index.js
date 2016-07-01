/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { SimpleOptionsType, SimpleIncomingBodyType, HttpContext } from "../../types";
import { hook } from "./handlers";

export default function(options: SimpleOptionsType, topicsHandler: TopicsHandler) {
  return {
    hook: async (conversationId: string, conversationType: string, ctx: HttpContext<SimpleIncomingBodyType>) => await hook(conversationId, conversationType, ctx, options, topicsHandler)
  }
}
