<script lang="ts">
	import { page } from '$app/stores';
	import DotsIcon from '@tabler/icons-svelte/icons/dots';
	import PinIcon from '@tabler/icons-svelte/icons/pin';
	import PinFilledIcon from '@tabler/icons-svelte/icons/pin-filled';
	import { pinnedItemsStore } from '$lib/stores/pinned-items.svelte.js';
	import FolderIcon from '@tabler/icons-svelte/icons/folder';
	import Share3Icon from '@tabler/icons-svelte/icons/share-3';
	import TrashIcon from '@tabler/icons-svelte/icons/trash';
	import { Icon } from '$lib/components/ui/icon/index.js';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { items }: { items: { name: string; url: string; icon: string }[] } = $props();

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Documents</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (item.name)}
			{#if !pinnedItemsStore.isPinned(item.url)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={$page.url.pathname.startsWith(item.url)}>
						{#snippet child({ props })}
							<a {...props} href={item.url}>
								<Icon name={item.icon} />
								<span>{item.name}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuAction
									{...props}
									showOnHover
									class="rounded-sm data-[state=open]:bg-accent"
								>
									<DotsIcon />
									<span class="sr-only">More</span>
								</Sidebar.MenuAction>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							class="w-32 rounded-lg"
							side={sidebar.isMobile ? 'bottom' : 'right'}
							align={sidebar.isMobile ? 'end' : 'start'}
						>
							<DropdownMenu.Item
								onclick={() =>
									pinnedItemsStore.toggle({
										title: item.name,
										url: item.url,
										icon: item.icon,
										type: 'documents'
									})}
							>
								{#if pinnedItemsStore.isPinned(item.url)}
									<PinFilledIcon />
									<span>Unpin</span>
								{:else}
									<PinIcon />
									<span>Pin</span>
								{/if}
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<FolderIcon />
								<span>Open</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Share3Icon />
								<span>Share</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item variant="destructive">
								<TrashIcon />
								<span>Delete</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			{/if}
		{/each}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				<DotsIcon class="text-sidebar-foreground/70" />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Group>
