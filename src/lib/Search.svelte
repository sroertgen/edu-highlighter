<script>
	import { searchInput } from '$lib/store';
</script>

<div>
	<input
		bind:value={$searchInput}
		type="text"
		placeholder="Type here"
		class="input input-bordered w-full max-w-xs"
	/>
</div>
