/* @flow */
import type { TopicsHandler } from "wild-yak/dist/types";
import type { SimpleOptionsType, SimpleIncomingBodyType, HttpContext } from "../../types";
import { hook } from "./handlers";

export default function(options: SimpleOptionsType, topicsHandler: TopicsHandler) {
  return {
    hook: async (ctx: HttpContext<SimpleIncomingBodyType>) => await hook(ctx, options, topicsHandler)
  }
}
