# Turtle Academy PocketBase Schema Setup

This document describes the complete PocketBase schema and setup for Turtle Academy, a beginner-friendly coding course platform.

## Overview

Turtle Academy is designed to teach programming fundamentals through:

- Short animations and interactive visualizations
- Live coding exercises with step-by-step execution
- Visual indicators for loops, arrays, and functions
- Gamification with badges, XP, and progress tracking

## Database Schema

### Collections Overview

The schema includes 12 collections that work together to create a comprehensive learning platform:

1. **users** (auth) - User accounts with roles and profiles
2. **courses** - Course catalog and metadata
3. **modules** - Course sections (e.g., "Loops", "Arrays")
4. **lessons** - Individual lessons within modules
5. **exercises** - Coding exercises with starter code
6. **checks** - Grading specifications for exercises
7. **submissions** - Student code submissions and results
8. **progress** - Per-user lesson completion tracking
9. **assets** - Videos, animations, and other media files
10. **badges** - Achievement badges for gamification
11. **achievements** - User badge awards
12. **xp_events** - Experience point tracking and history

### Key Features

- **Role-based access control** (student/instructor/admin)
- **Content hierarchy** (courses → modules → lessons → exercises)
- **Real-time progress tracking** with Kanban-style status
- **Code execution and grading** with visual feedback
- **Gamification system** with badges and XP
- **Asset management** for videos and animations
- **Event streaming** for code execution visualization

## Setup Instructions

### Prerequisites

1. PocketBase instance running (local or hosted)
2. Admin credentials for your PocketBase instance
3. Node.js environment with ES modules support

### Environment Variables

Set these environment variables before running the setup:

```bash
export PB_URL="https://academy.pockethost.io"
export PB_ADMIN_EMAIL="admin@academy.com"
export PB_ADMIN_PASSWORD="your-admin-password"
```

### Quick Setup

Run the complete setup with one command:

```bash
pnpm run pb:setup
```

This will:

1. Create all 12 collections with proper relationships
2. Set up access rules and indexes
3. Create sample data for the "Foundations" course
4. Generate test users and progress data

### Individual Scripts

You can also run individual parts of the setup:

```bash
# Schema only (creates collections and rules)
pnpm run pb:schema

# Seed data only (creates sample content)
pnpm run pb:seed

# Full setup (schema + seed data)
pnpm run pb:setup
```

## Sample Data

The seed script creates:

### Users

- **1 Instructor**: `instructor@academy.dev` / `instructor123`
- **4 Students**:
  - `alice@student.dev` / `student123`
  - `bob@student.dev` / `student123`
  - `carol@student.dev` / `student123`
  - `dave@student.dev` / `student123`

### Course Content

- **Foundations Course** with 3 modules:
  - **Loops**: 2 lessons (Loops 101, Loop Iterations)
  - **Arrays**: 2 lessons (Arrays 101, Array Mutation)
  - **Functions**: 1 lesson (Functions 101)
- **6 exercises** with starter code and solution code
- **Grading checks** for each exercise
- **4 achievement badges**

### Progress Data

- Sample progress entries for different students
- Example submissions (both passing and failing)
- XP events and achievement awards

## API Usage

The setup includes a comprehensive PocketBase client with helper functions:

```typescript
import { auth, courses, lessons, exercises, progress } from '$lib/pocketbase';

// Authentication
await auth.login('student@example.com', 'password');
await auth.logout();

// Course management
const courseList = await courses.list();
const course = await courses.getBySlug('foundations');

// Lesson and exercise access
const lessons = await lessons.getByCourse(courseId);
const exercises = await exercises.getByLesson(lessonId);

// Progress tracking
const userProgress = await progress.getUserProgress();
await progress.updateProgress(lessonId, 'completed');

// Code submission
const submission = await exercises.submit(exerciseId, userCode);
```

## Collection Details

### Users Collection

- Extends PocketBase auth with custom fields
- Roles: `student`, `instructor`, `admin`
- Profile fields: handle, displayName, avatar, bio
- Gamification: xp, streakCount

### Courses Collection

- Hierarchical content organization
- Visibility controls: `public`, `private`, `unlisted`
- Status management: `draft`, `published`
- Author relationships and ordering

### Lessons Collection

- Rich content with JSON blocks (MDX support)
- Asset relationships for videos and animations
- Free/paid lesson controls
- Estimated completion time

### Exercises Collection

- Multi-language support (JS, TS, Python, Java)
- Starter code and protected solution code
- Runtime limits and visualizer configuration
- Ordering and visibility controls

### Submissions Collection

- Code execution results and timing
- Event streaming for visualizers
- Pass/fail/error status tracking
- Performance metrics

### Progress Collection

- Per-user lesson status tracking
- Best completion time and attempt counts
- Kanban-style status: `not_started`, `in_progress`, `completed`
- Links to last submission

## Access Rules

The schema implements comprehensive access control:

- **Students**: Can view published content, submit code, track progress
- **Instructors**: Can create/edit courses, view all submissions, manage content
- **Admins**: Full access to all collections and data

### Key Rule Patterns

```javascript
// Students can only see published content
listRule: 'status = "published" && visibility = "public"';

// Users can only modify their own data
updateRule: 'user = @request.auth.id';

// Instructors can manage their courses
createRule: 'course.author = @request.auth.id';
```

## Indexes

Performance-optimized indexes for common queries:

- User lookups by handle and role
- Course filtering by status and visibility
- Lesson ordering within courses and modules
- Progress tracking by user and lesson
- Submission history and results
- Asset type and visibility filtering

## Real-time Features

PocketBase real-time subscriptions for:

- Live progress updates
- Code submission results
- Achievement notifications
- XP and streak changes

## Development Workflow

1. **Schema Changes**: Modify `scripts/academy_schema.js`
2. **Seed Data**: Update `scripts/academy_seed.js`
3. **Test Setup**: Run `pnpm run pb:setup`
4. **Frontend Integration**: Use helpers in `src/lib/pocketbase/index.ts`

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check PB_URL and network connectivity
2. **Authentication Failed**: Verify admin credentials
3. **Collection Already Exists**: Scripts are idempotent and safe to re-run
4. **Missing Environment Variables**: Ensure all required env vars are set

### Debug Mode

Add debug logging to see detailed execution:

```bash
DEBUG=* pnpm run pb:setup
```

### Manual Verification

Check your PocketBase admin UI to verify:

- All 12 collections are created
- Access rules are properly set
- Sample data is present
- Indexes are created

## Next Steps

After running the setup:

1. **Frontend Development**: Build the course catalog and lesson player
2. **Code Execution**: Integrate Monaco editor and WebContainers
3. **Visualizers**: Implement loop, array, and function visualizers
4. **UI Components**: Create the Kanban board and progress tracking
5. **Authentication**: Implement login/signup flows
6. **Real-time Updates**: Connect progress and submission subscriptions

## Support

For issues with the setup:

1. Check the console output for specific errors
2. Verify your PocketBase instance is accessible
3. Ensure all environment variables are set correctly
4. Try running individual scripts to isolate issues

The setup is designed to be idempotent - you can safely run it multiple times without issues.
