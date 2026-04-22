# School Management System - TODO

## Phase 1: Database Design & Schema
- [x] Create todo.md file
- [x] Design database schema (students, teachers, courses, enrollments, grades)
- [x] Create Drizzle schema with all tables and relationships
- [x] Generate migration SQL files
- [x] Execute migrations in database

## Phase 2: Backend Development
- [x] Implement database query helpers in server/db.ts
- [x] Create tRPC procedures for students CRUD
- [x] Create tRPC procedures for teachers CRUD
- [x] Create tRPC procedures for courses CRUD
- [x] Create tRPC procedures for enrollments CRUD
- [x] Create tRPC procedures for grades CRUD
- [x] Implement role-based access control (adminProcedure, userProcedure)
- [x] Add authorization checks for all procedures
- [x] Create test cases for critical procedures

## Phase 3: Frontend Development
- [x] Design elegant UI style guide (colors, typography, spacing)
- [x] Create i18n configuration for Spanish language
- [x] Build DashboardLayout with sidebar navigation
- [x] Create dashboard page with statistics
- [x] Build Students management page (list, create, edit, delete)
- [x] Build Teachers management page (list, create, edit, delete)
- [x] Build Courses management page (list, create, edit, delete)
- [x] Build Enrollments management page (list, enroll, view history)
- [x] Build Grades recording page (enter, view, edit)
- [x] Implement role-based UI visibility and access control
- [x] Add loading states and error handling

## Phase 4: Reports & Export
- [x] Diagnose the missing environment variables and routes.
- [x] Create implementation plan to fix authentication failure and 404 redirections.
- [x] Implement the fix: Update `.env`, `App.tsx`, and `SchoolDashboardLayout`.
- [x] Verify the fix: Test the login flow and all sidebar links.
- [x] Set up local MySQL using Docker Compose.
- [/] Revamp authentication system to use local username/password.
  - [ ] Update database schema (users table).
  - [ ] Implement backend login/register procedures.
  - [ ] Create frontend Auth page (Login/Register).
  - [ ] Update App.tsx and ProtectedRoute.
- [x] Create report generation procedures in backend
- [x] Implement CSV export for student lists
- [x] Implement CSV export for teacher lists
- [x] Implement CSV export for grades by course
- [x] Add CSV export options
- [x] Create reports page in frontend

## Phase 5: Testing & Validation
- [x] Write vitest tests for all backend procedures
- [x] Test role-based access control enforcement
- [x] Manual testing of all CRUD operations
- [x] Test report generation and exports
- [x] Verify Spanish language content throughout

## Phase 6: Deployment & Delivery
- [x] Final UI review and polish
- [x] Create checkpoint
- [x] Prepare deployment


## Phase 6: Materials & Interactive Questions System
- [x] Extend database schema with materials and questions tables
- [x] Create API procedures for uploading materials (PDF/images)
- [x] Create API procedures for CRUD of questions
- [x] Create API procedures for student answers to questions
- [x] Build Materials page for teachers (upload, manage, delete)
- [x] Build Materials view page for students
- [x] Build Questions page for teachers (create, edit, delete)
- [x] Build Questions page for students (view, answer, submit)
- [x] Implement file storage for PDFs and images
- [x] Add role-based access control for materials and questions
- [x] Implement teacher/admin-only procedures for material and question management
- [x] Add student identity validation for answer submissions
- [x] Create tests for materials and questions procedures


## Phase 7: Redesign Course Interaction
- [ ] Delete separate Materials and Questions pages
- [ ] Delete Answers page
- [ ] Create CourseDetail page with tabs for Materials, Questions, Students, Grades
- [ ] Implement Materials tab within CourseDetail (upload, view, delete)
- [ ] Implement Questions tab within CourseDetail (create, view, answer, edit)
- [ ] Implement Students tab within CourseDetail (view enrolled students)
- [ ] Implement Grades tab within CourseDetail (view/enter grades for course students)
- [ ] Update Courses page to navigate to CourseDetail on click
- [ ] Update navigation to remove Materials and Questions menu items
- [ ] Test all interactions within course detail view
