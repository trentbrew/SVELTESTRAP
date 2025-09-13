import PocketBase from 'pocketbase';

// Academy PocketBase Configuration
const pb = new PocketBase('https://academy.pockethost.io');

// Collection names for type safety
export const COLLECTIONS = {
	USERS: 'users',
	COURSES: 'courses',
	MODULES: 'modules',
	LESSONS: 'lessons',
	EXERCISES: 'exercises',
	CHECKS: 'checks',
	SUBMISSIONS: 'submissions',
	PROGRESS: 'progress',
	ASSETS: 'assets',
	BADGES: 'badges',
	ACHIEVEMENTS: 'achievements',
	XP_EVENTS: 'xp_events'
} as const;

// User roles
export const USER_ROLES = {
	STUDENT: 'student',
	INSTRUCTOR: 'instructor',
	ADMIN: 'admin'
} as const;

// Lesson status
export const LESSON_STATUS = {
	DRAFT: 'draft',
	PUBLISHED: 'published'
} as const;

// Progress status
export const PROGRESS_STATUS = {
	NOT_STARTED: 'not_started',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed'
} as const;

// Submission results
export const SUBMISSION_RESULTS = {
	PASS: 'pass',
	FAIL: 'fail',
	ERROR: 'error'
} as const;

// Asset types
export const ASSET_TYPES = {
	VIDEO: 'video',
	ANIMATION: 'animation',
	CAPTION: 'caption',
	DATA: 'data'
} as const;

// XP event sources
export const XP_SOURCES = {
	SUBMISSION: 'submission',
	LESSON_COMPLETE: 'lesson_complete',
	STREAK: 'streak',
	MANUAL: 'manual'
} as const;

// Helper functions for authentication
export const auth = {
	async login(email: string, password: string) {
		return await pb.collection(COLLECTIONS.USERS).authWithPassword(email, password);
	},

	async logout() {
		pb.authStore.clear();
	},

	async register(email: string, password: string, userData: any) {
		return await pb.collection(COLLECTIONS.USERS).create({
			email,
			password,
			passwordConfirm: password,
			...userData
		});
	},

	get user() {
		return pb.authStore.model;
	},

	get isAuthenticated() {
		return pb.authStore.isValid;
	}
};

// Helper functions for courses
export const courses = {
	async list() {
		return await pb.collection(COLLECTIONS.COURSES).getList(1, 50, {
			filter: 'status = "published"',
			sort: 'created'
		});
	},

	async get(id: string) {
		return await pb.collection(COLLECTIONS.COURSES).getOne(id, {
			expand: 'author,modules,modules.lessons'
		});
	},

	async getBySlug(slug: string) {
		return await pb.collection(COLLECTIONS.COURSES).getFirstListItem(`slug = "${slug}"`, {
			expand: 'author,modules,modules.lessons'
		});
	}
};

// Helper functions for modules
export const modules = {
	async getByCourse(courseId: string) {
		return await pb.collection(COLLECTIONS.MODULES).getList(1, 100, {
			filter: `course = "${courseId}"`,
			sort: 'order',
			expand: 'course,lessons'
		});
	},

	async get(id: string) {
		return await pb.collection(COLLECTIONS.MODULES).getOne(id, {
			expand: 'course,lessons'
		});
	}
};

// Helper functions for lessons
export const lessons = {
	async getByCourse(courseId: string) {
		return await pb.collection(COLLECTIONS.LESSONS).getList(1, 100, {
			filter: `course = "${courseId}" && status = "published"`,
			sort: 'order',
			expand: 'module,exercises'
		});
	},

	async getByModule(moduleId: string) {
		return await pb.collection(COLLECTIONS.LESSONS).getList(1, 100, {
			filter: `module = "${moduleId}"`,
			expand: 'course,module,exercises'
		});
	},

	async get(id: string) {
		return await pb.collection(COLLECTIONS.LESSONS).getOne(id, {
			expand: 'course,module,exercises,videoAsset,animationAsset'
		});
	}
};

