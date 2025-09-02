<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	export type View = { id: string; label: string; badge?: number };

	let { title = '', subtitle = '', views = [] as View[] } = $props();

	let value = $state<string>(views[0]?.id ?? '');
	let viewLabel = $derived(views.find((v) => v.id === value)?.label ?? '');
</script>

<div class="flex min-h-[calc(100vh-64px)] flex-col p-8">
	<div class="mb-6 flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">{title}</h1>
			{#if subtitle}
				<p class="text-muted-foreground mt-1 max-w-prose">{subtitle}</p>
			{/if}
		</div>
	</div>

	{#if views.length > 0}
		<Tabs.Root bind:value class="w-full flex-1 flex-col justify-start gap-6">
			<div class="flex items-center justify-between">
				<Tabs.List
					class="**:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex hidden"
				>
					{#each views as v (v.id)}
						<Tabs.Trigger value={v.id}>
							{v.label}
							{#if v.badge && v.badge > 0}
								<Badge data-slot="badge" variant="secondary">{v.badge}</Badge>
							{/if}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
				<div class="text-muted-foreground @4xl/main:hidden text-sm">{viewLabel}</div>
				<div class="flex shrink-0 items-center gap-2">
					<slot name="actions" />
				</div>
			</div>
			<div class="flex min-h-0 flex-1">
				<slot {value} />
			</div>
		</Tabs.Root>
	{:else}
		<div class="flex min-h-0 flex-1">
			<slot />
		</div>
	{/if}
</div>
