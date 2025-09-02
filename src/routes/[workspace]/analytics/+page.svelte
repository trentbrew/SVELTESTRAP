<script lang="ts">
	import BasePage from '$lib/components/base-page.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
	function connectSource() {}
	function viewDocs() {
		window.open('/docs', '_blank');
	}
	const views = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'orders', label: 'Orders' },
		{ id: 'shipments', label: 'Shipments' }
	];
	const description = 'Connect data sources to start seeing charts and insights.';
</script>

<BasePage title="Analytics" subtitle="Charts and insights across your data." {views}>
	{#snippet actions()}
		<Button size="sm" on:click={connectSource}>Connect source</Button>
	{/snippet}
	{#snippet children({ value })}
		<EmptyState
			title="No analytics yet"
			{description}
			primaryActionText="Connect source"
			onPrimary={connectSource}
			secondaryActionText="View docs"
			onSecondary={viewDocs}
			iconComponent={ChartBarIcon}
		/>
	{/snippet}
</BasePage>
