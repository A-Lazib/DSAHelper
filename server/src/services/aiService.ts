import OpenAI from 'openai';
import type { DebugResponse, FeedbackResponse, HintResponse } from '../types/index.js';

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
	? new OpenAI({ apiKey })
	: null;

export function isAIEnabled(): boolean {
	return Boolean(client);
}

function extractJsonObject(text: string): string | null {
	const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
	if (fenced?.[1]) {
		return fenced[1].trim();
	}

	const first = text.indexOf('{');
	const last = text.lastIndexOf('}');
	if (first !== -1 && last !== -1 && last > first) {
		return text.slice(first, last + 1);
	}

	return null;
}

async function completeAsJson<T>(prompt: string): Promise<T | null> {
	if (!client) return null;

	try {
		const result = await client.chat.completions.create({
			model: 'gpt-4o-mini',
			temperature: 0.2,
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: 'You are a coding interview assistant. Return valid JSON only.'
				},
				{
					role: 'user',
					content: prompt
				}
			]
		});

		const content = result.choices?.[0]?.message?.content;
		if (!content) return null;

		const jsonText = extractJsonObject(content);
		if (!jsonText) return null;

		return JSON.parse(jsonText) as T;
	} catch (error) {
		console.warn('OpenAI request failed. Falling back to local heuristics.', error);
		return null;
	}
}

export async function analyzeDebugWithAI(input: {
	problemDescription: string;
	userCode: string;
}): Promise<DebugResponse | null> {
	const prompt = `
Analyze this coding solution and return JSON with shape:
{
	"issueFound": boolean,
	"issues": [
		{
			"summary": string,
			"location": string,
			"logicExplanation": string,
			"exampleFailingInput": string,
			"stepByStepFailure": string[]
		}
	],
	"overallAnalysis": string
}

Problem:
${input.problemDescription}

Code:
${input.userCode}
`;

	return completeAsJson<DebugResponse>(prompt);
}

export async function analyzeFeedbackWithAI(input: {
	problemDescription: string;
	userCode: string;
	expectedTimeComplexity: string;
	expectedSpaceComplexity: string;
}): Promise<FeedbackResponse | null> {
	const prompt = `
Evaluate this solution and return JSON with shape:
{
	"correctness": { "status": "pass" | "issues", "details": string },
	"timeComplexity": {
		"detected": string,
		"expected": string,
		"isOptimal": boolean,
		"explanation": string
	},
	"spaceComplexity": {
		"detected": string,
		"expected": string,
		"isOptimal": boolean,
		"explanation": string
	},
	"optimizationSuggestions": string[],
	"codeQualityNotes": string[],
	"comparison": string
}

Expected time complexity: ${input.expectedTimeComplexity}
Expected space complexity: ${input.expectedSpaceComplexity}

Problem:
${input.problemDescription}

Code:
${input.userCode}
`;

	return completeAsJson<FeedbackResponse>(prompt);
}

export async function analyzeHintWithAI(input: {
	problemDescription: string;
	userCode: string;
	hintLevel: 1 | 2 | 3;
}): Promise<HintResponse | null> {
	const prompt = `
Give a level-${input.hintLevel} interview hint.
Do not provide a full solution.
Return JSON with shape:
{
	"level": 1 | 2 | 3,
	"hint": string,
	"nextLevelAvailable": boolean
}

Problem:
${input.problemDescription}

Current code:
${input.userCode}
`;

	return completeAsJson<HintResponse>(prompt);
}
