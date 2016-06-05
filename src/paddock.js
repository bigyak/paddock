/* @flow */
import type { TopicType, InitYakOptionsType } from "yak-ai-wild-yak/types";
import type { FbOptionsType, WebOptionsType } from "../types";
import { init as initYak } from "yak-ai-wild-yak";
import webAdapter from "./adapters/web";
import facebookAdapter from "./adapters/facebook";

export function init(topics: Array<TopicType>, options: InitYakOptionsType, adapterConfig: { facebook: FbOptionsType, web: WebOptionsType }) {
  const handler = initYak(topics, options);
  const web = adapterConfig.web ? webAdapter(adapterConfig.web, handler) : undefined;
  const facebook = adapterConfig.facebook ? facebookAdapter(adapterConfig.facebook, handler) : undefined;
  return { web, facebook };
}
