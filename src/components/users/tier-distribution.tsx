"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

interface TierDataItem {
    name: string;
    value: number;
    color: string;
}

interface TierDistributionProps {
    tierData?: {
        ECO_STARTER: number;
        ECO_WARRIOR: number;
        ECO_CHAMPION: number;
    } | null;
}

export function TierDistribution({ tierData }: TierDistributionProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Build chart data from real DB values, fallback to zeros if not loaded yet
    const TIER_DATA: TierDataItem[] = [
        { name: 'Eco Starter',  value: tierData?.ECO_STARTER  ?? 0, color: '#95A5A6' },
        { name: 'Eco Warrior',  value: tierData?.ECO_WARRIOR  ?? 0, color: '#3498DB' },
        { name: 'Eco Champion', value: tierData?.ECO_CHAMPION ?? 0, color: '#2ECC71' },
    ];

    // If all zero (loading or empty), show a placeholder segment so chart doesn't break
    const total = TIER_DATA.reduce((s, t) => s + t.value, 0);
    const chartData = total === 0
        ? [{ name: 'No Data', value: 1, color: '#E9ECEF' }]
        : TIER_DATA;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Card: Pie Chart */}
            <Card className="p-6 rounded-[4px] border border-gray-100 bg-white shadow-sm flex flex-col h-[350px]">
                <h3 className="text-sm font-bold text-[#2D3436] mb-6">Tier Distribution</h3>
                <div className="flex-1 w-full relative min-w-0">
                    {mounted ? (
                        <ResponsiveContainer width="100%" height="100%" debounce={100}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={total > 0}
                                    label={total > 0 ? ({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%` : undefined}
                                    outerRadius={80}
                                    dataKey="value"
                                    stroke="none"
                                    className="text-[10px] font-semibold outline-none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '4px', border: '1px solid #f3f4f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#2D3436' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                        </div>
                    )}
                </div>
                {/* Horizontal Legend */}
                <div className="flex justify-center items-center space-x-6 mt-4">
                    {TIER_DATA.map((tier, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: tier.color }} />
                            <span className="text-[10px] font-bold text-gray-500">{tier.name}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Right Card: Statistics List */}
            <Card className="p-6 rounded-[4px] border border-gray-100 bg-white shadow-sm flex flex-col h-[350px]">
                <h3 className="text-sm font-bold text-[#2D3436] mb-8">Tier Statistics</h3>
                <div className="flex-1 flex flex-col space-y-4">
                    {TIER_DATA.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-[4px] transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: tier.color }} />
                                <span className="text-sm font-bold text-[#2D3436] group-hover:text-primary-green transition-colors">{tier.name}</span>
                            </div>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-bold text-[#1A1A1A]">{tier.value < 10 ? `0${tier.value}` : tier.value}</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">users</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
