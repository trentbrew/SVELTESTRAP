<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	let open = $state(true); // Default to open
</script>

{#if pinnedItemsStore.pinnedItems.length > 0}
	<Sidebar.Group>
		<Sidebar.GroupLabel class="flex items-center justify-start gap-2">
			<div class="flex items-center gap-2">
				<!-- <PinIcon class="size-4" /> -->
				PINNED
			</div>
			<!-- <div class="p-1" class:rotate-180={open}>
				<ChevronDownIcon class="size-4 transition-transform duration-200" />
			</div> -->
		</Sidebar.GroupLabel>
		<Collapsible.Root bind:open class="w-full">
			<Collapsible.Content>
				<Sidebar.Menu>
					{#each pinnedItemsStore.pinnedItems as item (item.url)}
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
								onclick={() => pinnedItemsStore.unpin(item.url)}
								showOnHover
								class="data-[state=open]:bg-accent rounded-sm"
							>
								<PinFilledIcon class="h-4 w-4" />
								<span class="sr-only">Unpin item</span>
							</Sidebar.MenuAction>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Collapsible.Content>
		</Collapsible.Root>
	</Sidebar.Group>
{/if}