// Helper functions for exercises
export const exercises = {
	async getByLesson(lessonId: string) {
		return await pb.collection(COLLECTIONS.EXERCISES).getList(1, 50, {
			filter: `lesson = "${lessonId}" && visibility = "public"`,
			sort: 'order'
		});
	},

	async submit(exerciseId: string, code: string) {
		return await pb.collection(COLLECTIONS.SUBMISSIONS).create({
			exercise: exerciseId,
			user: pb.authStore.model?.id,
			code,
			result: 'pending' // Will be updated by backend processing
		});
	}
};

// Helper functions for progress
export const progress = {
	async getUserProgress(userId?: string) {
		const userIdToUse = userId || pb.authStore.model?.id;
		if (!userIdToUse) throw new Error('User not authenticated');

		return await pb.collection(COLLECTIONS.PROGRESS).getList(1, 100, {
			filter: `user = "${userIdToUse}"`,
			expand: 'lesson,lesson.course,lesson.module'
		});
	},

	async updateProgress(lessonId: string, status: string, metadata?: any) {
		const userId = pb.authStore.model?.id;
		if (!userId) throw new Error('User not authenticated');

		// Try to find existing progress record
		try {
			const existing = await pb
				.collection(COLLECTIONS.PROGRESS)
				.getFirstListItem(`user = "${userId}" && lesson = "${lessonId}"`);
			// Update existing record
			return await pb.collection(COLLECTIONS.PROGRESS).update(existing.id, {
				status,
				...metadata
			});
		} catch {
			// Create new record if none exists
			return await pb.collection(COLLECTIONS.PROGRESS).create({
				user: userId,
				lesson: lessonId,
				status,
				...metadata
			});
		}
	}
};

// Helper functions for submissions
export const submissions = {
	async getUserSubmissions(userId?: string) {
		const userIdToUse = userId || pb.authStore.model?.id;
		if (!userIdToUse) throw new Error('User not authenticated');

		return await pb.collection(COLLECTIONS.SUBMISSIONS).getList(1, 100, {
			filter: `user = "${userIdToUse}"`,
			sort: '-created',
			expand: 'exercise,exercise.lesson'
		});
	},

	async getByExercise(exerciseId: string, userId?: string) {
		const userIdToUse = userId || pb.authStore.model?.id;
		if (!userIdToUse) throw new Error('User not authenticated');

		return await pb.collection(COLLECTIONS.SUBMISSIONS).getList(1, 50, {
			filter: `exercise = "${exerciseId}" && user = "${userIdToUse}"`,
			sort: '-created'
		});
	}
};

// Helper functions for badges and achievements
export const gamification = {
	async getBadges() {
		return await pb.collection(COLLECTIONS.BADGES).getList(1, 100);
	},

	async getUserAchievements(userId?: string) {
		const userIdToUse = userId || pb.authStore.model?.id;
		if (!userIdToUse) throw new Error('User not authenticated');

		return await pb.collection(COLLECTIONS.ACHIEVEMENTS).getList(1, 100, {
			filter: `user = "${userIdToUse}"`,
			expand: 'badge'
		});
	},

	async getUserXP(userId?: string) {
		const userIdToUse = userId || pb.authStore.model?.id;
		if (!userIdToUse) throw new Error('User not authenticated');

		const user = await pb.collection(COLLECTIONS.USERS).getOne(userIdToUse);
		return user.xp || 0;
	}
};

// Real-time subscriptions
export const subscribe = {
	toUserProgress(callback: (data: any) => void) {
		return pb.collection(COLLECTIONS.PROGRESS).subscribe('*', callback);
	},

	toSubmissions(callback: (data: any) => void) {
		return pb.collection(COLLECTIONS.SUBMISSIONS).subscribe('*', callback);
	}
};

export default pb;
