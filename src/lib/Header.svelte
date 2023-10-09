<script>
	import Search from '$lib/Search.svelte';
	import AvatarDropdown from '$lib/AvatarDropdown.svelte';
	import { user } from '$lib/user';
	import ModalLogin from './ModalLogin.svelte';
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row justify-between">
		<a href="/">
			<h1 class="text-3xl text-center text-orange-400 italic font-bold">edu-highlighter</h1>
		</a>
		<div class="">
			{#if !$user.pk}
				<button
					onclick="login_modal.showModal()"
					class="btn bg-orange-400 hover:bg-orange-600 text-black">Login</button
				>
			{:else}
				<AvatarDropdown user={$user} />
			{/if}
		</div>
	</div>
	<Search />
</div>
<ModalLogin />
