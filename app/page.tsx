'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Star, ExternalLink, TrendingUp, Users, Building2, AlertTriangle } from 'lucide-react';

interface InsiderBuy {
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
}

interface TopInsider {
  id: string;
  name: string;
  totalTrades: number;
  totalValue: number;
  avgValue: number;
  companies: string[];
  recentTrades: InsiderBuy[];
  lastTradeDate: string;
}

function formatCurrency(num: number): string {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

function TradeCard({ trade, index, watchlist, onToggleWatchlist }: {
  trade: InsiderBuy;
  index: number;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}) {
  return (
    <div
      className="glass-card rounded-2xl p-5 transition-all duration-200 cursor-pointer hover:border-signal-green/20"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-gradient-to-r from-signal-green to-signal-green-dark text-signal-bg px-2.5 py-1 rounded-md text-sm font-bold">
              {trade.ticker}
            </span>
            <span className="text-signal-text font-semibold text-sm truncate">{trade.company}</span>
          </div>
          <div className="text-signal-muted text-xs">
            {trade.insider} • <span className="text-signal-cyan">{trade.role}</span>
          </div>
        </div>

        {/* Purchase Details */}
        <div>
          <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Purchase</div>
          <div className="text-xl font-bold text-signal-green">{formatCurrency(trade.value)}</div>
          <div className="text-xs text-signal-muted">
            {trade.shares.toLocaleString()} @ ${trade.price.toFixed(2)}
          </div>
        </div>

        {/* Date */}
        <div>
          <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Filed</div>
          <div className="text-lg font-semibold text-signal-text">{formatDate(trade.date)}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center justify-end">
          <a
            href={trade.secLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-signal-cyan/30 hover:bg-signal-cyan/10 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 text-signal-muted hover:text-signal-cyan" />
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWatchlist(trade.ticker); }}
            className={`p-2 rounded-lg transition-all ${
              watchlist.includes(trade.ticker)
                ? 'bg-signal-gold/20 border border-signal-gold/40 text-signal-gold'
                : 'bg-white/5 border border-white/10 text-signal-muted hover:text-signal-gold'
            }`}
          >
            <Star className="w-4 h-4" fill={watchlist.includes(trade.ticker) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TopInsiderCard({ insider, rank }: { insider: TopInsider; rank: number }) {
  const medalColors = [
    'from-yellow-400 to-amber-500',
    'from-gray-300 to-gray-400',
    'from-amber-600 to-amber-700',
  ];

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: `${rank * 0.05}s` }}>
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black ${
          rank < 3 
            ? `bg-gradient-to-br ${medalColors[rank]} text-signal-bg ${rank === 0 ? 'glow-gold' : ''}`
            : 'bg-white/10 text-signal-muted'
        }`}>
          {rank + 1}
        </div>

        {/* Name & Companies */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg text-signal-text truncate">{insider.name}</div>
          <div className="text-xs text-signal-muted truncate">
            {insider.companies.slice(0, 3).join(', ')}
            {insider.companies.length > 3 && ` +${insider.companies.length - 3} more`}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex gap-8 items-center">
          <div className="text-center">
            <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Trades</div>
            <div className="text-xl font-bold text-signal-cyan">{insider.totalTrades}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Total Value</div>
            <div className="text-xl font-bold text-signal-green">{formatCurrency(insider.totalValue)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Avg Trade</div>
            <div className="text-xl font-bold text-signal-text">{formatCurrency(insider.avgValue)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">Last Trade</div>
            <div className="text-sm font-semibold text-signal-muted">{formatDate(insider.lastTradeDate)}</div>
          </div>
        </div>
      </div>

      {/* Mobile stats */}
      <div className="md:hidden grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <div className="text-[10px] text-signal-muted uppercase">Trades</div>
          <div className="text-lg font-bold text-signal-cyan">{insider.totalTrades}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-signal-muted uppercase">Total</div>
          <div className="text-lg font-bold text-signal-green">{formatCurrency(insider.totalValue)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-signal-muted uppercase">Avg</div>
          <div className="text-lg font-bold text-signal-text">{formatCurrency(insider.avgValue)}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'buys' | 'top' | 'watchlist'>('buys');
  const [trades, setTrades] = useState<InsiderBuy[]>([]);
  const [topInsiders, setTopInsiders] = useState<TopInsider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [minValue, setMinValue] = useState(100000);
  const [sortBy, setSortBy] = useState<'value' | 'date'>('date');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('insider-watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('insider-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [buysRes, insidersRes] = await Promise.all([
        fetch(`/api/insider-buys?minValue=${minValue}`),
        fetch('/api/top-insiders'),
      ]);

      if (!buysRes.ok || !insidersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const buysData = await buysRes.json();
      const insidersData = await insidersRes.json();

      setTrades(buysData.trades || []);
      setTopInsiders(insidersData.insiders || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [minValue]);

  const toggleWatchlist = (ticker: string) => {
    setWatchlist(prev =>
      prev.includes(ticker) ? prev.filter(t => t !== ticker) : [...prev, ticker]
    );
  };

  const sortedTrades = useMemo(() => {
    const sorted = [...trades];
    if (sortBy === 'value') {
      sorted.sort((a, b) => b.value - a.value);
    } else {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  }, [trades, sortBy]);

  const watchlistTrades = useMemo(() => {
    return trades.filter(t => watchlist.includes(t.ticker));
  }, [trades, watchlist]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(t => t.date.startsWith(todayStr));
    return {
      todayCount: todayTrades.length,
      totalVolume: trades.reduce((sum, t) => sum + t.value, 0),
      avgValue: trades.length > 0 ? trades.reduce((sum, t) => sum + t.value, 0) / trades.length : 0,
    };
  }, [trades]);

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-signal-green to-signal-green-dark rounded-xl flex items-center justify-center text-2xl font-black text-signal-bg glow-green">
            ◈
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">
              INSIDER SIGNAL
            </h1>
            <p className="text-xs text-signal-muted uppercase tracking-widest">
              6-Week Swing Trade Intelligence
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { label: "Today's Buys", value: stats.todayCount.toString() },
            { label: 'Total Volume', value: formatCurrency(stats.totalVolume) },
            { label: 'Avg Trade Size', value: formatCurrency(stats.avgValue) },
            { label: 'Watching', value: watchlist.length.toString() },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-xl px-5 py-3 min-w-[140px]">
              <div className="text-[10px] text-signal-muted uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-signal-green">{stat.value}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {[
          { id: 'buys' as const, label: 'Daily Buys', icon: TrendingUp },
          { id: 'top' as const, label: 'Top Insiders', icon: Users },
          { id: 'watchlist' as const, label: `Watchlist (${watchlist.length})`, icon: Star },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-signal-green to-signal-green-dark text-signal-bg glow-green'
                : 'text-signal-muted hover:text-signal-text'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Filters (for buys tab) */}
      {activeTab === 'buys' && (
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-signal-muted uppercase tracking-wider">Min Value</label>
            <select
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-signal-text text-sm"
            >
              <option value={50000}>$50K+</option>
              <option value={100000}>$100K+</option>
              <option value={500000}>$500K+</option>
              <option value={1000000}>$1M+</option>
              <option value={5000000}>$5M+</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-signal-muted uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'value' | 'date')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-signal-text text-sm"
            >
              <option value="date">Most Recent</option>
              <option value="value">Largest Value</option>
            </select>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-signal-muted hover:text-signal-green hover:border-signal-green/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {lastUpdated && (
            <div className="text-xs text-signal-muted">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card rounded-xl p-6 mb-6 border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <div className="font-semibold">Error loading data</div>
              <div className="text-sm text-red-400/70">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'buys' && (
        <div className="space-y-3">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-24 ml-auto" />
                </div>
              </div>
            ))
          ) : sortedTrades.length > 0 ? (
            sortedTrades.map((trade, index) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                index={index}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            ))
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="text-signal-muted">No trades found matching your criteria</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'top' && (
        <div className="space-y-3">
          <div className="glass-card rounded-xl p-4 mb-4 border-signal-green/20 bg-signal-green/5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="font-semibold text-signal-green">Most Active Buyers</div>
                <div className="text-xs text-signal-muted">Insiders with multiple recent purchases</div>
              </div>
            </div>
          </div>

          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            ))
          ) : topInsiders.length > 0 ? (
            topInsiders.map((insider, index) => (
              <TopInsiderCard key={insider.id} insider={insider} rank={index} />
            ))
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="text-signal-muted">No top insiders found</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="space-y-3">
          {watchlist.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-signal-muted" />
              <div className="text-signal-muted">Your watchlist is empty</div>
              <div className="text-sm text-signal-muted/70 mt-1">
                Star tickers from the Daily Buys tab to track them here
              </div>
            </div>
          ) : watchlistTrades.length > 0 ? (
            watchlistTrades.map((trade, index) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                index={index}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            ))
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="text-signal-muted">No recent trades for watched tickers</div>
              <div className="text-sm text-signal-muted/70 mt-2">
                Watching: {watchlist.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Watchlist Badge */}
      {watchlist.length > 0 && activeTab !== 'watchlist' && (
        <div className="fixed bottom-6 right-6 glass-card rounded-xl px-4 py-3 border-signal-gold/30 bg-signal-bg/90">
          <div className="text-xs text-signal-gold font-semibold mb-2 flex items-center gap-2">
            <Star className="w-3 h-3" fill="currentColor" />
            WATCHLIST ({watchlist.length})
          </div>
          <div className="flex gap-2 flex-wrap max-w-[200px]">
            {watchlist.slice(0, 5).map(ticker => (
              <span key={ticker} className="bg-signal-gold/20 text-signal-gold px-2 py-1 rounded text-xs font-semibold">
                {ticker}
              </span>
            ))}
            {watchlist.length > 5 && (
              <span className="text-signal-gold/60 text-xs">+{watchlist.length - 5}</span>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <footer className="mt-12 glass-card rounded-xl p-5">
        <p className="text-xs text-signal-muted leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> This tool is for informational purposes only. Data is derived from SEC Form 4 filings 
          via Financial Modeling Prep API. Past performance does not guarantee future results. This is not financial advice. 
          Always conduct your own research and consider consulting a licensed financial advisor before making investment decisions.
        </p>
      </footer>
    </main>
  );
}
