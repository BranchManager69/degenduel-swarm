import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  
  // Build the API URL with optional query parameters
  let apiUrl = 'https://degenduel.me/api/contests';
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (limit) params.append('limit', limit);
  if (offset) params.append('offset', offset);
  
  const queryString = params.toString();
  if (queryString) {
    apiUrl += `?${queryString}`;
  }
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    // Ensure we return an array of contests
    if (Array.isArray(data)) {
      return NextResponse.json(data);
    } else if (data && typeof data === 'object' && data.contests && Array.isArray(data.contests)) {
      return NextResponse.json(data.contests);
    } else {
      console.error("External API did not return an array of contests:", data);
      return NextResponse.json(
        { error: 'External API returned an invalid format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching contests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contests from API' },
      { status: 500 }
    );
  }
}