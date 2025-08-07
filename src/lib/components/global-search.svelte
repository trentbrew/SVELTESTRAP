<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import { sidebarData } from '$lib/data/sidebar-data';
	import { page } from '$app/stores';

	// Get all navigation items from sidebar data
	const navItems = [
		...sidebarData.navMain,
		...sidebarData.navContent,
		...sidebarData.navAnalytics,
		...sidebarData.navSecondary
	];

	// Filter out items without a URL or with '#' as URL
	const filteredNavItems = navItems.filter((item) => item.url && item.url !== '#');

	// Add utility pages that might not be in the sidebar
	const utilityPages = [
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

<!-- The whole thing is now a button that opens the command dialog -->
<div class="p-2">
	<button
		type="button"
		class="bg-background text-muted-foreground hover:bg-accent focus:ring-ring flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
		onclick={openDialog}
		aria-label="Open global search"
	>
		<SearchIcon class="size-4 opacity-70" />
		<span class="flex-1 text-left">Search or jump to...</span>
		<kbd
			class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
		>
			<span class="text-xs">⌘</span>K
		</kbd>
	</button>
</div>

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
						{#if item.icon}
							<svelte:component this={item.icon} class="mr-2 size-4" />
						{/if}
						<span>{item.title}</span>
						{#if item.description}
							<span class="text-muted-foreground ml-2 truncate text-xs">
								{item.description}
							</span>
						{/if}
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}

		<Command.Separator />

		<Command.Group heading="Actions">
			<Command.Item onSelect={() => handleSelect('/workspace/settings')}>
				<svelte:component
					this={sidebarData.navSecondary.find((i) => i.title === 'Settings')?.icon}
					class="mr-2 size-4"
				/>
				<span>Open Settings</span>
				<Command.Shortcut>⌘,</Command.Shortcut>
			</Command.Item>
			<Command.Item onSelect={() => window.location.reload()}>
				<span>Reload Page</span>
				<Command.Shortcut>⌘R</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
