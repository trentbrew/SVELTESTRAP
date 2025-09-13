import { lessons } from '$lib/pocketbase/index.js';
import { error } from '@sveltejs/kit';

// Mapping of course IDs to titles
const courseIdToTitle: Record<string, string> = {
	b3z3vov77ntyyx1: 'JavaScript Fundamentals',
	'73ptkp2v7kx0qsz': 'React Development'
};

// Mapping of module IDs to titles
const moduleIdToTitle: Record<string, string> = {
	rvvqwn9467j1km8: 'Variables and Data Types',
	gv4qfohc4h22uqc: 'Functions and Scope',
	myp5nfrs2mgf4x4: 'Components and JSX'
};

export async function load({ params }) {
	try {
		const lesson = await lessons.get(params.lessonId);
		return {
			courseId: params.courseId,
			courseTitle: courseIdToTitle[params.courseId] || params.courseId,
			moduleId: params.moduleId,
			moduleTitle: moduleIdToTitle[params.moduleId] || params.moduleId,
			lessonId: params.lessonId,
			lesson
		};
	} catch (err) {
		console.error('Failed to load lesson:', err);
		throw error(404, 'Lesson not found');
	}
}
