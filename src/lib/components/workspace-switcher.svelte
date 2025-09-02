<script lang="ts">
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import type { Workspace } from '$lib/data/sidebar-data';
	import { page } from '$app/stores';

	let { workspaces }: { workspaces: Workspace[] } = $props();

	const sidebar = useSidebar();
	let open = $state(false);

	function handleWorkspaceSelect(workspace: Workspace) {
		// Navigate to the workspace
		window.location.href = workspace.url;
	}

	function handleCreateWorkspace() {
		// Placeholder: implement global workspace create route if needed
		window.location.href = '/workspaces/create';
	}

	function handleManageWorkspaces() {
		const slug = $page.params.workspace || (workspaces[0]?.id ?? 'workspace');
		window.location.href = `/${slug}/settings`;
	}

	// Get the active workspace
	let activeWorkspace = $derived(
		workspaces.find((w) => w.id === $page.params.workspace) ||
			workspaces.find((w) => w.isActive) ||
			workspaces[0]
	);
</script>

<Sidebar.MenuButton class="w-full data-[slot=sidebar-menu-button]:!p-1">
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class="w-full">
			<button
				type="button"
				class="hover:bg-accent flex w-full items-center justify-between gap-2 rounded-md text-left {sidebar.state ===
				'collapsed'
					? ''
					: 'px-1.5 py-1.5'}"
			>
				<div class="flex w-full min-w-0 items-center gap-2">
					<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center">
						<img
							src={activeWorkspace?.logo}
							alt={activeWorkspace?.name}
							class="h-6 w-6 rounded-full object-cover"
						/>
					</div>
					{#if sidebar.state !== 'collapsed'}
						<span class="flex-1 truncate text-sm font-medium">{activeWorkspace?.name}</span>
						<ChevronDownIcon class="size-4 flex-shrink-0 opacity-50" />
					{/if}
				</div>
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="w-64" align="start">
			<DropdownMenu.Label>Workspaces</DropdownMenu.Label>
			<DropdownMenu.Separator />

			{#each workspaces as workspace (workspace.id)}
				<DropdownMenu.Item
					onSelect={() => handleWorkspaceSelect(workspace)}
					class="flex items-center gap-2"
				>
					<img src={workspace.logo} alt={workspace.name} class="size-4 rounded-sm" />
					<span class="flex-1">{workspace.name}</span>
					{#if workspace.isActive}
						<div class="bg-primary size-2 rounded-full"></div>
					{/if}
				</DropdownMenu.Item>
			{/each}

			<DropdownMenu.Separator />

			<DropdownMenu.Item onSelect={handleCreateWorkspace}>
				<PlusIcon class="mr-2 size-4" />
				Create workspace
			</DropdownMenu.Item>

			<DropdownMenu.Item onSelect={handleManageWorkspaces}>
				<SettingsIcon class="mr-2 size-4" />
				Manage workspaces
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Sidebar.MenuButton>

<!-- Add divider after workspace switcher in collapsed mode -->
{#if sidebar.state === 'collapsed'}
	<div class="bg-border mx-auto my-1 h-px w-8 translate-x-2"></div>
{/if}
