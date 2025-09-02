<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onMount(() => {
		// Ensure we're in the browser and redirect to dashboard
		if (browser) {
			import('$lib/routes').then(({ DEFAULT_WORKSPACE }) => {
				goto(`/${DEFAULT_WORKSPACE}/dashboard`, { replaceState: true });
			});
		}
	});
</script>

<!-- This page redirects to /{workspace}/dashboard -->
<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="mb-2 text-2xl font-semibold">Redirecting...</h1>
		<p class="text-gray-600">Taking you to the dashboard</p>
	</div>
</div>
