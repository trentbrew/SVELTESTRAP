import { makeRoutes } from '$lib/routes';

export type NavItem = {
	title: string;
	url: string;
	icon?: string;
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
			name: 'TurtleCode Demo',
			email: 'demo@pocketflow.dev',
			avatar:
				'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/th69qz07n9gsddr/avatar_DW57vH1BP3.png?token='
		} as UserData,
		// TODO: make workspaces dynamic
		workspaces: [
			{
				id: workspace,
				name: 'turtle_academy',
				logo: 'https://academy.pockethost.io/api/files/n3xvlemfwmvfb26/c7jw60d2lytu1qs/a_g_iZZdwT8fUe.svg',
				url: routes.dashboard,
				isActive: true
			}
		] as Workspace[],
		navMain: [
			{
				title: 'Courses',
				url: routes.dashboard,
				icon: 'dashboard',
				description: 'Live orders, shipments, failures, retry'
			},
			{
				title: 'Resources',
				url: routes.orders,
				icon: 'book',
				description: 'All orders from Webflow; statuses and actions'
			},
			{
				title: 'Exercises',
				url: routes.shipments,
				icon: 'brain',
				description: 'Rates, labels, tracking via Shippo'
			},
			{
				title: 'Community',
				url: routes.returns,
				icon: 'flame',
				description: 'Initiate and track return shipments'
			},
			{
				title: 'Arcade',
				url: routes.products,
				icon: 'users',
				description: 'Product catalog and SKU mapping'
			}
		] as NavItem[],
		navContent: [
			{
				title: 'Product Overview',
				url: routes.docs.productOverview,
				icon: 'fileQuestion',
				description: "What PocketFlow is and who it's for"
			},
			{
				title: 'MVP Scope',
				url: routes.docs.mvp,
				icon: 'fileQuestion',
				description: 'Must-haves, nice-later, and out-of-scope'
			},
			{
				title: 'Architecture',
				url: routes.docs.architecture,
				icon: 'fileQuestion',
				description: 'Hono API, PocketBase, and integrations'
			},
			{
				title: 'Data Model',
				url: routes.docs.dataModel,
				icon: 'fileText',
				description: 'Collections and SSoT schema'
			},
			{
				title: 'Core Flows',
				url: routes.docs.coreFlows,
				icon: 'fileText',
				description: 'Physical, digital, returns, status webhooks'
			},
			{
				title: 'API Surface',
				url: routes.docs.apiSurface,
				icon: 'fileText',
				description: 'Webhooks, actions, and ops routes'
			},
			{
				title: 'Integration Contracts',
				url: routes.docs.integrationContracts,
				icon: 'fileText',
				description: 'Webflow, Shippo, and writebacks'
			},
			{
				title: 'Setup Wizard',
				url: routes.docs.setup,
				icon: 'fileText',
				description: '10-minute setup steps'
			},
			{
				title: 'Pricing',
				url: routes.docs.pricing,
				icon: 'fileText',
				description: 'Simple plans aligned to value'
			},
			{
				title: 'Go/No-Go',
				url: routes.docs.goNoGo,
				icon: 'fileText',
				description: 'Kill rules and latency notes'
			},
			{
				title: 'Scaffold Next',
				url: routes.docs.scaffoldNext,
				icon: 'fileText',
				description: 'Adapters, routes, libs, observability'
			}
		] as NavItem[],
		navAnalytics: [
			{
				title: 'Analytics',
				url: routes.analytics,
				icon: 'chart',
				description: 'Orders, shipments, fulfillment rates'
			},
			{
				title: 'Job Runs',
				url: routes.jobRuns,
				icon: 'barChart',
				description: 'Background jobs, retries, and statuses'
			},
			{
				title: 'Reconcile',
				url: routes.reconcile,
				icon: 'database',
				description: 'Compare Webflow vs SSoT and fix drifts'
			}
		] as NavItem[],
		navSecondary: [
			{
				title: 'Settings',
				url: routes.settings,
				icon: 'settings',
				description: 'Account and workspace settings'
			},
			{
				title: 'Help',
				url: routes.help,
				icon: 'help',
				description: 'Help center and support'
			},
			{
				title: 'Feedback',
				url: routes.feedback,
				icon: 'messageSquare',
				description: 'Share feedback about PocketFlow'
			}
		] as NavItem[]
	} as const;
}
