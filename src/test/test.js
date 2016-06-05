import __polyfill from "babel-polyfill";
import should from "should";
import { init } from "../paddock";
import getTopics from "./topics";

const webSession = {
  sessionId: "0xDEADBEEF",
  type: "web"
};

const adapterConfig = {
  facebook: { verifyToken: "abcd", pageAccessToken: "xyz1" },
  web: {}
};

function getSessionId(session) {
  return (session.type === "web") ? session.sessionId :
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
    paddock.web.should.not.be.empty();
  });

  it("response to a message", async () => {
    const messages = [{ text: "Hello world" }];
    const { env, topics } = getTopics({ includeMain: true });
    const paddock = await init(topics, { getSessionId, getSessionType }, adapterConfig);
    const result = await paddock.web.webhookHttpPost({ session: webSession, body: { messages } });
    result.messages[0].should.equal("hey, what's up!");
  });

});
