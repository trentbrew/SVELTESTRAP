#!/usr/bin/env node

const PB_URL = 'https://academy.pockethost.io';
const PB_ADMIN_EMAIL = 'admin@turtle.academy';
const PB_ADMIN_PASSWORD = 'myPassword123';

let authToken = null;

async function authenticate() {
	console.log('🔐 Authenticating as admin...');

	const response = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			identity: PB_ADMIN_EMAIL,
			password: PB_ADMIN_PASSWORD
		})
	});

	if (!response.ok) {
		throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	authToken = data.token;
	console.log('✅ Admin authentication successful');
	return data;
}

async function makeRequest(endpoint, options = {}) {
	const url = `${PB_URL}/api/${endpoint}`;
	const headers = {
		'Content-Type': 'application/json',
		...options.headers
	};

	if (authToken) {
		headers['Authorization'] = `Bearer ${authToken}`;
	}

	const response = await fetch(url, {
		...options,
		headers
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
	}

	return response.json();
}

async function createBadgesCollection() {
	console.log('📋 Creating badges collection...');

	try {
		const response = await makeRequest('collections', {
			method: 'POST',
			body: JSON.stringify({
				id: 'bdg01academy001',
				name: 'badges',
				type: 'base',
				system: false,
				schema: [
					{
						id: 'badge_key_field',
						name: 'key',
						type: 'text',
						required: true,
						unique: true,
						options: { pattern: '^[a-z0-9_\\-]+$' }
					},
					{
						id: 'badge_name_field',
						name: 'name',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					},
					{
						id: 'badge_description_field',
						name: 'description',
						type: 'text',
						options: { max: 2000 }
					}
				],
				indexes: ['CREATE UNIQUE INDEX idx_badges_key ON badges (key)'],
				listRule: true,
				viewRule: true,
				createRule: "@request.auth.role ?~ '(instructor|admin)'",
				updateRule: "@request.auth.role ?~ '(instructor|admin)'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		});
		console.log('✅ Created badges collection');
		return response;
	} catch (error) {
		if (error.message.includes('already exists') || error.message.includes('duplicate')) {
			console.log('✅ Badges collection already exists');
			return null;
		} else {
			throw error;
		}
	}
}

async function createBadges() {
	console.log('🏆 Creating sample badges...');

	const badges = [
		{ key: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson' },
		{
			key: 'javascript_basics',
			name: 'JavaScript Basics',
			description: 'Complete all JavaScript Fundamentals lessons'
		},
		{
			key: 'react_beginner',
			name: 'React Beginner',
			description: 'Complete the React Development course'
		}
	];

	for (const badge of badges) {
		try {
			await makeRequest('collections/badges/records', {
				method: 'POST',
				body: JSON.stringify({
					key: badge.key,
					name: badge.name,
					description: badge.description
				})
			});
			console.log(`   ✅ Created badge: ${badge.name}`);
		} catch (error) {
			if (error.message.includes('already exists') || error.message.includes('duplicate')) {
				console.log(`   ✅ Badge already exists: ${badge.name}`);
			} else {
				console.error(`   ❌ Failed to create badge ${badge.name}:`, error.message);
			}
		}
	}
}

async function main() {
	try {
		console.log('🚀 Creating badges collection and sample badges...');

		// Authenticate
		await authenticate();

		// Create badges collection
		await createBadgesCollection();

		// Create sample badges
		await createBadges();

		console.log('\n🎉 Badges setup completed successfully!');
		console.log('🌐 Admin UI: https://academy.pockethost.io/_/');
	} catch (error) {
		console.error('❌ Setup failed:', error.message);
		process.exit(1);
	}
}

main();
