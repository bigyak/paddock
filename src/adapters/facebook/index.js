/* @flow */
import type { TopicsHandler } from "yak-ai-wild-yak/types";
import type { FbOptionsType, FbIncomingBodyType, HttpContext } from "../../../types";
import { webhookHttpGet, webhookHttpPost } from "./handlers";

export default function(options: FbOptionsType, topicsHandler: TopicsHandler) {
  if (!options.verifyToken) {
    throw new Error("verifyToken was empty.")
  }
  if (!options.pageAccessToken) {
    throw new Error("pageAccessToken was empty.")
  }
  return {
    webhookHttpGet: async (ctx: HttpContext<Object>) => await webhookHttpGet(ctx, options),
    webhookHttpPost: async (ctx: HttpContext<FbIncomingBodyType>) => await webhookHttpPost(ctx, options, topicsHandler)
  }
}
