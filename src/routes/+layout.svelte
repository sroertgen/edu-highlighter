<script>
	import '../app.css';
	import Header from '$lib/Header.svelte';
</script>

<div class="flex flex-col mx-40">
	<Header />
	<slot />
</div>
