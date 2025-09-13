// Centralized app routes and helpers for workspace-aware paths

export const DEFAULT_WORKSPACE = 'academy';

export function wsPath(workspace: string, subpath = ''): string {
	const clean = subpath.startsWith('/') ? subpath : `/${subpath}`;
	return `/${workspace}${clean}`;
}

export function makeRoutes(workspace: string) {
	return {
		// workspace-scoped
		dashboard: wsPath(workspace, '/dashboard'),
		orders: wsPath(workspace, '/orders'),
		shipments: wsPath(workspace, '/shipments'),
		returns: wsPath(workspace, '/returns'),
		products: wsPath(workspace, '/products'),
		inventory: wsPath(workspace, '/inventory'),
		downloads: wsPath(workspace, '/downloads'),
		connectors: wsPath(workspace, '/connectors'),
		jobs: wsPath(workspace, '/jobs'),
		analytics: wsPath(workspace, '/analytics'),
		jobRuns: wsPath(workspace, '/job-runs'),
		reconcile: wsPath(workspace, '/reconcile'),
		settings: wsPath(workspace, '/settings'),

		// global docs (non-workspace)
		docs: {
			productOverview: '/docs/product-overview',
			mvp: '/docs/mvp',
			architecture: '/docs/architecture',
			dataModel: '/docs/data-model',
			coreFlows: '/docs/core-flows',
			apiSurface: '/docs/api-surface',
			integrationContracts: '/docs/integration-contracts',
			setup: '/docs/setup',
			pricing: '/docs/pricing',
			goNoGo: '/docs/go-no-go',
			scaffoldNext: '/docs/scaffold-next'
		},

		help: '/help',
		feedback: '/feedback'
	} as const;
}
