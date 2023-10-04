<script>
	import { onMount } from 'svelte';
	import { Readability, isProbablyReaderable } from '@mozilla/readability';
	import { parseHTML } from 'linkedom';
	import { ndkStore } from '$lib/ndk';
	import { selection, range } from '$lib/store';

	onMount(() => {
		// Once the component is mounted, we can access the document:
		document.addEventListener(`selectionchange`, () => {
			// const div = document.querySelector('*');
			const selected = window.getSelection();
			selection.set(selected);
			console.log($selection);
			range.set($selection.getRangeAt(0));
			console.log('range', $range);
		});
	});

	function escape(regex) {
		return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
	}
	/**
	 * @param {DOM} innerHTML
	 * @param {NDKHighlight} highlightEvent
	 * @returns {DOM}
	 */
	function addHighlights(innerHTML, highlightEvent) {
		// TODO improve with pablos approach in "MarkedContent.svelte"
		const words = highlightEvent.content.split(/[ ]+/).filter((w) => w.length > 0);
		// find the first word
		const N = 3;
		const firstNWords = words.slice(0, N);
		const lastNWords = words.slice(-N);

		// Remove non-alphanumeric characters
		const sanitizeWord = (w) => w.replace(/[^a-zA-Z0-9]/g, '.*');
		const firstNWordsSanitized = firstNWords.map(sanitizeWord);
		const lastNWordsSanitized = lastNWords.map(sanitizeWord);
		// Create a regex pattern that matches the first and last N words with any characters in between
		const pattern = firstNWordsSanitized.join(' ') + '[^]*?' + lastNWordsSanitized.join('[^]*?');

		// Create a RegExp object from the pattern
		console.log({ pattern });
		// create a pattern that includes everything in between

		const escapedContent = escape(highlightEvent.content);
		const regex = new RegExp(escapedContent, 'gi'); // 'gi' for global and case-insensitive search
		const matches = innerHTML.match(regex);
		if (matches) {
			console.log(matches);
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
	async function loadArticle() {
		const url = 'https://www.e-teaching.org/praxis/hybride-lernraeume/asynchron-hybride-vorlesung';
		const res = await fetch(url);
		const html = await res.text();
		const { document } = parseHTML(html);

		// Check if the content is suitable for Readability
		if (!isProbablyReaderable(document)) {
			throw new Error('The page is not reader-friendly.');
		}

		let reader = new Readability(document);
		let article = reader.parse();

		return article;
	}

	async function loadHighlights() {
		const filter = {
			kinds: [9802],
			'#r': ['https://www.e-teaching.org/praxis/hybride-lernraeume/asynchron-hybride-vorlesung']
		};
		const events = await $ndkStore.fetchEvents(filter);
		console.log('highlight events', events);
		return Array.from(events);
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

	async function loadHighlightedArticle() {
		const article = await loadArticle();
		const highlightEvents = await loadHighlights();
		// get the innerHTMLContent
		const docInnerHTML = article.content;
		const highlightedHTML = setHighlightsInHTML(docInnerHTML, highlightEvents);
		const highlightedDom = parseHTML(highlightedHTML);
		return highlightedDom;
	}
	function handleClick(e) {
		console.log('click event', e);
	}
</script>

<div class="border border-white">
	{#await loadHighlightedArticle() then article}
		<!-- catch error if article is not reader friendly -->
		<div on:click={handleClick} class="selection:bg-yellow-500 selection:text-black">
			{@html article.document}
		</div>
	{/await}
</div>

<style lang="postcss">
	:global(h1, h2) {
		font-weight: 800;
		font-size: 1.75rem;
		font-family: Montserrat, sans-serif;
		margin-top: 1.5rem;
	}
</style>
