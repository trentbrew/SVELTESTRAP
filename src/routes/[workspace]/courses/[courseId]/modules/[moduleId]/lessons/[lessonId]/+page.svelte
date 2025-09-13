<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Icon } from '$lib/components/ui/icon/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
	<div class="px-4 lg:px-6">
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => goto(`/academy/courses/${data.courseId}/modules/${data.moduleId}/lessons`)}
				>
					<Icon name="chevronRight" class="h-4 w-4 rotate-180" />
					Back to Lessons
				</Button>
			</div>
		</div>

		<div class="mx-auto max-w-4xl">
			<div class="mb-6">
				<div class="mb-2 flex items-center gap-2">
					<Icon name="fileText" class="h-5 w-5" />
					<h1 class="text-2xl font-bold">{data.lesson.title}</h1>
				</div>
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<span>Slug: {data.lesson.slug}</span>
					<Badge variant="outline">{data.lesson.status}</Badge>
					{#if data.lesson.estimatedMinutes}
						<span>{data.lesson.estimatedMinutes} minutes</span>
					{/if}
					<Badge variant={data.lesson.isFree ? 'default' : 'secondary'}>
						{data.lesson.isFree ? 'Free' : 'Premium'}
					</Badge>
				</div>
			</div>

			<div class="prose max-w-none">
				{#if data.lesson.content}
					<div class="rounded-lg bg-muted p-6">
						<h3 class="mb-4 text-lg font-semibold">Lesson Content</h3>
						<pre class="text-sm whitespace-pre-wrap">{JSON.stringify(
								data.lesson.content,
								null,
								2
							)}</pre>
					</div>
				{:else}
					<div class="rounded-lg bg-muted p-6 text-center">
						<Icon name="fileText" class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<p class="text-muted-foreground">No content available for this lesson yet.</p>
					</div>
				{/if}
			</div>

			<div class="mt-8 rounded-lg bg-muted p-4">
				<h3 class="mb-2 text-lg font-semibold">Lesson Details</h3>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="font-medium">Course ID:</span>
						{data.courseId}
					</div>
					<div>
						<span class="font-medium">Module ID:</span>
						{data.moduleId}
					</div>
					<div>
						<span class="font-medium">Lesson ID:</span>
						{data.lessonId}
					</div>
					<div>
						<span class="font-medium">Order:</span>
						{data.lesson.order || 0}
					</div>
					<div>
						<span class="font-medium">Created:</span>
						{new Date(data.lesson.created).toLocaleDateString()}
					</div>
					<div>
						<span class="font-medium">Updated:</span>
						{new Date(data.lesson.updated).toLocaleDateString()}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
