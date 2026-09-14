# Danish SSC CGL Study Hub — Real Data Audit & Architecture Report

## Executive Summary
This document audits and certifies the complete elimination of fabricated, hardcoded, or simulated user activity data across the **Danish SSC CGL Study Hub**. The application adheres strictly to the **Real Zero State Principle**: a brand-new user or fresh browser session presents an authentic zero-state baseline reflecting zero completed chapters, zero mock attempts, zero bookmarked items, and zero error-log entries. All metrics, progress percentages, accuracy figures, and badges now derive directly and exclusively from verified user actions and real datasets.

---

## 1. Storage & Version Migration Layer (`storageService.ts`)

| Storage Key | Data Type | Default / Zero State | Mutation Trigger | Real Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| `df_app_data_version` | String (`'2.0.0'`) | `'2.0.0'` | Auto-checked on app initialization | Purges legacy `df_` localStorage keys from pre-existing demo sessions |
| `df_completed_chapters` | `string[]` | `[]` (Empty Array) | User clicks "Mark Chapter Complete" button inside a lesson | Real array of chapter slugs |
| `df_last_opened_chapter` | Object or `null` | `null` | User visits a chapter reading module | Last viewed lesson slug, title, and timestamp |
| `df_bookmarks` | `BookmarkItem[]` | `[]` (Empty Array) | User clicks bookmark icon on any rule, formula, vocabulary card, or question | Real user-selected pins |
| `df_error_log` | `ErrorLogItem[]` | `[]` (Empty Array) | Wrong answers during mocks/practice (if Auto-Log enabled) or manual log | Real student mistakes with question ID, user choice, and correct answer |
| `df_mock_attempts` | `MockAttempt[]` | `[]` (Empty Array) | User completes and submits a timed mock test | Exact scores, accuracy, timestamps, and questions attempted |
| `df_test_results` | `TestResult[]` | `[]` (Empty Array) | User completes and submits a timed mock test | Full question-by-question breakdown of student responses |
| `df_study_plan_days` | `StudyPlanDay[]` | 17 Days with `completed: false` | User checks/unchecks individual task checkboxes in 17-Day Plan | Real student checklist state |
| `df_auto_error_log` | Boolean | `true` | User toggles auto-logging in Error Log or Settings | Real student preference |

### Version-Based Auto-Purge Mechanism
```typescript
const APP_DATA_VERSION = '2.0.0';
// Automatically purges older simulated demo data on startup:
checkAndMigrateStorageVersion();
```
When an existing user with pre-seeded demo entries opens the app, the migration detector checks `df_app_data_version`. If missing or < `2.0.0`, all legacy keys are purged and reset to authentic empty collections, ensuring no user ever encounters synthetic completion states.

---

## 2. Metric-by-Metric Verification Audit

### A. Curriculum & Syllabus Progress
* **Previous State**: Subject–Verb Agreement falsely showed `72%` progress; total curriculum showed fake percentage.
* **Current Real Source**: 
  - Calculated dynamically: `completedCount = storageService.getCompletedChapters().length`
  - `totalChapters = ENGLISH_CHAPTERS.length + MATHS_CHAPTERS.length`
  - `progressPercent = Math.round((completedCount / totalChapters) * 100)`
* **Zero State**: Exactly `0% Completed • Not Started` (no artificial minimum bar width).
* **Completion Requirement**: Opening a page does NOT mark it complete. The user must explicitly press the green **"Mark Chapter Complete"** CTA in `ChapterReadingView.tsx`.

### B. Navbar Badges (Bookmarks & Error Notebook)
* **Previous State**: Displayed synthetic counts (`3` bookmarks, `4` errors).
* **Current Real Source**:
  - `bookmarkCount = storageService.getBookmarks().length`
  - `errorCount = storageService.getErrorLog().filter(e => !e.isCorrected).length`
* **Zero State**: Both badges start at count `0` and are completely hidden from the DOM (`{bookmarkCount > 0 && ...}`).
* **Reactive Sync**: Subscribes to custom window event `danish_cgl_storage_changed` to update instantaneously when bookmarks or errors are logged without requiring page reload.

