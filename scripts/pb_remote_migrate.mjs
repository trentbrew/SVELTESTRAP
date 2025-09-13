// One-off remote PocketBase migration runner for Pockethost (or any PB URL)
// Usage:
//   PB_URL=https://your.pockethost.io PB_ADMIN_EMAIL=admin@example.com PB_ADMIN_PASSWORD=secret \
//   node apps/app/scripts/pb_remote_migrate.mjs
//
// Notes:
// - Applies the same schema changes as 003_webflow_centric.js
// - Safe to run multiple times (idempotent-ish)

import PocketBase from 'pocketbase';

// Read from env and sanitize the base URL (remove '/_/' admin UI path if present)
const rawUrl = process.env.PB_URL || 'http://localhost:3456';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '';

function sanitizeBaseUrl(u) {
	if (!u) return u;
	try {
		const url = new URL(u);
		// strip '/_/' or '/_' if provided
		if (url.pathname && url.pathname.startsWith('/_/')) {
			url.pathname = '/';
		} else if (url.pathname === '/_') {
			url.pathname = '/';
		}
		// drop trailing slash except root
		const s = url.toString();
		return s.endsWith('/') ? s.slice(0, -1) : s;
	} catch {
		return u.replace(/\/_\/?$/, '');
	}
}

const PB_URL = sanitizeBaseUrl(rawUrl);

if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
	console.error('Missing env vars. Required: PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const pb = new PocketBase(PB_URL);

function upsertField(schema, fieldSpec) {
	const idx = schema.findIndex((f) => f.name === fieldSpec.name);
	if (idx === -1) schema.push(fieldSpec);
	else schema[idx] = { ...schema[idx], ...fieldSpec };
}

function removeField(schema, name) {
	const i = schema.findIndex((f) => f.name === name);
	if (i !== -1) schema.splice(i, 1);
}

function ensureSelectValue(schema, fieldName, value) {
	const f = schema.find((f) => f.name === fieldName && f.type === 'select');
	if (!f) return; // nothing to change
	const vals = new Set(f.options?.values || []);
	vals.add(value);
	f.options = { ...(f.options || {}), values: Array.from(vals) };
}

function ensureIndex(indexes, sql) {
	if (!Array.isArray(indexes)) indexes = [];
	if (!indexes.some((s) => s.trim() === sql.trim())) indexes.push(sql);
	return indexes;
}

async function main() {
	console.log('PB_URL:', PB_URL);
	// quick connectivity check
	await pb.health.check();
	console.log('Authenticating admin...');
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

	// ===== ORDERS =====
	{
		const orders = await pb.collections.getOne('orders');
		const schema = [...orders.schema];
		upsertField(schema, {
			name: 'webflow_order_id',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		upsertField(schema, {
			name: 'idempotency_key',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		// status values (if present)
		const s = schema.find((f) => f.name === 'status' && f.type === 'select');
		if (s)
			s.options = {
				...(s.options || {}),
				maxSelect: 1,
				values: ['pending', 'paid', 'processing', 'fulfilled', 'returned', 'failed']
			};
		// shipping_method add 'shippo'
		ensureSelectValue(schema, 'shipping_method', 'shippo');
		// remove legacy relation 'products'
		removeField(schema, 'products');

		let indexes = Array.from(orders.indexes || []);
		indexes = ensureIndex(
			indexes,
			'create index if not exists "idx_orders_webflow" on "orders" ("webflow_order_id")'
		);
		indexes = ensureIndex(
			indexes,
			'create index if not exists "idx_orders_stripe" on "orders" ("stripe_payment_id")'
		);
		indexes = ensureIndex(
			indexes,
			'create unique index if not exists "idx_orders_idem" on "orders" ("idempotency_key")'
		);

		await pb.collections.update(orders.id, { schema, indexes });
		console.log('Updated orders');
	}

	// Get orders again for id reference
	const ordersRef = await pb.collections.getOne('orders');

	// ===== FULFILLMENTS =====
	{
		const fulf = await pb.collections.getOne('fulfillments');
		const schema = [...fulf.schema];
		// remove wrong self relation
		removeField(schema, 'orders');
		// ensure correct relation -> orders
		if (!schema.find((f) => f.name === 'order' && f.type === 'relation')) {
			schema.push({
				name: 'order',
				type: 'relation',
				required: true,
				options: {
					collectionId: ordersRef.id,
					cascadeDelete: false,
					minSelect: null,
					maxSelect: 1,
					displayFields: []
				}
			});
		}
		// provider select
		upsertField(schema, {
			name: 'provider',
			type: 'select',
			required: false,
			options: { maxSelect: 1, values: ['shippo'] }
		});

		let indexes = Array.from(fulf.indexes || []);
		indexes = ensureIndex(
			indexes,
			'create index if not exists "idx_fulfillments_order" on "fulfillments" ("order")'
		);
		// include tracking index only if field exists
		if (schema.find((f) => f.name === 'tracking_number')) {
			indexes = ensureIndex(
				indexes,
				'create index if not exists "idx_fulfillments_tracking" on "fulfillments" ("tracking_number")'
			);
		}

		await pb.collections.update(fulf.id, { schema, indexes });
		console.log('Updated fulfillments');
	}

	// ===== ORDER_ITEMS =====
	{
		const items = await pb.collections.getOne('order_items');
		const schema = [...items.schema];
		upsertField(schema, {
			name: 'sku',
			type: 'text',
			required: true,
			options: { min: null, max: null, pattern: '' }
		});
		upsertField(schema, {
			name: 'webflow_variant_id',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		await pb.collections.update(items.id, { schema });
		console.log('Updated order_items');
	}

	// ===== PRODUCTS =====
	{
		const products = await pb.collections.getOne('products');
		const schema = [...products.schema];
		upsertField(schema, {
			name: 'sku',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		upsertField(schema, {
			name: 'webflow_product_id',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		upsertField(schema, {
			name: 'webflow_variant_id',
			type: 'text',
			required: false,
			options: { min: null, max: null, pattern: '' }
		});
		upsertField(schema, {
			name: 'type',
			type: 'select',
			required: false,
			options: { maxSelect: 1, values: ['physical', 'digital'] }
		});
		upsertField(schema, {
			name: 'weight_lbs',
			type: 'number',
			required: false,
			options: { min: 0, max: null }
		});

		let indexes = Array.from(products.indexes || []);
		indexes = ensureIndex(
			indexes,
			'create unique index if not exists "idx_products_sku" on "products" ("sku")'
		);

		await pb.collections.update(products.id, { schema, indexes });
		console.log('Updated products');
	}

	// ===== CUSTOMERS =====
	{
		const customers = await pb.collections.getOne('customers');
		let indexes = Array.from(customers.indexes || []);
		indexes = ensureIndex(
			indexes,
			'create unique index if not exists "idx_customers_email" on "customers" ("email")'
		);
		await pb.collections.update(customers.id, { indexes });
		console.log('Updated customers');
	}

	// ===== SYNC_LOG =====
	{
		const sync = await pb.collections.getOne('sync_log');
		const schema = [...sync.schema];
		ensureSelectValue(schema, 'external_system', 'shippo');
		let indexes = Array.from(sync.indexes || []);
		indexes = ensureIndex(
			indexes,
			'create index if not exists "idx_sync_obj" on "sync_log" ("object_type", "object_id")'
		);
		await pb.collections.update(sync.id, { schema, indexes });
		console.log('Updated sync_log');
	}

	console.log('Remote migration completed successfully.');
}

main().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
