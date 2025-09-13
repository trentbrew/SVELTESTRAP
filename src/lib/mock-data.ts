// Mock data for testing the frontend with more content

export const mockCourses = [
	{
		id: 'js-fundamentals-mock',
		title: 'JavaScript Fundamentals',
		slug: 'javascript-fundamentals-mock',
		description: 'Learn the fundamentals of JavaScript programming',
		status: 'published',
		author: '47s82nm77gdrcpr',
		created: '2025-01-01T00:00:00.000Z',
		updated: '2025-01-01T00:00:00.000Z',
		progress: 25
	},
	{
		id: 'react-dev-mock',
		title: 'React Development',
		slug: 'react-development-mock',
		description: 'Build modern web applications with React',
		status: 'published',
		author: '47s82nm77gdrcpr',
		created: '2025-01-02T00:00:00.000Z',
		updated: '2025-01-02T00:00:00.000Z',
		progress: 60
	},
	{
		id: 'python-fundamentals-mock',
		title: 'Python Fundamentals',
		slug: 'python-fundamentals',
		description: 'Learn the basics of Python programming language',
		status: 'published',
		author: '47s82nm77gdrcpr',
		created: '2025-01-03T00:00:00.000Z',
		updated: '2025-01-03T00:00:00.000Z',
		progress: 0
	},
	{
		id: 'advanced-js-mock',
		title: 'Advanced JavaScript',
		slug: 'advanced-javascript',
		description: 'Master advanced JavaScript concepts and modern development practices',
		status: 'published',
		author: '47s82nm77gdrcpr',
		created: '2025-01-04T00:00:00.000Z',
		updated: '2025-01-04T00:00:00.000Z',
		progress: 15
	},
	{
		id: 'fullstack-mock',
		title: 'Full Stack Development',
		slug: 'full-stack-development',
		description: 'Build complete web applications with modern technologies',
		status: 'published',
		author: '47s82nm77gdrcpr',
		created: '2025-01-05T00:00:00.000Z',
		updated: '2025-01-05T00:00:00.000Z',
		progress: 80
	}
];

