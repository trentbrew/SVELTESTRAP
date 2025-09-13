<script lang="ts">
	import { page } from '$app/stores';
	import { IconChevronRight } from '@tabler/icons-svelte';

	let segments = $derived($page.url.pathname.split('/').filter(Boolean));

	// Mapping of known IDs to titles
	const idToTitleMap: Record<string, string> = {
		// Course IDs
		b3z3vov77ntyyx1: 'JavaScript Fundamentals',
		'73ptkp2v7kx0qsz': 'React Development',

		// Module IDs (we'll add these as we discover them)
		rvvqwn9467j1km8: 'Variables and Data Types',
		gv4qfohc4h22uqc: 'Functions and Scope',
		myp5nfrs2mgf4x4: 'Components and JSX'
	};

	// Function to get the appropriate label for a segment
	const getSegmentLabel = (seg: string) => {
		// Check if we have a mapping for this ID
		if (idToTitleMap[seg]) {
			return idToTitleMap[seg];
		}

		// Default behavior: capitalize and format the segment
		return seg
			.split('-')
			.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
			.join(' ');
	};

	// Function to get the correct URL for a breadcrumb segment
	const getSegmentUrl = (segments: string[], index: number) => {
		const pathSegments = segments.slice(0, index + 1);

		// Special case: if we're at the "courses" segment, redirect to dashboard
		if (pathSegments.length === 2 && pathSegments[1] === 'courses') {
			return '/academy/dashboard';
		}

		// Special case: if we're at a course ID segment, redirect to its modules page
		if (
			pathSegments.length === 3 &&
			pathSegments[1] === 'courses' &&
			idToTitleMap[pathSegments[2]]
		) {
			return '/academy/courses/' + pathSegments[2] + '/modules';
		}

		return '/' + pathSegments.join('/');
	};
</script>

{#if segments.length > 0}
	<nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
		{#each segments as seg, i}
			{#if i !== segments.length - 1}
				<a href={getSegmentUrl(segments, i)} class="text-muted-foreground hover:underline">
					{getSegmentLabel(seg)}
				</a>
				<IconChevronRight class="text-muted-foreground/50" size={16} />
			{:else}
				<span class="font-semibold">{getSegmentLabel(seg)}</span>
			{/if}
		{/each}
	</nav>
{/if}
