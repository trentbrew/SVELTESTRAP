<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ProgressBar from '$lib/components/ui/progress-bar.svelte';
	import { Icon } from '$lib/components/ui/icon/index.js';

	interface Lesson {
		id: string;
		title: string;
		slug: string;
		order: number;
		estimatedMinutes: number;
		isFree: boolean;
		status: string;
		course: string;
		module: string;
		created: string;
		updated: string;
		progress?: number; // 0-100
	}

	interface Props {
		isOpen: boolean;
		moduleTitle: string;
		lessons: Lesson[];
		courseId: string;
		moduleId: string;
	}

	let { isOpen, moduleTitle, lessons, courseId, moduleId }: Props = $props();

	const dispatch = createEventDispatcher();

	const handleClose = () => {
		dispatch('close');
	};

	const handleLessonClick = (lesson: Lesson) => {
		// Navigate to lesson page
		window.location.href = `/academy/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`;
	};
</script>

<Sheet.Root bind:open={isOpen} onOpenChange={(open) => !open && handleClose()}>
	<Sheet.Content side="right" class="w-full max-w-md">
		<Sheet.Header>
			<Sheet.Title>Lessons</Sheet.Title>
			<Sheet.Description>{moduleTitle}</Sheet.Description>
		</Sheet.Header>

		<div class="flex-1 overflow-y-auto px-4 py-6">
			{#if lessons && lessons.length > 0}
				<div class="space-y-3">
					{#each lessons as lesson (lesson.id)}
						<div
							class="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
							onclick={() => handleLessonClick(lesson)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleLessonClick(lesson);
								}
							}}
						>
							<!-- Lesson Header -->
							<div class="mb-3 flex items-start justify-between">
								<div class="flex-1">
									<h3 class="leading-tight font-semibold group-hover:text-primary">
										{lesson.title}
									</h3>
									<p class="mt-1 text-sm text-muted-foreground">
										{lesson.estimatedMinutes} min
									</p>
								</div>
								<div class="ml-3 flex items-center gap-2">
									<Badge variant={lesson.isFree ? 'default' : 'secondary'}>
										{lesson.isFree ? 'Free' : 'Premium'}
									</Badge>
									<Badge variant="outline" class="text-xs">
										#{lesson.order || 0}
									</Badge>
								</div>
							</div>

							<!-- Progress Bar -->
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs text-muted-foreground">
									<span>Progress</span>
									<span>{lesson.progress || 0}%</span>
								</div>
								<ProgressBar
									progress={lesson.progress || 0}
									size="sm"
									showPercentage={false}
									class="w-full"
								/>
							</div>

							<!-- Footer -->
							<div class="flex items-center justify-between pt-2 text-xs text-muted-foreground">
								<span>Created {new Date(lesson.created).toLocaleDateString()}</span>
								<div
									class="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100"
								>
									<span>Start lesson</span>
									<Icon name="arrow-right" class="h-3 w-3" />
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div class="mb-4 rounded-full bg-muted p-3">
						<Icon name="book-open" class="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">No lessons found</h3>
					<p class="text-muted-foreground">This module doesn't have any lessons yet.</p>
				</div>
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
