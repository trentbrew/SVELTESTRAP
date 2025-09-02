<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import NavPinned from './nav-pinned.svelte';
	import GlobalSearch from './global-search.svelte';
	import WorkspaceSwitcher from './workspace-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getSidebarData } from '$lib/data/sidebar-data';
	import { page } from '$app/stores';

	import type { ComponentProps } from 'svelte';

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	// Sidebar data is now workspace-aware
	let workspaceSlug = $derived($page.params.workspace);
	let data = $derived(getSidebarData(workspaceSlug));

	// Combine all navigation items for search functionality (exclude docs in workspace)
	let allNavItems = $derived([...data.navMain, ...data.navAnalytics, ...data.navSecondary]);
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<WorkspaceSwitcher workspaces={data.workspaces} />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<GlobalSearch items={allNavItems} />
		<NavPinned />

		<!-- Main Navigation -->
		<NavMain items={data.navMain} title="Navigation" />

		<!-- Analytics -->
		<NavMain items={data.navAnalytics} title="Analytics" class="mt-0" />

		<!-- Secondary Navigation -->
		<!-- <NavSecondary items={sidebarData.navSecondary} class="mt-auto" /> -->
	</Sidebar.Content>
	<Sidebar.Footer class="mt-auto border-t px-2 pt-4">
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
