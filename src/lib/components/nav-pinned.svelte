<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
</script>

{#if pinnedItemsStore.pinnedItems.length > 0}
	<Sidebar.Group>
		<Sidebar.GroupLabel class="flex items-center gap-2">
			<PinIcon class="h-4 w-4" />
			Pinned
		</Sidebar.GroupLabel>
		<Sidebar.Menu>
			{#each pinnedItemsStore.pinnedItems as item (item.url)}
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
	</Sidebar.Group>
{/if}
