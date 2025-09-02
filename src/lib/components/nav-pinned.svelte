<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';

	const sidebar = useSidebar();
	let open = $state(true); // Default to open
</script>

{#if pinnedItemsStore.pinnedItems.length > 0}
	<Sidebar.Group>
		<Collapsible.Root bind:open class="w-full">
			{#if sidebar.state !== 'collapsed'}
				<Collapsible.Trigger class="flex items-center justify-between hover:opacity-100">
					<div class="-rotate-90 p-1 duration-200" class:rotate-[0deg]={open}>
						<ChevronDownIcon class="size-4 opacity-50 transition-transform duration-200" />
					</div>
					<Sidebar.GroupLabel
						class="flex items-center gap-2 hover:opacity-100 hover:transition-none hover:duration-0"
						>PINNED</Sidebar.GroupLabel
					>
				</Collapsible.Trigger>
			{/if}
			<Collapsible.Content>
				<Sidebar.GroupContent class="flex flex-col gap-2">
					<Sidebar.Menu class="mt-0">
						{#each pinnedItemsStore.pinnedItems as item (item.url)}
							<Sidebar.MenuItem class="ml-4">
								<Sidebar.MenuButton
									tooltipContent={item.title}
									isActive={$page.url.pathname.startsWith(item.url)}
								>
									<a href={item.url} class="flex items-center">
										{#if item.icon}
											{@const IconComponent = item.icon}
											<IconComponent class="mr-2 size-4 opacity-50" />
										{/if}
										{#if sidebar.state !== 'collapsed'}
											<span>{item.title}</span>
										{/if}
									</a>
								</Sidebar.MenuButton>
								{#if sidebar.state !== 'collapsed'}
									<Sidebar.MenuAction
										onclick={() => pinnedItemsStore.unpin(item.url)}
										showOnHover
										class="data-[state=open]:bg-accent rounded-sm"
									>
										<PinFilledIcon class="h-4 w-4" />
										<span class="sr-only">Unpin item</span>
									</Sidebar.MenuAction>
								{/if}
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Collapsible.Content>
		</Collapsible.Root>
		{#if sidebar.state === 'collapsed'}
			<div class="bg-border mx-auto my-1 h-px w-12 translate-x-0"></div>
		{/if}
	</Sidebar.Group>
{/if}
