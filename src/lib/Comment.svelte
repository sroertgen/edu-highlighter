<script>
	import { ndkStore } from '$lib/ndk';
	import { nip19 } from 'nostr-tools';
	import Avatar from '$lib/Avatar.svelte';

	async function getUser(pk) {
		const npub = nip19.npubEncode(pk);
		const nUser = $ndkStore.getUser({ npub: npub });
		const profile = await nUser.fetchProfile();
		return { npub, pk, profile };
	}
	// regex to remove the quoted note
	// fetch author profile of comment
	// comment box
	// Avatar with user profile
	function formatUnixTimestamp(timestamp) {
		var date = new Date(timestamp * 1000);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = '0' + date.getMinutes();
		var formattedTime = day + '.' + month + '.' + year + ', ' + hours + ':' + minutes.substr(-2);
		return formattedTime;
	}

	/**
	 * @param {string} quote
	 * @returns {string}
	 */
	function cleanQuote(quote) {
		console.log(quote);
		const pattern = /nostr:note[a-z0-9]+\n/;
		const cleaned = quote.replace(pattern, '');
		return cleaned;
	}
	export let quoteEvent;
</script>

<div class="mb-3">
	{#await getUser(quoteEvent.pubkey) then user}
		<div class="flex gap-1">
			<Avatar {user} />
			<p>{user.profile?.displayName}</p>
			<p>{formatUnixTimestamp(quoteEvent.created_at)}</p>
		</div>
	{/await}
	<p class="mt-2">{cleanQuote(quoteEvent.content)}</p>
</div>
