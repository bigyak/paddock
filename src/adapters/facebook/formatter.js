/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "wild-yak/dist/types";
import type { FbIncomingMessageType, FbOutgoingMessageType, FbIncomingStringMessageType, FbOutgoingMessageButtonType, FbOutgoingElementType } from "../../types";

function async getObjectInfo(pageId, objectId, fields, options) {
  return await options.request({
    qs: { fields, access_token: options.pageAccessTokens.pageId },
    uri: 'https://graph.facebook.com/v2.6/' + objectId,
    json: true // Automatically stringifies the body to JSON
  });
}

export async function parseIncomingMessage(pageId: string, conversationType: string, incoming: FbIncomingMessageType, options: FbOptionsType) : Promise<IncomingMessageType> {
  if (conversationType == 'messaging') {
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
  } else if (conversationType == 'feed') {
    if (incoming.item === 'comment') {
      const fields = 'id,from,message,created_time';
      const fbComment = getObjectInfo(pageId, incoming.comment_id, fields, options);
      return {
        type: "string",
        timestamp: incoming.created_time,
        text: fbComment.message,
        sender: fbComment.from.name
      }
    }
  }
}

function formatButtons(optionValues: Array<string>) : Array<FbOutgoingMessageButtonType> {
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

function formatElements(elements: Array<{ title: string, subtitle: string, image_url: string, options: Array<string>}>) : Array<FbOutgoingElementType> {
  let formattedElements = [];
  for (let i=0; i<elements.length; i++) {
    formattedElements.push({
      title: elements[i].title,
      subtitle: elements[i].subtitle,
      image_url: elements[i].image_url,
      buttons: formatButtons(elements[i].options)
    })
  }
  return formattedElements;
}

export function formatOutgoingMessage(pageId: string, conversationType: string, message: OutgoingMessageType) : FbOutgoingMessageType {
  if (conversationType === 'messaging') {
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
              "buttons": formatButtons(message.values)
            }
          }
        };
      case "elements":
        return {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements": formatElements(message.values)
            }
          }
        };
      default:
        return {"text": "hello world!"};
    }
  } else if (conversationType === 'feed') {
    switch(message.type) {
      case "string":
        return message.text;
  }
}
