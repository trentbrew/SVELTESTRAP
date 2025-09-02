<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import DocsSidebar from '$lib/components/docs-sidebar.svelte';
	import DocsHeader from '$lib/components/docs-header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<DocsSidebar variant="inset" />
	<Sidebar.Inset class="bg-background border">
		<DocsHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
