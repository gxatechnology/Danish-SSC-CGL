export type SubjectType = 'English' | 'Mathematics' | 'Reasoning' | 'General Awareness' | 'Tier-II';

export type AppRoute =
  | 'home'
  | 'syllabus'
  | 'subjects'
  | 'reasoning'
  | 'reasoning-chapter'
  | 'general-awareness'
  | 'general-awareness-chapter'
  | 'ga-chapter'
  | 'english'
  | 'english-chapter'
  | 'english-grammar-rules'
  | 'english-vocabulary'
  | 'mathematics'
  | 'maths-chapter'
  | 'maths-formulas'
  | 'tier2'
  | 'tier2-chapter'
  | 'practice'
  | 'mock-tests'
  | 'mock-active'
  | 'results'
  | 'result-detail'
  | 'progress'
  | 'bookmarks'
  | 'error-log'
  | 'revision'
  | 'revision-all'
  | 'revision-last-day'
  | 'study-plan'
  | 'ask-tutor'
  | 'settings';

export type NavTab = 
  | 'home' 
  | 'subjects'
  | 'reasoning'
  | 'general-awareness'
  | 'english' 
  | 'mathematics' 
  | 'practice' 
  | 'mock-tests' 
  | 'revision' 
  | 'study-plan' 
  | 'progress';

export type PriorityLevel = 'High Priority' | 'Medium Priority' | 'Quick Revision';

export interface SolvedExample {
  level: 'Easy' | 'Moderate' | 'SSC-level' | 'Advanced';
  question: string;
  solution: string;
  fastTrick?: string;
  trapNote?: string;
}

export interface CommonMistakeItem {
  wrongApproach: string;
  correctApproach: string;
  reason: string;
}

export interface PracticeQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceType?: string;
}

