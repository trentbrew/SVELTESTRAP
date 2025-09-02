<script lang="ts">
	import BasePage from '$lib/components/base-page.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import BoltIcon from '@tabler/icons-svelte/icons/bolt';
	function createJob() {}
	function viewDocs() {
		window.open('/docs', '_blank');
	}
	const views = [
		{ id: 'all', label: 'All' },
		{ id: 'in-progress', label: 'In Process' },
		{ id: 'done', label: 'Done' }
	];
	const description = 'View background job history and statuses once jobs run.';
</script>

<BasePage title="Job Runs" subtitle="Queue and monitor background work." {views}>
	{#snippet actions()}
		<Button size="sm" on:click={createJob}>New Job</Button>
	{/snippet}
	{#snippet children({ value })}
		<EmptyState
			title="No job runs yet"
			{description}
			primaryActionText="Create job"
			onPrimary={createJob}
			secondaryActionText="View docs"
			onSecondary={viewDocs}
			iconComponent={BoltIcon}
		/>
	{/snippet}
</BasePage>
