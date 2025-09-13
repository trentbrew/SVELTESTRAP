<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ProgressBar from '$lib/components/ui/progress-bar.svelte';
	import { Icon } from '$lib/components/ui/icon/index.js';
	import { createEventDispatcher } from 'svelte';

	interface Module {
		id: string;
		title: string;
		description: string;
		order: number;
		course: string;
		created: string;
		updated: string;
		progress?: number; // 0-100
		thumbnail?: string; // URL to thumbnail image
	}

	interface Props {
		module: Module;
		courseId: string;
	}

	let { module, courseId }: Props = $props();

	const dispatch = createEventDispatcher();

	// Sample thumbnails for modules
	const moduleThumbnails: Record<string, string> = {
		// JavaScript Fundamentals (original)
		rvvqwn9467j1km8:
			'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop&crop=center', // Variables and Data Types
		gv4qfohc4h22uqc:
			'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop&crop=center', // Functions and Scope

		// JavaScript Fundamentals (mock)
		'js-vars-mock':
			'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop&crop=center', // Variables and Data Types
		'js-functions-mock':
			'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop&crop=center', // Functions and Scope
		'js-dom-mock':
			'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop&crop=center', // DOM Manipulation
		'js-events-mock':
			'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop&crop=center', // Events and Event Handling

		// React Development (original)
		myp5nfrs2mgf4x4:
			'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center', // Components and JSX

		// React Development (mock)
		'react-components-mock':
			'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center', // Components and JSX
		'react-state-mock':
			'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=225&fit=crop&crop=center', // State and Props
		'react-hooks-mock':
			'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center', // React Hooks

		// Python Fundamentals
		'python-syntax-mock':
			'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop&crop=center', // Python Syntax
		'python-control-mock':
			'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop&crop=center', // Control Flow
		'python-data-mock':
			'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop&crop=center', // Data Structures
		'python-oop-mock':
			'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop&crop=center', // OOP

		// Advanced JavaScript
		'es6-features-mock':
			'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop&crop=center', // ES6+ Features
		'async-js-mock':
			'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop&crop=center', // Async Programming
		'js-patterns-mock':
			'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop&crop=center', // Design Patterns

		// Full Stack Development
		'backend-dev-mock':
			'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&crop=center', // Backend Development
		'database-design-mock':
			'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&crop=center', // Database Design
		'frontend-integration-mock':
			'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&crop=center', // Frontend Integration
		'deployment-devops-mock':
			'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&crop=center' // Deployment and DevOps
	};

	const moduleThumbnail = moduleThumbnails[module.id] || module.thumbnail;

	const handleCardClick = () => {
		dispatch('openLessons', {
			moduleId: module.id,
			moduleTitle: module.title,
			courseId: courseId
		});
	};
</script>

<div
	class="group cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
	onclick={handleCardClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick();
		}
	}}
>
	<!-- Thumbnail -->
	<div class="mb-4 aspect-video overflow-hidden rounded-md bg-muted">
		{#if moduleThumbnail}
			<img
				src={moduleThumbnail}
				alt={module.title}
				class="h-full w-full object-cover transition-transform group-hover:scale-105"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<Icon name="package" class="h-12 w-12 text-muted-foreground" />
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="space-y-3">
		<!-- Title and Order -->
		<div class="flex items-start justify-between">
			<h3 class="line-clamp-2 text-lg leading-tight font-semibold group-hover:text-primary">
				{module.title}
			</h3>
			<Badge variant="outline" class="ml-2 shrink-0 text-xs">
				#{module.order || 0}
			</Badge>
		</div>

		<!-- Description -->
		{#if module.description && module.description !== 'No description'}
			<p class="line-clamp-2 text-sm text-muted-foreground">
				{module.description}
			</p>
		{/if}

		<!-- Progress Bar -->
		<div class="space-y-1">
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span>Progress</span>
				<span>{module.progress || 0}%</span>
			</div>
			<ProgressBar
				progress={module.progress || 0}
				size="sm"
				showPercentage={false}
				class="w-full"
			/>
		</div>

		<!-- Footer -->
		<div class="flex items-center justify-between pt-2 text-xs text-muted-foreground">
			<span>Created {new Date(module.created).toLocaleDateString()}</span>
			<div
				class="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span>View lessons</span>
				<Icon name="arrow-right" class="h-3 w-3" />
			</div>
		</div>
	</div>
</div>
