/* @flow */
import type { IncomingMessageType, OutgoingMessageType } from "yak-ai-wild-yak/dist/types";
import type { FbIncomingMessageType, FbOutgoingMessageType, FbIncomingStringMessageType } from "../../types";

export function parseIncomingMessage(incoming: FbIncomingMessageType) : IncomingMessageType {
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

function formatButtons(optionValues) {
  let buttons = [];
  for (let i=0; i<optionValues.length; i++) {
    let val = optionValues[i];
    if (typeof(val) == 'string') {
      buttons.push({ "type":"postback", "title":val, "payload":val });
    } else if (typeof(val) == 'object') {
      buttons.push({ "type":"web_url", "url":val.url, "title":val.text });
    }
  }
  return buttons;
}

function formatElements(elements) {
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

export function formatOutgoingMessage(message: OutgoingMessageType) : FbOutgoingMessageType {
  switch(message.type) {
    case "string":
      return { text: message.text };
      break;
    case "options":
      return {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text": message.text ? message.text : null,
            "buttons": formatButtons(message.values)
          }
        }
      };
      break;
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
      break;
    default:
      return {"text": "hello world!"};
  }
}
