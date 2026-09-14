import { StudyPlanDay } from '../types';

export const STUDY_PLAN_DAYS: StudyPlanDay[] = [
  {
    date: '2026-09-14',
    dayNumber: 1,
    dayLabel: 'Mon, 14 Sep (Today)',
    isToday: true,
    englishTask: {
      title: 'Subject–Verb Agreement (Rules 1–7)',
      slug: 'subject-verb-agreement',
      description: 'Study head noun isolation, prepositional phrases, and correlative proximity concord.',
      completed: false,
    },
    mathsTask: {
      title: 'Percentage & Base-Shift Delta',
      slug: 'percentage',
      description: 'Practice fractional equivalents and +1/x -> -1/(x+1) consumption reduction.',
      completed: false,
    },
    practiceTask: {
      title: 'Daily Mini Test 1 + 20 PYQ Spotting Errors',
      targetCount: 20,
      completed: false,
    },
    revisionTask: {
      title: 'Mensuration 2D Incircle & Circumcircle formulas',
      completed: false,
    },
    notes: 'Prioritize non-pen ratio calculations during quant exercises.',
  },
  {
    date: '2026-09-15',
    dayNumber: 2,
    dayLabel: 'Tue, 15 Sep',
    isToday: false,
    englishTask: {
      title: 'Tenses & Sequence of Tenses',
      slug: 'tenses',
      description: 'Past perfect relationship, time adverbs (ago, since, by the time), and stative verbs.',
      completed: false,
    },
    mathsTask: {
      title: 'Triangles & Incircle Theorems',
      slug: 'triangles-geometry',
      description: 'Inradius in right triangles r = (a+b-c)/2, equilateral triangle R:r = 2:1.',
      completed: false,
    },
    practiceTask: {
      title: 'English Sectional Mock 1 (25 Qs in 15 mins)',
      targetCount: 25,
      completed: false,
    },
    revisionTask: {
      title: 'BlackBook Vocab Root Words (Altruist, Ephemeral, Taciturn)',
      completed: false,
    },
    notes: 'Strict timer adherence. Review all wrong answers in Error Log.',
  },
  {
    date: '2026-09-16',
    dayNumber: 3,
    dayLabel: 'Wed, 16 Sep',
    isToday: false,
    englishTask: {
      title: 'Conditionals & Hypothetical Clauses',
      slug: 'conditionals',
      description: 'Third conditional, subjunctive were, and inversion in unreal past.',
      completed: false,
    },
    mathsTask: {
      title: 'Mensuration 2D & Cyclic Quadrilaterals',
      slug: 'mensuration-2d',
      description: 'Ptolemy theorem (d1*d2 = ac + bd) and Brahmagupta formula.',
      completed: false,
    },
    practiceTask: {
      title: 'Maths Sectional Mock 1 (25 Qs in 15 mins)',
      targetCount: 25,
      completed: false,
    },
    revisionTask: {
      title: 'CI vs SI 2-year difference formula D2 = P(R/100)^2',
      completed: false,
    },
    notes: 'Verify negative marks lost on review.',
  },
  {
    date: '2026-09-17',
    dayNumber: 4,
    dayLabel: 'Thu, 17 Sep',
    isToday: false,
    englishTask: {
      title: 'Prepositions & Superfluous Usages',
      slug: 'prepositions',
      description: 'Fixed prepositions (abstain from, accustomed to) and transitive verbs (comprise, order).',
      completed: false,
    },
    mathsTask: {
      title: 'Algebra & Cubic Symmetric Identities',
      slug: 'percentage',
      description: 'a^3 + b^3 + c^3 = 3abc when a+b+c=0.',
      completed: false,
    },
    practiceTask: {
      title: 'Daily Mini Test 2 (10 Questions)',
      targetCount: 10,
      completed: false,
    },
    revisionTask: {
      title: 'Correlative conjunction rules & 231 pronoun order',
      completed: false,
    },
    notes: 'Maintain 7-day study streak.',
  },
  {
    date: '2026-09-18',
    dayNumber: 5,
    dayLabel: 'Fri, 18 Sep',
    isToday: false,
    englishTask: {
      title: 'Pronouns & Order of Persons',
      slug: 'subject-verb-agreement',
      description: '231 vs 123 rule, each other vs one another, relative pronoun antecedents.',
      completed: false,
    },
    mathsTask: {
      title: 'Time Speed Distance & Relative Speed',
      slug: 'percentage',
      description: 'Opposite direction S1+S2 vs same direction S1-S2, train crossings.',
      completed: false,
    },
    practiceTask: {
      title: 'English Sectional Mock 2 (25 Qs in 15 mins)',
      targetCount: 25,
      completed: false,
    },
    revisionTask: {
      title: 'Trigonometric identities: sec^2 - tan^2 = 1',
      completed: false,
    },
    notes: 'Focus on eliminating rushed reading errors.',
  },
  {
    date: '2026-09-29',
    dayNumber: 16,
    dayLabel: 'Tue, 29 Sep (Pre-Exam Day)',
    isToday: false,
    englishTask: {
      title: 'Last-Day English Rapid Checklist',
      slug: 'subject-verb-agreement',
      description: 'Rapid recall of 10 golden grammar rules and high-yield BlackBook vocab.',
      completed: false,
    },
    mathsTask: {
      title: 'Last-Day Maths Formula Book',
      slug: 'percentage',
      description: 'Geometry inradius, Ptolemy, CI-SI, trigonometry identities revision.',
      completed: false,
    },
    practiceTask: {
      title: 'Light 10-Q Accuracy Calibration',
      targetCount: 10,
      completed: false,
    },
    revisionTask: {
      title: 'Complete Error Notebook Clearance',
      completed: false,
    },
    notes: 'No heavy new topics. Sleep early by 10:00 PM for peak cognitive agility.',
  },
  {
    date: '2026-09-30',
    dayNumber: 17,
    dayLabel: 'Wed, 30 Sep (EXAM DAY)',
    isToday: false,
    englishTask: {
      title: 'SSC CGL 2026 Tier-I Examination',
      description: 'Calm mind, confident execution, aggressive elimination of answer traps.',
      completed: false,
    },
    mathsTask: {
      title: 'Quantitative Section Execution',
      description: 'First round: solve direct arithmetic & geometry; second round: calculative algebra.',
      completed: false,
    },
    practiceTask: {
      title: 'Official SSC CGL Examination',
      targetCount: 100,
      completed: false,
    },
    revisionTask: {
      title: 'Mission Accomplished: Prepared for Danish Fatma',
      completed: false,
    },
    notes: 'Exam day reached. Maximum confidence and precision.',
  },
];
