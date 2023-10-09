<script>
	import { goto } from '$app/navigation';
	import { searchInput } from '$lib/store';
	import SearchIcon from './elements/SearchIcon.svelte';

	// TODO implement goto https://kit.svelte.dev/docs/modules#$app-navigation-goto
	// when user hits enter on search
	function handleKeypress(e) {
		if (e.key === 'Enter') {
			goto(`/read?url=${$searchInput}`);
		}
	}
</script>

<div
	class="join flex flex-row mx-auto items-center align-center w-full border-white border rounded-full px-4 w-1/2"
>
	<SearchIcon />
	<input
		bind:value={$searchInput}
		type="text"
		placeholder="Was möchtest du heute annotieren?"
		class="input w-full rounded-full appearance-none outline-none focus:appearance-none focus:outline-none"
		on:keypress={handleKeypress}
	/>
</div>
