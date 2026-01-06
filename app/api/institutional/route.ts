import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  const apiKey = process.env.FMP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch institutional ownership / 13F filings
    // This endpoint shows major institutional holders
    const url = `https://financialmodelingprep.com/api/v3/institutional-holder/${symbol || 'AAPL'}?apikey=${apiKey}`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`);
    }

    const holdings = await response.json();

    // Filter for significant positions and recent activity
    const significantHoldings = holdings
      .filter((h: any) => h.shares > 100000)
      .sort((a: any, b: any) => b.shares - a.shares)
      .slice(0, 20);

    return NextResponse.json({
      symbol: symbol || 'AAPL',
      holdings: significantHoldings,
      meta: {
        total: significantHoldings.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error fetching institutional holdings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institutional holdings' },
      { status: 500 }
    );
  }
}
