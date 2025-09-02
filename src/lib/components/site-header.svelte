<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import BellIcon from '@tabler/icons-svelte/icons/bell';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import BookIcon from '@tabler/icons-svelte/icons/book';
	import { toggleMode, mode } from 'mode-watcher';
	import { page } from '$app/stores';
</script>

<header
	class="h-(--header-height) bg-background/80 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-10 flex shrink-0 items-center gap-2 rounded-t-xl border-b backdrop-blur-xl transition-[width,height] ease-linear"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<!-- Breadcrumb -->
		<Breadcrumb />
		<div class="ml-auto flex items-center gap-2">
			<!-- New Actions Dropdown -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="icon" class="size-8">
						<PlusIcon class="size-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item
						onSelect={() => (window.location.href = `/${$page.params.workspace}/products/new`)}
						>New Product</DropdownMenu.Item
					>
					<DropdownMenu.Item
						onSelect={() => (window.location.href = `/${$page.params.workspace}/orders/new`)}
						>New Order</DropdownMenu.Item
					>
					<DropdownMenu.Item
						onSelect={() => (window.location.href = `/${$page.params.workspace}/shipments/new`)}
						>New Shipment</DropdownMenu.Item
					>
					<DropdownMenu.Item
						onSelect={() => (window.location.href = `/${$page.params.workspace}/returns/new`)}
						>New Return</DropdownMenu.Item
					>
					<DropdownMenu.Item
						onSelect={() => (window.location.href = `/${$page.params.workspace}/jobs/new`)}
						>New Job</DropdownMenu.Item
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<!-- Notifications -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="icon" class="size-8">
						<BellIcon class="size-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>No notifications</DropdownMenu.Label>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<!-- Settings -->
			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				href={`/${$page.params.workspace}/settings`}
			>
				<SettingsIcon class="size-4" />
			</Button>

			<!-- Documentation -->
			<Button variant="ghost" size="icon" class="size-8" href="/docs/setup">
				<BookIcon class="size-4" />
			</Button>
		</div>
	</div>
</header>
