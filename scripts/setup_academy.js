#!/usr/bin/env node

// Academy Complete Setup Script
// This script sets up the entire Academy platform with schema and seed data
// Usage: node scripts/setup_academy.js

import PocketBase from 'pocketbase';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PB_URL = process.env.PB_URL || 'http://localhost:3456';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '';

const pb = new PocketBase(PB_URL);

// Colors for console output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
	log(`\n${colors.cyan}${step}. ${message}${colors.reset}`);
}

function logSuccess(message) {
	log(`✅ ${message}`, 'green');
}

function logError(message) {
	log(`❌ ${message}`, 'red');
}

function logWarning(message) {
	log(`⚠️  ${message}`, 'yellow');
}

async function checkEnvironment() {
	logStep(1, 'Checking environment variables...');

	if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
		logError('Missing required environment variables:');
		log('  PB_ADMIN_EMAIL - Admin email for PocketBase', 'yellow');
		log('  PB_ADMIN_PASSWORD - Admin password for PocketBase', 'yellow');
		log('\nExample:', 'cyan');
		log(
			'  PB_ADMIN_EMAIL=admin@example.com PB_ADMIN_PASSWORD=secret node scripts/setup_academy.js',
			'cyan'
		);
		process.exit(1);
	}

	logSuccess('Environment variables configured');
}

async function testConnection() {
	logStep(2, 'Testing PocketBase connection...');

	try {
		await pb.health.check();
		logSuccess(`Connected to PocketBase at ${PB_URL}`);
	} catch (error) {
		logError(`Failed to connect to PocketBase: ${error.message}`);
		process.exit(1);
	}
}

async function authenticate() {
	logStep(3, 'Authenticating as admin...');

	try {
		await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
		logSuccess('Admin authentication successful');
	} catch (error) {
		logError(`Admin authentication failed: ${error.message}`);
		process.exit(1);
	}
}

async function runSchemaMigration() {
	logStep(4, 'Running schema migration...');

	try {
		// Import and run the schema migration
		const schemaPath = join(__dirname, 'academy_schema.js');
		const { main: runSchema } = await import(schemaPath);
		await runSchema();
		logSuccess('Schema migration completed');
	} catch (error) {
		logError(`Schema migration failed: ${error.message}`);
		throw error;
	}
}

async function runSeedData() {
	logStep(5, 'Creating seed data...');

	try {
		// Import and run the seed data script
		const seedPath = join(__dirname, 'academy_seed.js');
		const { main: runSeed } = await import(seedPath);
		await runSeed();
		logSuccess('Seed data creation completed');
	} catch (error) {
		logError(`Seed data creation failed: ${error.message}`);
		throw error;
	}
}

async function verifySetup() {
	logStep(6, 'Verifying setup...');

	try {
		// Check if collections exist
		const collections = await pb.collections.getFullList();
		const expectedCollections = [
			'users',
			'courses',
			'modules',
			'lessons',
			'exercises',
			'checks',
			'submissions',
			'progress',
			'assets',
			'badges',
			'achievements',
			'xp_events'
		];

		const existingCollections = collections.map((c) => c.name);
		const missingCollections = expectedCollections.filter(
			(name) => !existingCollections.includes(name)
		);

		if (missingCollections.length > 0) {
			logWarning(`Missing collections: ${missingCollections.join(', ')}`);
		} else {
			logSuccess('All collections created successfully');
		}

		// Check if we have sample data
		const courses = await pb.collection('courses').getList(1, 1);
		const users = await pb.collection('users').getList(1, 1);

		if (courses.totalItems > 0) {
			logSuccess(`Found ${courses.totalItems} course(s)`);
		} else {
			logWarning('No courses found');
		}

		if (users.totalItems > 0) {
			logSuccess(`Found ${users.totalItems} user(s)`);
		} else {
			logWarning('No users found');
		}
	} catch (error) {
		logError(`Verification failed: ${error.message}`);
		throw error;
	}
}

async function displaySummary() {
	logStep(7, 'Setup Summary');

	log('\n🎉 Academy setup completed successfully!', 'green');
	log('\n📋 What was created:', 'cyan');
	log('  • 12 database collections with proper relationships', 'cyan');
	log('  • User authentication system with roles (student/instructor/admin)', 'cyan');
	log('  • Course management system (courses → modules → lessons)', 'cyan');
	log('  • Exercise system with code submission and grading', 'cyan');
	log('  • Progress tracking and gamification (badges, XP)', 'cyan');
	log('  • Asset management for videos and animations', 'cyan');
	log('  • Sample "Foundations" course with 6 lessons', 'cyan');
	log('  • 5 sample users (1 instructor, 4 students)', 'cyan');
	log('  • Sample exercises, progress, and submissions', 'cyan');

	log('\n🔗 Login Credentials:', 'yellow');
	log('  Instructor: instructor@academy.dev / instructor123', 'yellow');
	log('  Students: [name]@student.dev / student123', 'yellow');
	log('    • alice@student.dev', 'yellow');
	log('    • bob@student.dev', 'yellow');
	log('    • carol@student.dev', 'yellow');
	log('    • dave@student.dev', 'yellow');

	log('\n🚀 Next Steps:', 'magenta');
	log('  1. Update your frontend to use the new PocketBase helpers', 'magenta');
	log('  2. Implement the course catalog and lesson player UI', 'magenta');
	log('  3. Add the interactive coding environment (Monaco + WebContainers)', 'magenta');
	log('  4. Build the visualizers for loops, arrays, and functions', 'magenta');
	log('  5. Implement the Kanban board for lesson progress', 'magenta');

	log('\n📚 API Documentation:', 'blue');
	log('  • All helper functions are available in src/lib/pocketbase/index.ts', 'blue');
	log('  • Use the exported functions: auth, courses, lessons, exercises, etc.', 'blue');
	log('  • Real-time subscriptions available via subscribe object', 'blue');

	log('\n🛠️  Development Commands:', 'blue');
	log('  • Run schema only: node scripts/academy_schema.js', 'blue');
	log('  • Run seed only: node scripts/academy_seed.js', 'blue');
	log('  • Full setup: node scripts/setup_academy.js', 'blue');
}

async function main() {
	try {
		log('🚀 Starting Academy Platform Setup', 'bright');
		log('=====================================', 'bright');

		await checkEnvironment();
		await testConnection();
		await authenticate();
		await runSchemaMigration();
		await runSeedData();
		await verifySetup();
		await displaySummary();

		log('\n✨ Setup completed successfully!', 'green');
	} catch (error) {
		logError(`Setup failed: ${error.message}`);
		log('\n🔧 Troubleshooting:', 'yellow');
		log('  • Check your PocketBase URL and admin credentials', 'yellow');
		log('  • Ensure PocketBase is running and accessible', 'yellow');
		log('  • Check the console output above for specific errors', 'yellow');
		log('  • Try running the schema and seed scripts individually', 'yellow');

		process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGINT', () => {
	log('\n\n⚠️  Setup interrupted by user', 'yellow');
	process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
	logError(`Unhandled rejection at: ${promise}, reason: ${reason}`);
	process.exit(1);
});

main();
