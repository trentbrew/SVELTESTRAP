<script lang="ts">
	export let title: string = 'Nothing here yet';
	export let description: string = '';
	export let primaryActionText: string = '';
	export let onPrimary: (() => void) | undefined;
	export let secondaryActionText: string = '';
	export let onSecondary: (() => void) | undefined;
	// Either pass an emoji via `icon` or a Svelte component via `iconComponent`
	export let icon: string = '';
	export let iconComponent: any = null;
	export let className: string = '';

	function handlePrimary() {
		if (onPrimary) onPrimary();
	}
	function handleSecondary() {
		if (onSecondary) onSecondary();
	}
</script>

<section
	class={`bg-muted/25 flex !h-full flex-1 flex-col items-center justify-center rounded-lg border p-12 text-center md:p-16 ${className}`}
>
	<div class="text-muted-foreground mb-10 scale-[2]">
		{#if iconComponent}
			{@render iconComponent({ class: 'text-muted-foreground mb-10 !size-16' })}
		{:else if icon}
			<div class="text-muted-foreground mb-4 !size-16 text-4xl">{icon}</div>
		{/if}
	</div>
	<h2 class="mb-2 text-2xl font-semibold tracking-tight">{title}</h2>
	{#if description}
		<p class="text-muted-foreground mb-6 max-w-prose">{description}</p>
	{/if}
	<div class="flex gap-3">
		{#if primaryActionText}
			<button
				class="bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow hover:opacity-90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				on:click={handlePrimary}>{primaryActionText}</button
			>
		{/if}
		{#if secondaryActionText}
			<button
				class="bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				on:click={handleSecondary}>{secondaryActionText}</button
			>
		{/if}
	</div>
</section>

<style>
</style>
