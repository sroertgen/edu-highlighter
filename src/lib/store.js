import { writable } from "svelte/store"

export const searchInput = writable("")

export const selection = writable({})
export const range = writable({})

export const highlightedDocument = writable({
  url: "https://www.e-teaching.org/praxis/hybride-lernraeume/asynchron-hybride-vorlesung"
})
