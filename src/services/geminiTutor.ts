import { StudyTutorContext } from '../types';

export interface TutorResponse {
  content: string;
  groundedNotes?: string[];
  source?: string;
}

/**
 * Client service to communicate with the secure server-side Gemini tutor route.
 */
export async function askStudyTutor(
  message: string,
  context?: StudyTutorContext
): Promise<TutorResponse> {
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chapterContext: context
          ? {
              subject: context.subject,
              chapterTitle: context.chapterTitle,
              currentSection: context.currentSection,
              rules: context.rules,
              formulas: context.formulas,
            }
          : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const replyText: string = data.reply || data.fallback || 'No response generated.';

    // Extract any Grounded Notes bullet points if demarcated
    const groundedNotes: string[] = [];
    if (replyText.includes("## From Danish's Notes")) {
      const parts = replyText.split("## Additional Explanation");
      const notesSection = parts[0].replace("## From Danish's Notes", "").trim();
      const lines = notesSection.split('\n').filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'));
      lines.forEach((l) => groundedNotes.push(l.replace(/^[-*]\s*/, '').trim()));
    } else if (context?.chapterTitle) {
      groundedNotes.push(`Focused on: ${context.chapterTitle} (${context.subject})`);
    }

    return {
      content: replyText,
      groundedNotes: groundedNotes.length > 0 ? groundedNotes : undefined,
      source: data.source,
    };
  } catch (err: any) {
    console.error('Failed to query study tutor API:', err);

    // Graceful offline fallback grounded in curriculum
    return {
      content: `I am currently consulting your local syllabus notes offline:\n\n- **Subject**: ${context?.subject || 'SSC CGL Tier-I'}\n- **Concept**: ${context?.chapterTitle || 'Grammar & Quantitative Aptitude'}\n\nKey Rule: In English, identify the true head noun before prepositional phrases (e.g. "The quality of these apples *is* excellent"). In Maths, apply fractional ratio equivalents (e.g. 1/6 = 16.66%) rather than calculating 100/6 with pen.\n\n*Full generative AI explanations are available when connected to the tutor server.*`,
      groundedNotes: [
        'Isolate the head noun before prepositional modifiers.',
        'Convert percent increments to fraction deltas (x/(100+x)).',
      ],
      source: 'offline_curriculum_engine',
    };
  }
}
