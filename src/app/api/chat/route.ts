import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting
// In production, use a durable store like Redis or a database
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the rate limit key
  // In production, consider using a combination of IP and user session
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return `chat:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const maxRequests = 3;
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

const SYSTEM_PROMPT = `You are a friendly, educational Master Gardener AI assistant for a site called Nurturing Gardens. You love promoting the wonders of nature, especially native and pollinator-friendly plants. You are professional, fun, and approachable.

Important guidelines:
- Never pretend to know local regulations; always remind users to check local extension services for invasive species or restrictions.
- You are not a veterinarian; for pet toxicity, always recommend confirming with a vet and checking ASPCA's database.
- Encourage sustainable gardening practices and the use of native plants.
- Provide practical, actionable advice for home gardeners.
- Be encouraging and supportive, especially to beginners.
- When discussing plant care, consider regional variations and remind users to verify information for their specific area.`;

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    const { allowed, remaining } = checkRateLimit(rateLimitKey);

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: "You've reached today's free question limit. Come back tomorrow for more gardening chats!",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request. Messages array is required.' },
        { status: 400 }
      );
    }

    // Get API configuration
    const apiKey = process.env.OPENAI_API_KEY || process.env.GARDENER_API_KEY;
    const model = process.env.GARDENER_MODEL || 'gpt-4-turbo-preview';

    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Chat service is not configured. Please contact the site administrator.' },
        { status: 503 }
      );
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);

      return NextResponse.json(
        { error: 'Failed to get response from chat service.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from chat service.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      remaining,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
