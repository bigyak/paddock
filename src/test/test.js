import __polyfill from "babel-polyfill";
import should from "should";
import { init } from "../paddock";
import getTopics from "./topics";

const simpleSession = {
  sessionId: "0xDEADBEEF",
  type: "simple"
};

const adapterConfig = {
  facebook: { verifyToken: "abcd", pageAccessToken: "xyz1" },
  simple: {}
};

function getSessionId(session) {
  return (session.type === "simple") ? session.sessionId :
    (session.type === "facebook") ? session.user.id :
    null;
}

function getSessionType(session) {
  return session.type;
}

describe("Paddock", () => {

  it("init() returns a handler", async () => {
    const { env, topics } = getTopics({ includeMain: true });
    const paddock = await init(topics, { getSessionId, getSessionType }, adapterConfig);
    paddock.should.not.be.empty();
    paddock.facebook.should.not.be.empty();
    paddock.simple.should.not.be.empty();
  });

  it("response to a message", async () => {
    const messages = [{ text: "Hello world" }];
    const { env, topics } = getTopics({ includeMain: true });
    const paddock = await init(topics, { getSessionId, getSessionType }, adapterConfig);
    const result = await paddock.simple.hook({ session: simpleSession, body: { messages } });
    result.messages[0].text.should.equal("hey, what's up!");
  });

});
