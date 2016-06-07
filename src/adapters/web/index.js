/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/types";
import type { WebOptionsType, WebIncomingBodyType, HttpContext } from "../../types";
import { webhookHttpPost } from "./handlers";

export default function(options: WebOptionsType, topicsHandler: TopicsHandler) {
  return {
    webhookHttpPost: async (ctx: HttpContext<WebIncomingBodyType>) => await webhookHttpPost(ctx, options, topicsHandler)
  }
}
