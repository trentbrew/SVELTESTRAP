#!/usr/bin/env node

/**
 * Simple script to add sample data to PocketBase
 * This version uses direct API calls without authentication
 */

// Sample courses data (matching existing structure)
const courses = [
	{
		title: 'Python Fundamentals',
		slug: 'python-fundamentals',
		description: 'Learn the basics of Python programming language',
		status: 'published',
		author: '47s82nm77gdrcpr'
	},
	{
		title: 'Advanced JavaScript',
		slug: 'advanced-javascript',
		description: 'Master advanced JavaScript concepts and modern development practices',
		status: 'published',
		author: '47s82nm77gdrcpr'
	},
	{
		title: 'Full Stack Development',
		slug: 'full-stack-development',
		description: 'Build complete web applications with modern technologies',
		status: 'published',
		author: '47s82nm77gdrcpr'
	}
];

async function addCourses() {
	console.log('🚀 Adding sample courses...\n');

	for (const course of courses) {
		try {
			const response = await fetch(
				'https://academy.pockethost.io/api/collections/courses/records',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(course)
				}
			);

			if (response.ok) {
				const result = await response.json();
				console.log(`✅ Added course: ${course.title} (${result.id})`);
			} else {
				const error = await response.text();
				console.log(`⚠️  Failed to add course ${course.title}: ${error}`);
			}
		} catch (error) {
			console.log(`❌ Error adding course ${course.title}: ${error.message}`);
		}
	}
}

// Run the script
addCourses();
