/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/dist/types";
import type { WebOptionsType, WebIncomingBodyType, HttpContext } from "../../types";
import { hook } from "./handlers";

export default function(options: WebOptionsType, topicsHandler: TopicsHandler) {
  return {
    hook: async (ctx: HttpContext<WebIncomingBodyType>) => await hook(ctx, options, topicsHandler)
  }
}
