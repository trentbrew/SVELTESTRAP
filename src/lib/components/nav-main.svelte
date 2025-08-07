<script lang="ts">
	import { page } from '$app/stores';
	import CirclePlusFilledIcon from '@tabler/icons-svelte/icons/circle-plus-filled';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import MailIcon from '@tabler/icons-svelte/icons/mail';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Icon } from '@tabler/icons-svelte';
	import SearchIcon from '@tabler/icons-svelte/icons/search';

	let {
		items,
		title,
		class: className,
		...restProps
	}: {
		items: { title: string; url: string; icon?: Icon }[];
		title?: string;
		class?: string;
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-2">
		<Sidebar.Menu class="mt-0">
			<Sidebar.GroupLabel>Documents</Sidebar.GroupLabel>
			{#each items as item (item.title)}
				{#if !pinnedItemsStore.isPinned(item.url)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							tooltipContent={item.title}
							isActive={$page.url.pathname.startsWith(item.url)}
						>
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									{#if item.icon}
										<item.icon />
									{/if}
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuAction
							onclick={() =>
								pinnedItemsStore.toggle({
									title: item.title,
									url: item.url,
									icon: item.icon,
									type: 'main'
								})}
							showOnHover
							class="data-[state=open]:bg-accent rounded-sm"
						>
							{#if pinnedItemsStore.isPinned(item.url)}
								<PinFilledIcon class="h-4 w-4" />
							{:else}
								<PinIcon class="h-4 w-4" />
							{/if}
							<span class="sr-only">Pin item</span>
						</Sidebar.MenuAction>
					</Sidebar.MenuItem>
				{/if}
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
