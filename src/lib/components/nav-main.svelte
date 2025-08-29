<script lang="ts">
	import { page } from '$app/stores';
	import CirclePlusFilledIcon from '@tabler/icons-svelte/icons/circle-plus-filled';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import MailIcon from '@tabler/icons-svelte/icons/mail';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
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

	let open = $state(true); // Default to open
</script>

<Sidebar.Group class={className} {...restProps}>
	<Collapsible.Root bind:open class="w-full">
		<Collapsible.Trigger class="flex items-center justify-between hover:opacity-100">
			<Sidebar.GroupLabel>{title?.toUpperCase() || 'Documents'}</Sidebar.GroupLabel>
			<div class="p-1" class:rotate-180={open}>
				<ChevronDownIcon class="size-4 opacity-50 transition-transform duration-200" />
			</div>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<Sidebar.GroupContent class="flex flex-col gap-2">
				<Sidebar.Menu class="mt-0">
					{#each items as item (item.title)}
						{#if !pinnedItemsStore.isPinned(item.url)}
							<Sidebar.MenuItem class="pl-2">
								<Sidebar.MenuButton
									tooltipContent={item.title}
									isActive={$page.url.pathname.startsWith(item.url)}
								>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											{#if item.icon}
												<item.icon class="mr-2 size-4 opacity-50" />
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
		</Collapsible.Content>
	</Collapsible.Root>
</Sidebar.Group>
