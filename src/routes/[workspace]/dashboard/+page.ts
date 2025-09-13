import { courses } from '$lib/pocketbase/index';

export async function load() {
	try {
		const coursesData = await courses.list();
		return {
			courses: coursesData.items || []
		};
	} catch (error) {
		console.error('Failed to load courses:', error);
		return {
			courses: []
		};
	}
}
