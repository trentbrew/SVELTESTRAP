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

async function checkExistingCollections() {
	console.log('📋 Checking existing collections...');
	try {
		const response = await makeRequest('collections');
		const collections = response.items || response;

		if (Array.isArray(collections)) {
			const collectionNames = collections.map((c) => c.name);
			console.log('Found collections:', collectionNames);

			if (collectionNames.includes('courses')) {
				console.log('⚠️  Collections already exist. Found:', collectionNames.join(', '));
				return true;
			} else {
				console.log('✅ No existing collections found. Ready for setup.');
				return false;
			}
		} else {
			console.log('✅ No existing collections found.');
			return false;
		}
	} catch (error) {
		console.log('✅ No existing collections found (or error checking):', error.message);
		return false;
	}
}

async function createCollection(config) {
	console.log(`   Creating collection: ${config.name}...`);

	const response = await makeRequest('collections', {
		method: 'POST',
		body: JSON.stringify(config)
	});

	console.log(`   ✅ Created collection: ${config.name}`);
	return response;
}

async function createCollections() {
	console.log('📋 Creating collections...');

	// Fixed IDs for relations (exactly 15 characters)
	const IDS = {
		users: '_pb_users_auth_',
		courses: 'crs01academy001',
		modules: 'mod01academy001',
		lessons: 'les01academy001',
		exercises: 'exr01academy001',
		checks: 'chk01academy001',
		submissions: 'sub01academy001',
		progress: 'prg01academy001',
		assets: 'ast01academy001',
		badges: 'bdg01academy001',
		achievements: 'ach01academy001',
		xp_events: 'xpe01academy001'
	};

	// 1) courses - simplified schema
	await createCollection({
		id: IDS.courses,
		name: 'courses',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'course_title_field',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{
				id: 'course_slug_field',
				name: 'slug',
				type: 'text',
				required: true,
				unique: true,
				options: { pattern: '^[a-z0-9-]{3,}$' }
			},
			{ id: 'course_description_field', name: 'description', type: 'text', options: { max: 5000 } },
			{
				id: 'course_author_field',
				name: 'author',
				type: 'relation',
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{
				id: 'course_status_field',
				name: 'status',
				type: 'select',
				options: { maxSelect: 1, values: ['draft', 'published'] }
			}
		],
		indexes: ['CREATE UNIQUE INDEX idx_courses_slug ON courses (slug)'],
		listRule:
			"status = 'published' || @request.auth.role ?~ '(instructor|admin)' || author = @request.auth.id",
		viewRule: "@request.auth.id != ''",
		createRule: "@request.auth.role ?~ '(instructor|admin)'",
		updateRule: "author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 2) modules - simplified schema
	await createCollection({
		id: IDS.modules,
		name: 'modules',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'module_course_field',
				name: 'course',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.courses, maxSelect: 1 }
			},
			{
				id: 'module_title_field',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{ id: 'module_order_field', name: 'order', type: 'number', options: {} }
		],
		indexes: ['CREATE INDEX idx_modules_course_order ON modules (course, `order`)'],
		listRule: "course.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 3) lessons - simplified schema
	await createCollection({
		id: IDS.lessons,
		name: 'lessons',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'lesson_course_field',
				name: 'course',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.courses, maxSelect: 1 }
			},
			{
				id: 'lesson_module_field',
				name: 'module',
				type: 'relation',
				options: { collectionId: IDS.modules, maxSelect: 1 }
			},
			{
				id: 'lesson_title_field',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{
				id: 'lesson_slug_field',
				name: 'slug',
				type: 'text',
				required: true,
				options: { pattern: '^[a-z0-9-]{3,}$' }
			},
			{
				id: 'lesson_status_field',
				name: 'status',
				type: 'select',
				options: { maxSelect: 1, values: ['draft', 'published'] }
			}
		],
		indexes: ['CREATE UNIQUE INDEX idx_lessons_course_slug ON lessons (course, slug)'],
		listRule:
			"(course.status = 'published' && status = 'published') || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 4) exercises - simplified schema
	await createCollection({
		id: IDS.exercises,
		name: 'exercises',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'exercise_lesson_field',
				name: 'lesson',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.lessons, maxSelect: 1 }
			},
			{
				id: 'exercise_title_field',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{
				id: 'exercise_prompt_field',
				name: 'prompt',
				type: 'text',
				required: true,
				options: { max: 8000 }
			}
		],
		indexes: ['CREATE INDEX idx_exercises_lesson ON exercises (lesson)'],
		listRule: "lesson.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 5) badges - simplified schema
	await createCollection({
		id: IDS.badges,
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
			{ id: 'badge_description_field', name: 'description', type: 'text', options: { max: 2000 } }
		],
		indexes: ['CREATE UNIQUE INDEX idx_badges_key ON badges (key)'],
		listRule: true,
		viewRule: true,
		createRule: "@request.auth.role ?~ '(instructor|admin)'",
		updateRule: "@request.auth.role ?~ '(instructor|admin)'",
		deleteRule: "@request.auth.role = 'admin'"
	});
}

async function createSeedData() {
	console.log('🌱 Creating seed data...');

	// Create instructor account
	let instructor;
	try {
		instructor = await makeRequest('collections/users/records', {
			method: 'POST',
			body: JSON.stringify({
				email: 'instructor@academy.dev',
				emailVisibility: true,
				password: 'instructor123',
				passwordConfirm: 'instructor123',
				name: 'Academy Instructor',
				role: 'instructor'
			})
		});
		console.log('   ✅ Created instructor account');
	} catch (error) {
		if (error.message.includes('already exists') || error.message.includes('duplicate')) {
			// Try to find existing instructor
			const instructors = await makeRequest(
				'collections/users/records?filter=email="instructor@academy.dev"'
			);
			if (instructors.items && instructors.items.length > 0) {
				instructor = instructors.items[0];
				console.log('   ✅ Using existing instructor account');
			} else {
				throw error;
			}
		} else {
			throw error;
		}
	}

	// Create Course 1: JavaScript Fundamentals
	const course1 = await makeRequest('collections/courses/records', {
		method: 'POST',
		body: JSON.stringify({
			title: 'JavaScript Fundamentals',
			slug: 'javascript-fundamentals',
			description:
				'Master the fundamentals of JavaScript programming. Learn variables, functions, objects, and control structures.',
			author: instructor.id,
			status: 'published'
		})
	});
	console.log('   ✅ Created JavaScript Fundamentals course');

	// Create Course 1 Modules
	const jsModule1 = await makeRequest('collections/modules/records', {
		method: 'POST',
		body: JSON.stringify({
			course: course1.id,
			title: 'Variables and Data Types',
			order: 1
		})
	});

	const jsModule2 = await makeRequest('collections/modules/records', {
		method: 'POST',
		body: JSON.stringify({
			course: course1.id,
			title: 'Functions and Scope',
			order: 2
		})
	});

	// Create Course 1 Lessons
	const jsLessons = [
		{ title: 'Introduction to Variables', slug: 'introduction-to-variables', module: jsModule1.id },
		{ title: 'Data Types in JavaScript', slug: 'data-types-in-javascript', module: jsModule1.id },
		{ title: 'Function Declarations', slug: 'function-declarations', module: jsModule2.id }
	];

	for (const lesson of jsLessons) {
		await makeRequest('collections/lessons/records', {
			method: 'POST',
			body: JSON.stringify({
				course: course1.id,
				module: lesson.module,
				title: lesson.title,
				slug: lesson.slug,
				status: 'published'
			})
		});
	}
	console.log('   ✅ Created JavaScript lessons');

	// Create Course 2: React Development
	const course2 = await makeRequest('collections/courses/records', {
		method: 'POST',
		body: JSON.stringify({
			title: 'React Development',
			slug: 'react-development',
			description:
				'Build modern web applications with React. Learn components, hooks, state management, and best practices.',
			author: instructor.id,
			status: 'published'
		})
	});
	console.log('   ✅ Created React Development course');

	// Create Course 2 Modules
	const reactModule1 = await makeRequest('collections/modules/records', {
		method: 'POST',
		body: JSON.stringify({
			course: course2.id,
			title: 'Components and JSX',
			order: 1
		})
	});

	// Create some React lessons
	const reactLessons = [
		{ title: 'Introduction to React', slug: 'introduction-to-react', module: reactModule1.id },
		{ title: 'Understanding JSX', slug: 'understanding-jsx', module: reactModule1.id }
	];

	for (const lesson of reactLessons) {
		await makeRequest('collections/lessons/records', {
			method: 'POST',
			body: JSON.stringify({
				course: course2.id,
				module: lesson.module,
				title: lesson.title,
				slug: lesson.slug,
				status: 'published'
			})
		});
	}
	console.log('   ✅ Created React lessons');

	// Create sample badges
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
		await makeRequest('collections/badges/records', {
			method: 'POST',
			body: JSON.stringify({
				key: badge.key,
				name: badge.name,
				description: badge.description
			})
		});
	}
	console.log('   ✅ Created sample badges');
}

async function setupAcademy() {
	try {
		console.log('🚀 Starting Academy Hosted Setup');
		console.log(`📡 Connecting to: ${PB_URL}`);

		// Authenticate
		await authenticate();

		// Check if collections already exist
		const hasExistingCollections = await checkExistingCollections();

		if (!hasExistingCollections) {
			// Create collections
			await createCollections();
		} else {
			console.log('📋 Collections already exist, skipping creation...');
		}

		// Create seed data
		await createSeedData();

		console.log('\n🎉 Academy hosted setup completed successfully!');
		console.log('👨‍🏫 Instructor: instructor@academy.dev / instructor123');
		console.log('🌐 Admin UI: https://academy.pockethost.io/_/');
	} catch (error) {
		console.error('❌ Setup failed:', error.message);
		process.exit(1);
	}
}

// Run the setup
setupAcademy();
