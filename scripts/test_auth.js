#!/usr/bin/env node

import PocketBase from 'pocketbase';

const PB_URL = 'https://academy.pockethost.io';
const PB_ADMIN_EMAIL = 'admin@turtle.academy';
const PB_ADMIN_PASSWORD = 'myPassword123';

const pb = new PocketBase(PB_URL);

async function testAuth() {
	try {
		console.log('🔐 Testing authentication...');
		console.log('URL:', PB_URL);
		console.log('Email:', PB_ADMIN_EMAIL);

		// Try different authentication methods
		console.log('\n1. Trying pb.admins.authWithPassword...');
		const authResult = await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
		console.log('✅ Authentication successful:', authResult.admin.email);

		// Test if we can access collections
		console.log('\n2. Testing collections access...');
		const collections = await pb.collections.getFullList();
		console.log('✅ Collections access successful. Found', collections.length, 'collections');

		// List existing collections
		if (collections.length > 0) {
			console.log('\nExisting collections:');
			collections.forEach((c) => console.log('  -', c.name, '(id:', c.id + ')'));
		} else {
			console.log('\nNo collections found - ready for setup!');
		}
	} catch (error) {
		console.error('❌ Authentication failed:', error.message);
		if (error.response) {
			console.error('   Response:', error.response);
		}
		console.error('   Full error:', error);
	}
}

testAuth();
