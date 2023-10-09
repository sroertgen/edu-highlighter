<script>
	import { ndkStore } from '$lib/ndk';

	async function loadHighlightedContent() {
		const filter = { kinds: [9802], limit: 200 };
		const events = await $ndkStore.fetchEvents(filter);
		const resources = new Set(
			[...events]
				.map((e) => e.tags.find((t) => t[0] === 'r'), [])
				.filter((r) => r && (r[1].includes('patternpool') || r[1].includes('e-teaching')))
				.map((r) => r[1])
		);
		return [...resources];
		console.log(resources);
	}
</script>

<div class="mt-4">
	{#await loadHighlightedContent() then resources}
		<div class="grid grid-flow-col">
			{#each resources as resource}
				<div class="card w-96 bg-base-200 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">{resource}</h2>
						<div class="card-actions justify-end">
							<a
								href="/read?url={resource}"
								class="btn bg-orange-400 hover:bg-orange-600 text-black">Ansehen</a
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</div>
