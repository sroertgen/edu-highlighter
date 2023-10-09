<script>
	import ContentViewer from '$lib/ContentViewer.svelte';
	import SelectionViewer from '$lib/SelectionViewer.svelte';
	import { highlightedDocument } from '$lib/store.js';

	/**
	 * @property data
	 * @property data.htmlText {string}
	 */
	export let data;

	highlightedDocument.update((d) => ({ ...d, url: data.url }));
</script>

<div class="flex mt-2">
	<div class="w-2/3">
		<ContentViewer htmlText={data.htmlText} url={data.url} />
	</div>
	<SelectionViewer />
</div>
