<script lang="ts">
	import BasePage from '$lib/components/base-page.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import PlugIcon from '@tabler/icons-svelte/icons/plug';
	function openConnectors() {}
	function viewDocs() {
		window.open('/docs', '_blank');
	}
	const views = [
		{ id: 'all', label: 'All' },
		{ id: 'webflow', label: 'Webflow' },
		{ id: 'shippo', label: 'Shippo' },
		{ id: 'stripe', label: 'Stripe' }
	];
	const description = 'Configure Webflow, Stripe (read-only), and Shippo to begin syncing data.';
</script>

<BasePage title="Connectors" subtitle="Configure integrations for data syncs." {views}>
	{#snippet actions()}
		<Button size="sm" on:click={openConnectors}>Add connector</Button>
	{/snippet}
	{#snippet children({ value })}
		<EmptyState
			title="No connectors configured"
			{description}
			primaryActionText="Add connector"
			onPrimary={openConnectors}
			secondaryActionText="View docs"
			onSecondary={viewDocs}
			iconComponent={PlugIcon}
		/>
	{/snippet}
</BasePage>
