<script>
	import { selection, range, highlightedDocument } from '$lib/store';
	import { ndkStore } from '$lib/ndk';
	import { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';

	let context = '';

	$: if ($range?.commonAncestorContainer?.textContent && $selection.toString().length) {
		try {
			// remove from content breaklines and other control characters
			const content = $range.commonAncestorContainer.innerText.replace(/[\n\r\t]/g, ' ');
			// we need to escape parantetheses in regexes
			// console.log('content', content);
			const escapedText = $selection.toString().replace(/[()-\*]/g, '\\$&');
			console.log('escapedtext', escapedText);
			console.log('content', content);
			const regex = new RegExp(escapedText, 'gi'); // 'gi' for global and case-insensitive search
			const matches = $range.commonAncestorContainer.innerText.match(regex);
			if (matches) {
				// Wrap matching text with <mark> elements
				context = content.replace(regex, (match) => {
					return `<mark>${match}</mark>`;
				});
			} else {
				context = '';
			}
		} catch (e) {
			console.error(e);
			context = '';
		}
	}

	async function saveHighlight() {
		let userHex;
		const nip07signer = new NDKNip07Signer();

		$ndkStore.signer = nip07signer;

		await nip07signer.user().then(async (user) => {
			if (!!user.npub) {
				userHex = user.hexpubkey;
				console.log('Permission granted to read their public key:', user.npub);
			}
		});
		console.log(userHex);
		const event = new NDKEvent($ndkStore);
		event.kind = 9802;
		event.content = $selection.toString();
		event.tags = [
			['r', $highlightedDocument.url],
			// ['p', userHex, ] --> tag original author
			['context', context]
		];
		await event.publish();
		console.log(event);
	}
</script>

{#if $range?.commonAncestorContainer?.textContent}
	<div class="relative">
		<div class="border border-white fixed">
			<p>Raw Selection: {$selection.toString()}</p>
			<p>{@html context}</p>
			<button on:click={saveHighlight} class="btn">Save</button>
		</div>
	</div>
{/if}
