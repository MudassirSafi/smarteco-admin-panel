"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEFAULT_COLORS = ["#2563eb", "#1E8449", "#f59e0b", "#10b981", "#6366f1", "#ec4899"];

interface WasteChartProps {
    stats?: Record<string, number>;
    isLoading: boolean;
}

export function WasteChart({ stats = {}, isLoading }: WasteChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const chartData = Object.entries(stats).length > 0
        ? Object.entries(stats).map(([name, value], index) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            value,
            color: DEFAULT_COLORS[index % DEFAULT_COLORS.length]
        }))
        : [
            { name: "Plastic", value: 0, color: "#2563eb" },
            { name: "Paper", value: 0, color: "#1E8449" },
            { name: "Metal", value: 0, color: "#f59e0b" },
            { name: "Organic", value: 0, color: "#10b981" },
        ];

    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-8">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">Waste Generation</CardTitle>
                <p className="text-xs text-gray-400 font-medium -mt-1">Distribution across categories</p>
            </CardHeader>
            <CardContent className="p-8 pb-4">
                <div className="h-[280px] w-full min-w-0">
                    {mounted ? (
                        <ResponsiveContainer width="100%" height="100%" debounce={100}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
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
