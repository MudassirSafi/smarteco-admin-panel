"use client";

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PickupChartProps {
    data?: Array<{
        name: string;
        pickups: number;
        waste: number;
    }>;
    isLoading: boolean;
}

const SquareDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
        <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={fill} stroke="none" />
    );
};

export function PickupChart({ data, isLoading }: PickupChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const chartData = data || [];

    return (
        <Card className="border border-gray-100 shadow-sm col-span-2">
            <CardHeader className="pb-0 pt-6 px-8">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">Weekly Pickup Trends</CardTitle>
                <p className="text-xs text-gray-400 font-medium -mt-1">Pickups and waste volume over the last 7 days</p>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <div className="h-[300px] w-full min-w-0">
                    {mounted && !isLoading ? (
                        <ResponsiveContainer width="100%" height="100%" debounce={100}>
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="square"
                                    wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b', paddingTop: '20px' }}
                                />
                                <Line
                                    name="Pickups"
                                    type="monotone"
                                    dataKey="pickups"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={<SquareDot fill="#2563eb" />}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    name="Waste (kg)"
                                    type="monotone"
                                    dataKey="waste"
                                    stroke="#1E8449"
                                    strokeWidth={2}
                                    dot={<SquareDot fill="#1E8449" />}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