export interface ChapterTable {
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ChapterDiagram {
  type: 'venn' | 'direction' | 'family-tree' | 'dice' | 'triangle' | 'circle' | 'mirror' | 'paper-folding' | 'table';
  title: string;
  caption: string;
  data?: any;
}

export interface ChapterSection {
  title: string;
  type: 
    | 'intro'
    | 'concept' 
    | 'definitions'
    | 'rules' 
    | 'traps' 
    | 'examples' 
    | 'exceptions' 
    | 'formulas' 
    | 'shortcuts' 
    | 'mistakes'
    | 'pyq-pattern'
    | 'practice'
    | 'revision'
    | 'summary';
  content: string;
  mathFormulas?: string[];
  table?: ChapterTable;
  diagram?: ChapterDiagram;
  solvedExamples?: SolvedExample[];
  commonMistakes?: CommonMistakeItem[];
  practiceQuestions?: PracticeQuizItem[];
  rulesList?: {
    ruleNo: number;
    title: string;
    statement: string;
    incorrect?: string;
    correct?: string;
    trapNote?: string;
  }[];
  examplesList?: {
    incorrect: string;
    correct: string;
    explanation: string;
  }[];
}

export type AssessmentStatus = 'Not Yet' | 'Need Revision' | 'Confident';

export interface ChapterHighlight {
  id: string;
  text: string;
  color: 'yellow' | 'green' | 'pink';
  date: string;
}

export interface StudyChapter {
  slug: string;
  title: string;
  subject: SubjectType;
  unit?: string;
  category: string;
  subcategory: string;
  priority: PriorityLevel;
  tier?: 'Tier-I' | 'Tier-II' | 'Tier-I & II';
  estimatedMinutes: number;
  rulesCount: number;
  mcqsCount: number;
  wordCount?: number;
  summary: string;
  sections: ChapterSection[];
  favouriteTrap: string;
  memoryTrick?: string;
  order: number;
  prevSlug?: string;
  nextSlug?: string;
}

export interface GrammarRuleItem {
  id: string;
  ruleNumber: number;
  title: string;
  topic: string;
  category: string;
  statement: string;
  incorrectExample: string;
  correctExample: string;
  explanation: string;
  frequentExamTrap: string;
  isRevised?: boolean;
  isBookmarked?: boolean;
}

export interface MathFormulaItem {
  id: string;
  title: string;
  category: string;
  topic: string;
  latex: string;
  plainText: string;
  variables: { symbol: string; meaning: string }[];
  whenToUse: string;
  commonTrap: string;
  isRevised?: boolean;
  isBookmarked?: boolean;
}

export interface VocabItem {
  id: string;
  word: string;
  meaning: string;
  type: 'synonym' | 'antonym' | 'one-word' | 'idiom' | 'confusing-word' | 'spelling';
  category: string;
  example: string;
  synonyms?: string[];
  antonyms?: string[];
  mnemonic?: string;
  isLearned?: boolean;
  isBookmarked?: boolean;
}

export interface RuleItem {
  id?: string;
  ruleNo?: number;
  number?: number;
  title: string;
  statement?: string;
  formula?: string;
  isCompleted?: boolean;
  incorrectExample?: string;
  correctExample?: string;
  explanation?: string;
}

export interface MCQQuestion {
  id: string;
  subject: 'English' | 'Quantitative' | 'Reasoning' | 'General Awareness' | 'Tier-II';
  topic: string;
  category?: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;
  correctOptionId?: string;
  examSource?: string;
  explanation: string;
  ruleAnchor?: string;
  formulaAnchor?: string;
  shortcut?: string;
  sourceType?: 'Verified PYQ' | 'PYQ-style' | 'Practice' | 'AI-Generated Practice' | string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: 'English' | 'Quantitative' | 'Reasoning' | 'General Awareness' | 'Combined';
  type: 'Sectional' | 'Daily Mini' | 'Full-Length' | 'Final Revision';
  questionsCount: number;
  durationMinutes: number;
  maxMarks: number;
  description: string;
  sections: {
    sectionId: string;
    sectionName: string;
    subject: 'English' | 'Quantitative';
    questionsCount: number;
    durationMinutes: number;
    questions: MCQQuestion[];
  }[];
}

export interface MockQuestionResponse {
  questionId: string;
  selectedOption?: string;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export interface MockAttemptResult {
  attemptId: string;
  mockId: string;
  mockTitle: string;
  date: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  rawScore: number;
  negativeMarksLost: number;
  finalScore: number;
  maxMarks: number;
  accuracy: number;
  totalTimeSpentSeconds: number;
  responses: Record<string, MockQuestionResponse>;
  topicBreakdown: Record<string, { total: number; correct: number; wrong: number }>;
}

export type ErrorType =
  | 'Concept'
  | 'Calculation'
  | 'Formula'
  | 'Grammar'
  | 'Vocabulary'
  | 'Rushed Reading'
  | 'Guessing';

export interface ErrorLogEntry {
  id: string;
  questionId: string;
  questionText: string;
  subject: 'English' | 'Quantitative';
  topic: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  errorType: ErrorType;
  dateAdded: string;
  isCorrected: boolean;
  notes?: string;
}

export interface BookmarkItem {
  id: string;
  targetId: string;
  title: string;
  category: 'Notes' | 'English' | 'Mathematics' | 'Formula' | 'Vocabulary' | 'Questions';
  snippet: string;
  routeTarget: {
    route: AppRoute;
    slug?: string;
    itemId?: string;
  };
  dateAdded: string;
}

export interface StudyPlanDay {
  date: string;
  dayNumber: number;
  dayLabel: string;
  isToday: boolean;
  englishTask: { title: string; slug?: string; description: string; completed: boolean };
  mathsTask: { title: string; slug?: string; description: string; completed: boolean };
  practiceTask: { title: string; targetCount: number; completed: boolean };
  revisionTask: { title: string; completed: boolean };
  notes: string;
}

export interface AcademicTask {
  id: number;
  number: number;
  category: string;
  estTime: string;
  title: string;
  description: string;
  donePercent?: number;
  isCompleted: boolean;
  actionText: string;
  actionType: 'continue' | 'start' | 'drill' | 'review';
}

export interface ErrorNote {
  id: string;
  source: string;
  type: string;
  quote: string;
  ruleTitle: string;
  ruleDetail: string;
  correctForm: string;
  testedCount: number;
}

export interface StudyTutorContext {
  subject: string;
  chapterTitle: string;
  currentSection?: string;
  rules?: string[];
  formulas?: string[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  groundedNotes?: string[];
}

export type PracticeMode =
  | 'adaptive'
  | 'pyq'
  | 'speed'
  | 'timed'
  | 'traps'
  | 'Practice'
  | 'Study'
  | 'Exam';

export interface GrammarChapter {
  id: string;
  number?: number;
  title: string;
  category: string;
  description: string;
  priority: 'High' | 'Medium' | 'High Priority' | 'Medium Priority' | 'Quick Revision';
  rulesCount: number;
  exceptionsCount?: number;
  isCompleted?: boolean;
  status?: 'Completed' | 'In Progress' | 'Not Started';
  mcqsCount?: number;
  progressPercent?: number;
  subtext?: string;
}

export interface TestResult {
  attemptId: string;
  testId: string;
  mockTestId?: string;
  title: string;
  date: string;
  totalScore: number;
  maxMarks: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  negativeMarksLost: number;
  timeTakenSeconds: number;
  userAnswers: Record<string, string>;
  topicBreakdown?: {
    topic: string;
    total: number;
    correct: number;
    wrong: number;
    accuracy: number;
  }[];
}

export interface ErrorLogItem {
  id: string;
  questionId: string;
  questionText: string;
  subject: string;
  topic: string;
  errorType: ErrorType;
  notes?: string;
  sourceTestOrChapter?: string;
  correctAnswer: string;
  yourAnswer: string;
  isCorrected?: boolean;
  dateAdded?: string;
}

