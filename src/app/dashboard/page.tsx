"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PickupChart } from "@/components/dashboard/pickup-chart";
import { WasteChart } from "@/components/dashboard/waste-chart";
import { ActiveCollectors } from "@/components/dashboard/active-collectors";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AlertsNotifications } from "@/components/dashboard/alerts-notifications";
import { Users, Truck, DollarSign, TrendingUp } from "lucide-react";
import { LiveStatus } from "@/components/ui/live-status";
import { userService, DashboardStats } from "@/services/user.service";

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        
        const loadStats = async () => {
            setIsLoading(true);
            try {
                const data = await userService.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load dashboard stats:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadStats();
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format numbers with commas
    const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
    // Format currency
    const formatCurrency = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M RWF`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K RWF`;
        return `${num} RWF`;
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight truncate">Dashboard</h1>
                    <p className="text-[10px] md:text-sm text-gray-500 font-medium mt-1 truncate">
                        Real-time analytics <span className="hidden xs:inline">•</span>
                        <span className="text-gray-400 font-normal ml-1 hidden xs:inline">
                            {currentTime ? `Last updated: ${currentTime}` : "Loading timestamp..."}
                        </span>
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <LiveStatus />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Users"
                    value={isLoading ? "..." : formatNumber(stats?.users.total || 0)}
                    change={stats?.users.newThisWeek ? `+${stats.users.newThisWeek} this week` : "Stable"}
                    icon={Users}
                    iconColor="bg-blue-50 text-blue-600"
                    trend="up"
                />
                <StatCard
                    title="Active Pickups Today"
                    value={isLoading ? "..." : formatNumber(stats?.pickups.todayScheduled || 0)}
                    change={stats?.pickups.todayCompleted ? `${stats.pickups.todayCompleted} completed` : "No activity"}
                    icon={Truck}
                    iconColor="bg-indigo-50 text-indigo-600"
                    trend="up"
                />
                <StatCard
                    title="Revenue (This Month)"
                    value={isLoading ? "..." : formatCurrency(stats?.revenue.thisMonthRWF || 0)}
                    change="Current month"
                    icon={DollarSign}
                    iconColor="bg-orange-50 text-orange-600"
                    trend="up"
                />
                <StatCard
                    title="Collectors"
                    value={isLoading ? "..." : formatNumber(stats?.collectors.total || 0)}
                    subtext={stats?.collectors.avgRating ? `${stats.collectors.avgRating.toFixed(1)} avg rating` : "Active now"}
                    icon={Truck}
                    iconColor="bg-indigo-50 text-indigo-600"
                    trend="up"
                />
            </div>

            {/* Charts Grid - Equalized columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PickupChart data={stats?.pickupTrend} isLoading={isLoading} />
                <WasteChart stats={stats?.pickups?.byWasteType} isLoading={isLoading} />
            </div>

            {/* Details Grid - Equalized columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveCollectors stats={stats} isLoading={isLoading} />
                <RecentActivity activities={stats?.recentActivity} isLoading={isLoading} />
            </div>

            {/* Alerts Section */}
            <div className="pt-2">
                <AlertsNotifications />
            </div>
        </div>
    );
}
