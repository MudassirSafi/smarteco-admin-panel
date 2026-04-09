"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, UserPlus, PackageCheck, AlertCircle, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const formatRelativeTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return d.toLocaleDateString();
};

interface RecentActivityProps {
    activities?: Array<{
        id: string;
        type: 'USER_REGISTRATION' | 'PICKUP_COMPLETED' | 'PAYMENT_RECEIVED' | 'SYSTEM_ALERT';
        user: string;
        time: string | Date;
        detail?: string;
    }>;
    isLoading: boolean;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'USER_REGISTRATION': return UserPlus;
        case 'PICKUP_COMPLETED': return PackageCheck;
        case 'PAYMENT_RECEIVED': return CreditCard;
        case 'SYSTEM_ALERT': return AlertCircle;
        default: return Activity;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case 'USER_REGISTRATION': return "bg-green-500";
        case 'PICKUP_COMPLETED': return "bg-blue-500";
        case 'PAYMENT_RECEIVED': return "bg-purple-500";
        case 'SYSTEM_ALERT': return "bg-orange-500";
        default: return "bg-gray-500";
    }
};

const getActivityActionLabel = (type: string, detail?: string) => {
    switch (type) {
        case 'USER_REGISTRATION': return "New user registered";
        case 'PICKUP_COMPLETED': return `Pickup completed • ${detail || 'In Progress'}`;
        case 'PAYMENT_RECEIVED': return `Payment received • ${detail || 'RWF'}`;
        case 'SYSTEM_ALERT': return `System alert • ${detail || 'Alert'}`;
        default: return "Activity recorded";
    }
};

export function RecentActivity({ activities = [], isLoading }: RecentActivityProps) {
    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 pt-6 px-8 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">Recent Activity</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-6">
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[1px] before:bg-gray-100">
                    {activities.length > 0 ? activities.map((activity, idx) => {
                        const Icon = getActivityIcon(activity.type);
                        const color = getActivityColor(activity.type);
                        const action = getActivityActionLabel(activity.type, activity.detail);
                        const timeString = formatRelativeTime(activity.time);

                        return (
                            <div key={idx} className="relative flex items-start pl-8 space-x-3 group">
                                {/* Timeline Dot */}
                                <div className={cn(
                                    "absolute left-0 top-1.5 w-[22px] h-[22px] rounded-[4px] border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110",
                                    color
                                )}>
                                    <Icon className="w-2.5 h-2.5 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{activity.user}</p>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">{timeString}</span>
                                    </div>
                                    <p className="text-[12px] text-gray-500 font-medium leading-tight">{action}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-10 text-gray-400 text-sm italic">
                            {isLoading ? "Fetching latest activities..." : "No recent activity recorded yet"}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
