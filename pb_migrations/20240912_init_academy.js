/// pb_migrations/20240912_init_academy.js
migrate(
	async (db) => {
		const dao = new Dao(db);

		// Fixed IDs so we can wire relations on first pass.
		const IDS = {
			users: '_pb_users_auth_',
			courses: 'crs01academy001x',
			modules: 'mod01academy001x',
			lessons: 'les01academy001x',
			exercises: 'exr01academy001x',
			checks: 'chk01academy001x',
			submissions: 'sub01academy001x',
			progress: 'prg01academy001x',
			assets: 'ast01academy001x',
			badges: 'bdg01academy001x',
			achievements: 'ach01academy001x',
			xp_events: 'xpe01academy001x'
		};

		// Helper to build a collection
		const mk = (cfg) =>
			new Collection({
				...cfg,
				type: 'base',
				system: false
				// PB fills created/updated automatically; explicit fields allowed but not needed.
			});

		// 1) courses
		await dao.saveCollection(
			mk({
				id: IDS.courses,
				name: 'courses',
				schema: [
					new SchemaField({
						id: 'title',
						name: 'title',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					}),
					new SchemaField({
						id: 'slug',
						name: 'slug',
						type: 'text',
						required: true,
						unique: true,
						options: { pattern: '^[a-z0-9-]{3,}$' }
					}),
					new SchemaField({
						id: 'description',
						name: 'description',
						type: 'text',
						options: { max: 5000 }
					}),
					new SchemaField({
						id: 'level',
						name: 'level',
						type: 'select',
						options: { maxSelect: 1, values: ['beginner', 'intro'] }
					}),
					new SchemaField({
						id: 'visibility',
						name: 'visibility',
						type: 'select',
						options: { maxSelect: 1, values: ['public', 'private', 'unlisted'] }
					}),
					new SchemaField({
						id: 'coverImage',
						name: 'coverImage',
						type: 'file',
						options: { maxSelect: 1, maxSize: 50 * 1024 * 1024 }
					}),
					new SchemaField({
						id: 'author',
						name: 'author',
						type: 'relation',
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({ id: 'order', name: 'order', type: 'number', options: {} }),
					new SchemaField({
						id: 'status',
						name: 'status',
						type: 'select',
						options: { maxSelect: 1, values: ['draft', 'published'] }
					})
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
			})
		);

		// 2) modules
		await dao.saveCollection(
			mk({
				id: IDS.modules,
				name: 'modules',
				schema: [
					new SchemaField({
						id: 'course',
						name: 'course',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.courses, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'title',
						name: 'title',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					}),
					new SchemaField({ id: 'order', name: 'order', type: 'number', options: {} }),
					new SchemaField({
						id: 'description',
						name: 'description',
						type: 'text',
						options: { max: 2000 }
					})
				],
				indexes: ['CREATE INDEX idx_modules_course_order ON modules (course, `order`)'],
				listRule: "course.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
				viewRule: "@request.auth.id != ''",
				createRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
				updateRule: "course.author = @request.auth.id || @request.auth.role = 'admin'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		);

		// 3) lessons
		await dao.saveCollection(
			mk({
				id: IDS.lessons,
				name: 'lessons',
				schema: [
					new SchemaField({
						id: 'course',
						name: 'course',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.courses, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'module',
						name: 'module',
						type: 'relation',
						options: { collectionId: IDS.modules, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'title',
						name: 'title',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					}),
					new SchemaField({
						id: 'slug',
						name: 'slug',
						type: 'text',
						required: true,
						options: { pattern: '^[a-z0-9-]{3,}$' }
					}),
					new SchemaField({ id: 'order', name: 'order', type: 'number', options: {} }),
					new SchemaField({
						id: 'estimatedMinutes',
						name: 'estimatedMinutes',
						type: 'number',
						options: {}
					}),
					new SchemaField({ id: 'isFree', name: 'isFree', type: 'bool', options: {} }),
					new SchemaField({
						id: 'status',
						name: 'status',
						type: 'select',
						options: { maxSelect: 1, values: ['draft', 'published'] }
					}),
					new SchemaField({ id: 'content', name: 'content', type: 'json', options: {} }),
					new SchemaField({
						id: 'videoAsset',
						name: 'videoAsset',
						type: 'relation',
						options: { collectionId: IDS.assets, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'animationAsset',
						name: 'animationAsset',
						type: 'relation',
						options: { collectionId: IDS.assets, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'createdBy',
						name: 'createdBy',
						type: 'relation',
						options: { collectionId: IDS.users, maxSelect: 1 }
					})
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
			})
		);

		// 4) exercises
		await dao.saveCollection(
			mk({
				id: IDS.exercises,
				name: 'exercises',
				schema: [
					new SchemaField({
						id: 'lesson',
						name: 'lesson',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.lessons, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'title',
						name: 'title',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					}),
					new SchemaField({
						id: 'prompt',
						name: 'prompt',
						type: 'text',
						required: true,
						options: { max: 8000 }
					}),
					new SchemaField({
						id: 'starterCode',
						name: 'starterCode',
						type: 'text',
						options: { max: 20000 }
					}),
					new SchemaField({
						id: 'solutionCode',
						name: 'solutionCode',
						type: 'text',
						options: { max: 20000 }
					}),
					new SchemaField({
						id: 'language',
						name: 'language',
						type: 'select',
						options: { maxSelect: 1, values: ['js', 'ts'] }
					}),
					new SchemaField({
						id: 'maxRuntimeMs',
						name: 'maxRuntimeMs',
						type: 'number',
						options: {}
					}),
					new SchemaField({ id: 'scaffolds', name: 'scaffolds', type: 'json', options: {} }),
					new SchemaField({ id: 'order', name: 'order', type: 'number', options: {} }),
					new SchemaField({
						id: 'visibility',
						name: 'visibility',
						type: 'select',
						options: { maxSelect: 1, values: ['public', 'hidden'] }
					})
				],
				indexes: ['CREATE INDEX idx_exercises_lesson_order ON exercises (lesson, `order`)'],
				listRule: "lesson.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
				viewRule: "@request.auth.id != ''",
				createRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
				updateRule: "lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		);

		// Field-level read restriction for solutionCode:
		// PocketBase doesn't have per-field rules in schema; enforce via API layer if needed.
		// Alternatively, store solutionCode in a separate collection with strict rules.

		// 5) checks
		await dao.saveCollection(
			mk({
				id: IDS.checks,
				name: 'checks',
				schema: [
					new SchemaField({
						id: 'exercise',
						name: 'exercise',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.exercises, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'type',
						name: 'type',
						type: 'select',
						required: true,
						options: { maxSelect: 1, values: ['assert', 'stdout', 'unit'] }
					}),
					new SchemaField({
						id: 'expression',
						name: 'expression',
						type: 'text',
						options: { max: 8000 }
					}),
					new SchemaField({ id: 'timeoutMs', name: 'timeoutMs', type: 'number', options: {} }),
					new SchemaField({ id: 'points', name: 'points', type: 'number', options: {} }),
					new SchemaField({ id: 'order', name: 'order', type: 'number', options: {} })
				],
				indexes: ['CREATE INDEX idx_checks_exercise_order ON checks (exercise, `order`)'],
				listRule:
					"exercise.lesson.status = 'published' || @request.auth.role ?~ '(instructor|admin)'",
				viewRule: "@request.auth.id != ''",
				createRule:
					"exercise.lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
				updateRule:
					"exercise.lesson.course.author = @request.auth.id || @request.auth.role = 'admin'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		);

		// 6) assets
		await dao.saveCollection(
			mk({
				id: IDS.assets,
				name: 'assets',
				schema: [
					new SchemaField({
						id: 'type',
						name: 'type',
						type: 'select',
						options: { maxSelect: 1, values: ['video', 'animation', 'caption', 'data'] }
					}),
					new SchemaField({
						id: 'file',
						name: 'file',
						type: 'file',
						options: { maxSelect: 1, maxSize: 500 * 1024 * 1024 }
					}),
					new SchemaField({ id: 'durationMs', name: 'durationMs', type: 'number', options: {} }),
					new SchemaField({ id: 'meta', name: 'meta', type: 'json', options: {} }),
					new SchemaField({
						id: 'owner',
						name: 'owner',
						type: 'relation',
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'visibility',
						name: 'visibility',
						type: 'select',
						options: { maxSelect: 1, values: ['public', 'private'] }
					})
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
			})
		);

		// 7) submissions
		await dao.saveCollection(
			mk({
				id: IDS.submissions,
				name: 'submissions',
				schema: [
					new SchemaField({
						id: 'exercise',
						name: 'exercise',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.exercises, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'user',
						name: 'user',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'code',
						name: 'code',
						type: 'text',
						required: true,
						options: { max: 200000 }
					}),
					new SchemaField({
						id: 'result',
						name: 'result',
						type: 'select',
						options: { maxSelect: 1, values: ['pass', 'fail', 'error'] }
					}),
					new SchemaField({ id: 'durationMs', name: 'durationMs', type: 'number', options: {} }),
					new SchemaField({ id: 'stdout', name: 'stdout', type: 'text', options: { max: 200000 } }),
					new SchemaField({ id: 'stderr', name: 'stderr', type: 'text', options: { max: 200000 } }),
					new SchemaField({ id: 'events', name: 'events', type: 'json', options: {} }),
					new SchemaField({ id: 'passedCount', name: 'passedCount', type: 'number', options: {} }),
					new SchemaField({ id: 'failedCount', name: 'failedCount', type: 'number', options: {} })
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
			})
		);

		// 8) progress
		await dao.saveCollection(
			mk({
				id: IDS.progress,
				name: 'progress',
				schema: [
					new SchemaField({
						id: 'user',
						name: 'user',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'lesson',
						name: 'lesson',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.lessons, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'status',
						name: 'status',
						type: 'select',
						options: { maxSelect: 1, values: ['not_started', 'in_progress', 'completed'] }
					}),
					new SchemaField({ id: 'bestTimeMs', name: 'bestTimeMs', type: 'number', options: {} }),
					new SchemaField({ id: 'attempts', name: 'attempts', type: 'number', options: {} }),
					new SchemaField({
						id: 'lastSubmission',
						name: 'lastSubmission',
						type: 'relation',
						options: { collectionId: IDS.submissions, maxSelect: 1 }
					})
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
			})
		);

		// 9) badges
		await dao.saveCollection(
			mk({
				id: IDS.badges,
				name: 'badges',
				schema: [
					new SchemaField({
						id: 'key',
						name: 'key',
						type: 'text',
						required: true,
						unique: true,
						options: { pattern: '^[a-z0-9_\\-]+$' }
					}),
					new SchemaField({
						id: 'name',
						name: 'name',
						type: 'text',
						required: true,
						options: { min: 1, max: 200 }
					}),
					new SchemaField({
						id: 'description',
						name: 'description',
						type: 'text',
						options: { max: 2000 }
					}),
					new SchemaField({
						id: 'icon',
						name: 'icon',
						type: 'file',
						options: { maxSelect: 1, maxSize: 10 * 1024 * 1024 }
					}),
					new SchemaField({ id: 'criteria', name: 'criteria', type: 'json', options: {} })
				],
				indexes: ['CREATE UNIQUE INDEX idx_badges_key ON badges (key)'],
				listRule: 'true',
				viewRule: 'true',
				createRule: "@request.auth.role ?~ '(instructor|admin)'",
				updateRule: "@request.auth.role ?~ '(instructor|admin)'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		);

		// 10) achievements
		await dao.saveCollection(
			mk({
				id: IDS.achievements,
				name: 'achievements',
				schema: [
					new SchemaField({
						id: 'user',
						name: 'user',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'badge',
						name: 'badge',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.badges, maxSelect: 1 }
					}),
					new SchemaField({ id: 'awardedAt', name: 'awardedAt', type: 'date', options: {} }),
					new SchemaField({ id: 'meta', name: 'meta', type: 'json', options: {} })
				],
				indexes: ['CREATE UNIQUE INDEX unq_achievements_user_badge ON achievements (user, badge)'],
				listRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
				viewRule: "user = @request.auth.id || @request.auth.role ?~ '(instructor|admin)'",
				createRule: "@request.auth.role ?~ '(instructor|admin)'",
				updateRule: "@request.auth.role = 'admin'",
				deleteRule: "@request.auth.role = 'admin'"
			})
		);

		// 11) xp_events
		await dao.saveCollection(
			mk({
				id: IDS.xp_events,
				name: 'xp_events',
				schema: [
					new SchemaField({
						id: 'user',
						name: 'user',
						type: 'relation',
						required: true,
						options: { collectionId: IDS.users, maxSelect: 1 }
					}),
					new SchemaField({
						id: 'source',
						name: 'source',
						type: 'select',
						options: { maxSelect: 1, values: ['submission', 'lesson_complete', 'streak', 'manual'] }
					}),
					new SchemaField({
						id: 'sourceId',
						name: 'sourceId',
						type: 'text',
						options: { max: 200 }
					}),
					new SchemaField({ id: 'delta', name: 'delta', type: 'number', options: {} }),
					new SchemaField({ id: 'note', name: 'note', type: 'text', options: { max: 2000 } })
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
			})
		);
	},
	async (db) => {
		// DOWN: drop in reverse dependency order
		const dao = new Dao(db);
		const drop = async (nameOrId) => {
			const c = dao.findCollectionByNameOrId(nameOrId);
			if (c) await dao.deleteCollection(c);
		};

		await drop('xp_events');
		await drop('achievements');
		await drop('badges');
		await drop('progress');
		await drop('submissions');
		await drop('assets');
		await drop('checks');
		await drop('exercises');
		await drop('lessons');
		await drop('modules');
		await drop('courses');
	}
);
