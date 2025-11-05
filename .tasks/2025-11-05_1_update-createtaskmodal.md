# Context

File name: 2025-11-05_1_update-createtaskmodal.md
Created at: 2025-11-05_17:00:49
Created by: anlnm
Main branch: main
Task Branch: dev/anlnm/ui_developmen_6
Yolo Mode: Off

# Task Description

Update `CreateTaskModal.tsx` to:

1. Accept `defaultProjectId` prop and auto-select it (similar to `MeetingSchedulerModal.tsx`)
2. Convert assignee dropdown from `Dropdown` to `Combobox` with search functionality
3. Implement search for assignees with infinite query (pagination) like project selector
4. Update all callers to pass `defaultProjectId` where appropriate

# Project Overview

- Next.js 14+ with TypeScript
- Using Fluent UI React v9
- React Query for data fetching
- React Hook Form for form management
- Internationalization with next-intl
- Located at: d:\Project\SecureScribe\SecureScribeWeb

# Analysis

## Current State of CreateTaskModal

- File: `app/[locale]/tasks/components/CreateTaskModal.tsx`
- Props: `open`, `onClose`, `mode`, `taskId`, `initialTask`
- **Missing**: `defaultProjectId` prop
- Project selection: Uses Combobox with infinite query ✓
- Assignee selection: Uses Dropdown (no search, loads all users at once) ✗

## Current State of MeetingSchedulerModal (Reference)

- File: `components/modal/MeetingSchedulerModal.tsx`
- Props include: `defaultProjectId`
- Uses `defaultProjectId` in defaultValues
- Disables project selector when `defaultProjectId` is provided
- Project selection: Combobox with infinite query + search ✓

## Callers of CreateTaskModal

1. `ProjectDetailClient.tsx` (Line 755): `<CreateTaskModal open={showTaskModal} onClose={() => handleTaskModalClose(false)} />`
   - **Should pass**: `defaultProjectId={projectId}`
   - Has access to `projectId` from URL params
2. `TaskActionsMenu.tsx` (Line 172): Used for editing tasks
   - Passes `initialTask` prop
   - Should pass `defaultProjectId` based on context if available

3. `TasksPageClient.tsx` (Line 263): Used for creating tasks from tasks page
   - No project context, keep default behavior

## Current Assignee Implementation

- Uses simple `Dropdown` component
- Queries all users at once with `getUsers({ limit: 50, page: 1 })`
- No search, no pagination, no filtering

## Proposed Solution

- Add `defaultProjectId?: string` prop to `CreateTaskModalProps`
- Update form defaultValues to use `defaultProjectId`
- Disable project selector and hide project section when `defaultProjectId` is provided
- Convert assignee from `Dropdown` to `Combobox`
- Implement search for assignees using `useInfiniteQuery`
- Add user search state similar to project search
- Update `ProjectDetailClient.tsx` to pass `defaultProjectId={projectId}`

# Current execution step: "RESEARCH_COMPLETE"

# Task Progress

[Pending execution]

# Final Review:

[Pending]
