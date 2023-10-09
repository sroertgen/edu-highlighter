<script>
	import { onMount } from 'svelte';
	import { Readability, isProbablyReaderable } from '@mozilla/readability';
	import { parseHTML } from 'linkedom';
	import { ndkStore } from '$lib/ndk';
	import {
		selection,
		range,
		highlightEvents,
		quoteEvents,
		selectedHighlight,
		searchInput
	} from '$lib/store';

	export let htmlText;
	export let url;
	$: console.log($selectedHighlight);
	$: console.log($searchInput);

	onMount(() => {
		// Once the component is mounted, we can access the document:
		document.addEventListener(`selectionchange`, () => {
			const selected = window.getSelection();
			if (selected?.toString().length) {
				selection.set(selected);
				range.set($selection.getRangeAt(0));
			}
		});
	});

	/**
	 * @param {DOM} innerHTML
	 * @param {NDKHighlight} highlightEvent
	 * @returns {DOM}
	 */
	function addHighlights(innerHTML, highlightEvent) {
		// if (highlightEvent.content.startsWith('vom')) {
		// 	console.log('skipping');
		// 	return innerHTML;
		// }
		const words = highlightEvent.content.split(/[ ]+/).filter((w) => w.length > 0);
		const regex = new RegExp(words.join('(\\s*<[\\w\\s=":\\/\\.-]*>| )+'));
		const matches = innerHTML.match(regex);
		if (matches) {
			// Wrap matching text with <mark> elements
			innerHTML = innerHTML.replace(regex, (match) => {
				return `<mark id=${highlightEvent.id} data-highlight-id="${highlightEvent.id}">${match}</mark>`;
			});
		}
		return innerHTML;
	}

	/**
	 * @returns {ArticleObject}
	 */
	async function loadArticle(htmlText) {
		const { document } = parseHTML(htmlText);

		// Check if the content is suitable for Readability
		if (!isProbablyReaderable(document)) {
			throw new Error('The page is not reader-friendly.');
		}

		let reader = new Readability(document);
		let article = reader.parse();

		return article;
	}

	async function loadHighlights() {
		const highlightsFilter = {
			kinds: [9802],
			'#r': [url]
		};
		const hEvents = await $ndkStore.fetchEvents(highlightsFilter);
		highlightEvents.set(Array.from(hEvents));
		console.log('highlight events', $highlightEvents);

		const eventIds = $highlightEvents.map((h) => h.id);
		const quotesFilter = {
			kinds: [1],
			'#q': [...eventIds]
		};
		const qEvents = await $ndkStore.fetchEvents(quotesFilter);
		quoteEvents.set(Array.from(qEvents));
		console.log('qEvents', qEvents);
	}

	/**
	 * @param
	 * @param {NDKHighlight[]} highlightEvents
	 * @returns {string} - highlightedHTML
	 */
	function setHighlightsInHTML(innerHTML, highlightEvents) {
		let highlightedHTML = innerHTML;
		for (const e of highlightEvents) {
			highlightedHTML = addHighlights(highlightedHTML, e);
		}
		return highlightedHTML;
	}

	async function loadHighlightedArticle(htmlText) {
		const { title, content } = await loadArticle(htmlText);
		await loadHighlights();
		// get the innerHTMLContent
		const docInnerHTML = content;
		const highlightedHTML = setHighlightsInHTML(docInnerHTML, $highlightEvents);
		const highlightedDom = parseHTML(highlightedHTML);
		return { ...highlightedDom, title };
	}
	function handleClick(e) {
		if (e.target.dataset.highlightId) {
			selectedHighlight.set($highlightEvents.find((h) => h.id === e.target.dataset.highlightId));
		}
	}
</script>

<div id="article" class="border border-white rounded-xl p-4">
	{#await loadHighlightedArticle(htmlText) then article}
		<h1>{article.title}</h1>
		<!-- catch error if article is not reader friendly -->
		<div on:click={handleClick} class="selection:bg-orange-400 selection:text-slate-800">
			{@html article.document}
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>

<style lang="postcss">
	:global(#article h1, #article h2) {
		font-weight: 800;
		font-size: 1.75rem;
		font-family: Montserrat, sans-serif;
		margin-top: 1.5rem;
	}
	:global(#article a) {
		text-decoration: underline;
		font-weight: bold;
	}
	:global(#article mark, #selectionView mark) {
		background-color: #fb923c;
		color: #1e293b;
	}
	:global(#article mark:hover) {
		background-color: #ea580c;
		cursor: pointer;
	}
</style>
