<script lang="ts">
	import InnerShadowTopIcon from '@tabler/icons-svelte/icons/inner-shadow-top';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import NavPinned from './nav-pinned.svelte';
	import GlobalSearch from './global-search.svelte';
	import WorkspaceSwitcher from './workspace-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { sidebarData } from '$lib/data/sidebar-data';

	import type { ComponentProps } from 'svelte';

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	// Combine all navigation items for search functionality
	let allNavItems = $derived([
		...sidebarData.navMain,
		...sidebarData.navContent,
		...sidebarData.navAnalytics,
		...sidebarData.navSecondary
	]);
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<WorkspaceSwitcher workspaces={sidebarData.workspaces} />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<GlobalSearch items={allNavItems} />
		<NavPinned />

		<!-- Main Navigation -->
		<NavMain items={sidebarData.navMain} title="Navigation" />

		<!-- Content Management -->
		<NavMain items={sidebarData.navContent} title="Content" class="mt-0" />

		<!-- Analytics -->
		<NavMain items={sidebarData.navAnalytics} title="Analytics" class="mt-0" />

		<!-- Secondary Navigation -->
		<!-- <NavSecondary items={sidebarData.navSecondary} class="mt-auto" /> -->
	</Sidebar.Content>
	<Sidebar.Footer class="mt-auto border-t">
		<NavUser user={sidebarData.user} />
	</Sidebar.Footer>
</Sidebar.Root>
