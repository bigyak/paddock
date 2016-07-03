/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";
import type {
  FbOptionsType, FbMessengerIncomingType, FbIncomingFeedMessageType, FbIncomingMessageType,
  FbMessengerOutgoingType, FbMessengerOutgoingButtonType, FbOutgoingMessengerElementType, FbOutgoingFeedMessageType, FbCommentObjectType
} from "../../types";

async function getObjectInfo(pageId: string, objectId: string, fields: string, options: Object) {
  return await options.request({
    qs: { fields, access_token: options.pageAccessTokens[pageId] },
    uri: 'https://graph.facebook.com/v2.6/' + objectId,
    json: true // Automatically stringifies the body to JSON
  });
}

export async function parseIncomingMessage(
  pageId: string,
  conversationType: string,
  incoming: FbIncomingMessageType,
  options: FbOptionsType
) : Promise<?IncomingMessageType> {
  if (conversationType == 'messaging') {
    const _incoming: any = incoming;
    return parseIncomingChatMessage(pageId, _incoming, options);
  } else if (conversationType == 'feed') {
    const _incoming: any = incoming;
    return parseIncomingFeedMessage(pageId, _incoming, options);
  }
  throw new Error("Unknown conversationType");
}

async function parseIncomingChatMessage(
  pageId: string,
  incoming: FbMessengerIncomingType,
  options: FbOptionsType
) : Promise<?IncomingMessageType> {
  if (incoming.message && incoming.message.text) {
    return {
      type: "string",
      timestamp: incoming.timestamp,
      text: incoming.message.text
    }
  } else if (incoming.postback) {
    return {
      type: "string",
      timestamp: incoming.timestamp,
      text: incoming.postback.payload
    }
  } else {
    return {
      type: "string",
      timestamp: incoming.timestamp,
      text: "unknown message type"
    }
  }
}

async function parseIncomingFeedMessage(
  pageId: string,
  incoming: FbIncomingFeedMessageType,
  options: FbOptionsType
) : Promise<?IncomingMessageType> {
  if (incoming.item === 'comment') {
    const fields = 'id,from,message,created_time';
    const fbComment = await getObjectInfo(pageId, incoming.comment_id, fields, options);
    return {
      type: "string",
      timestamp: incoming.created_time,
      text: fbComment.message,
      text: 'Price please',//fbComment.message,
      sender: fbComment.from.name
    }
  }
}

function formatChatButtons(optionValues: Array<string>) : Array<FbMessengerOutgoingButtonType> {
  let buttons = [];
  for (let i=0; i<optionValues.length; i++) {
    let val = optionValues[i];
    if (typeof(val) == 'string') {
      buttons.push({ "type": "postback", "title":val, "payload":val });
    } else if (typeof(val) == 'object') {
      buttons.push({ "type":"web_url", "url": val.url, "title": val.text });
    }
  }
  return buttons;
}

function formatChatElements(elements: Array<{ title: string, subtitle: string, image_url: string, options: Array<string>}>) : Array<FbOutgoingMessengerElementType> {
  let formattedElements = [];
  for (let i=0; i<elements.length; i++) {
    formattedElements.push({
      title: elements[i].title,
      subtitle: elements[i].subtitle,
      image_url: elements[i].image_url,
      buttons: formatChatButtons(elements[i].options)
    })
  }
  return formattedElements;
}

export function formatOutgoingChatMessage(pageId: string, message: OutgoingMessageType) : ?FbMessengerOutgoingType {
  if (typeof message === "string") {
    return { text: message };
  } else {
    switch(message.type) {
      case "string":
        return { text: message.text };
      case "options":
        return {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type": "button",
              "text": message.text ? message.text : null,
              "buttons": formatChatButtons(message.values)
            }
          }
        };
      case "elements":
        return {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements": formatChatElements(message.values)
            }
          }
        };
      default:
        return {"text": "hello world!"};
    }
  }
}


export function formatOutgoingFeedMessage(pageId: string, message: OutgoingMessageType) : ?FbOutgoingFeedMessageType {
  if (typeof message === "string") {
    return { text: message };
  } else {
    switch(message.type) {
      case "string":
        return { text: message.text };
    }
  }
}
