<script lang="ts">
	import { Drawer as DrawerPrimitive } from 'vaul-svelte';
	import DrawerOverlay from './drawer-overlay.svelte';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		...restProps
	}: DrawerPrimitive.ContentProps & {
		portalProps?: DrawerPrimitive.PortalProps;
	} = $props();

	function onPointerDown(event: PointerEvent) {
		const startX = event.clientX;
		const drawerEl = ref as HTMLElement;
		if (!drawerEl) return;
		const initialWidth = drawerEl.getBoundingClientRect().width;

		function onMove(e: PointerEvent) {
			const dx = startX - e.clientX; // positive when dragging leftwards
			let newWidth = initialWidth + dx;
			const minWidth = 200;
			const maxWidth = window.innerWidth * 0.9;
			if (newWidth < minWidth) newWidth = minWidth;
			if (newWidth > maxWidth) newWidth = maxWidth;
			drawerEl.style.width = `${newWidth}px`;
		}

		function onUp() {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		}

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}
</script>

<DrawerPrimitive.Portal {...portalProps}>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		bind:ref
		data-slot="drawer-content"
		class={cn(
			'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
			'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
			'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
			'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[33vw] data-[vaul-drawer-direction=right]:border-l',
			'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[33vw] data-[vaul-drawer-direction=left]:border-r',
			className
		)}
		{...restProps}
	>
		<!-- Resize handle on the leading edge of the drawer -->
		<div
			onpointerdown={onPointerDown}
			class="absolute top-0 left-0 h-full w-2 cursor-ew-resize"
		></div>

		<div
			class="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
		></div>
		{@render children?.()}
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
