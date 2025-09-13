#!/usr/bin/env node

/**
 * Script to add sample courses, modules, and lessons to PocketBase
 * Run with: node scripts/add_sample_data.js
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://academy.pockethost.io');

// Sample data
const sampleCourses = [
	{
		title: 'Python Fundamentals',
		slug: 'python-fundamentals',
		description: 'Learn the basics of Python programming language',
		level: 'beginner',
		visibility: 'public',
		status: 'published',
		author: 'Academy Team',
		order: 3
	},
	{
		title: 'Advanced JavaScript',
		slug: 'advanced-javascript',
		description: 'Master advanced JavaScript concepts and modern development practices',
		level: 'intermediate',
		visibility: 'public',
		status: 'published',
		author: 'Academy Team',
		order: 4
	},
	{
		title: 'Full Stack Development',
		slug: 'full-stack-development',
		description: 'Build complete web applications with modern technologies',
		level: 'advanced',
		visibility: 'public',
		status: 'published',
		author: 'Academy Team',
		order: 5
	}
];

const sampleModules = [
	// Python Fundamentals modules
	{
		title: 'Python Syntax and Variables',
		description: 'Learn Python syntax, variables, and basic data types',
		order: 1,
		course: 'python-course-id' // Will be replaced with actual course ID
	},
	{
		title: 'Control Flow and Functions',
		description: 'Master if statements, loops, and function definitions',
		order: 2,
		course: 'python-course-id'
	},
	{
		title: 'Data Structures',
		description: 'Work with lists, dictionaries, and other Python data structures',
		order: 3,
		course: 'python-course-id'
	},

	// Advanced JavaScript modules
	{
		title: 'ES6+ Features',
		description:
			'Explore modern JavaScript features like arrow functions, destructuring, and modules',
		order: 1,
		course: 'advanced-js-course-id'
	},
	{
		title: 'Async Programming',
		description: 'Master promises, async/await, and asynchronous JavaScript patterns',
		order: 2,
		course: 'advanced-js-course-id'
	},
	{
		title: 'Design Patterns',
		description: 'Learn common JavaScript design patterns and best practices',
		order: 3,
		course: 'advanced-js-course-id'
	},

	// Full Stack Development modules
	{
		title: 'Backend Development',
		description: 'Build robust APIs with Node.js and Express',
		order: 1,
		course: 'fullstack-course-id'
	},
	{
		title: 'Database Design',
		description: 'Design and implement databases with SQL and NoSQL',
		order: 2,
		course: 'fullstack-course-id'
	},
	{
		title: 'Frontend Integration',
		description: 'Connect frontend and backend with modern frameworks',
		order: 3,
		course: 'fullstack-course-id'
	},
	{
		title: 'Deployment and DevOps',
		description: 'Deploy applications and set up CI/CD pipelines',
		order: 4,
		course: 'fullstack-course-id'
	}
];

const sampleLessons = [
	// Python Syntax and Variables lessons
	{
		title: 'Introduction to Python',
		slug: 'introduction-to-python',
		order: 1,
		estimatedMinutes: 30,
		isFree: true,
		status: 'published',
		module: 'python-syntax-module-id'
	},
	{
		title: 'Variables and Data Types',
		slug: 'variables-and-data-types-python',
		order: 2,
		estimatedMinutes: 45,
		isFree: true,
		status: 'published',
		module: 'python-syntax-module-id'
	},
	{
		title: 'String Manipulation',
		slug: 'string-manipulation-python',
		order: 3,
		estimatedMinutes: 40,
		isFree: false,
		status: 'published',
		module: 'python-syntax-module-id'
	},

	// Control Flow and Functions lessons
	{
		title: 'Conditional Statements',
		slug: 'conditional-statements-python',
		order: 1,
		estimatedMinutes: 35,
		isFree: true,
		status: 'published',
		module: 'control-flow-module-id'
	},
	{
		title: 'Loops and Iteration',
		slug: 'loops-and-iteration-python',
		order: 2,
		estimatedMinutes: 50,
		isFree: true,
		status: 'published',
		module: 'control-flow-module-id'
	},
	{
		title: 'Function Definition and Usage',
		slug: 'function-definition-python',
		order: 3,
		estimatedMinutes: 60,
		isFree: false,
		status: 'published',
		module: 'control-flow-module-id'
	},

	// ES6+ Features lessons
	{
		title: 'Arrow Functions and Template Literals',
		slug: 'arrow-functions-template-literals',
		order: 1,
		estimatedMinutes: 40,
		isFree: true,
		status: 'published',
		module: 'es6-module-id'
	},
	{
		title: 'Destructuring Assignment',
		slug: 'destructuring-assignment',
		order: 2,
		estimatedMinutes: 35,
		isFree: true,
		status: 'published',
		module: 'es6-module-id'
	},
	{
		title: 'Modules and Imports',
		slug: 'modules-and-imports',
		order: 3,
		estimatedMinutes: 45,
		isFree: false,
		status: 'published',
		module: 'es6-module-id'
	},

	// Backend Development lessons
	{
		title: 'Setting up Node.js and Express',
		slug: 'nodejs-express-setup',
		order: 1,
		estimatedMinutes: 50,
		isFree: true,
		status: 'published',
		module: 'backend-module-id'
	},
	{
		title: 'Building REST APIs',
		slug: 'building-rest-apis',
		order: 2,
		estimatedMinutes: 75,
		isFree: true,
		status: 'published',
		module: 'backend-module-id'
	},
	{
		title: 'Authentication and Security',
		slug: 'authentication-security',
		order: 3,
		estimatedMinutes: 90,
		isFree: false,
		status: 'published',
		module: 'backend-module-id'
	}
];

async function addSampleData() {
	try {
		console.log('🚀 Adding sample data to PocketBase...\n');

		// Add courses
		console.log('📚 Adding courses...');
		const courseIds = {};

		for (const course of sampleCourses) {
			try {
				const record = await pb.collection('courses').create(course);
				courseIds[course.slug] = record.id;
				console.log(`✅ Added course: ${course.title} (${record.id})`);
			} catch (error) {
				console.log(`⚠️  Course might already exist: ${course.title}`);
			}
		}

		// Add modules
		console.log('\n📦 Adding modules...');
		const moduleIds = {};

		for (const module of sampleModules) {
			// Replace placeholder course IDs with actual IDs
			let courseId = module.course;
			if (module.course === 'python-course-id') {
				courseId = courseIds['python-fundamentals'];
			} else if (module.course === 'advanced-js-course-id') {
				courseId = courseIds['advanced-javascript'];
			} else if (module.course === 'fullstack-course-id') {
				courseId = courseIds['full-stack-development'];
			}

			if (!courseId) {
				console.log(`⚠️  Skipping module ${module.title} - course not found`);
				continue;
			}

			try {
				const record = await pb.collection('modules').create({
					...module,
					course: courseId
				});
				moduleIds[module.title.toLowerCase().replace(/\s+/g, '-')] = record.id;
				console.log(`✅ Added module: ${module.title} (${record.id})`);
			} catch (error) {
				console.log(`⚠️  Module might already exist: ${module.title}`);
			}
		}

		// Add lessons
		console.log('\n📖 Adding lessons...');

		for (const lesson of sampleLessons) {
			// Replace placeholder module IDs with actual IDs
			let moduleId = lesson.module;
			if (lesson.module === 'python-syntax-module-id') {
				moduleId = moduleIds['python-syntax-and-variables'];
			} else if (lesson.module === 'control-flow-module-id') {
				moduleId = moduleIds['control-flow-and-functions'];
			} else if (lesson.module === 'es6-module-id') {
				moduleId = moduleIds['es6+-features'];
			} else if (lesson.module === 'backend-module-id') {
				moduleId = moduleIds['backend-development'];
			}

			if (!moduleId) {
				console.log(`⚠️  Skipping lesson ${lesson.title} - module not found`);
				continue;
			}

			try {
				const record = await pb.collection('lessons').create({
					...lesson,
					module: moduleId
				});
				console.log(`✅ Added lesson: ${lesson.title} (${record.id})`);
			} catch (error) {
				console.log(`⚠️  Lesson might already exist: ${lesson.title}`);
			}
		}

		console.log('\n🎉 Sample data added successfully!');
		console.log('\n📊 Summary:');
		console.log(`- ${sampleCourses.length} courses`);
		console.log(`- ${sampleModules.length} modules`);
		console.log(`- ${sampleLessons.length} lessons`);
	} catch (error) {
		console.error('❌ Error adding sample data:', error);
	}
}

// Run the script
addSampleData();
