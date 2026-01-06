import { NextResponse } from 'next/server';
import { processInsiderBuys, type InsiderTrade } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minValue = parseInt(searchParams.get('minValue') || '100000');
  const limit = parseInt(searchParams.get('limit') || '100');

  const apiKey = process.env.FMP_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch latest insider trades - purchases only
    const url = `https://financialmodelingprep.com/api/v4/insider-trading?transactionType=P-Purchase&page=0&apikey=${apiKey}`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`);
    }

    const rawTrades: InsiderTrade[] = await response.json();
    
    // Process and filter trades
    const processedTrades = processInsiderBuys(rawTrades)
      .filter(trade => trade.value >= minValue)
      .slice(0, limit);

    // Fetch company profiles for the unique tickers to get company names
    const uniqueTickers = [...new Set(processedTrades.map(t => t.ticker))];
    const companyNames: Record<string, string> = {};

    // Batch fetch company profiles (max 5 at a time to conserve API calls)
    const tickerBatches = [];
    for (let i = 0; i < uniqueTickers.length; i += 5) {
      tickerBatches.push(uniqueTickers.slice(i, i + 5));
    }

    for (const batch of tickerBatches.slice(0, 4)) { // Limit to first 20 tickers
      const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${batch.join(',')}?apikey=${apiKey}`;
      try {
        const profileRes = await fetch(profileUrl);
        if (profileRes.ok) {
          const profiles = await profileRes.json();
          profiles.forEach((p: any) => {
            companyNames[p.symbol] = p.companyName;
          });
        }
      } catch (e) {
        // Continue without company names if fetch fails
      }
    }

    // Enrich trades with company names
    const enrichedTrades = processedTrades.map(trade => ({
      ...trade,
      company: companyNames[trade.ticker] || trade.ticker,
    }));

    return NextResponse.json({
      trades: enrichedTrades,
      meta: {
        total: enrichedTrades.length,
        minValue,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error fetching insider trades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insider trades' },
      { status: 500 }
    );
  }
}
