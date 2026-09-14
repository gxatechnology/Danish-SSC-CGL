import { StudyChapter, SubjectType } from '../types';
import { ENGLISH_CHAPTERS } from './englishChapters';
import { MATHS_CHAPTERS } from './mathsChapters';
import { REASONING_CHAPTERS } from './reasoningChapters';
import { GENERAL_AWARENESS_CHAPTERS } from './generalAwarenessChapters';
import { TIER2_CHAPTERS } from './tier2Chapters';

export const ALL_CHAPTERS: StudyChapter[] = [
  ...REASONING_CHAPTERS,
  ...GENERAL_AWARENESS_CHAPTERS,
  ...MATHS_CHAPTERS,
  ...ENGLISH_CHAPTERS,
  ...TIER2_CHAPTERS,
];

export interface SubjectMeta {
  id: SubjectType;
  title: string;
  tagline: string;
  tier: 'Tier-I & II' | 'Tier-II Only';
  color: string;
  lightBg: string;
  borderColor: string;
  iconName: string;
  route: string;
  units: string[];
}

export const SUBJECTS_CONFIG: SubjectMeta[] = [
  {
    id: 'Reasoning',
    title: 'General Intelligence & Reasoning',
    tagline: 'Analogies, Series, Coding-Decoding, Kinship, Direction, Syllogisms, Venn Sets & Non-Verbal Logic',
    tier: 'Tier-I & II',
    color: 'text-indigo-600 dark:text-indigo-400',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    iconName: 'Brain',
    route: 'reasoning',
    units: ['Unit 1: Verbal Reasoning', 'Unit 2: Logical Reasoning', 'Unit 3: Non-Verbal Reasoning'],
  },
  {
    id: 'General Awareness',
    title: 'General Awareness & GK',
    tagline: 'Indian History, Geography, Polity & Constitution, Economy, General Science & Static GK',
    tier: 'Tier-I & II',
    color: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconName: 'Globe2',
    route: 'general-awareness',
    units: ['Unit 1: Indian History', 'Unit 2: Geography', 'Unit 3: Indian Polity', 'Unit 4: Indian Economy', 'Unit 5: General Science', 'Unit 6: Static GK'],
  },
  {
    id: 'Mathematics',
    title: 'Quantitative Aptitude',
    tagline: 'Number System, Commercial Arithmetic, Algebra, Geometry, Mensuration & Trigonometry',
    tier: 'Tier-I & II',
    color: 'text-emerald-600 dark:text-emerald-400',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconName: 'Calculator',
    route: 'mathematics',
    units: ['Unit 1: Number Systems', 'Unit 2: Commercial Mathematics', 'Unit 3: Advanced Mathematics'],
  },
  {
    id: 'English',
    title: 'English Language & Comprehension',
    tagline: 'Syntax Concord, Parts of Speech, Tenses, Conditionals, Prepositions, Voice & Narration',
    tier: 'Tier-I & II',
    color: 'text-blue-600 dark:text-blue-400',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconName: 'BookOpen',
    route: 'english',
    units: ['Unit 1: Grammar Foundation', 'Unit 2: Transformational Grammar', 'Unit 3: Vocabulary & Comprehension'],
  },
  {
    id: 'Tier-II',
    title: 'Tier-II Specialized Modules',
    tagline: 'Statistics, Probability & Mandatory Qualifying Computer Knowledge Module',
    tier: 'Tier-II Only',
    color: 'text-purple-600 dark:text-purple-400',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconName: 'Cpu',
    route: 'tier2',
    units: ['Module 1: Mathematical Abilities (Tier-II)', 'Module 2: Computer Knowledge (Tier-II Qualifying)'],
  },
];

export function getAllChapters(): StudyChapter[] {
  return ALL_CHAPTERS;
}

export function getChapterBySlug(slug: string): StudyChapter | undefined {
  return ALL_CHAPTERS.find((ch) => ch.slug === slug);
}

export function getChaptersBySubject(subject: SubjectType): StudyChapter[] {
  return ALL_CHAPTERS.filter((ch) => ch.subject === subject);
}

export interface SearchMatch {
  chapter: StudyChapter;
  sectionTitle: string;
  snippet: string;
  matchType: 'title' | 'rule' | 'formula' | 'content' | 'trap';
}

export function searchAllBookContent(rawQuery: string): SearchMatch[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query || query.length < 2) return [];

  const results: SearchMatch[] = [];

  for (const chapter of ALL_CHAPTERS) {
    // Check chapter title and summary
    if (chapter.title.toLowerCase().includes(query) || chapter.summary.toLowerCase().includes(query)) {
      results.push({
        chapter,
        sectionTitle: 'Chapter Overview',
        snippet: chapter.summary,
        matchType: 'title',
      });
    }

    // Check sections
    for (const section of chapter.sections) {
      if (section.content && section.content.toLowerCase().includes(query)) {
        const idx = section.content.toLowerCase().indexOf(query);
        const start = Math.max(0, idx - 40);
        const end = Math.min(section.content.length, idx + query.length + 60);
        const snippet = (start > 0 ? '...' : '') + section.content.slice(start, end).trim() + (end < section.content.length ? '...' : '');

        results.push({
          chapter,
          sectionTitle: section.title,
          snippet,
          matchType: 'content',
        });
      }

      // Check formulas
      if (section.mathFormulas) {
        for (const formula of section.mathFormulas) {
          if (formula.toLowerCase().includes(query)) {
            results.push({
              chapter,
              sectionTitle: section.title,
              snippet: formula,
              matchType: 'formula',
            });
          }
        }
      }

      // Check rules
      if (section.rulesList) {
        for (const rule of section.rulesList) {
          if (
            rule.title.toLowerCase().includes(query) ||
            rule.statement.toLowerCase().includes(query) ||
            (rule.trapNote && rule.trapNote.toLowerCase().includes(query))
          ) {
            results.push({
              chapter,
              sectionTitle: rule.title,
              snippet: rule.statement,
              matchType: 'rule',
            });
          }
        }
      }
    }
  }

  return results.slice(0, 20); // Cap at 20 most relevant hits
}

export function getBookStatistics() {
  const totalChapters = ALL_CHAPTERS.length;
  const totalRules = ALL_CHAPTERS.reduce((acc, ch) => acc + (ch.rulesCount || 0), 0);
  const totalEstimatedMinutes = ALL_CHAPTERS.reduce((acc, ch) => acc + (ch.estimatedMinutes || 0), 0);
  const totalPracticeQuestions = ALL_CHAPTERS.reduce((acc, ch) => acc + (ch.mcqsCount || 0), 0);

  return {
    totalChapters,
    totalRules,
    totalEstimatedHours: (totalEstimatedMinutes / 60).toFixed(1),
    totalPracticeQuestions,
  };
}
