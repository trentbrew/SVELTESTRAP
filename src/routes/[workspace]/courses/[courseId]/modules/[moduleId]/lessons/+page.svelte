<script lang="ts">
	import type { PageData } from './$types';
	import LessonsDataTable from '$lib/components/lessons-data-table.svelte';
	import { mockLessons } from '$lib/mock-data.js';

	let { data }: { data: PageData } = $props();

	// Combine real data with mock data for testing
	const allLessons = [...(data.lessons || []), ...(mockLessons[data.moduleId] || [])];
</script>

<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
	<!-- Module Header -->
	<div class="px-4 lg:px-6">
		<div class="mb-6">
			<h1 class="text-3xl font-bold tracking-tight">{data.moduleTitle}</h1>
			<p class="mt-2 text-muted-foreground">Module lessons and exercises</p>
		</div>
	</div>

	<LessonsDataTable data={allLessons as any} courseId={data.courseId} moduleId={data.moduleId} />
</div>
