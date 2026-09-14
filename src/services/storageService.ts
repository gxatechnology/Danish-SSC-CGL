import { MockAttemptResult, ErrorLogEntry, BookmarkItem, StudyPlanDay } from '../types';

export const APP_DATA_VERSION = '2.0.0';
const DATA_VERSION_KEY = 'danish_cgl_data_version';

const STORAGE_KEYS = {
  COMPLETED_CHAPTERS: 'danish_cgl_completed_chapters',
  LAST_OPENED_CHAPTER: 'danish_cgl_last_opened',
  BOOKMARKS: 'danish_cgl_bookmarks',
  ERROR_LOG: 'danish_cgl_error_log',
  MOCK_ATTEMPTS: 'danish_cgl_mock_attempts',
  STUDY_PLAN_DAYS: 'danish_cgl_study_plan_days',
  REVISED_RULES: 'danish_cgl_revised_rules',
  REVISED_FORMULAS: 'danish_cgl_revised_formulas',
  LEARNED_VOCAB: 'danish_cgl_learned_vocab',
  SETTINGS: 'danish_cgl_settings',
};

// Dispatch storage change event for reactive UI updates
const notifyStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('danish_cgl_storage_changed'));
  }
};

// Run version check and purge obsolete demo data on first load
export function checkAndMigrateStorageVersion() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (currentVersion !== APP_DATA_VERSION) {
      // Purge all old hardcoded/pre-seeded demo keys
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_CHAPTERS);
      localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_CHAPTER);
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
      localStorage.removeItem(STORAGE_KEYS.ERROR_LOG);
      localStorage.removeItem(STORAGE_KEYS.MOCK_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.STUDY_PLAN_DAYS);
      localStorage.removeItem(STORAGE_KEYS.REVISED_RULES);
      localStorage.removeItem(STORAGE_KEYS.REVISED_FORMULAS);
      localStorage.removeItem(STORAGE_KEYS.LEARNED_VOCAB);
      // Mark current clean version
      localStorage.setItem(DATA_VERSION_KEY, APP_DATA_VERSION);
      notifyStorageChange();
    }
  } catch (e) {
    console.error('Storage migration error:', e);
  }
}

// Auto-run migration
checkAndMigrateStorageVersion();

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoLogError: boolean;
  dailyTargetMinutes: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  autoLogError: true,
  dailyTargetMinutes: 115,
};

