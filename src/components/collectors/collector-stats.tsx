"use client";

import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectorStatProps {
    title: string;
    value: string;
    type: 'location' | 'route' | 'rating' | 'pickups';
}

function StatCard({ title, value, type }: CollectorStatProps) {
    const iconMap = {
        location: { icon: MapPin, color: "bg-blue-50 text-blue-600" },
        route: { icon: TrendingUp, color: "bg-indigo-50 text-indigo-600" },
        rating: { icon: Star, color: "bg-orange-50 text-orange-600" },
        pickups: { icon: TrendingUp, color: "bg-green-50 text-primary-green" },
    };

    const { icon: Icon, color } = iconMap[type];

    return (
        <Card className="flex-1 min-w-[140px] rounded-xl border border-gray-100 bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-default">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">{title}</p>
                <div className={cn("p-2 rounded-lg shadow-sm transition-all", color)}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-none">{value}</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-2">Active records</p>
            </div>
        </Card>
    );
}

export function CollectorStats({ stats }: { stats: any[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
