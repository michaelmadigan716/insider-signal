import { NextResponse } from 'next/server';
import { processInsiderBuys, getTopInsiders, type InsiderTrade } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  const apiKey = process.env.FMP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch more data to find top insiders with multiple trades
    // We'll fetch multiple pages to get more data
    const pages = [0, 1, 2];
    const allTrades: InsiderTrade[] = [];

    for (const page of pages) {
      const url = `https://financialmodelingprep.com/api/v4/insider-trading?transactionType=P-Purchase&page=${page}&apikey=${apiKey}`;
      const response = await fetch(url, {
        next: { revalidate: 300 }
      });

      if (response.ok) {
        const trades = await response.json();
        allTrades.push(...trades);
      }
    }

    const processedTrades = processInsiderBuys(allTrades);
    const topInsiders = getTopInsiders(processedTrades);

    return NextResponse.json({
      insiders: topInsiders.map(insider => ({
        id: insider.id,
        name: insider.name,
        totalTrades: insider.totalTrades,
        totalValue: insider.totalValue,
        avgValue: insider.avgValue,
        companies: insider.companies,
        recentTrades: insider.trades.slice(0, 5),
        lastTradeDate: insider.trades[0]?.date,
      })),
      meta: {
        total: topInsiders.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error fetching top insiders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top insiders' },
      { status: 500 }
    );
  }
}
