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
		const collections = await makeRequest('collections');
		const collectionNames = collections.map((c) => c.name);

		if (collectionNames.includes('courses')) {
			console.log('⚠️  Collections already exist. Found:', collectionNames.join(', '));
			return true;
		} else {
			console.log('✅ No existing collections found. Ready for setup.');
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

	// 1) courses
	await createCollection({
		id: IDS.courses,
		name: 'courses',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'course_title',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{
				id: 'course_slug',
				name: 'slug',
				type: 'text',
				required: true,
				unique: true,
				options: { pattern: '^[a-z0-9-]{3,}$' }
			},
			{ id: 'course_description', name: 'description', type: 'text', options: { max: 5000 } },
			{
				id: 'course_level',
				name: 'level',
				type: 'select',
				options: { maxSelect: 1, values: ['beginner', 'intro'] }
			},
			{
				id: 'course_visibility',
				name: 'visibility',
				type: 'select',
				options: { maxSelect: 1, values: ['public', 'private', 'unlisted'] }
			},
			{
				id: 'course_cover_image',
				name: 'coverImage',
				type: 'file',
				options: { maxSelect: 1, maxSize: 50 * 1024 * 1024 }
			},
			{
				id: 'course_author',
				name: 'author',
				type: 'relation',
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{ id: 'course_order', name: 'order', type: 'number', options: {} },
			{
				id: 'course_status',
				name: 'status',
				type: 'select',
				options: { maxSelect: 1, values: ['draft', 'published'] }
			}
		],
		indexes: [
			'CREATE UNIQUE INDEX idx_courses_slug ON courses (slug)',
			'CREATE INDEX idx_courses_status_visibility ON courses (status, visibility)',
			'CREATE INDEX idx_courses_author ON courses (author)'
		],
		listRule:
			"status = 'published' && visibility = 'public' || @request.auth.role ?~ '(instructor|admin)' || author = @request.auth.id",
		viewRule: "@request.auth.id != ''",
		createRule: "@request.auth.role ?~ '(instructor|admin)'",
		updateRule: "author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 2) modules
	await createCollection({
		id: IDS.modules,
		name: 'modules',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'module_course',
				name: 'course',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.courses, maxSelect: 1 }
			},
			{
				id: 'module_title',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{ id: 'module_order', name: 'order', type: 'number', options: {} },
			{ id: 'module_description', name: 'description', type: 'text', options: { max: 2000 } }
		],
		indexes: ['CREATE INDEX idx_modules_course_order ON modules (course, `order`)'],
		listRule: "course.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 3) lessons
	await createCollection({
		id: IDS.lessons,
		name: 'lessons',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'lesson_course',
				name: 'course',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.courses, maxSelect: 1 }
			},
			{
				id: 'lesson_module',
				name: 'module',
				type: 'relation',
				options: { collectionId: IDS.modules, maxSelect: 1 }
			},
			{
				id: 'lesson_title',
				name: 'title',
				type: 'text',
				required: true,
				options: { min: 1, max: 200 }
			},
			{
				id: 'lesson_slug',
				name: 'slug',
				type: 'text',
				required: true,
				options: { pattern: '^[a-z0-9-]{3,}$' }
			},
			{ id: 'lesson_order', name: 'order', type: 'number', options: {} },
			{ id: 'lesson_estimated_minutes', name: 'estimatedMinutes', type: 'number', options: {} },
			{ id: 'lesson_is_free', name: 'isFree', type: 'bool', options: {} },
			{
				id: 'lesson_status',
				name: 'status',
				type: 'select',
				options: { maxSelect: 1, values: ['draft', 'published'] }
			},
			{ id: 'lesson_content', name: 'content', type: 'json', options: {} },
			{
				id: 'lesson_video_asset',
				name: 'videoAsset',
				type: 'relation',
				options: { collectionId: IDS.assets, maxSelect: 1 }
			},
			{
				id: 'lesson_animation_asset',
				name: 'animationAsset',
				type: 'relation',
				options: { collectionId: IDS.assets, maxSelect: 1 }
			},
			{
				id: 'lesson_created_by',
				name: 'createdBy',
				type: 'relation',
				options: { collectionId: IDS.users, maxSelect: 1 }
			}
		],
		indexes: [
			'CREATE UNIQUE INDEX idx_lessons_course_slug ON lessons (course, slug)',
			'CREATE INDEX idx_lessons_course_module_order ON lessons (course, module, `order`)',
			'CREATE INDEX idx_lessons_status ON lessons (status)'
		],
		listRule:
			"(course.status = 'published' && status = 'published') || @request.auth.role ?~ '(instructor|admin)' || createdBy = @request.auth.id",
		viewRule: "@request.auth.id != ''",
		createRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 4) exercises
	await createCollection({
		id: IDS.exercises,
		name: 'exercises',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'lesson',
				name: 'lesson',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.lessons, maxSelect: 1 }
			},
			{ id: 'title', name: 'title', type: 'text', required: true, options: { min: 1, max: 200 } },
			{ id: 'prompt', name: 'prompt', type: 'text', required: true, options: { max: 8000 } },
			{ id: 'starterCode', name: 'starterCode', type: 'text', options: { max: 20000 } },
			{ id: 'solutionCode', name: 'solutionCode', type: 'text', options: { max: 20000 } },
			{
				id: 'language',
				name: 'language',
				type: 'select',
				options: { maxSelect: 1, values: ['js', 'ts'] }
			},
			{ id: 'maxRuntimeMs', name: 'maxRuntimeMs', type: 'number', options: {} },
			{ id: 'scaffolds', name: 'scaffolds', type: 'json', options: {} },
			{ id: 'order', name: 'order', type: 'number', options: {} },
			{
				id: 'visibility',
				name: 'visibility',
				type: 'select',
				options: { maxSelect: 1, values: ['public', 'hidden'] }
			}
		],
		indexes: ['CREATE INDEX idx_exercises_lesson_order ON exercises (lesson, `order`)'],
		listRule: "lesson.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 5) checks
	await createCollection({
		id: IDS.checks,
		name: 'checks',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'exercise',
				name: 'exercise',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.exercises, maxSelect: 1 }
			},
			{
				id: 'type',
				name: 'type',
				type: 'select',
				required: true,
				options: { maxSelect: 1, values: ['assert', 'stdout', 'unit'] }
			},
			{ id: 'expression', name: 'expression', type: 'text', options: { max: 8000 } },
			{ id: 'timeoutMs', name: 'timeoutMs', type: 'number', options: {} },
			{ id: 'points', name: 'points', type: 'number', options: {} },
			{ id: 'order', name: 'order', type: 'number', options: {} }
		],
		indexes: ['CREATE INDEX idx_checks_exercise_order ON checks (exercise, `order`)'],
		listRule: "exercise.lesson.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "exercise.lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		updateRule: "exercise.lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 6) assets
	await createCollection({
		id: IDS.assets,
		name: 'assets',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'type',
				name: 'type',
				type: 'select',
				options: { maxSelect: 1, values: ['video', 'animation', 'caption', 'data'] }
			},
			{
				id: 'file',
				name: 'file',
				type: 'file',
				options: { maxSelect: 1, maxSize: 500 * 1024 * 1024 }
			},
			{ id: 'durationMs', name: 'durationMs', type: 'number', options: {} },
			{ id: 'meta', name: 'meta', type: 'json', options: {} },
			{
				id: 'owner',
				name: 'owner',
				type: 'relation',
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{
				id: 'visibility',
				name: 'visibility',
				type: 'select',
				options: { maxSelect: 1, values: ['public', 'private'] }
			}
		],
		indexes: [
			'CREATE INDEX idx_assets_type ON assets (`type`)',
			'CREATE INDEX idx_assets_owner ON assets (owner)',
			'CREATE INDEX idx_assets_visibility ON assets (visibility)'
		],
		listRule:
			"visibility = 'public' || owner = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "@request.auth.id != ''",
		createRule: "@request.auth.id != ''",
		updateRule: "owner = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 7) submissions
	await createCollection({
		id: IDS.submissions,
		name: 'submissions',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'exercise',
				name: 'exercise',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.exercises, maxSelect: 1 }
			},
			{
				id: 'user',
				name: 'user',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{ id: 'code', name: 'code', type: 'text', required: true, options: { max: 200000 } },
			{
				id: 'result',
				name: 'result',
				type: 'select',
				options: { maxSelect: 1, values: ['pass', 'fail', 'error'] }
			},
			{ id: 'durationMs', name: 'durationMs', type: 'number', options: {} },
			{ id: 'stdout', name: 'stdout', type: 'text', options: { max: 200000 } },
			{ id: 'stderr', name: 'stderr', type: 'text', options: { max: 200000 } },
			{ id: 'events', name: 'events', type: 'json', options: {} },
			{ id: 'passedCount', name: 'passedCount', type: 'number', options: {} },
			{ id: 'failedCount', name: 'failedCount', type: 'number', options: {} }
		],
		indexes: [
			'CREATE INDEX idx_submissions_exercise_user_created ON submissions (exercise, user, created)',
			'CREATE INDEX idx_submissions_result ON submissions (result)'
		],
		listRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		createRule: "@request.auth.id != '' && user = @request.auth.id",
		updateRule: "user = @request.auth.id || @request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 8) progress
	await createCollection({
		id: IDS.progress,
		name: 'progress',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'user',
				name: 'user',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{
				id: 'lesson',
				name: 'lesson',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.lessons, maxSelect: 1 }
			},
			{
				id: 'status',
				name: 'status',
				type: 'select',
				options: { maxSelect: 1, values: ['not_started', 'in_progress', 'completed'] }
			},
			{ id: 'bestTimeMs', name: 'bestTimeMs', type: 'number', options: {} },
			{ id: 'attempts', name: 'attempts', type: 'number', options: {} },
			{
				id: 'lastSubmission',
				name: 'lastSubmission',
				type: 'relation',
				options: { collectionId: IDS.submissions, maxSelect: 1 }
			}
		],
		indexes: [
			'CREATE UNIQUE INDEX unq_progress_user_lesson ON progress (user, lesson)',
			'CREATE INDEX idx_progress_status ON progress (status)'
		],
		listRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		createRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		updateRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		deleteRule: "user = @request.auth.id || @request.auth.role = 'admin'"
	});

	// 9) badges
	await createCollection({
		id: IDS.badges,
		name: 'badges',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'key',
				name: 'key',
				type: 'text',
				required: true,
				unique: true,
				options: { pattern: '^[a-z0-9_\\-]+$' }
			},
			{ id: 'name', name: 'name', type: 'text', required: true, options: { min: 1, max: 200 } },
			{ id: 'description', name: 'description', type: 'text', options: { max: 2000 } },
			{
				id: 'icon',
				name: 'icon',
				type: 'file',
				options: { maxSelect: 1, maxSize: 10 * 1024 * 1024 }
			},
			{ id: 'criteria', name: 'criteria', type: 'json', options: {} }
		],
		indexes: ['CREATE UNIQUE INDEX idx_badges_key ON badges (key)'],
		listRule: 'true',
		viewRule: 'true',
		createRule: "@request.auth.role ?~ '(instructor|admin)'",
		updateRule: "@request.auth.role ?~ '(instructor|admin)'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 10) achievements
	await createCollection({
		id: IDS.achievements,
		name: 'achievements',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'user',
				name: 'user',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{
				id: 'badge',
				name: 'badge',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.badges, maxSelect: 1 }
			},
			{ id: 'awardedAt', name: 'awardedAt', type: 'date', options: {} },
			{ id: 'meta', name: 'meta', type: 'json', options: {} }
		],
		indexes: ['CREATE UNIQUE INDEX unq_achievements_user_badge ON achievements (user, badge)'],
		listRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		createRule: "@request.auth.role ?~ '(instructor|admin)'",
		updateRule: "@request.auth.role = 'admin'",
		deleteRule: "@request.auth.role = 'admin'"
	});

	// 11) xp_events
	await createCollection({
		id: IDS.xp_events,
		name: 'xp_events',
		type: 'base',
		system: false,
		schema: [
			{
				id: 'user',
				name: 'user',
				type: 'relation',
				required: true,
				options: { collectionId: IDS.users, maxSelect: 1 }
			},
			{
				id: 'source',
				name: 'source',
				type: 'select',
				options: { maxSelect: 1, values: ['submission', 'lesson_complete', 'streak', 'manual'] }
			},
			{ id: 'sourceId', name: 'sourceId', type: 'text', options: { max: 200 } },
			{ id: 'delta', name: 'delta', type: 'number', options: {} },
			{ id: 'note', name: 'note', type: 'text', options: { max: 2000 } }
		],
		indexes: [
			'CREATE INDEX idx_xpe_user_created ON xp_events (user, created)',
			'CREATE INDEX idx_xpe_source_sourceId ON xp_events (source, sourceId)'
		],
		listRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		viewRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
		createRule:
			"@request.auth.id != '' && (user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)')",
		updateRule: "@request.auth.role = 'admin'",
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
			level: 'beginner',
			visibility: 'public',
			author: instructor.id,
			order: 1,
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
			order: 1,
			description: 'Learn about JavaScript variables, primitive data types, and type coercion.'
		})
	});

	const jsModule2 = await makeRequest('collections/modules/records', {
		method: 'POST',
		body: JSON.stringify({
			course: course1.id,
			title: 'Functions and Scope',
			order: 2,
			description:
				'Understand function declarations, expressions, and variable scope in JavaScript.'
		})
	});

	const jsModule3 = await makeRequest('collections/modules/records', {
		method: 'POST',
		body: JSON.stringify({
			course: course1.id,
			title: 'Objects and Arrays',
			order: 3,
			description: 'Work with JavaScript objects, arrays, and common array methods.'
		})
	});

	// Create Course 1 Lessons (simplified for brevity)
	const jsLessons = [
		{
			title: 'Introduction to Variables',
			slug: 'introduction-to-variables',
			order: 1,
			module: jsModule1.id,
			isFree: true
		},
		{
			title: 'Data Types in JavaScript',
			slug: 'data-types-in-javascript',
			order: 2,
			module: jsModule1.id,
			isFree: true
		},
		{
			title: 'Function Declarations',
			slug: 'function-declarations',
			order: 1,
			module: jsModule2.id,
			isFree: true
		},
		{
			title: 'Understanding Props',
			slug: 'understanding-props',
			order: 1,
			module: jsModule3.id,
			isFree: true
		}
	];

	for (const lesson of jsLessons) {
		await makeRequest('collections/lessons/records', {
			method: 'POST',
			body: JSON.stringify({
				course: course1.id,
				module: lesson.module,
				title: lesson.title,
				slug: lesson.slug,
				order: lesson.order,
				estimatedMinutes: 15,
				isFree: lesson.isFree,
				status: 'published',
				content: { type: 'lesson', sections: [{ type: 'text', content: 'Sample lesson content' }] },
				createdBy: instructor.id
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
			level: 'intro',
			visibility: 'public',
			author: instructor.id,
			order: 2,
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
			order: 1,
			description: 'Learn the fundamentals of React components and JSX syntax.'
		})
	});

	// Create some React lessons
	const reactLessons = [
		{
			title: 'Introduction to React',
			slug: 'introduction-to-react',
			order: 1,
			module: reactModule1.id,
			isFree: true
		},
		{
			title: 'Understanding JSX',
			slug: 'understanding-jsx',
			order: 2,
			module: reactModule1.id,
			isFree: true
		}
	];

	for (const lesson of reactLessons) {
		await makeRequest('collections/lessons/records', {
			method: 'POST',
			body: JSON.stringify({
				course: course2.id,
				module: lesson.module,
				title: lesson.title,
				slug: lesson.slug,
				order: lesson.order,
				estimatedMinutes: 20,
				isFree: lesson.isFree,
				status: 'published',
				content: {
					type: 'lesson',
					sections: [{ type: 'text', content: 'Sample React lesson content' }]
				},
				createdBy: instructor.id
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
				description: badge.description,
				criteria: { type: 'lesson_complete', count: 1 }
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