### C. "Resume Learning" (Continue Where You Left Off)
* **Previous State**: Forced display of Subject–Verb Agreement as active in-progress lesson.
* **Current Real Source**: `storageService.getLastOpenedChapter()`
* **Zero State**: When `null`, displays a clear invitation: *"Begin with Subject–Verb Agreement — Rule 1: Prepositional phrase interposition"* with a *"Start Module 1"* CTA.

### D. Mock Test Attempts, Scores & Accuracies
* **Previous State**: Fabricated previous scores (`44.0 / 50`, `88% Accuracy`) on cards and summaries.
* **Current Real Source**: `storageService.getTestResults()` and `storageService.getMockAttempts()`
* **Zero State**:
  - Unattempted tests display badge `"Available"` (or `"Not Attempted"`).
  - Score displays `" — "`.
  - Date displays `"TCS 2026 Format"`.
  - Action button displays `"Start Mock"`.
  - Only after a real exam submission does the card switch to `"Attempted"`, `"Latest Score: X / Y"`, and offer a `"Report"` view button.

### E. Diagnostic Analytics Dashboard (`ProgressView.tsx`)
* **Previous State**: Displayed hardcoded "Day 48", "400 attempted MCQs", "82.0% Overall Accuracy", and a fake "7-day checkmark streak".
* **Current Real Source**:
  - Aggregate sums over real `MockAttempt[]` objects in `storageService.getMockAttempts()`.
  - Overall Accuracy: `totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null`
  - Sectional Average: `attempts.length > 0 ? (sum / attempts.length) : null`
  - Subject breakdowns for English, Quantitative, and Reasoning derived only from actual submitted attempts.
* **Zero State**:
  - Overall Accuracy: `" — "` (with subtitle: *"No mock tests attempted yet. Accuracy and diagnostic curves will calculate from your actual test submissions."*)
  - Sectional Avg: `" — "`
  - Subject Accuracy: `"Not Attempted"`
  - Active Streak: `"0 Active Days (Ready to Begin)"` with empty state indicator.

### F. 17-Day Study Masterplan (`StudyPlanView.tsx`)
* **Previous State**: Day 1 tasks were pre-marked `completed: true`.
* **Current Real Source**: `storageService.getStudyPlanDays()`, falling back to `STUDY_PLAN_DAYS`.
* **Zero State**: All 17 days, all 4 daily tasks (English, Maths, Practice, Revision) start with `completed: false` with unselected checkboxes.
* **User Control**: Checking a task persists immediately to `storageService.saveStudyPlanDays()`.

### G. Error Notebook (`ErrorLogView.tsx`) & Bookmarks (`BookmarksView.tsx`)
* **Previous State**: Pre-populated with 3 mock error items and 5 mock bookmarks.
* **Current Real Source**: Actual user interactions during practice/mocks.
* **Zero State**:
  - Error Log: Shows `"No Errors in this Category! Your error notebook is clear."` with clean empty state icon.
  - Bookmarks: Shows `"No Bookmarks Saved Yet. Click the bookmark icon on any chapter, formula, or vocabulary card to assemble your high-yield revision pinboard."`

---

## 3. Real Content Datasets (Factual Curriculum vs. User Activity)

The following datasets represent verified reference study curriculum and question banks (NOT user activity):
1. `ENGLISH_CHAPTERS` & `MATHS_CHAPTERS` (`src/data/mockData.ts`): Chapter lists with factual counts of rules and syllabus weightages.
2. `MCQ_BANK` (`src/content/mcqBank.ts`): 100+ verified TCS SSC CGL PYQs with official answer keys, detailed explanations, and trap analyses.
3. `MOCK_TESTS` (`src/content/mockTests.ts`): Realistic CBT sectional tests and mini drills configured with official +2 / -0.5 marking schemes.
4. `STUDY_PLAN_DAYS` (`src/content/studyPlan.ts`): Pedagogical roadmap structured across 17 days targeting the September 30, 2026 exam date.

---

## 4. Conclusion
Every visual badge, progress bar, accuracy stat, test result card, and activity log across the Danish SSC CGL Study Hub is now 100% faithful to actual student interaction. A fresh browser starts at true zero.
