<script>
	import {
		selection,
		range,
		highlightedDocument,
		selectedHighlight,
		quoteEvents
	} from '$lib/store';
	import { user } from '$lib/user';
	import Comment from '$lib/Comment.svelte';

	import { publishHighlight, publishComment } from '$lib/publish';
	let context = '';
	let inputUserThoughts = '';

	$: if ($range?.commonAncestorContainer?.textContent && $selection.toString().length) {
		try {
			const content = $range.commonAncestorContainer.textContent;
			// we need to escape parantetheses in regexes
			// TODO still the smartest way to do?
			const escapedText = $selection.toString().replace(/[()-\*]/g, '\\$&');
			const regex = new RegExp(escapedText, 'gi'); // 'gi' for global and case-insensitive search
			const matches = $range.commonAncestorContainer.textContent.match(regex);
			if (matches) {
				// Wrap matching text with <mark> elements
				context = content.replace(regex, (match) => {
					return `<mark>${match}</mark>`;
				});
			} else {
				context = '';
			}
		} catch (e) {
			// console.error(e);
			context = '';
		}
	}

	function embedInContext(highlightEvent) {
		const context = highlightEvent.tags.find((t) => t[0] === 'context')[1];
		const highlightContent = new RegExp(highlightEvent.content);
		const embedded = context.replace(highlightContent, (match) => {
			return `<mark>${match}</mark>`;
		});
		return embedded;
	}

	async function handleSave() {
		let highlightEvent;
		if ($selection.focusNode) {
			highlightEvent = await publishHighlight($selection, context, $highlightedDocument.url);
		}
		if (inputUserThoughts) {
			const eventId = highlightEvent ? highlightEvent.id : $selectedHighlight.id;
			await publishComment(eventId, inputUserThoughts);
		}
		// reload events?
	}
</script>

{#if $selection.focusNode || $selectedHighlight.id}
	<div id="selectionView" class="relative">
		<div class="border border-white p-5 rounded-xl fixed w-1/3 mx-4">
			<div class="w-full flex flex-col gap-2">
				{#if $selection.focusNode}
					<p class="overflow-auto max-h-96">{@html context}</p>
				{:else if $selectedHighlight.id !== undefined}
					<p>{@html embedInContext($selectedHighlight)}</p>
				{/if}
				<textarea
					bind:value={inputUserThoughts}
					placeholder="Was meinst du dazu?"
					class="block textarea textarea-bordered textarea-lg w-full"
				/>
				<div>
					<button disabled={!$user.pk} on:click={handleSave} class="btn">Save</button>
					<button
						on:click={() => {
							selectedHighlight.set({});
							selection.set({});
						}}
						class="btn">Cancel</button
					>
				</div>
			</div>
			<div class="my-3">
				{#each $quoteEvents as quoteEvent}
					<Comment {quoteEvent} />
				{/each}
			</div>
		</div>
	</div>
{/if}
