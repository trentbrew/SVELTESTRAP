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

async function verifySetup() {
	try {
		console.log('🔍 Verifying Academy setup...');

		// Authenticate
		await authenticate();

		// Check collections
		console.log('\n📋 Collections:');
		const collectionsResponse = await makeRequest('collections');
		const collections = collectionsResponse.items || collectionsResponse;
		const academyCollections = collections.filter((c) =>
			['courses', 'modules', 'lessons', 'exercises', 'badges'].includes(c.name)
		);

		academyCollections.forEach((collection) => {
			console.log(`   ✅ ${collection.name} (${collection.id})`);
		});

		// Check courses
		console.log('\n📚 Courses:');
		const courses = await makeRequest('collections/courses/records');
		const coursesList = courses.items || courses;
		coursesList.forEach((course) => {
			console.log(`   ✅ ${course.title} (${course.slug})`);
		});

		// Check modules
		console.log('\n📖 Modules:');
		const modules = await makeRequest('collections/modules/records');
		const modulesList = modules.items || modules;
		modulesList.forEach((module) => {
			console.log(`   ✅ ${module.title}`);
		});

		// Check lessons
		console.log('\n📝 Lessons:');
		const lessons = await makeRequest('collections/lessons/records');
		const lessonsList = lessons.items || lessons;
		lessonsList.forEach((lesson) => {
			console.log(`   ✅ ${lesson.title} (${lesson.slug})`);
		});

		// Check users
		console.log('\n👥 Users:');
		const users = await makeRequest('collections/users/records');
		const usersList = users.items || users;
		usersList.forEach((user) => {
			if (user.email === 'instructor@academy.dev') {
				console.log(`   ✅ ${user.email} (${user.role || 'user'})`);
			}
		});

		console.log('\n🎉 Academy setup verification completed!');
		console.log('🌐 Admin UI: https://academy.pockethost.io/_/');
		console.log('👨‍🏫 Instructor: instructor@academy.dev / instructor123');
	} catch (error) {
		console.error('❌ Verification failed:', error.message);
		process.exit(1);
	}
}

verifySetup();
