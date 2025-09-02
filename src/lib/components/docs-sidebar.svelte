<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from '$lib/components/nav-main.svelte';
	import GlobalSearch from '$lib/components/global-search.svelte';
  import { getSidebarData } from '$lib/data/sidebar-data';
	import { DEFAULT_WORKSPACE } from '$lib/routes';
	import type { ComponentProps } from 'svelte';

	// Use docs links from sidebar data (navContent contains /docs/*)
  const data = getSidebarData(DEFAULT_WORKSPACE);
  const docSections = data.navDocsSections;
  const docItems = docSections.flatMap((s) => s.items);
	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<!-- Replace workspace switcher with a simple label -->
			<Sidebar.MenuItem>
				<div class="text-muted-foreground px-2 py-1 text-xs font-medium uppercase tracking-wide">
					Docs
				</div>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
    <!-- Optional search (hide workspace actions) -->
    <GlobalSearch items={docItems} showWorkspaceActions={false} />
    {#each docSections as section (section.title)}
      <NavMain items={section.items} title={section.title} class="mt-0" />
    {/each}
  </Sidebar.Content>
	<!-- No footer/user for public docs -->
</Sidebar.Root>
