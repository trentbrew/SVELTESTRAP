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
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { Icon } from '$lib/components/ui/icon/index.js';

	let {
		items,
		title,
		class: className,
		...restProps
	}: {
		items: { title: string; url: string; icon?: string }[];
		title?: string;
		class?: string;
	} = $props();

	const sidebar = useSidebar();

	let open = $state(true); // Default to open
</script>

<Sidebar.Group class={className} {...restProps}>
	<Collapsible.Root bind:open class="w-full">
		{#if sidebar.state !== 'collapsed'}
			<Collapsible.Trigger class="flex items-center justify-between hover:opacity-100">
				<div class="-rotate-90 p-1 duration-200" class:rotate-[0deg]={open}>
					<ChevronDownIcon class="size-4 opacity-50 transition-transform duration-200" />
				</div>
				<Sidebar.GroupLabel
					class="flex items-center gap-2 hover:opacity-100 hover:transition-none hover:duration-0"
					>{title?.toUpperCase() || 'Documents'}</Sidebar.GroupLabel
				>
			</Collapsible.Trigger>
		{/if}
		<Collapsible.Content>
			<Sidebar.GroupContent class="flex flex-col gap-2">
				<Sidebar.Menu class="mt-0">
					{#each items as item (item.title)}
						{#if !pinnedItemsStore.isPinned(item.url)}
							<Sidebar.MenuItem class={sidebar.state !== 'collapsed' ? 'ml-4' : ''}>
								<Sidebar.MenuButton
									tooltipContent={item.title}
									isActive={$page.url.pathname.startsWith(item.url)}
								>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											{#if item.icon}
												<Icon name={item.icon} class="mr-2 size-4 opacity-50" />
											{/if}
											{#if sidebar.state !== 'collapsed'}
												<span>{item.title}</span>
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
								{#if sidebar.state !== 'collapsed'}
									<Sidebar.MenuAction
										onclick={() =>
											pinnedItemsStore.toggle({
												title: item.title,
												url: item.url,
												icon: item.icon,
												type: 'main'
											})}
										showOnHover
										class="rounded-sm data-[state=open]:bg-accent"
									>
										{#if pinnedItemsStore.isPinned(item.url)}
											<PinFilledIcon class="h-4 w-4" />
										{:else}
											<PinIcon class="h-4 w-4" />
										{/if}
										<span class="sr-only">Pin item</span>
									</Sidebar.MenuAction>
								{/if}
							</Sidebar.MenuItem>
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Add divider in collapsed mode -->
	{#if sidebar.state === 'collapsed'}
		<div class="mx-auto mt-4 h-px w-12 -translate-x-0 bg-border"></div>
	{/if}
</Sidebar.Group>
