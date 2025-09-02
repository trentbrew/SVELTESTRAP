import type { ComponentType, SvelteComponent } from 'svelte';
import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
import ReportIcon from '@tabler/icons-svelte/icons/report';
import DatabaseIcon from '@tabler/icons-svelte/icons/database';
import SettingsIcon from '@tabler/icons-svelte/icons/settings';
import HelpIcon from '@tabler/icons-svelte/icons/help';
import MessageIcon from '@tabler/icons-svelte/icons/message';
import FileDescriptionIcon from '@tabler/icons-svelte/icons/file-description';
// New icons aligned to PocketFlow
import ShoppingCartIcon from '@tabler/icons-svelte/icons/shopping-cart';
import TruckIcon from '@tabler/icons-svelte/icons/truck';
import RotateIcon from '@tabler/icons-svelte/icons/rotate-2';
import PackageIcon from '@tabler/icons-svelte/icons/package';
import DownloadIcon from '@tabler/icons-svelte/icons/download';
import PlugIcon from '@tabler/icons-svelte/icons/plug';
import BoltIcon from '@tabler/icons-svelte/icons/bolt';
import { registerIcon } from '$lib/stores/pinned-items.svelte.js';
import { makeRoutes } from '$lib/routes';

// Register all icons for serialization
registerIcon('dashboard', DashboardIcon);
registerIcon('chart-bar', ChartBarIcon);
registerIcon('report', ReportIcon);
registerIcon('database', DatabaseIcon);
registerIcon('settings', SettingsIcon);
registerIcon('help', HelpIcon);
registerIcon('message', MessageIcon);
registerIcon('file-description', FileDescriptionIcon);
registerIcon('shopping-cart', ShoppingCartIcon);
registerIcon('truck', TruckIcon);
registerIcon('rotate-2', RotateIcon);
registerIcon('package', PackageIcon);
registerIcon('download', DownloadIcon);
registerIcon('plug', PlugIcon);
registerIcon('bolt', BoltIcon);

export type NavItem = {
	title: string;
	url: string;
	icon?: ComponentType<SvelteComponent>;
	isActive?: boolean;
	description?: string;
	items?: Array<{
		title: string;
		url: string;
	}>;
};

export type UserData = {
	name: string;
	email: string;
	avatar: string;
};

export type Workspace = {
	id: string;
	name: string;
	logo: string;
	url: string;
	isActive?: boolean;
};

export function getSidebarData(workspace: string) {
	const routes = makeRoutes(workspace);
	return {
		// TODO: make user dynamic
		user: {
			name: 'PocketFlow Demo',
			email: 'demo@pocketflow.dev',
			avatar:
				'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/th69qz07n9gsddr/avatar_DW57vH1BP3.png?token='
		} as UserData,
		// TODO: make workspaces dynamic
		workspaces: [
			{
				id: workspace,
				name: 'PocketFlow',
				logo: 'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/phwvuxr87m2x8m2/group_5_DZDQTT6EPX.png?token=',
				url: routes.dashboard,
				isActive: true
			}
		] as Workspace[],
		navMain: [
			{
				title: 'Dashboard',
				url: routes.dashboard,
				icon: DashboardIcon,
				description: 'Live orders, shipments, failures, retry'
			},
			{
				title: 'Orders',
				url: routes.orders,
				icon: ShoppingCartIcon,
				description: 'All orders from Webflow; statuses and actions'
			},
			{
				title: 'Shipments',
				url: routes.shipments,
				icon: TruckIcon,
				description: 'Rates, labels, tracking via Shippo'
			},
			{
				title: 'Returns',
				url: routes.returns,
				icon: RotateIcon,
				description: 'Initiate and track return shipments'
			},
			{
				title: 'Products',
				url: routes.products,
				icon: PackageIcon,
				description: 'Product catalog and SKU mapping'
			},
			{
				title: 'Inventory',
				url: routes.inventory,
				icon: DatabaseIcon,
				description: 'PocketFlow as SSoT; stock levels'
			},
			{
				title: 'Downloads',
				url: routes.downloads,
				icon: DownloadIcon,
				description: 'Digital delivery links and fulfillment'
			},
			{
				title: 'Connectors',
				url: routes.connectors,
				icon: PlugIcon,
				description: 'Webflow, Stripe (read-only), Shippo settings'
			},
			{
				title: 'Jobs',
				url: routes.jobs,
				icon: BoltIcon,
				description: 'Retries, reconcile tasks, job runs'
			}
		] as NavItem[],
		navContent: [
			{
				title: 'Product Overview',
				url: routes.docs.productOverview,
				icon: FileDescriptionIcon,
				description: 'What PocketFlow is and who it’s for'
			},
			{
				title: 'MVP Scope',
				url: routes.docs.mvp,
				icon: FileDescriptionIcon,
				description: 'Must-haves, nice-later, and out-of-scope'
			},
			{
				title: 'Architecture',
				url: routes.docs.architecture,
				icon: FileDescriptionIcon,
				description: 'Hono API, PocketBase, and integrations'
			},
			{
				title: 'Data Model',
				url: routes.docs.dataModel,
				icon: FileDescriptionIcon,
				description: 'Collections and SSoT schema'
			},
			{
				title: 'Core Flows',
				url: routes.docs.coreFlows,
				icon: FileDescriptionIcon,
				description: 'Physical, digital, returns, status webhooks'
			},
			{
				title: 'API Surface',
				url: routes.docs.apiSurface,
				icon: FileDescriptionIcon,
				description: 'Webhooks, actions, and ops routes'
			},
			{
				title: 'Integration Contracts',
				url: routes.docs.integrationContracts,
				icon: FileDescriptionIcon,
				description: 'Webflow, Shippo, and writebacks'
			},
			{
				title: 'Setup Wizard',
				url: routes.docs.setup,
				icon: FileDescriptionIcon,
				description: '10-minute setup steps'
			},
			{
				title: 'Pricing',
				url: routes.docs.pricing,
				icon: FileDescriptionIcon,
				description: 'Simple plans aligned to value'
			},
			{
				title: 'Go/No-Go',
				url: routes.docs.goNoGo,
				icon: FileDescriptionIcon,
				description: 'Kill rules and latency notes'
			},
			{
				title: 'Scaffold Next',
				url: routes.docs.scaffoldNext,
				icon: FileDescriptionIcon,
				description: 'Adapters, routes, libs, observability'
			}
		] as NavItem[],
		navAnalytics: [
			{
				title: 'Analytics',
				url: routes.analytics,
				icon: ChartBarIcon,
				description: 'Orders, shipments, fulfillment rates'
			},
			{
				title: 'Job Runs',
				url: routes.jobRuns,
				icon: ReportIcon,
				description: 'Background jobs, retries, and statuses'
			},
			{
				title: 'Reconcile',
				url: routes.reconcile,
				icon: DatabaseIcon,
				description: 'Compare Webflow vs SSoT and fix drifts'
			}
		] as NavItem[],
		navSecondary: [
			{
				title: 'Settings',
				url: routes.settings,
				icon: SettingsIcon,
				description: 'Account and workspace settings'
			},
			{ title: 'Help', url: routes.help, icon: HelpIcon, description: 'Help center and support' },
			{
				title: 'Feedback',
				url: routes.feedback,
				icon: MessageIcon,
				description: 'Share feedback about PocketFlow'
			}
		] as NavItem[]
	} as const;
}
