import { modules } from '$lib/pocketbase/index.js';
import { error } from '@sveltejs/kit';

// Mapping of course IDs to titles
const courseIdToTitle: Record<string, string> = {
	b3z3vov77ntyyx1: 'JavaScript Fundamentals',
	'73ptkp2v7kx0qsz': 'React Development'
};

export async function load({ params }) {
	try {
		const modulesData = await modules.getByCourse(params.courseId);
		return {
			courseId: params.courseId,
			courseTitle: courseIdToTitle[params.courseId] || params.courseId,
			modules: modulesData.items || []
		};
	} catch (err) {
		console.error('Failed to load modules:', err);
		throw error(404, 'Course not found');
	}
}
