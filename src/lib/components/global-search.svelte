<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import { page } from '$app/stores';
	import type { NavItem } from '$lib/data/sidebar-data';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';

	let { items, showWorkspaceActions = true }: { items: NavItem[]; showWorkspaceActions?: boolean } = $props();

	const sidebar = useSidebar();

	// Filter out items without a URL or with '#' as URL
	const filteredNavItems = items.filter((item) => item.url && item.url !== '#');

	// Add utility pages that might not be in the sidebar
	const utilityPages: Array<{ title: string; url: string; icon: string; description?: string }> = [
		{ title: 'Documentation', url: '/docs', icon: 'file-text' },
		{ title: 'Feedback', url: '/feedback', icon: 'message-circle' },
		{ title: 'Sign Up', url: '/auth/signup', icon: 'user-plus' },
		{ title: 'Log In', url: '/auth/login', icon: 'log-in' },
		{ title: 'Onboarding', url: '/auth/onboarding', icon: 'compass' }
	];

	// Combine all searchable items
	const searchableItems = [...filteredNavItems, ...utilityPages];

	// Current path for highlighting active item
	let currentPath = $derived($page.url.pathname);

	let open = $state(false);
	let searchQuery = $state('');

	// Filter items based on search query
	let filteredItems = $derived(
		searchQuery === ''
			? searchableItems
			: searchableItems.filter((item) =>
					item.title.toLowerCase().includes(searchQuery.toLowerCase())
				)
	);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	function openDialog() {
		open = true;
	}

	function handleSelect(url: string) {
		window.location.href = url;
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<!-- Show different layouts based on sidebar state -->
{#if sidebar.state === 'collapsed'}
	<!-- Collapsed state: just the search icon -->
	<div class="p-2">
		<button
			type="button"
			class="flex w-full items-center justify-center rounded-md border bg-background/50 p-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-ring focus:outline-none"
			onclick={openDialog}
			aria-label="Open global search"
		>
			<SearchIcon class="size-4 opacity-70" />
		</button>
	</div>
{:else}
	<!-- Expanded state: full search bar -->
	<div class="p-2">
		<button
			type="button"
			class="flex w-full items-center gap-2 rounded-md border bg-background/50 px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-ring focus:outline-none"
			onclick={openDialog}
			aria-label="Open global search"
		>
			<SearchIcon class="size-4 opacity-70" />
			<span class="flex-1 text-left">Search or jump to...</span>
			<kbd
				class="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none"
			>
				<span class="text-xs">⌘</span>K
			</kbd>
		</button>
	</div>
{/if}

<Command.Dialog bind:open>
	<Command.Input
		placeholder="Search pages, settings, and more..."
		bind:value={searchQuery}
		onkeydown={(e) => e.key === 'Escape' && (open = false)}
	/>
	<Command.List>
		<Command.Empty>No results found for "{searchQuery}"</Command.Empty>

		{#if filteredItems.length > 0}
			<Command.Group heading="Pages">
				{#each filteredItems as item}
					<Command.Item
						onSelect={() => handleSelect(item.url)}
						data-active={currentPath === item.url}
					>
						{#if item.icon && typeof item.icon !== 'string'}
							<item.icon class="mr-2 size-4" />
						{/if}
						<span>{item.title}</span>
						{#if 'description' in item && item.description}
							<span class="ml-2 truncate text-xs text-muted-foreground">
								{item.description}
							</span>
						{/if}
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}

		<Command.Separator />

		{#if showWorkspaceActions && $page.params.workspace}
			<Command.Group heading="Actions">
				<Command.Item onSelect={() => handleSelect(`/${$page.params.workspace}/settings`)}>
					<SettingsIcon class="mr-2 size-4" />
					<span>Open Settings</span>
					<Command.Shortcut>⌘,</Command.Shortcut>
				</Command.Item>
				<Command.Item onSelect={() => window.location.reload()}>
					<span>Reload Page</span>
					<Command.Shortcut>⌘R</Command.Shortcut>
				</Command.Item>
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
