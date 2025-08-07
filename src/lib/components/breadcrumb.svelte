<script lang="ts">
	import { page } from '$app/stores';
	import { IconChevronRight } from '@tabler/icons-svelte';

	let segments = $derived($page.url.pathname.split('/').filter(Boolean));

	const segmentLabel = (seg: string) =>
		seg
			.split('-')
			.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
			.join(' ');
</script>

{#if segments.length > 0}
	<nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
		{#each segments as seg, i}
			{#if i !== segments.length - 1}
				<a
					href={'/' + segments.slice(0, i + 1).join('/')}
					class="text-muted-foreground hover:underline"
				>
					{segmentLabel(seg)}
				</a>
				<IconChevronRight class="text-muted-foreground/50" size={16} />
			{:else}
				<span class="font-semibold">{segmentLabel(seg)}</span>
			{/if}
		{/each}
	</nav>
{/if}
