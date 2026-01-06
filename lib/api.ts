// Types for insider trading data
export interface InsiderTrade {
  symbol: string;
  filingDate: string;
  transactionDate: string;
  reportingCik: string;
  transactionType: string;
  securitiesOwned: number;
  companyCik: string;
  reportingName: string;
  typeOfOwner: string;
  acquistionOrDisposition: string;
  formType: string;
  securitiesTransacted: number;
  price: number;
  securityName: string;
  link: string;
}

export interface ProcessedInsiderBuy {
  id: string;
  date: string;
  insider: string;
  role: string;
  company: string;
  ticker: string;
  shares: number;
  price: number;
  value: number;
  secLink: string;
  transactionType: string;
}

export interface TopInsider {
  id: string;
  name: string;
  trades: ProcessedInsiderBuy[];
  totalTrades: number;
  totalValue: number;
  avgValue: number;
  companies: string[];
}

export interface InstitutionalHolder {
  holder: string;
  shares: number;
  dateReported: string;
  change: number;
  changePercentage: number;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || '300') * 1000; // 5 minutes default

export async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

export function processInsiderBuys(trades: InsiderTrade[]): ProcessedInsiderBuy[] {
  return trades
    .filter(trade => 
      trade.acquistionOrDisposition === 'A' && // Acquisition
      (trade.transactionType === 'P' || trade.transactionType === 'P-Purchase') && // Purchase
      trade.price > 0 &&
      trade.securitiesTransacted > 0
    )
    .map(trade => ({
      id: `${trade.symbol}-${trade.reportingCik}-${trade.transactionDate}`,
      date: trade.transactionDate || trade.filingDate,
      insider: trade.reportingName,
      role: formatRole(trade.typeOfOwner),
      company: trade.symbol, // We'll fetch company names separately if needed
      ticker: trade.symbol,
      shares: trade.securitiesTransacted,
      price: trade.price,
      value: trade.securitiesTransacted * trade.price,
      secLink: trade.link,
      transactionType: trade.transactionType,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatRole(typeOfOwner: string): string {
  const roleMap: Record<string, string> = {
    'director': 'Director',
    'officer': 'Officer',
    '10 percent owner': '10% Owner',
    'other': 'Other',
  };
  return roleMap[typeOfOwner.toLowerCase()] || typeOfOwner;
}

export function formatCurrency(num: number): string {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toFixed(2)}`;
}

export function getTopInsiders(trades: ProcessedInsiderBuy[]): TopInsider[] {
  const insiderMap = new Map<string, ProcessedInsiderBuy[]>();

  trades.forEach(trade => {
    const existing = insiderMap.get(trade.insider) || [];
    existing.push(trade);
    insiderMap.set(trade.insider, existing);
  });

  return Array.from(insiderMap.entries())
    .map(([name, trades]) => ({
      id: name.replace(/\s+/g, '-').toLowerCase(),
      name,
      trades,
      totalTrades: trades.length,
      totalValue: trades.reduce((sum, t) => sum + t.value, 0),
      avgValue: trades.reduce((sum, t) => sum + t.value, 0) / trades.length,
      companies: [...new Set(trades.map(t => t.ticker))],
    }))
    .filter(insider => insider.totalTrades >= 2) // At least 2 trades
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 20);
}