export const storageService = {
  // Last Opened Lesson - null if user hasn't opened any chapter yet
  getLastOpenedChapter(): { slug: string; subject: string; title: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_OPENED_CHAPTER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setLastOpenedChapter(chapter: { slug: string; subject: string; title: string }) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_OPENED_CHAPTER, JSON.stringify(chapter));
      notifyStorageChange();
    } catch (e) {
      console.error(e);
    }
  },

  // Completed Chapters - returns ONLY genuinely user-completed chapters (starts at [])
  getCompletedChapters(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_CHAPTERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isChapterCompleted(slug: string): boolean {
    return this.getCompletedChapters().includes(slug);
  },

  toggleChapterCompletion(slug: string): boolean {
    const list = this.getCompletedChapters();
    let updated: string[];
    let isCompleted = false;
    if (list.includes(slug)) {
      updated = list.filter((s) => s !== slug);
      isCompleted = false;
    } else {
      updated = [...list, slug];
      isCompleted = true;
    }
    localStorage.setItem(STORAGE_KEYS.COMPLETED_CHAPTERS, JSON.stringify(updated));
    notifyStorageChange();
    return isCompleted;
  },

  // Bookmarks - returns ONLY user-saved bookmarks (starts at [])
  getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(item: Omit<BookmarkItem, 'id' | 'dateAdded'>): boolean {
    const bookmarks = this.getBookmarks();
    const existingIndex = bookmarks.findIndex((b) => b.targetId === item.targetId);
    let state = false;
    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      state = false; // unbookmarked
    } else {
      const newItem: BookmarkItem = {
        ...item,
        id: 'bm_' + Date.now(),
        dateAdded: new Date().toISOString(),
      };
      bookmarks.push(newItem);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      state = true; // bookmarked
    }
    notifyStorageChange();
    return state;
  },

  isBookmarked(targetId: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((b) => b.targetId === targetId);
  },

  // Error Log - returns ONLY user-flagged or auto-logged mistakes (starts at [])
  getErrorLog(): ErrorLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addErrorLogEntry(entry: Omit<ErrorLogEntry, 'id' | 'dateAdded'>) {
    const logs = this.getErrorLog();
    const existing = logs.find((l) => l.questionId === entry.questionId);
    if (existing) {
      existing.userAnswer = entry.userAnswer;
      existing.isCorrected = false;
    } else {
      logs.unshift({
        ...entry,
        id: 'err_' + Date.now(),
        dateAdded: new Date().toISOString().split('T')[0],
      });
    }
    localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(logs));
    notifyStorageChange();
  },

  toggleErrorCorrected(id: string): boolean {
    const logs = this.getErrorLog();
    const item = logs.find((l) => l.id === id);
    if (item) {
      item.isCorrected = !item.isCorrected;
      localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(logs));
      notifyStorageChange();
      return item.isCorrected;
    }
    return false;
  },

  deleteErrorLogEntry(id: string) {
    const logs = this.getErrorLog().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(logs));
    notifyStorageChange();
  },

  // Mock Attempts - returns ONLY actual tests submitted by user (starts at [])
  getMockAttempts(): MockAttemptResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockAttempt(attempt: MockAttemptResult) {
    const attempts = this.getMockAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.MOCK_ATTEMPTS, JSON.stringify(attempts));
    notifyStorageChange();
  },

  getMockAttemptById(attemptId: string): MockAttemptResult | undefined {
    return this.getMockAttempts().find((a) => a.attemptId === attemptId);
  },

  // Study Plan - stores user checkboxes for the 17-day schedule
  getStudyPlanDays(): StudyPlanDay[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN_DAYS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStudyPlanDays(days: StudyPlanDay[]) {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN_DAYS, JSON.stringify(days));
    notifyStorageChange();
  },

  // Revised Rules & Formulas - starts at []
  getRevisedRuleIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISED_RULES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleRevisedRule(ruleId: string): boolean {
    const ids = this.getRevisedRuleIds();
    let updated: string[];
    let state = false;
    if (ids.includes(ruleId)) {
      updated = ids.filter((id) => id !== ruleId);
      state = false;
    } else {
      updated = [...ids, ruleId];
      state = true;
    }
    localStorage.setItem(STORAGE_KEYS.REVISED_RULES, JSON.stringify(updated));
    notifyStorageChange();
    return state;
  },

  getRevisedFormulaIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISED_FORMULAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleRevisedFormula(formulaId: string): boolean {
    const ids = this.getRevisedFormulaIds();
    let updated: string[];
    let state = false;
    if (ids.includes(formulaId)) {
      updated = ids.filter((id) => id !== formulaId);
      state = false;
    } else {
      updated = [...ids, formulaId];
      state = true;
    }
    localStorage.setItem(STORAGE_KEYS.REVISED_FORMULAS, JSON.stringify(updated));
    notifyStorageChange();
    return state;
  },

  // Learned Vocab
  getLearnedVocabIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNED_VOCAB);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleLearnedVocab(wordId: string): boolean {
    const ids = this.getLearnedVocabIds();
    let updated: string[];
    let state = false;
    if (ids.includes(wordId)) {
      updated = ids.filter((id) => id !== wordId);
      state = false;
    } else {
      updated = [...ids, wordId];
      state = true;
    }
    localStorage.setItem(STORAGE_KEYS.LEARNED_VOCAB, JSON.stringify(updated));
    notifyStorageChange();
    return state;
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(settings: Partial<AppSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyStorageChange();
    return updated;
  },

  // Export Study Data JSON
  exportAllData(): string {
    const exportObject = {
      exportVersion: '2.0.0',
      appName: 'Danish SSC CGL Study Hub',
      preparedFor: 'Danish Fatma',
      preparedBy: 'Tauqeer Ashraf',
      exportDate: new Date().toISOString(),
      completedChapters: this.getCompletedChapters(),
      bookmarks: this.getBookmarks(),
      errorLog: this.getErrorLog(),
      mockAttempts: this.getMockAttempts(),
      studyPlanDays: this.getStudyPlanDays(),
      revisedRules: this.getRevisedRuleIds(),
      revisedFormulas: this.getRevisedFormulaIds(),
      learnedVocab: this.getLearnedVocabIds(),
      settings: this.getSettings(),
    };
    return JSON.stringify(exportObject, null, 2);
  },

  // Import Study Data JSON
  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid JSON file structure.' };
      }
      if (Array.isArray(data.completedChapters)) {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_CHAPTERS, JSON.stringify(data.completedChapters));
      }
      if (Array.isArray(data.bookmarks)) {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks));
      }
      if (Array.isArray(data.errorLog)) {
        localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(data.errorLog));
      }
      if (Array.isArray(data.mockAttempts)) {
        localStorage.setItem(STORAGE_KEYS.MOCK_ATTEMPTS, JSON.stringify(data.mockAttempts));
      }
      if (Array.isArray(data.studyPlanDays)) {
        localStorage.setItem(STORAGE_KEYS.STUDY_PLAN_DAYS, JSON.stringify(data.studyPlanDays));
      }
      if (Array.isArray(data.revisedRules)) {
        localStorage.setItem(STORAGE_KEYS.REVISED_RULES, JSON.stringify(data.revisedRules));
      }
      if (Array.isArray(data.revisedFormulas)) {
        localStorage.setItem(STORAGE_KEYS.REVISED_FORMULAS, JSON.stringify(data.revisedFormulas));
      }
      if (Array.isArray(data.learnedVocab)) {
        localStorage.setItem(STORAGE_KEYS.LEARNED_VOCAB, JSON.stringify(data.learnedVocab));
      }
      notifyStorageChange();
      return { success: true, message: 'Study data successfully restored!' };
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Parse error';
      return { success: false, message: `Import failed: ${err}` };
    }
  },

  // Reset Operations
  resetProgress() {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_CHAPTERS);
    localStorage.removeItem(STORAGE_KEYS.REVISED_RULES);
    localStorage.removeItem(STORAGE_KEYS.REVISED_FORMULAS);
    localStorage.removeItem(STORAGE_KEYS.LEARNED_VOCAB);
    localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_CHAPTER);
    notifyStorageChange();
  },

  resetResults() {
    localStorage.removeItem(STORAGE_KEYS.MOCK_ATTEMPTS);
    notifyStorageChange();
  },

  resetErrorLog() {
    localStorage.removeItem(STORAGE_KEYS.ERROR_LOG);
    notifyStorageChange();
  },

  resetAll() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(DATA_VERSION_KEY, APP_DATA_VERSION);
    notifyStorageChange();
  },

  clearAllData() {
    this.resetAll();
  },

  exportAllUserData(): string {
    return this.exportAllData();
  },

  importUserData(jsonString: string): boolean {
    return this.importData(jsonString).success;
  },

  // Auto Error Log Setting
  isAutoErrorLogEnabled(): boolean {
    return this.getSettings().autoLogError;
  },

  setAutoErrorLog(enabled: boolean) {
    this.updateSettings({ autoLogError: enabled });
  },

  // Error Log Aliases
  addErrorLogItem(item: {
    questionId: string;
    questionText: string;
    subject: string;
    topic: string;
    errorType: any;
    notes?: string;
    sourceTestOrChapter?: string;
    correctAnswer: string;
    yourAnswer: string;
  }) {
    this.addErrorLogEntry({
      questionId: item.questionId,
      questionText: item.questionText,
      subject: item.subject === 'English' ? 'English' : 'Quantitative',
      topic: item.topic,
      userAnswer: item.yourAnswer,
      correctAnswer: item.correctAnswer,
      explanation: item.notes || `Logged from ${item.sourceTestOrChapter || 'practice'}`,
      errorType: item.errorType,
      isCorrected: false,
      notes: item.notes,
    });
  },

  toggleErrorLogCorrected(id: string): boolean {
    return this.toggleErrorCorrected(id);
  },

  deleteErrorLogItem(id: string) {
    this.deleteErrorLogEntry(id);
  },

  // Test Results Compatibility
  getTestResults(): any[] {
    const attempts = this.getMockAttempts();
    return attempts.map((a) => ({
      attemptId: a.attemptId,
      testId: a.mockId,
      title: a.mockTitle,
      date: a.date,
      totalScore: a.finalScore,
      maxMarks: a.maxMarks,
      accuracy: a.accuracy,
      correctCount: a.correct,
      wrongCount: a.wrong,
      unattemptedCount: a.unattempted,
      negativeMarksLost: a.negativeMarksLost,
      timeTakenSeconds: a.totalTimeSpentSeconds,
      userAnswers: Object.fromEntries(
        Object.entries(a.responses || {}).map(([qid, resp]: [string, any]) => [qid, resp?.selectedOption || ''])
      ),
      topicBreakdown: Object.entries(a.topicBreakdown || {}).map(([topic, stats]: [string, any]) => ({
        topic,
        total: stats?.total || 0,
        correct: stats?.correct || 0,
        wrong: stats?.wrong || 0,
        accuracy: (stats?.total || 0) > 0 ? Math.round(((stats?.correct || 0) / (stats?.total || 1)) * 100) : 0,
      })),
    }));
  },

  saveTestResult(result: any) {
    const attempt: MockAttemptResult = {
      attemptId: result.attemptId || 'att_' + Date.now(),
      mockId: result.testId,
      mockTitle: result.title,
      date: result.date || new Date().toISOString(),
      totalQuestions: (result.correctCount || 0) + (result.wrongCount || 0) + (result.unattemptedCount || 0),
      attempted: (result.correctCount || 0) + (result.wrongCount || 0),
      correct: result.correctCount || 0,
      wrong: result.wrongCount || 0,
      unattempted: result.unattemptedCount || 0,
      rawScore: (result.correctCount || 0) * 2,
      negativeMarksLost: result.negativeMarksLost || 0,
      finalScore: result.totalScore,
      maxMarks: result.maxMarks,
      accuracy: result.accuracy,
      totalTimeSpentSeconds: result.timeTakenSeconds || 0,
      responses: Object.fromEntries(
        Object.entries(result.userAnswers || {}).map(([qid, ans]) => [
          qid,
          {
            questionId: qid,
            selectedOption: ans as string,
            isMarkedForReview: false,
            timeSpentSeconds: 30,
          },
        ])
      ),
      topicBreakdown: Object.fromEntries(
        (result.topicBreakdown || []).map((tb: any) => [
          tb.topic,
          { total: tb.total, correct: tb.correct, wrong: tb.wrong },
        ])
      ),
    };
    this.saveMockAttempt(attempt);
  },

  // Personal Notes for Chapters
  getChapterNotes(slug: string): string {
    try {
      return localStorage.getItem(`danish_cgl_notes_${slug}`) || '';
    } catch {
      return '';
    }
  },

  saveChapterNotes(slug: string, notes: string) {
    try {
      localStorage.setItem(`danish_cgl_notes_${slug}`, notes);
      notifyStorageChange();
    } catch (e) {
      console.error('Error saving notes', e);
    }
  },

  // Chapter Self-Assessment: 'Not Yet' | 'Need Revision' | 'Confident'
  getChapterAssessment(slug: string): 'Not Yet' | 'Need Revision' | 'Confident' {
    try {
      const val = localStorage.getItem(`danish_cgl_assessment_${slug}`);
      if (val === 'Need Revision' || val === 'Confident') return val;
      return 'Not Yet';
    } catch {
      return 'Not Yet';
    }
  },

  saveChapterAssessment(slug: string, status: 'Not Yet' | 'Need Revision' | 'Confident') {
    try {
      localStorage.setItem(`danish_cgl_assessment_${slug}`, status);
      notifyStorageChange();
    } catch (e) {
      console.error('Error saving assessment', e);
    }
  },

  // Chapter Highlights
  getChapterHighlights(slug: string): { id: string; text: string; color: 'yellow' | 'green' | 'pink'; date: string }[] {
    try {
      const data = localStorage.getItem(`danish_cgl_highlights_${slug}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveChapterHighlights(slug: string, highlights: { id: string; text: string; color: 'yellow' | 'green' | 'pink'; date: string }[]) {
    try {
      localStorage.setItem(`danish_cgl_highlights_${slug}`, JSON.stringify(highlights));
      notifyStorageChange();
    } catch (e) {
      console.error('Error saving highlights', e);
    }
  },
};
