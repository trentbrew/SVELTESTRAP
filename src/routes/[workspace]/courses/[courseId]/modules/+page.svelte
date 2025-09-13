<script lang="ts">
	import type { PageData } from './$types';
	import ModuleCard from '$lib/components/module-card.svelte';
	import LessonsDrawer from '$lib/components/lessons-drawer.svelte';
	import { mockModules, mockLessons } from '$lib/mock-data.js';

	let { data }: { data: PageData } = $props();

	// Combine real data with mock data for testing
	const allModules = [...(data.modules || []), ...(mockModules[data.courseId] || [])];

	// Drawer state
	let isDrawerOpen = $state(false);
	let selectedModule = $state<{
		moduleId: string;
		moduleTitle: string;
		courseId: string;
	} | null>(null);

	// Get lessons for selected module
	const selectedModuleLessons = $derived(() => {
		if (!selectedModule) return [];
		return mockLessons[selectedModule.moduleId] || [];
	});

	const handleOpenLessons = (event: CustomEvent) => {
		selectedModule = event.detail;
		isDrawerOpen = true;
	};

	const handleCloseDrawer = () => {
		isDrawerOpen = false;
		selectedModule = null;
	};
</script>

<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
	<!-- Course Header -->
	<div class="px-4 lg:px-6">
		<div class="mb-6">
			<h1 class="text-3xl font-bold tracking-tight">{data.courseTitle}</h1>
			<p class="mt-2 text-muted-foreground">Course modules and lessons</p>
		</div>
	</div>

	<!-- Modules Grid -->
	<div class="px-4 lg:px-6">
		{#if allModules && allModules.length > 0}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each allModules as module (module.id)}
					<ModuleCard
						module={module as any}
						courseId={data.courseId}
						on:openLessons={handleOpenLessons}
					/>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="mb-4 rounded-full bg-muted p-3">
					<svg
						class="h-6 w-6 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						></path>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-semibold">No modules found</h3>
				<p class="text-muted-foreground">This course doesn't have any modules yet.</p>
			</div>
		{/if}
	</div>
</div>

<!-- Lessons Drawer -->
{#if selectedModule}
	<LessonsDrawer
		isOpen={isDrawerOpen}
		moduleTitle={selectedModule.moduleTitle}
		lessons={selectedModuleLessons()}
		courseId={selectedModule.courseId}
		moduleId={selectedModule.moduleId}
		on:close={handleCloseDrawer}
	/>
{/if}
