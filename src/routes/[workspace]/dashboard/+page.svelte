<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import CoursesDataTable from '$lib/components/courses-data-table.svelte';
	import { mockCourses } from '$lib/mock-data.js';

	interface PageData {
		courses: any[];
	}

	let { data }: { data: PageData } = $props();

	// Combine real data with mock data for testing
	const allCourses = [...(data?.courses || []), ...mockCourses];
</script>

<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
	<SectionCards />
	<div class="px-4 lg:px-6">
		<ChartAreaInteractive />
	</div>
	<CoursesDataTable data={allCourses} />
</div>
