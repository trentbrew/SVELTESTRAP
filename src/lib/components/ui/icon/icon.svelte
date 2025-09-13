<script lang="ts">
	import {
		BookIcon,
		BrainIcon,
		FlameIcon,
		UsersIcon,
		Gamepad2Icon,
		DownloadIcon,
		PlugIcon,
		BoltIcon,
		SettingsIcon,
		HelpCircleIcon,
		MessageCircleIcon,
		FileQuestionIcon,
		FileTextIcon,
		ShoppingCartIcon,
		TruckIcon,
		RotateCwIcon,
		PackageIcon,
		LayoutDashboardIcon,
		ChartBarIcon,
		DatabaseIcon,
		JoystickIcon,
		Package2Icon,
		BarChart3Icon,
		MessageSquareIcon,
		SunIcon,
		MoonIcon,
		SearchIcon,
		MenuIcon,
		XIcon,
		ChevronDownIcon,
		ChevronRightIcon,
		PlusIcon,
		MinusIcon,
		EditIcon,
		TrashIcon,
		SaveIcon,
		CheckIcon,
		AlertCircleIcon,
		InfoIcon
	} from '@lucide/svelte';

	interface Props {
		name: string;
		class?: string;
		size?: number;
	}

	let { name, class: className = '', size = 16 }: Props = $props();

	// Icon registry mapping string names to components
	const iconRegistry: Record<string, any> = {
		// Main navigation icons
		book: BookIcon,
		brain: BrainIcon,
		flame: FlameIcon,
		users: UsersIcon,
		gamepad: Gamepad2Icon,
		download: DownloadIcon,
		plug: PlugIcon,
		bolt: BoltIcon,
		settings: SettingsIcon,
		help: HelpCircleIcon,
		message: MessageCircleIcon,
		fileQuestion: FileQuestionIcon,
		fileText: FileTextIcon,
		shoppingCart: ShoppingCartIcon,
		truck: TruckIcon,
		rotate: RotateCwIcon,
		package: PackageIcon,
		dashboard: LayoutDashboardIcon,
		chart: ChartBarIcon,
		database: DatabaseIcon,
		joystick: JoystickIcon,
		package2: Package2Icon,
		barChart: BarChart3Icon,
		messageSquare: MessageSquareIcon,

		// UI icons
		sun: SunIcon,
		moon: MoonIcon,
		search: SearchIcon,
		menu: MenuIcon,
		close: XIcon,
		chevronDown: ChevronDownIcon,
		chevronRight: ChevronRightIcon,
		plus: PlusIcon,
		minus: MinusIcon,
		edit: EditIcon,
		trash: TrashIcon,
		save: SaveIcon,
		check: CheckIcon,
		alert: AlertCircleIcon,
		info: InfoIcon
	};

	let IconComponent = $derived(iconRegistry[name]);
</script>

{#if IconComponent}
	{@const Component = IconComponent}
	<Component class={className} {size} />
{:else}
	<!-- Fallback for unknown icons -->
	<div class="h-4 w-4 rounded bg-gray-300" title="Unknown icon: {name}"></div>
{/if}
