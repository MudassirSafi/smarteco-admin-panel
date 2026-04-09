"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PickupStats } from "@/components/pickups/pickup-stats";
import { PickupTable } from "@/components/pickups/pickup-table";
import { LiveStatus } from "@/components/ui/live-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Filter } from "lucide-react";
import { pickupService, PickupRecord, PickupStats as PickupStatsData } from "@/services/pickup.service";
import { useSearch } from "@/context/search-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PickupManagementPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [pickups, setPickups] = useState<PickupRecord[]>([]);
    const [stats, setStats] = useState<PickupStatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("All Status");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [pickupsData, statsData] = await Promise.all([
                    pickupService.getPickups(),
                    pickupService.getStats()
                ]);
                setPickups(pickupsData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load pickup data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredPickups = pickups.filter(p => {
        const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.collector.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All Status" || p.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-row items-start justify-between gap-6">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">Pickup Management</h1>
                            <p className="text-[12px] md:text-sm text-[#636E72] font-semibold mt-1">
                                {stats?.today || 0} total pickups today
                            </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <LiveStatus />
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <PickupStats stats={stats} />

                    {/* Controls Row - Stack on mobile */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="relative flex-[4]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B2BEC3]" />
                            <Input
                                placeholder="Search pickups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-white border-gray-100 shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm text-[#2D3436] placeholder:text-[#B2BEC3] font-medium w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full h-11 bg-white border border-gray-100 text-[#2D3436] font-bold hover:bg-gray-50 hover:border-gray-200 shadow-sm rounded-[4px] flex items-center justify-between px-4 transition-all outline-none">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-400" />
                                        <span>{statusFilter}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-56">
                                    {["All Status", "Completed", "En Route", "Scheduled", "In Progress"].map((status) => (
                                        <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Main Table Area */}
                    <div className="-mx-4 md:mx-0 overflow-x-auto">
                        <PickupTable
                            pickups={filteredPickups}
                            isLoading={isLoading}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
