import { get } from "svelte/store";
import { ndkStore } from "$lib/ndk";
import { user as userStore } from "$lib/user";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

function createHighlightEvent(ndk, selection, context, url) {
  const event = new NDKEvent(ndk);
  event.kind = 9802;
  event.content = selection.toString();
  event.tags = [
    ['r', url],
    // ['p', userHex, ] --> tag original author
    ['context', context]
  ];
  console.log("highlightEvent", event);
  return event
}

function createQuoteEvent(ndk, highlightEventId, userInput) {
  const event = new NDKEvent(ndk);
  event.kind = 1;
  event.content = `nostr:${nip19.noteEncode(highlightEventId)}\n ${userInput}`;
  event.tags = [
    [
      "q",
      highlightEventId,
      "quote"
    ],
    [
      "k",
      "9802"
    ],
    [
      "e",
      highlightEventId
    ]
  ];
  console.log("quoteEvent", event);
  return event
}
// selection
// context
// url
// userInput
// (labels)?
export async function publishHighlight(selection, context, url) {
  const ndk = get(ndkStore)
  const user = get(userStore)
  ndk.signer = user.signer;
  user.signer.user().then(async (user) => {
    if (!!user.npub) {
      console.log("Permission granted to read their public key:", user.npub);
    }
  });
  const highlightEvent = createHighlightEvent(ndk, selection, context, url)
  // await event.publish();
  // TODO publish another event with the content of the userInput
  return highlightEvent
}

export async function publishComment(eventId, userInput) {
  const ndk = get(ndkStore)
  const user = get(userStore)
  ndk.signer = user.signer;
  user.signer.user().then(async (user) => {
    if (!!user.npub) {
      console.log("Permission granted to read their public key:", user.npub);
    }
  });
  const quoteEvent = createQuoteEvent(ndk, eventId, userInput)
  await quoteEvent.publish();
  return quoteEvent

}
