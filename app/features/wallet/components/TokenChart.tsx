'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MarketData, CoinGeckoService, TokenStats } from '@/lib/infrastructure/services/CoinGeckoService';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Clock, Timer, X, ChevronDown } from 'lucide-react';

interface TokenChartProps {
    symbol: string;
    onClose: () => void;
    hideCloseButton?: boolean;
    hideStats?: boolean;
}

type TimeRange = '1h' | '24h' | '7d' | '14d' | '30d' | '90d' | '180d' | '1y' | 'max';

export const TokenChart: React.FC<TokenChartProps> = ({ symbol, onClose, hideCloseButton, hideStats }) => {
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [stats, setStats] = useState<TokenStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverData, setHoverData] = useState<{ price: number; x: number; y: number; timestamp: number } | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [nextUpdate, setNextUpdate] = useState<number>(3600);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const tokenId = CoinGeckoService.getTokenId(symbol);

    const ranges: TimeRange[] = ['1h', '24h', '7d', '14d', '30d', '90d', '180d', '1y', 'max'];

    const getDaysFromRange = (range: TimeRange): string => {
        const mapping: Record<TimeRange, string> = {
            '1h': '1', '24h': '1', '7d': '7', '14d': '14', '30d': '30',
            '90d': '90', '180d': '180', '1y': '365', 'max': 'max'
        };
        return mapping[range];
    };

    // Global session-linked timer logic
    useEffect(() => {
        const STORAGE_KEY = 'reflecter_last_market_update';

        const getRemainingTime = () => {
            const lastUpdate = localStorage.getItem(STORAGE_KEY);
            if (!lastUpdate) {
                // First time ever, set to now
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
                return 3600;
            }
            const elapsed = (Date.now() - parseInt(lastUpdate)) / 1000;
            const remaining = 3600 - elapsed;
            return remaining > 0 ? Math.floor(remaining) : 0;
        };

        setNextUpdate(getRemainingTime());

        const timer = setInterval(() => {
            const remaining = getRemainingTime();
            setNextUpdate(remaining);

            // If time is up, we'll force a refresh on next mount or if component is active
            if (remaining <= 0) {
                // In a real app we might trigger a refresh here, 
                // but for now we'll just let the next fetch happen smoothly
                // We reset the timestamp ONLY if we are actually fetching data
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [chart, tokenStats] = await Promise.all([
                    CoinGeckoService.getMarketChart(tokenId, parseInt(getDaysFromRange(timeRange))),
                    CoinGeckoService.getTokenStats(tokenId)
                ]);
                setMarketData(chart);
                setStats(tokenStats);

                // Only reset the global timer if it was actually expired
                // This keeps the timer consistent across pages/refreshes
                if (nextUpdate <= 0) {
                    localStorage.setItem('reflecter_last_market_update', Date.now().toString());
                }
            } catch (error) {
                // Handled by service
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [tokenId, timeRange]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const CHART_WIDTH = 1000;
    const CHART_HEIGHT = 600;
    const PADDING_LEFT = 40;
    const PADDING_RIGHT = 80;
    const PADDING_V = 60;

    const chartMetrics = useMemo(() => {
        if (!marketData || marketData.prices.length === 0) return null;
        const prices = marketData.prices.map(p => p[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = (maxPrice - minPrice) || 1;

        const adjustedMin = minPrice - (priceRange * 0.1);
        const adjustedMax = maxPrice + (priceRange * 0.1);
        const adjustedRange = adjustedMax - adjustedMin;

        const points = marketData.prices.map((p, i) => {
            const x = PADDING_LEFT + (i / (marketData.prices.length - 1)) * (CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT);
            const y = (CHART_HEIGHT - PADDING_V) - ((p[1] - adjustedMin) / adjustedRange) * (CHART_HEIGHT - 2 * PADDING_V);
            return { x, y, price: p[1], timestamp: p[0] };
        });

        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        const timeLabels = [];
        const step = Math.floor(points.length / 5);
        for (let i = 0; i < points.length; i += step) {
            timeLabels.push(points[i]);
            if (timeLabels.length >= 6) break;
        }

        return { points, path, minPrice, maxPrice, adjustedMin, adjustedMax, timeLabels };
    }, [marketData]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!chartMetrics || !svgRef.current) return;
        const svg = svgRef.current;
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const scaleX = CHART_WIDTH / rect.width;
        const adjustedX = mouseX * scaleX;

        let closestToken = chartMetrics.points[0];
        let minDiff = Math.abs(chartMetrics.points[0].x - adjustedX);

        for (const p of chartMetrics.points) {
            const diff = Math.abs(p.x - adjustedX);
            if (diff < minDiff) {
                minDiff = diff;
                closestToken = p;
            }
        }
        setHoverData(closestToken);
    };

    const isPositive = (stats?.price_change_percentage_24h || 0) >= 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 h-[400px]">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sincronizando Terminal...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0 relative">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Activity size={20} className={isPositive ? 'text-emerald-500' : 'text-red-500'} />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">{symbol} / USD</h2>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-lg">
                        <Timer size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                            Refresh en: <span className="text-white tabular-nums">{formatTime(nextUpdate)}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Range Selector - Desktop (Horizontal) */}
                    <div className="hidden sm:flex bg-zinc-900/80 p-1 rounded-xl border border-white/10 shadow-inner">
                        {ranges.map((r) => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeRange === r ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Range Selector - Mobile (Dropdown/List) */}
                    <div className="sm:hidden relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-zinc-900/80 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3 active:scale-95 transition-all"
                        >
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{timeRange}</span>
                            <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2">
                                {ranges.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            setTimeRange(r);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${timeRange === r ? 'text-indigo-400 bg-white/5' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {!hideCloseButton && (
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Header */}
            {!hideStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 shrink-0">
                    {[
                        { label: 'Precio Actual', value: `$ ${stats?.current_price?.toLocaleString()}`, color: 'text-white' },
                        { label: 'Cambio 24h', value: `${isPositive ? '+' : ''}${stats?.price_change_percentage_24h?.toFixed(2)}%`, color: isPositive ? 'text-emerald-500' : 'text-red-500' },
                        { label: 'High 24h', value: `$ ${stats?.high_24h?.toLocaleString()}`, color: 'text-zinc-300' },
                        { label: 'Low 24h', value: `$ ${stats?.low_24h?.toLocaleString()}`, color: 'text-zinc-300' }
                    ].map((stat, i) => (
                        <div key={i} className="px-4 py-3 bg-zinc-900/30 border border-white/5 rounded-xl sm:rounded-2xl">
                            <p className="text-[7px] sm:text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-sm sm:text-base font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Terminal Container */}
            <div className="flex-1 relative min-h-0 bg-black/40 border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/2 to-transparent pointer-events-none"></div>

                <div className="flex-1 w-full relative">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                        className="w-full h-full preserve-3d cursor-crosshair"
                        preserveAspectRatio="none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoverData(null)}
                    >
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.15" />
                                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <g className="opacity-10">
                            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                                <line
                                    key={`y-${i}`}
                                    x1={PADDING_LEFT} y1={PADDING_V + p * (CHART_HEIGHT - 2 * PADDING_V)}
                                    x2={CHART_WIDTH - PADDING_RIGHT} y2={PADDING_V + p * (CHART_HEIGHT - 2 * PADDING_V)}
                                    stroke="white" strokeWidth="0.5" strokeDasharray="4 4"
                                />
                            ))}
                        </g>

                        {chartMetrics && (
                            <>
                                <path
                                    d={`${chartMetrics.path} L ${CHART_WIDTH - PADDING_RIGHT} ${CHART_HEIGHT - PADDING_V} L ${PADDING_LEFT} ${CHART_HEIGHT - PADDING_V} Z`}
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d={chartMetrics.path}
                                    fill="none"
                                    stroke={isPositive ? '#10b981' : '#ef4444'}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <g className="hidden sm:block text-[10px] font-black fill-zinc-500 uppercase tracking-tight">
                                    <text x={CHART_WIDTH - PADDING_RIGHT + 15} y={PADDING_V + 5} textAnchor="start">$ {chartMetrics.maxPrice.toLocaleString(undefined, { maximumSignificantDigits: 4 })}</text>
                                    <text x={CHART_WIDTH - PADDING_RIGHT + 15} y={CHART_HEIGHT - PADDING_V + 5} textAnchor="start">$ {chartMetrics.minPrice.toLocaleString(undefined, { maximumSignificantDigits: 4 })}</text>
                                </g>

                                <g className="hidden sm:block text-[9px] font-black fill-zinc-700 uppercase tracking-widest text-center">
                                    {chartMetrics.timeLabels.map((p, i) => (
                                        <text key={i} x={p.x} y={CHART_HEIGHT - 25} textAnchor="middle">
                                            {new Date(p.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </text>
                                    ))}
                                </g>
                            </>
                        )}

                        {hoverData && (
                            <g>
                                <line x1={hoverData.x} y1={PADDING_V} x2={hoverData.x} y2={CHART_HEIGHT - PADDING_V} stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                                <circle cx={hoverData.x} cy={hoverData.y} r="6" fill={isPositive ? '#10b981' : '#ef4444'} stroke="white" strokeWidth="2" />

                                <foreignObject x={hoverData.x + 10} y={hoverData.y - 50} width="140" height="50" className="overflow-visible">
                                    <div className={`bg-zinc-800 border border-white/10 p-2 rounded-xl shadow-2xl backdrop-blur-sm ${hoverData.x > CHART_WIDTH * 0.7 ? '-translate-x-[calc(100%+20px)]' : ''}`}>
                                        <div className="text-[8px] font-black text-zinc-500 uppercase mb-0.5">
                                            {new Date(hoverData.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs font-black text-white">$ {hoverData.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                    </div>
                                </foreignObject>
                            </g>
                        )}
                    </svg>
                </div>
            </div>
        </div>
    );
};
