<script lang="ts">
	interface Props {
		progress: number; // 0-100
		size?: 'sm' | 'md' | 'lg';
		showPercentage?: boolean;
		class?: string;
	}

	let { progress, size = 'md', showPercentage = true, class: className = '' }: Props = $props();

	// Clamp progress between 0 and 100
	const clampedProgress = Math.max(0, Math.min(100, progress));

	// Size classes
	const sizeClasses = {
		sm: 'h-1.5',
		md: 'h-2',
		lg: 'h-3'
	};

	// Progress color based on completion
	const getProgressColor = (progress: number) => {
		if (progress === 0) return 'bg-gray-200';
		if (progress < 30) return 'bg-red-500';
		if (progress < 60) return 'bg-yellow-500';
		if (progress < 90) return 'bg-blue-500';
		return 'bg-green-500';
	};
</script>

<div class="flex items-center gap-2 {className}">
	<div class="flex-1 overflow-hidden rounded-full bg-gray-200 {sizeClasses[size]}">
		<div
			class="h-full transition-all duration-300 ease-in-out {getProgressColor(clampedProgress)}"
			style="width: {clampedProgress}%"
		></div>
	</div>
	{#if showPercentage}
		<span class="min-w-[3rem] text-right text-xs font-medium text-muted-foreground">
			{Math.round(clampedProgress)}%
		</span>
	{/if}
</div>
