import { courses } from '$lib/pocketbase/index';

export async function load() {
	console.log('Load function called');
	return {
		courses: [
			{
				id: 'test1',
				title: 'Test Course 1',
				description: 'Test Description 1',
				status: 'published',
				created: '2025-01-01T00:00:00.000Z'
			},
			{
				id: 'test2',
				title: 'Test Course 2',
				description: 'Test Description 2',
				status: 'published',
				created: '2025-01-02T00:00:00.000Z'
			}
		]
	};
}