export const mockModules: Record<string, any[]> = {
	'js-fundamentals-mock': [
		// JavaScript Fundamentals
		{
			id: 'js-vars-mock',
			title: 'Variables and Data Types',
			description: 'Learn about JavaScript variables, data types, and basic operations',
			order: 1,
			course: 'js-fundamentals-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 30
		},
		{
			id: 'js-functions-mock',
			title: 'Functions and Scope',
			description: 'Master function declarations, expressions, and scope in JavaScript',
			order: 2,
			course: 'js-fundamentals-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 20
		},
		{
			id: 'js-dom-mock',
			title: 'DOM Manipulation',
			description: 'Learn to interact with the Document Object Model',
			order: 3,
			course: 'js-fundamentals-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-events-mock',
			title: 'Events and Event Handling',
			description: 'Handle user interactions and browser events',
			order: 4,
			course: 'js-fundamentals-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	'react-dev-mock': [
		// React Development
		{
			id: 'react-components-mock',
			title: 'Components and JSX',
			description: 'Learn React components and JSX syntax',
			order: 1,
			course: 'react-dev-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 75
		},
		{
			id: 'react-state-mock',
			title: 'State and Props',
			description: 'Master React state management and component props',
			order: 2,
			course: 'react-dev-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 45
		},
		{
			id: 'react-hooks-mock',
			title: 'React Hooks',
			description: 'Learn modern React with hooks like useState and useEffect',
			order: 3,
			course: 'react-dev-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		}
	],
	'python-fundamentals-mock': [
		// Python Fundamentals
		{
			id: 'python-syntax-mock',
			title: 'Python Syntax and Variables',
			description: 'Learn Python syntax, variables, and basic data types',
			order: 1,
			course: 'python-fundamentals-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-control-mock',
			title: 'Control Flow and Functions',
			description: 'Master if statements, loops, and function definitions',
			order: 2,
			course: 'python-fundamentals-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-data-mock',
			title: 'Data Structures',
			description: 'Work with lists, dictionaries, and other Python data structures',
			order: 3,
			course: 'python-fundamentals-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-oop-mock',
			title: 'Object-Oriented Programming',
			description: 'Learn classes, objects, and inheritance in Python',
			order: 4,
			course: 'python-fundamentals-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		}
	],
	'advanced-js-mock': [
		// Advanced JavaScript
		{
			id: 'es6-features-mock',
			title: 'ES6+ Features',
			description:
				'Explore modern JavaScript features like arrow functions, destructuring, and modules',
			order: 1,
			course: 'advanced-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 15
		},
		{
			id: 'async-js-mock',
			title: 'Async Programming',
			description: 'Master promises, async/await, and asynchronous JavaScript patterns',
			order: 2,
			course: 'advanced-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-patterns-mock',
			title: 'Design Patterns',
			description: 'Learn common JavaScript design patterns and best practices',
			order: 3,
			course: 'advanced-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		}
	],
	'fullstack-mock': [
		// Full Stack Development
		{
			id: 'backend-dev-mock',
			title: 'Backend Development',
			description: 'Build robust APIs with Node.js and Express',
			order: 1,
			course: 'fullstack-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 90
		},
		{
			id: 'database-design-mock',
			title: 'Database Design',
			description: 'Design and implement databases with SQL and NoSQL',
			order: 2,
			course: 'fullstack-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 70
		},
		{
			id: 'frontend-integration-mock',
			title: 'Frontend Integration',
			description: 'Connect frontend and backend with modern frameworks',
			order: 3,
			course: 'fullstack-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 80
		},
		{
			id: 'deployment-devops-mock',
			title: 'Deployment and DevOps',
			description: 'Deploy applications and set up CI/CD pipelines',
			order: 4,
			course: 'fullstack-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 0
		}
	]
};

export const mockLessons: Record<string, any[]> = {
	rvvqwn9467j1km8: [
		// Variables and Data Types
		{
			id: 'intro-vars-mock',
			title: 'Introduction to Variables',
			slug: 'introduction-to-variables',
			order: 1,
			estimatedMinutes: 30,
			isFree: true,
			status: 'published',
			course: 'b3z3vov77ntyyx1',
			module: 'rvvqwn9467j1km8',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 100
		},
		{
			id: 'data-types-mock',
			title: 'Data Types in JavaScript',
			slug: 'data-types-in-javascript',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'b3z3vov77ntyyx1',
			module: 'rvvqwn9467j1km8',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'type-conversion-mock',
			title: 'Type Conversion and Coercion',
			slug: 'type-conversion-coercion',
			order: 3,
			estimatedMinutes: 40,
			isFree: false,
			status: 'published',
			course: 'b3z3vov77ntyyx1',
			module: 'rvvqwn9467j1km8',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	myp5nfrs2mgf4x4: [
		// Components and JSX
		{
			id: 'react-intro-mock',
			title: 'Introduction to React',
			slug: 'introduction-to-react',
			order: 1,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: '73ptkp2v7kx0qsz',
			module: 'myp5nfrs2mgf4x4',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 100
		},
		{
			id: 'jsx-syntax-mock',
			title: 'JSX Syntax and Rules',
			slug: 'jsx-syntax-rules',
			order: 2,
			estimatedMinutes: 35,
			isFree: true,
			status: 'published',
			course: '73ptkp2v7kx0qsz',
			module: 'myp5nfrs2mgf4x4',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 50
		},
		{
			id: 'component-lifecycle-mock',
			title: 'Component Lifecycle',
			slug: 'component-lifecycle',
			order: 3,
			estimatedMinutes: 60,
			isFree: false,
			status: 'published',
			course: '73ptkp2v7kx0qsz',
			module: 'myp5nfrs2mgf4x4',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		}
	],
	// JavaScript Fundamentals lessons
	'js-vars-mock': [
		{
			id: 'js-intro-vars-mock',
			title: 'Introduction to Variables',
			slug: 'js-introduction-to-variables',
			order: 1,
			estimatedMinutes: 30,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-vars-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 100
		},
		{
			id: 'js-data-types-mock',
			title: 'JavaScript Data Types',
			slug: 'js-data-types',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-vars-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 50
		},
		{
			id: 'js-type-conversion-mock',
			title: 'Type Conversion and Coercion',
			slug: 'js-type-conversion',
			order: 3,
			estimatedMinutes: 40,
			isFree: false,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-vars-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	'js-functions-mock': [
		{
			id: 'js-function-basics-mock',
			title: 'Function Basics',
			slug: 'js-function-basics',
			order: 1,
			estimatedMinutes: 40,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-functions-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 80
		},
		{
			id: 'js-scope-closure-mock',
			title: 'Scope and Closures',
			slug: 'js-scope-closures',
			order: 2,
			estimatedMinutes: 60,
			isFree: false,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-functions-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-higher-order-mock',
			title: 'Higher-Order Functions',
			slug: 'js-higher-order-functions',
			order: 3,
			estimatedMinutes: 50,
			isFree: false,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-functions-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	'js-dom-mock': [
		{
			id: 'js-dom-intro-mock',
			title: 'Introduction to the DOM',
			slug: 'js-dom-introduction',
			order: 1,
			estimatedMinutes: 35,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-dom-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-dom-selection-mock',
			title: 'Selecting DOM Elements',
			slug: 'js-dom-selection',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-dom-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-dom-manipulation-mock',
			title: 'DOM Manipulation',
			slug: 'js-dom-manipulation',
			order: 3,
			estimatedMinutes: 55,
			isFree: false,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-dom-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	'js-events-mock': [
		{
			id: 'js-event-basics-mock',
			title: 'Event Basics',
			slug: 'js-event-basics',
			order: 1,
			estimatedMinutes: 40,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-events-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-event-listeners-mock',
			title: 'Event Listeners',
			slug: 'js-event-listeners',
			order: 2,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-events-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-event-delegation-mock',
			title: 'Event Delegation',
			slug: 'js-event-delegation',
			order: 3,
			estimatedMinutes: 45,
			isFree: false,
			status: 'published',
			course: 'js-fundamentals-mock',
			module: 'js-events-mock',
			created: '2025-01-01T00:00:00.000Z',
			updated: '2025-01-01T00:00:00.000Z',
			progress: 0
		}
	],
	// React Development lessons
	'react-components-mock': [
		{
			id: 'react-intro-components-mock',
			title: 'Introduction to Components',
			slug: 'react-intro-components',
			order: 1,
			estimatedMinutes: 60,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-components-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 100
		},
		{
			id: 'react-jsx-syntax-mock',
			title: 'JSX Syntax and Usage',
			slug: 'react-jsx-syntax',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-components-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 80
		},
		{
			id: 'react-component-lifecycle-mock',
			title: 'Component Lifecycle',
			slug: 'react-component-lifecycle',
			order: 3,
			estimatedMinutes: 70,
			isFree: false,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-components-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		}
	],
	'react-state-mock': [
		{
			id: 'react-state-basics-mock',
			title: 'Managing Component State',
			slug: 'react-state-basics',
			order: 1,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-state-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 60
		},
		{
			id: 'react-props-drilling-mock',
			title: 'Props and Data Flow',
			slug: 'react-props-data-flow',
			order: 2,
			estimatedMinutes: 70,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-state-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 30
		},
		{
			id: 'react-state-lifting-mock',
			title: 'Lifting State Up',
			slug: 'react-lifting-state',
			order: 3,
			estimatedMinutes: 60,
			isFree: false,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-state-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		}
	],
	'react-hooks-mock': [
		{
			id: 'react-usestate-mock',
			title: 'useState Hook',
			slug: 'react-usestate-hook',
			order: 1,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-hooks-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'react-useeffect-mock',
			title: 'useEffect Hook',
			slug: 'react-useeffect-hook',
			order: 2,
			estimatedMinutes: 65,
			isFree: true,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-hooks-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'react-custom-hooks-mock',
			title: 'Custom Hooks',
			slug: 'react-custom-hooks',
			order: 3,
			estimatedMinutes: 55,
			isFree: false,
			status: 'published',
			course: 'react-dev-mock',
			module: 'react-hooks-mock',
			created: '2025-01-02T00:00:00.000Z',
			updated: '2025-01-02T00:00:00.000Z',
			progress: 0
		}
	],
	// Advanced JavaScript lessons
	'es6-features-mock': [
		{
			id: 'es6-arrow-functions-mock',
			title: 'Arrow Functions and Template Literals',
			slug: 'es6-arrow-functions',
			order: 1,
			estimatedMinutes: 40,
			isFree: true,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'es6-features-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 10
		},
		{
			id: 'es6-destructuring-mock',
			title: 'Destructuring Assignment',
			slug: 'es6-destructuring',
			order: 2,
			estimatedMinutes: 30,
			isFree: true,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'es6-features-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'es6-modules-mock',
			title: 'ES6 Modules',
			slug: 'es6-modules',
			order: 3,
			estimatedMinutes: 50,
			isFree: false,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'es6-features-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		}
	],
	'async-js-mock': [
		{
			id: 'async-promises-mock',
			title: 'Promises and Promise Chaining',
			slug: 'async-promises',
			order: 1,
			estimatedMinutes: 60,
			isFree: true,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'async-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 5
		},
		{
			id: 'async-await-mock',
			title: 'async/await Syntax',
			slug: 'async-await',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'async-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'async-event-loop-mock',
			title: 'Event Loop and Call Stack',
			slug: 'async-event-loop',
			order: 3,
			estimatedMinutes: 70,
			isFree: false,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'async-js-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		}
	],
	'js-patterns-mock': [
		{
			id: 'js-module-pattern-mock',
			title: 'Module Pattern',
			slug: 'js-module-pattern',
			order: 1,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'js-patterns-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-observer-pattern-mock',
			title: 'Observer Pattern',
			slug: 'js-observer-pattern',
			order: 2,
			estimatedMinutes: 60,
			isFree: false,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'js-patterns-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'js-factory-pattern-mock',
			title: 'Factory Pattern',
			slug: 'js-factory-pattern',
			order: 3,
			estimatedMinutes: 45,
			isFree: false,
			status: 'published',
			course: 'advanced-js-mock',
			module: 'js-patterns-mock',
			created: '2025-01-04T00:00:00.000Z',
			updated: '2025-01-04T00:00:00.000Z',
			progress: 0
		}
	],
	// Full Stack Development lessons
	'backend-dev-mock': [
		{
			id: 'node-express-setup-mock',
			title: 'Setting up Node.js and Express',
			slug: 'node-express-setup',
			order: 1,
			estimatedMinutes: 60,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'backend-dev-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 90
		},
		{
			id: 'rest-api-design-mock',
			title: 'REST API Design',
			slug: 'rest-api-design',
			order: 2,
			estimatedMinutes: 80,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'backend-dev-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 85
		},
		{
			id: 'api-authentication-mock',
			title: 'API Authentication',
			slug: 'api-authentication',
			order: 3,
			estimatedMinutes: 70,
			isFree: false,
			status: 'published',
			course: 'fullstack-mock',
			module: 'backend-dev-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 0
		}
	],
	'database-design-mock': [
		{
			id: 'sql-basics-mock',
			title: 'SQL Fundamentals',
			slug: 'sql-basics',
			order: 1,
			estimatedMinutes: 90,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'database-design-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 85
		},
		{
			id: 'database-normalization-mock',
			title: 'Database Normalization',
			slug: 'database-normalization',
			order: 2,
			estimatedMinutes: 75,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'database-design-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 70
		},
		{
			id: 'nosql-databases-mock',
			title: 'NoSQL Databases',
			slug: 'nosql-databases',
			order: 3,
			estimatedMinutes: 65,
			isFree: false,
			status: 'published',
			course: 'fullstack-mock',
			module: 'database-design-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 0
		}
	],
	'frontend-integration-mock': [
		{
			id: 'api-integration-mock',
			title: 'Frontend API Integration',
			slug: 'frontend-api-integration',
			order: 1,
			estimatedMinutes: 60,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'frontend-integration-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 70
		},
		{
			id: 'state-management-mock',
			title: 'State Management',
			slug: 'state-management',
			order: 2,
			estimatedMinutes: 80,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'frontend-integration-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 50
		},
		{
			id: 'error-handling-mock',
			title: 'Error Handling',
			slug: 'error-handling',
			order: 3,
			estimatedMinutes: 45,
			isFree: false,
			status: 'published',
			course: 'fullstack-mock',
			module: 'frontend-integration-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 0
		}
	],
	'deployment-devops-mock': [
		{
			id: 'docker-basics-mock',
			title: 'Docker Basics',
			slug: 'docker-basics',
			order: 1,
			estimatedMinutes: 70,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'deployment-devops-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 80
		},
		{
			id: 'cloud-deployment-mock',
			title: 'Cloud Deployment',
			slug: 'cloud-deployment',
			order: 2,
			estimatedMinutes: 90,
			isFree: true,
			status: 'published',
			course: 'fullstack-mock',
			module: 'deployment-devops-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 60
		},
		{
			id: 'ci-cd-pipeline-mock',
			title: 'CI/CD Pipeline',
			slug: 'ci-cd-pipeline',
			order: 3,
			estimatedMinutes: 85,
			isFree: false,
			status: 'published',
			course: 'fullstack-mock',
			module: 'deployment-devops-mock',
			created: '2025-01-05T00:00:00.000Z',
			updated: '2025-01-05T00:00:00.000Z',
			progress: 0
		}
	],
	// Python Fundamentals lessons
	'python-syntax-mock': [
		{
			id: 'python-intro-mock',
			title: 'Introduction to Python',
			slug: 'introduction-to-python',
			order: 1,
			estimatedMinutes: 30,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-syntax-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 100
		},
		{
			id: 'python-variables-mock',
			title: 'Variables and Data Types',
			slug: 'python-variables-data-types',
			order: 2,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-syntax-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-strings-mock',
			title: 'String Manipulation',
			slug: 'python-string-manipulation',
			order: 3,
			estimatedMinutes: 40,
			isFree: false,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-syntax-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		}
	],
	'python-control-mock': [
		{
			id: 'python-conditionals-mock',
			title: 'Conditional Statements',
			slug: 'python-conditional-statements',
			order: 1,
			estimatedMinutes: 35,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-control-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-loops-mock',
			title: 'Loops and Iteration',
			slug: 'python-loops-iteration',
			order: 2,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-control-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-functions-mock',
			title: 'Function Definition and Usage',
			slug: 'python-function-definition',
			order: 3,
			estimatedMinutes: 60,
			isFree: false,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-control-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		}
	],
	'python-data-mock': [
		{
			id: 'python-lists-mock',
			title: 'Lists and Tuples',
			slug: 'python-lists-tuples',
			order: 1,
			estimatedMinutes: 45,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-data-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-dictionaries-mock',
			title: 'Dictionaries and Sets',
			slug: 'python-dictionaries-sets',
			order: 2,
			estimatedMinutes: 50,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-data-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		}
	],
	'python-oop-mock': [
		{
			id: 'python-classes-mock',
			title: 'Classes and Objects',
			slug: 'python-classes-objects',
			order: 1,
			estimatedMinutes: 60,
			isFree: true,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-oop-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		},
		{
			id: 'python-inheritance-mock',
			title: 'Inheritance and Polymorphism',
			slug: 'python-inheritance-polymorphism',
			order: 2,
			estimatedMinutes: 70,
			isFree: false,
			status: 'published',
			course: 'python-fundamentals-mock',
			module: 'python-oop-mock',
			created: '2025-01-03T00:00:00.000Z',
			updated: '2025-01-03T00:00:00.000Z',
			progress: 0
		}
	]
};
