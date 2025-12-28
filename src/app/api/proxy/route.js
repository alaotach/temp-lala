import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url, apiKey, apiKeyHeader, apiKeyPrefix } = await request.json();

    // Build headers
    const headers = {
      "Content-Type": "application/json",
    };

    // Priority 1: Use API key if provided by user
    if (apiKey && apiKey.trim() !== "") {
      const keyValue = apiKeyPrefix && apiKeyPrefix.trim() 
        ? `${apiKeyPrefix.trim()} ${apiKey.trim()}`
        : apiKey.trim();
      headers[apiKeyHeader || "X-Api-Key"] = keyValue;
    }
    // Priority 2: Fallback to environment variable for known APIs
    else if (url.includes("indianapi.in") && process.env.NEXT_PUBLIC_INDIAN_API_KEY) {
      headers["X-Api-Key"] = process.env.NEXT_PUBLIC_INDIAN_API_KEY;
    }

    // Make the request from the server
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `API Error ${response.status}: ${text || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}
