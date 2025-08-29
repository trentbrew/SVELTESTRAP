<script lang="ts">
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Workspace } from '$lib/data/sidebar-data';

	let { workspaces }: { workspaces: Workspace[] } = $props();

	let open = $state(false);

	function handleWorkspaceSelect(workspace: Workspace) {
		// Navigate to the workspace
		window.location.href = workspace.url;
	}

	function handleCreateWorkspace() {
		// Navigate to workspace creation page
		window.location.href = '/workspace/create';
	}

	function handleManageWorkspaces() {
		// Navigate to workspace management page
		window.location.href = '/workspace/settings';
	}

	// Get the active workspace
	let activeWorkspace = $derived(workspaces.find((w) => w.isActive) || workspaces[0]);
</script>

<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class="w-full">
			<button
				type="button"
				class="hover:bg-accent flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left"
			>
				<div class="flex items-center gap-2">
					<img src={activeWorkspace?.logo} alt={activeWorkspace?.name} class="size-5 rounded-sm" />
					<span class="flex-1 text-sm font-medium">{activeWorkspace?.name}</span>
				</div>
				<ChevronDownIcon class="size-4 opacity-50" />
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
