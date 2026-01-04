/**
 * Gemini AI API Route (Server-Side)
 * Keeps API key secure and prevents client exposure
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize AI with server-only API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('[GEMINI] Missing GEMINI_API_KEY environment variable');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: NextRequest) {
    try {
        // Check if AI is initialized
        if (!ai) {
            return NextResponse.json(
                { error: 'AI service not configured' },
                { status: 500 }
            );
        }

        // Parse request body
        const { topic } = await request.json();

        if (!topic || typeof topic !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request: topic is required' },
                { status: 400 }
            );
        }

        // Validate topic length
        if (topic.length > 200) {
            return NextResponse.json(
                { error: 'Topic too long (max 200 characters)' },
                { status: 400 }
            );
        }

        // Generate AI response
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Explain the following Web3/Starknet technical concept in 2 sentences for a developer audience. Topic: ${topic}`,
            config: {
                systemInstruction:
                    'You are a senior blockchain engineer specialized in Starknet and ZK-rollups. Keep explanations concise, professional, and technical.',
            },
        });

        return NextResponse.json({
            text: response.text,
            topic,
        });
    } catch (error) {
        console.error('[GEMINI] Error generating content:', error);

        // Don't expose internal error details to client
        return NextResponse.json(
            {
                error: 'Failed to generate explanation. Please try again.',
            },
            { status: 500 }
        );
    }
}

// Rate limiting could be added here
// Example with Upstash:
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
//
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "1 m"),
// });
