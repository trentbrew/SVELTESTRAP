// LoopLens Seed Data Script
// Creates sample data for the Foundations course
// Usage: node scripts/looplens_seed.js

import PocketBase from 'pocketbase';

// Configuration - update these for your PocketBase instance
const PB_URL = process.env.PB_URL || 'https://academy.pockethost.io';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '';

const pb = new PocketBase(PB_URL);

async function main() {
	console.log('🌱 Starting LoopLens seed data creation...');

	// Authenticate as admin
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
	console.log('✅ Authenticated successfully');

	// 1. Create instructor/admin user
	console.log('👨‍🏫 Creating instructor...');
	const instructor = await pb.collections.create('users', {
		email: 'instructor@looplens.dev',
		password: 'instructor123',
		passwordConfirm: 'instructor123',
		role: 'instructor',
		handle: 'instructor',
		displayName: 'LoopLens Instructor',
		bio: 'Lead instructor for LoopLens coding courses',
		xp: 0,
		streakCount: 0
	});
	console.log('✅ Instructor created:', instructor.id);

	// 2. Create student users
	console.log('👨‍🎓 Creating students...');
	const students = [];
	const studentData = [
		{
			email: 'alice@student.dev',
			handle: 'alice_coder',
			displayName: 'Alice Johnson',
			bio: 'Learning to code with loops and arrays!'
		},
		{
			email: 'bob@student.dev',
			handle: 'bob_dev',
			displayName: 'Bob Smith',
			bio: 'Excited to master JavaScript fundamentals'
		},
		{
			email: 'carol@student.dev',
			handle: 'carol_learns',
			displayName: 'Carol Davis',
			bio: 'New to programming, starting with the basics'
		},
		{
			email: 'dave@student.dev',
			handle: 'dave_codes',
			displayName: 'Dave Wilson',
			bio: 'Building my coding skills step by step'
		}
	];

	for (const studentInfo of studentData) {
		const student = await pb.collections.create('users', {
			email: studentInfo.email,
			password: 'student123',
			passwordConfirm: 'student123',
			role: 'student',
			handle: studentInfo.handle,
			displayName: studentInfo.displayName,
			bio: studentInfo.bio,
			xp: 0,
			streakCount: 0
		});
		students.push(student);
		console.log(`✅ Student created: ${studentInfo.displayName} (${student.id})`);
	}

	// 3. Create Foundations course
	console.log('📚 Creating Foundations course...');
	const course = await pb.collections.create('courses', {
		title: 'Foundations',
		slug: 'foundations',
		description:
			'Learn the fundamentals of programming with interactive visualizations. Master loops, arrays, and functions through hands-on coding exercises.',
		level: 'beginner',
		visibility: 'public',
		author: instructor.id,
		order: 0,
		status: 'published'
	});
	console.log('✅ Course created:', course.id);

	// 4. Create modules
	console.log('📖 Creating modules...');
	const loopsModule = await pb.collections.create('modules', {
		course: course.id,
		title: 'Loops',
		order: 0,
		description:
			'Master the art of repetition in programming. Learn how to use for loops, while loops, and understand iteration patterns.'
	});

	const arraysModule = await pb.collections.create('modules', {
		course: course.id,
		title: 'Arrays',
		order: 1,
		description:
			'Explore data structures and learn how to store, access, and manipulate collections of data using arrays.'
	});

	const functionsModule = await pb.collections.create('modules', {
		course: course.id,
		title: 'Functions',
		order: 2,
		description:
			'Understand how to create reusable code blocks and organize your programs with functions.'
	});

	console.log('✅ Modules created');

	// 5. Create lessons
	console.log('📝 Creating lessons...');

	// Loops lessons
	const loops101 = await pb.collections.create('lessons', {
		course: course.id,
		module: loopsModule.id,
		title: 'Loops 101: Introduction to Repetition',
		slug: 'loops-101',
		order: 0,
		estimatedMinutes: 15,
		isFree: true,
		status: 'published',
		content: {
			blocks: [
				{
					type: 'heading',
					content: 'What are Loops?'
				},
				{
					type: 'paragraph',
					content:
						'Loops allow us to repeat code multiple times. Instead of writing the same code over and over, we can use loops to make our programs more efficient and easier to read.'
				},
				{
					type: 'code',
					content:
						'// Instead of this:\nconsole.log("Hello");\nconsole.log("Hello");\nconsole.log("Hello");\n\n// We can use a loop:\nfor (let i = 0; i < 3; i++) {\n  console.log("Hello");\n}'
				}
			]
		},
		createdBy: instructor.id
	});

	const loopsIterations = await pb.collections.create('lessons', {
		course: course.id,
		module: loopsModule.id,
		title: 'Loop Iterations: Counting and Patterns',
		slug: 'loops-iterations',
		order: 1,
		estimatedMinutes: 20,
		isFree: false,
		status: 'published',
		content: {
			blocks: [
				{
					type: 'heading',
					content: 'Understanding Loop Iterations'
				},
				{
					type: 'paragraph',
					content:
						"Every time a loop runs, it's called an iteration. We can use the loop variable to track which iteration we're on and create patterns."
				}
			]
		},
		createdBy: instructor.id
	});

	// Arrays lessons
	const arrays101 = await pb.collections.create('lessons', {
		course: course.id,
		module: arraysModule.id,
		title: 'Arrays 101: Storing Multiple Values',
		slug: 'arrays-101',
		order: 0,
		estimatedMinutes: 18,
		isFree: true,
		status: 'published',
		content: {
			blocks: [
				{
					type: 'heading',
					content: 'What are Arrays?'
				},
				{
					type: 'paragraph',
					content:
						'Arrays are containers that can hold multiple values. Think of them like a list where each item has a position (index).'
				}
			]
		},
		createdBy: instructor.id
	});

	const arraysMutation = await pb.collections.create('lessons', {
		course: course.id,
		module: arraysModule.id,
		title: 'Array Mutation: Changing Array Contents',
		slug: 'arrays-mutation',
		order: 1,
		estimatedMinutes: 25,
		isFree: false,
		status: 'published',
		content: {
			blocks: [
				{
					type: 'heading',
					content: 'Modifying Arrays'
				},
				{
					type: 'paragraph',
					content:
						"Arrays are mutable, meaning we can change their contents after they're created. Learn how to add, remove, and modify elements."
				}
			]
		},
		createdBy: instructor.id
	});

	// Functions lessons
	const functions101 = await pb.collections.create('lessons', {
		course: course.id,
		module: functionsModule.id,
		title: 'Functions 101: Reusable Code Blocks',
		slug: 'functions-101',
		order: 0,
		estimatedMinutes: 22,
		isFree: true,
		status: 'published',
		content: {
			blocks: [
				{
					type: 'heading',
					content: 'What are Functions?'
				},
				{
					type: 'paragraph',
					content:
						'Functions are reusable blocks of code that perform a specific task. They help us organize our code and avoid repetition.'
				}
			]
		},
		createdBy: instructor.id
	});

	console.log('✅ Lessons created');

	// 6. Create exercises for each lesson
	console.log('💻 Creating exercises...');

	// Loops 101 exercises
	const loops101Ex1 = await pb.collections.create('exercises', {
		lesson: loops101.id,
		title: 'Print Numbers 1 to 5',
		prompt:
			'Use a for loop to print the numbers 1, 2, 3, 4, and 5 to the console. Each number should be on a new line.',
		starterCode: '// Write your for loop here\n',
		solutionCode: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
		language: 'js',
		maxRuntimeMs: 2000,
		scaffolds: {
			visualizers: ['loop_tracker', 'console_output']
		},
		order: 0,
		visibility: 'public'
	});

	const loops101Ex2 = await pb.collections.create('exercises', {
		lesson: loops101.id,
		title: 'Count Down from 10',
		prompt: 'Create a loop that counts down from 10 to 1, printing each number.',
		starterCode: '// Write your countdown loop here\n',
		solutionCode: 'for (let i = 10; i >= 1; i--) {\n  console.log(i);\n}',
		language: 'js',
		maxRuntimeMs: 2000,
		scaffolds: {
			visualizers: ['loop_tracker', 'console_output']
		},
		order: 1,
		visibility: 'public'
	});

	// Arrays 101 exercises
	const arrays101Ex1 = await pb.collections.create('exercises', {
		lesson: arrays101.id,
		title: 'Create and Access Array Elements',
		prompt:
			'Create an array with the values [10, 20, 30, 40, 50] and print the third element (index 2) to the console.',
		starterCode: '// Create your array here\n// Print the third element\n',
		solutionCode: 'const numbers = [10, 20, 30, 40, 50];\nconsole.log(numbers[2]);',
		language: 'js',
		maxRuntimeMs: 2000,
		scaffolds: {
			visualizers: ['array_visualizer', 'console_output']
		},
		order: 0,
		visibility: 'public'
	});

	const arrays101Ex2 = await pb.collections.create('exercises', {
		lesson: arrays101.id,
		title: 'Loop Through Array',
		prompt:
			'Create an array of fruits: ["apple", "banana", "orange"] and use a loop to print each fruit.',
		starterCode: '// Create your array and loop here\n',
		solutionCode:
			'const fruits = ["apple", "banana", "orange"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}',
		language: 'js',
		maxRuntimeMs: 2000,
		scaffolds: {
			visualizers: ['array_visualizer', 'loop_tracker', 'console_output']
		},
		order: 1,
		visibility: 'public'
	});

	// Functions 101 exercises
	const functions101Ex1 = await pb.collections.create('exercises', {
		lesson: functions101.id,
		title: 'Create a Greeting Function',
		prompt:
			'Create a function called greet that takes a name parameter and returns "Hello, [name]!". Then call the function with your name.',
		starterCode: '// Create your function here\n// Call the function\n',
		solutionCode:
			'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Alice"));',
		language: 'js',
		maxRuntimeMs: 2000,
		scaffolds: {
			visualizers: ['function_stack', 'console_output']
		},
		order: 0,
		visibility: 'public'
	});

	console.log('✅ Exercises created');

	// 7. Create checks for exercises
	console.log('✅ Creating checks...');

	// Checks for loops exercises
	await pb.collections.create('checks', {
		exercise: loops101Ex1.id,
		type: 'stdout',
		expression: '1\\n2\\n3\\n4\\n5',
		timeoutMs: 1000,
		points: 1,
		order: 0
	});

	await pb.collections.create('checks', {
		exercise: loops101Ex2.id,
		type: 'stdout',
		expression: '10\\n9\\n8\\n7\\n6\\n5\\n4\\n3\\n2\\n1',
		timeoutMs: 1000,
		points: 1,
		order: 0
	});

	// Checks for arrays exercises
	await pb.collections.create('checks', {
		exercise: arrays101Ex1.id,
		type: 'stdout',
		expression: '30',
		timeoutMs: 1000,
		points: 1,
		order: 0
	});

	await pb.collections.create('checks', {
		exercise: arrays101Ex2.id,
		type: 'stdout',
		expression: 'apple\\nbanana\\norange',
		timeoutMs: 1000,
		points: 1,
		order: 0
	});

	// Checks for functions exercises
	await pb.collections.create('checks', {
		exercise: functions101Ex1.id,
		type: 'stdout',
		expression: 'Hello, Alice!',
		timeoutMs: 1000,
		points: 1,
		order: 0
	});

	console.log('✅ Checks created');

	// 8. Create some badges
	console.log('🏆 Creating badges...');

	const badges = [
		{
			key: 'loop_literate',
			name: 'Loop Literate',
			description: 'Completed your first loop exercise',
			criteria: { completedExercises: 1, lessonType: 'loops' }
		},
		{
			key: 'array_master',
			name: 'Array Master',
			description: 'Mastered array manipulation',
			criteria: { completedExercises: 2, lessonType: 'arrays' }
		},
		{
			key: 'function_wizard',
			name: 'Function Wizard',
			description: 'Created your first function',
			criteria: { completedExercises: 1, lessonType: 'functions' }
		},
		{
			key: 'foundations_graduate',
			name: 'Foundations Graduate',
			description: 'Completed the entire Foundations course',
			criteria: { completedLessons: 6 }
		}
	];

	for (const badgeData of badges) {
		await pb.collections.create('badges', badgeData);
		console.log(`✅ Badge created: ${badgeData.name}`);
	}

	// 9. Create some sample progress for students
	console.log('📊 Creating sample progress...');

	// Alice completes loops 101
	await pb.collections.create('progress', {
		user: students[0].id,
		lesson: loops101.id,
		status: 'completed',
		bestTimeMs: 45000, // 45 seconds
		attempts: 2
	});

	// Bob starts arrays 101
	await pb.collections.create('progress', {
		user: students[1].id,
		lesson: arrays101.id,
		status: 'in_progress',
		attempts: 1
	});

	// Carol completes functions 101
	await pb.collections.create('progress', {
		user: students[2].id,
		lesson: functions101.id,
		status: 'completed',
		bestTimeMs: 67000, // 67 seconds
		attempts: 3
	});

	console.log('✅ Sample progress created');

	// 10. Create some sample submissions
	console.log('📝 Creating sample submissions...');

	// Alice's successful submission for loops exercise
	await pb.collections.create('submissions', {
		exercise: loops101Ex1.id,
		user: students[0].id,
		code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
		result: 'pass',
		durationMs: 150,
		stdout: '1\n2\n3\n4\n5',
		stderr: '',
		events: [
			{ t: 0, kind: 'loop_start', payload: { variable: 'i', start: 1, end: 5 } },
			{ t: 100, kind: 'console_log', payload: { value: 1 } },
			{ t: 200, kind: 'console_log', payload: { value: 2 } },
			{ t: 300, kind: 'console_log', payload: { value: 3 } },
			{ t: 400, kind: 'console_log', payload: { value: 4 } },
			{ t: 500, kind: 'console_log', payload: { value: 5 } },
			{ t: 600, kind: 'loop_end' }
		],
		passedCount: 1,
		failedCount: 0
	});

	// Bob's failed submission for arrays exercise
	await pb.collections.create('submissions', {
		exercise: arrays101Ex1.id,
		user: students[1].id,
		code: 'const numbers = [10, 20, 30, 40, 50];\nconsole.log(numbers[1]);', // Wrong index
		result: 'fail',
		durationMs: 120,
		stdout: '20',
		stderr: '',
		events: [
			{ t: 0, kind: 'array_create', payload: { values: [10, 20, 30, 40, 50] } },
			{ t: 50, kind: 'array_access', payload: { index: 1, value: 20 } },
			{ t: 100, kind: 'console_log', payload: { value: 20 } }
		],
		passedCount: 0,
		failedCount: 1
	});

	console.log('✅ Sample submissions created');

	console.log('\n🎉 LoopLens seed data creation completed successfully!');
	console.log('\n📋 Summary:');
	console.log(`- 1 instructor: ${instructor.email}`);
	console.log(`- 4 students: ${students.map((s) => s.email).join(', ')}`);
	console.log(`- 1 course: ${course.title}`);
	console.log(`- 3 modules: Loops, Arrays, Functions`);
	console.log(`- 6 lessons with exercises and checks`);
	console.log(`- 4 badges for gamification`);
	console.log(`- Sample progress and submissions`);
	console.log('\n🔗 Login credentials:');
	console.log('Instructor: instructor@looplens.dev / instructor123');
	console.log('Students: [email]@student.dev / student123');
}

main().catch((err) => {
	console.error('❌ Seed data creation failed:', err);
	process.exit(1);
});
