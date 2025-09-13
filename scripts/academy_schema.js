// Academy PocketBase Schema Migration
// Creates all collections for the coding course platform
// Usage: node scripts/academy_schema.js

import PocketBase from 'pocketbase';

// Configuration - update these for your PocketBase instance
const PB_URL = process.env.PB_URL || 'https://turtle.pockethost.io';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '';

const pb = new PocketBase(PB_URL);

// Helper functions
function upsertField(schema, fieldSpec) {
	const idx = schema.findIndex((f) => f.name === fieldSpec.name);
	if (idx === -1) schema.push(fieldSpec);
	else schema[idx] = { ...schema[idx], ...fieldSpec };
}

function ensureIndex(indexes, sql) {
	if (!Array.isArray(indexes)) indexes = [];
	if (!indexes.some((s) => s.trim() === sql.trim())) indexes.push(sql);
	return indexes;
}

async function createCollection(name, options) {
	try {
		// Check if collection exists
		await pb.collections.getOne(name);
		console.log(`Collection ${name} already exists, updating...`);
		return await pb.collections.getOne(name);
	} catch (error) {
		console.log(`Creating collection ${name}...`);
		return await pb.collections.create(options);
	}
}

async function main() {
	console.log('Connecting to PocketBase at:', PB_URL);

	// Authenticate as admin
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
	console.log('Authenticated successfully');

	// 1. USERS (extends built-in auth)
	const users = await createCollection('users', {
		name: 'users',
		type: 'auth',
		schema: [
			{
				name: 'role',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['student', 'instructor', 'admin']
				}
			},
			{
				name: 'handle',
				type: 'text',
				required: true,
				options: {
					min: 3,
					max: 30,
					pattern: '^[a-z0-9_-]+$'
				}
			},
			{
				name: 'displayName',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 100
				}
			},
			{
				name: 'avatar',
				type: 'file',
				required: false,
				options: {
					maxSelect: 1,
					maxSize: 5242880, // 5MB
					allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				}
			},
			{
				name: 'bio',
				type: 'text',
				required: false,
				options: {
					max: 500
				}
			},
			{
				name: 'xp',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'streakCount',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			}
		],
		indexes: [
			'create unique index if not exists "idx_users_handle" on "users" ("handle")',
			'create index if not exists "idx_users_role" on "users" ("role")'
		]
	});

	// Update users collection rules
	await pb.collections.update(users.id, {
		createRule: '@request.auth.id != ""',
		listRule: '@request.auth.id != ""',
		viewRule: '@request.auth.id != ""',
		updateRule: 'id = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: '@request.auth.role = "admin"'
	});

	// 2. COURSES
	const courses = await createCollection('courses', {
		name: 'courses',
		type: 'base',
		schema: [
			{
				name: 'title',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 200
				}
			},
			{
				name: 'slug',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 100,
					pattern: '^[a-z0-9-]+$'
				}
			},
			{
				name: 'description',
				type: 'text',
				required: false,
				options: {
					max: 1000
				}
			},
			{
				name: 'level',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['beginner', 'intro', 'intermediate', 'advanced']
				}
			},
			{
				name: 'visibility',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['public', 'private', 'unlisted']
				}
			},
			{
				name: 'coverImage',
				type: 'file',
				required: false,
				options: {
					maxSelect: 1,
					maxSize: 10485760, // 10MB
					allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				}
			},
			{
				name: 'author',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'order',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'status',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['draft', 'published']
				}
			}
		],
		indexes: [
			'create unique index if not exists "idx_courses_slug" on "courses" ("slug")',
			'create index if not exists "idx_courses_status_visibility" on "courses" ("status", "visibility")',
			'create index if not exists "idx_courses_author" on "courses" ("author")'
		]
	});

	await pb.collections.update(courses.id, {
		createRule: '@request.auth.role in ["instructor", "admin"]',
		listRule:
			'status = "published" && visibility = "public" || @request.auth.role in ["instructor", "admin"] || author = @request.auth.id',
		viewRule:
			'status = "published" && visibility = "public" || @request.auth.role in ["instructor", "admin"] || author = @request.auth.id',
		updateRule: 'author = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'author = @request.auth.id || @request.auth.role = "admin"'
	});

	// 3. MODULES
	const modules = await createCollection('modules', {
		name: 'modules',
		type: 'base',
		schema: [
			{
				name: 'course',
				type: 'relation',
				required: true,
				options: {
					collectionId: courses.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'title',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 200
				}
			},
			{
				name: 'order',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'description',
				type: 'text',
				required: false,
				options: {
					max: 1000
				}
			}
		],
		indexes: [
			'create index if not exists "idx_modules_course_order" on "modules" ("course", "order")'
		]
	});

	await pb.collections.update(modules.id, {
		createRule: 'course.author = @request.auth.id || @request.auth.role = "admin"',
		listRule: 'course.status = "published" || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'course.status = "published" || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'course.author = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'course.author = @request.auth.id || @request.auth.role = "admin"'
	});

	// 4. LESSONS
	const lessons = await createCollection('lessons', {
		name: 'lessons',
		type: 'base',
		schema: [
			{
				name: 'course',
				type: 'relation',
				required: true,
				options: {
					collectionId: courses.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'module',
				type: 'relation',
				required: false,
				options: {
					collectionId: modules.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'title',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 200
				}
			},
			{
				name: 'slug',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 100,
					pattern: '^[a-z0-9-]+$'
				}
			},
			{
				name: 'order',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'estimatedMinutes',
				type: 'number',
				required: false,
				options: {
					min: 1
				}
			},
			{
				name: 'isFree',
				type: 'bool',
				required: false
			},
			{
				name: 'status',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['draft', 'published']
				}
			},
			{
				name: 'content',
				type: 'json',
				required: false
			},
			{
				name: 'videoAsset',
				type: 'relation',
				required: false,
				options: {
					collectionId: 'assets', // Will be created later
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'animationAsset',
				type: 'relation',
				required: false,
				options: {
					collectionId: 'assets', // Will be created later
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'createdBy',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			}
		],
		indexes: [
			'create unique index if not exists "idx_lessons_course_slug" on "lessons" ("course", "slug")',
			'create index if not exists "idx_lessons_course_module_order" on "lessons" ("course", "module", "order")',
			'create index if not exists "idx_lessons_status" on "lessons" ("status")'
		]
	});

	await pb.collections.update(lessons.id, {
		createRule: 'course.author = @request.auth.id || @request.auth.role = "admin"',
		listRule:
			'(course.status = "published" && status = "published") || @request.auth.role in ["instructor", "admin"] || createdBy = @request.auth.id',
		viewRule:
			'(course.status = "published" && status = "published") || @request.auth.role in ["instructor", "admin"] || createdBy = @request.auth.id',
		updateRule: 'course.author = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'course.author = @request.auth.id || @request.auth.role = "admin"'
	});

	// 5. EXERCISES
	const exercises = await createCollection('exercises', {
		name: 'exercises',
		type: 'base',
		schema: [
			{
				name: 'lesson',
				type: 'relation',
				required: true,
				options: {
					collectionId: lessons.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'title',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 200
				}
			},
			{
				name: 'prompt',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 2000
				}
			},
			{
				name: 'starterCode',
				type: 'text',
				required: false
			},
			{
				name: 'solutionCode',
				type: 'text',
				required: false
			},
			{
				name: 'language',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['js', 'ts', 'python', 'java']
				}
			},
			{
				name: 'maxRuntimeMs',
				type: 'number',
				required: false,
				options: {
					min: 1000,
					max: 30000
				}
			},
			{
				name: 'scaffolds',
				type: 'json',
				required: false
			},
			{
				name: 'order',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'visibility',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['public', 'hidden']
				}
			}
		],
		indexes: [
			'create index if not exists "idx_exercises_lesson_order" on "exercises" ("lesson", "order")'
		]
	});

	await pb.collections.update(exercises.id, {
		createRule: 'lesson.course.author = @request.auth.id || @request.auth.role = "admin"',
		listRule: 'lesson.status = "published" || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'lesson.status = "published" || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'lesson.course.author = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'lesson.course.author = @request.auth.id || @request.auth.role = "admin"'
	});

	// Add field rule for solutionCode
	const exercisesCollection = await pb.collections.getOne('exercises');
	const updatedSchema = exercisesCollection.schema.map((field) => {
		if (field.name === 'solutionCode') {
			return {
				...field,
				options: {
					...field.options,
					viewRule: '@request.auth.role in ["instructor", "admin"]'
				}
			};
		}
		return field;
	});
	await pb.collections.update(exercises.id, { schema: updatedSchema });

	// 6. CHECKS (grading specs)
	const checks = await createCollection('checks', {
		name: 'checks',
		type: 'base',
		schema: [
			{
				name: 'exercise',
				type: 'relation',
				required: true,
				options: {
					collectionId: exercises.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'type',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['assert', 'stdout', 'unit']
				}
			},
			{
				name: 'expression',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 500
				}
			},
			{
				name: 'timeoutMs',
				type: 'number',
				required: false,
				options: {
					min: 100,
					max: 10000
				}
			},
			{
				name: 'points',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'order',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			}
		],
		indexes: [
			'create index if not exists "idx_checks_exercise_order" on "checks" ("exercise", "order")'
		]
	});

	await pb.collections.update(checks.id, {
		createRule: 'exercise.lesson.course.author = @request.auth.id || @request.auth.role = "admin"',
		listRule:
			'exercise.lesson.status = "published" || @request.auth.role in ["instructor", "admin"]',
		viewRule:
			'exercise.lesson.status = "published" || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'exercise.lesson.course.author = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'exercise.lesson.course.author = @request.auth.id || @request.auth.role = "admin"'
	});

	// 7. SUBMISSIONS
	const submissions = await createCollection('submissions', {
		name: 'submissions',
		type: 'base',
		schema: [
			{
				name: 'exercise',
				type: 'relation',
				required: true,
				options: {
					collectionId: exercises.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'user',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'code',
				type: 'text',
				required: true
			},
			{
				name: 'result',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['pass', 'fail', 'error']
				}
			},
			{
				name: 'durationMs',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'stdout',
				type: 'text',
				required: false
			},
			{
				name: 'stderr',
				type: 'text',
				required: false
			},
			{
				name: 'events',
				type: 'json',
				required: false
			},
			{
				name: 'passedCount',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'failedCount',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			}
		],
		indexes: [
			'create index if not exists "idx_submissions_exercise_user_created" on "submissions" ("exercise", "user", "created")',
			'create index if not exists "idx_submissions_result" on "submissions" ("result")'
		]
	});

	await pb.collections.update(submissions.id, {
		createRule: '@request.auth.id != "" && user = @request.auth.id',
		listRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'user = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'user = @request.auth.id || @request.auth.role = "admin"'
	});

	// 8. PROGRESS
	const progress = await createCollection('progress', {
		name: 'progress',
		type: 'base',
		schema: [
			{
				name: 'user',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'lesson',
				type: 'relation',
				required: true,
				options: {
					collectionId: lessons.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'status',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['not_started', 'in_progress', 'completed']
				}
			},
			{
				name: 'bestTimeMs',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'attempts',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'lastSubmission',
				type: 'relation',
				required: false,
				options: {
					collectionId: submissions.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			}
		],
		indexes: [
			'create unique index if not exists "idx_progress_user_lesson" on "progress" ("user", "lesson")',
			'create index if not exists "idx_progress_status" on "progress" ("status")'
		]
	});

	await pb.collections.update(progress.id, {
		createRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		listRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		deleteRule: 'user = @request.auth.id || @request.auth.role = "admin"'
	});

	// 9. ASSETS
	const assets = await createCollection('assets', {
		name: 'assets',
		type: 'base',
		schema: [
			{
				name: 'type',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['video', 'animation', 'caption', 'data']
				}
			},
			{
				name: 'file',
				type: 'file',
				required: false,
				options: {
					maxSelect: 1,
					maxSize: 104857600, // 100MB
					allowedMimeTypes: [
						'video/mp4',
						'video/webm',
						'application/json',
						'text/plain',
						'image/jpeg',
						'image/png',
						'image/webp'
					]
				}
			},
			{
				name: 'durationMs',
				type: 'number',
				required: false,
				options: {
					min: 0
				}
			},
			{
				name: 'meta',
				type: 'json',
				required: false
			},
			{
				name: 'owner',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'visibility',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['public', 'private']
				}
			}
		],
		indexes: [
			'create index if not exists "idx_assets_type" on "assets" ("type")',
			'create index if not exists "idx_assets_owner" on "assets" ("owner")',
			'create index if not exists "idx_assets_visibility" on "assets" ("visibility")'
		]
	});

	await pb.collections.update(assets.id, {
		createRule: '@request.auth.id != ""',
		listRule:
			'visibility = "public" || owner = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		viewRule:
			'visibility = "public" || owner = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		updateRule: 'owner = @request.auth.id || @request.auth.role = "admin"',
		deleteRule: 'owner = @request.auth.id || @request.auth.role = "admin"'
	});

	// 10. BADGES
	const badges = await createCollection('badges', {
		name: 'badges',
		type: 'base',
		schema: [
			{
				name: 'key',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 50,
					pattern: '^[a-z0-9_]+$'
				}
			},
			{
				name: 'name',
				type: 'text',
				required: true,
				options: {
					min: 1,
					max: 100
				}
			},
			{
				name: 'description',
				type: 'text',
				required: false,
				options: {
					max: 500
				}
			},
			{
				name: 'icon',
				type: 'file',
				required: false,
				options: {
					maxSelect: 1,
					maxSize: 1048576, // 1MB
					allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg']
				}
			},
			{
				name: 'criteria',
				type: 'json',
				required: false
			}
		],
		indexes: ['create unique index if not exists "idx_badges_key" on "badges" ("key")']
	});

	await pb.collections.update(badges.id, {
		createRule: '@request.auth.role in ["instructor", "admin"]',
		listRule: 'true',
		viewRule: 'true',
		updateRule: '@request.auth.role in ["instructor", "admin"]',
		deleteRule: '@request.auth.role = "admin"'
	});

	// 11. ACHIEVEMENTS
	const achievements = await createCollection('achievements', {
		name: 'achievements',
		type: 'base',
		schema: [
			{
				name: 'user',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'badge',
				type: 'relation',
				required: true,
				options: {
					collectionId: badges.id,
					cascadeDelete: false,
					maxSelect: 1
				}
			},
			{
				name: 'meta',
				type: 'json',
				required: false
			}
		],
		indexes: [
			'create unique index if not exists "idx_achievements_user_badge" on "achievements" ("user", "badge")'
		]
	});

	await pb.collections.update(achievements.id, {
		createRule: '@request.auth.role in ["instructor", "admin"]',
		listRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		updateRule: '@request.auth.role = "admin"',
		deleteRule: '@request.auth.role = "admin"'
	});

	// 12. XP_EVENTS
	const xpEvents = await createCollection('xp_events', {
		name: 'xp_events',
		type: 'base',
		schema: [
			{
				name: 'user',
				type: 'relation',
				required: true,
				options: {
					collectionId: users.id,
					cascadeDelete: true,
					maxSelect: 1
				}
			},
			{
				name: 'source',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['submission', 'lesson_complete', 'streak', 'manual']
				}
			},
			{
				name: 'sourceId',
				type: 'text',
				required: false,
				options: {
					max: 100
				}
			},
			{
				name: 'delta',
				type: 'number',
				required: true
			},
			{
				name: 'note',
				type: 'text',
				required: false,
				options: {
					max: 200
				}
			}
		],
		indexes: [
			'create index if not exists "idx_xp_events_user_created" on "xp_events" ("user", "created")',
			'create index if not exists "idx_xp_events_source_sourceId" on "xp_events" ("source", "sourceId")'
		]
	});

	await pb.collections.update(xpEvents.id, {
		createRule:
			'@request.auth.id != "" && (user = @request.auth.id || @request.auth.role in ["instructor", "admin"])',
		listRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		viewRule: 'user = @request.auth.id || @request.auth.role in ["instructor", "admin"]',
		updateRule: '@request.auth.role = "admin"',
		deleteRule: '@request.auth.role = "admin"'
	});

	// Update lessons to reference assets collection
	const lessonsCollection = await pb.collections.getOne('lessons');
	const updatedLessonsSchema = lessonsCollection.schema.map((field) => {
		if (field.name === 'videoAsset' || field.name === 'animationAsset') {
			return {
				...field,
				options: {
					...field.options,
					collectionId: assets.id
				}
			};
		}
		return field;
	});
	await pb.collections.update(lessons.id, { schema: updatedLessonsSchema });

	console.log('✅ Academy schema migration completed successfully!');
	console.log('\nCollections created:');
	console.log('- users (auth)');
	console.log('- courses');
	console.log('- modules');
	console.log('- lessons');
	console.log('- exercises');
	console.log('- checks');
	console.log('- submissions');
	console.log('- progress');
	console.log('- assets');
	console.log('- badges');
	console.log('- achievements');
	console.log('- xp_events');
}

main().catch((err) => {
	console.error('❌ Migration failed:', err);
	process.exit(1);
});
