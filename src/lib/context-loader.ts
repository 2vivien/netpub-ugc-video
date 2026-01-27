import servicesMd from '../../ai-knowledge/services.md?raw';
import methodologyMd from '../../ai-knowledge/methodology.md?raw';
import companyMd from '../../ai-knowledge/company.md?raw';
import teamMd from '../../ai-knowledge/team.md?raw';
import faqMd from '../../ai-knowledge/faq.md?raw';

/**
 * Structured object containing the raw markdown content of the AI knowledge base.
 */
export const AI_KNOWLEDGE = {
    services: servicesMd,
    methodology: methodologyMd,
    company: companyMd,
    team: teamMd,
    faq: faqMd,
};

/**
 * Returns the full AI context as a single concatenated string, suitable for system prompts.
 */
export const getAIContext = (): string => {
    return Object.entries(AI_KNOWLEDGE)
        .map(([key, content]) => `=== ${key.toUpperCase()} CONTEXT ===\n${content}`)
        .join('\n\n');
};
