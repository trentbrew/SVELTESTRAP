<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { IconSun, IconMoon } from '@tabler/icons-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<section class="mb-8 p-8">
	<h2 class="mb-2 text-lg font-semibold">Theme Preferences</h2>
	<div class="flex items-center gap-4">
		<span>Theme:</span>
		<Button onclick={toggleMode} variant="outline" size="icon" aria-label="Toggle theme">
			<IconSun class="h-5 w-5 transition-all dark:scale-0 dark:-rotate-90" />
			<IconMoon
				class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</section>
