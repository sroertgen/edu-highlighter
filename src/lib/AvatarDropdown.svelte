<script>
	import Avatar from '$lib/Avatar.svelte';
	export let user;
</script>

<details class="dropdown dropdown-bottom dropdown-end cursor-pointer">
	<summary class="avatar">
		<Avatar {user} />
	</summary>
	<ul
		class="p-2 shadow menu dropdown-content border-orange-400 border z-[1] bg-base-100 rounded-box w-52"
	>
		<li class=""><a on:click={() => user.reset()}>Logout</a></li>
	</ul>
</details>
