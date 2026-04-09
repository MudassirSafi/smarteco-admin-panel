"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CollectorStats } from "@/components/collectors/collector-stats";
import { CollectorTable } from "@/components/collectors/collector-table";
import { CollectorDetailsModal } from "@/components/collectors/collector-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Filter, ArrowLeft } from "lucide-react";
import { collectorService, CollectorRecord } from "@/services/collector.service";
import { useSearch } from "@/context/search-context";
import { LiveStatus } from "@/components/ui/live-status";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CollectorManagementPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCollector, setSelectedCollector] = useState<CollectorRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("All Status");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [collectorsData, statsData] = await Promise.all([
                    collectorService.getCollectors(),
                    collectorService.getStats()
                ]);
                setCollectors(collectorsData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load collector data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredCollectors = collectors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All Status" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-primary-green">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight uppercase">Collector Management</h1>
                                <p className="text-[12px] md:text-sm text-gray-500 font-bold mt-1">
                                    {collectors.length} total collectors <span className="text-gray-300 mx-2">|</span> 
                                    <span className="text-primary-green">{collectors.filter(c => c.status === 'Available').length} active now</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <LiveStatus />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <CollectorStats stats={stats} />

                    {/* Controls Row - Stack on mobile */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                        <div className="relative flex-[4]">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search collectors by name, ID or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 bg-gray-50/50 border-none shadow-none focus:ring-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 font-bold w-full transition-all"
                            />
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100 hidden md:block" />
                        <div className="flex-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full h-12 bg-transparent text-gray-900 font-bold hover:bg-gray-50 shadow-none rounded-lg flex items-center justify-between px-4 transition-all outline-none">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-primary-green" />
                                        <span className="text-sm">{statusFilter}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-56 rounded-xl border-gray-100 shadow-xl p-2">
                                    {["All Status", "Available", "On Route", "Offline"].map((status) => (
                                        <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="rounded-lg font-bold text-gray-600 focus:text-primary-green focus:bg-green-50">
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Main Table Area */}
                    <div className="-mx-4 md:mx-0 overflow-x-auto">
                        <CollectorTable
                            collectors={filteredCollectors}
                            isLoading={isLoading}
                            onView={(c) => {
                                setSelectedCollector(c);
                                setIsModalOpen(true);
                            }}
                            onEdit={(c) => {
                                setSelectedCollector(c);
                                setIsModalOpen(true);
                            }}
                        />
                    </div>

                    {/* Modal */}
                    <CollectorDetailsModal
                        collector={selectedCollector}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </main>
            </div>
        </div>
    );
}
