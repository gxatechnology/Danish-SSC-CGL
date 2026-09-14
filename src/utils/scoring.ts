import { MockQuestionResponse, MCQQuestion, MockAttemptResult } from '../types';

export interface ScoreCalculationInput {
  attemptId: string;
  mockId: string;
  mockTitle: string;
  allQuestions: MCQQuestion[];
  responses: Record<string, MockQuestionResponse>;
  totalTimeSpentSeconds: number;
}

export function calculateSSCScore(input: ScoreCalculationInput): MockAttemptResult {
  const { attemptId, mockId, mockTitle, allQuestions, responses, totalTimeSpentSeconds } = input;

  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  const topicBreakdown: Record<string, { total: number; correct: number; wrong: number }> = {};

  allQuestions.forEach((q) => {
    if (!topicBreakdown[q.topic]) {
      topicBreakdown[q.topic] = { total: 0, correct: 0, wrong: 0 };
    }
    topicBreakdown[q.topic].total += 1;

    const resp = responses[q.id];
    if (!resp || !resp.selectedOption) {
      unattempted += 1;
    } else if (resp.selectedOption === q.correctAnswer) {
      correct += 1;
      topicBreakdown[q.topic].correct += 1;
    } else {
      wrong += 1;
      topicBreakdown[q.topic].wrong += 1;
    }
  });

  const attempted = correct + wrong;
  const rawPositive = correct * 2.0;
  const negativeMarksLost = wrong * 0.5;
  const finalScore = parseFloat((rawPositive - negativeMarksLost).toFixed(2));
  const maxMarks = allQuestions.length * 2;
  const accuracy = attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(1)) : 0;

  return {
    attemptId,
    mockId,
    mockTitle,
    date: new Date().toISOString(),
    totalQuestions: allQuestions.length,
    attempted,
    correct,
    wrong,
    unattempted,
    rawScore: rawPositive,
    negativeMarksLost,
    finalScore,
    maxMarks,
    accuracy,
    totalTimeSpentSeconds,
    responses,
    topicBreakdown,
  };
}
