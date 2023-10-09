<script>
	export let user;
</script>

<div class="avatar w-10 h-10">
	<img
		class="rounded-full border-orange-400 border"
		src={user.profile.image || `https://robohash.org/${user.npub}.png`}
	/>
</div>
