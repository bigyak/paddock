/* @flow */
import type { TopicType, InitYakOptionsType } from "wild-yak/dist/types";
import type { FbOptionsType, SimpleOptionsType } from "./types";
import { init as initYak } from "wild-yak";
import simpleAdapter from "./adapters/simple";
import facebookAdapter from "./adapters/facebook";

export function init(topics: Array<TopicType>, options: InitYakOptionsType, adapterConfig: { facebook: FbOptionsType, simple: SimpleOptionsType }) {
  const handler = initYak(topics, options);
  const simple = adapterConfig.simple ? simpleAdapter(adapterConfig.simple, handler) : undefined;
  const facebook = adapterConfig.facebook ? facebookAdapter(adapterConfig.facebook, handler) : undefined;
  return { simple, facebook };
}
