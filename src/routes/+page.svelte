<script>
	import Search from '$lib/Search.svelte';
	import ContentViewer from '$lib/ContentViewer.svelte';
	import SelectionViewer from '$lib/SelectionViewer.svelte';
	import { selection } from '$lib/store';
</script>

<Search />
<!-- <Avatar /> -->
<div class="flex flex-row">
	<div class="basis-2/3">
		<ContentViewer />
	</div>
	<div class="basis-1/3">
		<SelectionViewer />
	</div>
</div>
