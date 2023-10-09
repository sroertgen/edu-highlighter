import { writable } from "svelte/store"

export const searchInput = writable("")

export const selection = writable({})
export const range = writable({})

export const highlightedDocument = writable({
  url: "",
})


export const highlightEvents = writable([])
export const quoteEvents = writable([])
export const selectedHighlight = writable({})
