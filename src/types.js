/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";
export type HttpContext<TBody> = { query: { [key: string]: string }, body: TBody, session: Object }
