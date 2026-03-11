"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { UserSummaryCard } from "@/components/users/user-stats";
import { UserTable } from "@/components/users/user-table";
import { TierDistribution } from "@/components/users/tier-distribution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, FileDown, Users, Home, Building2, UserX, BarChart3 } from "lucide-react";
import { userService, UserRecord } from "@/services/user.service";
import { useSearch } from "@/context/search-context";
import { LiveStatus } from "@/components/ui/live-status";

export default function UsersPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "residential" && user.type === "Residential") ||
            (activeTab === "business" && user.type === "Business") ||
            (activeTab === "suspended" && user.status === "Suspended");

        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-[#2D3436]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#f8f9fa]">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">User Management</h1>
                            <p className="text-sm text-[#636E72] font-semibold mt-1">
                                Manage and monitor system users and tiers
                            </p>
                        </div>
                        <LiveStatus />
                    </div>

                    {/* User Summary Stats - Forced Single Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <UserSummaryCard title="Total Users" count={5} subtext="Manage 5 registered users" icon={Users} />
                        <UserSummaryCard title="Residential Users" count={3} subtext="Private households" icon={Home} />
                        <UserSummaryCard title="Business Accounts" count={2} subtext="Commercial entities" icon={Building2} />
                        <UserSummaryCard title="Suspended" count={1} subtext="Pending verification" icon={UserX} />
                    </div>

                    {/* Tabs / Filters Section - 5 Buttons with Icons */}
                    <div className="pt-2">
                        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-transparent border-none p-0 h-auto flex flex-wrap gap-3">
                                <TabsTrigger value="all" className="text-[11px] font-bold uppercase px-5 py-2.5 rounded-[4px] border border-gray-200 bg-white data-active:bg-primary-green data-active:text-white data-active:border-primary-green hover:bg-green-50 hover:text-primary-green transition-all shadow-sm flex items-center space-x-2">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>All Users (5)</span>
                                </TabsTrigger>
                                <TabsTrigger value="residential" className="text-[11px] font-bold uppercase px-5 py-2.5 rounded-[4px] border border-gray-200 bg-white data-active:bg-primary-green data-active:text-white data-active:border-primary-green hover:bg-green-50 hover:text-primary-green transition-all shadow-sm flex items-center space-x-2">
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Residential (3)</span>
                                </TabsTrigger>
                                <TabsTrigger value="business" className="text-[11px] font-bold uppercase px-5 py-2.5 rounded-[4px] border border-gray-200 bg-white data-active:bg-primary-green data-active:text-white data-active:border-primary-green hover:bg-green-50 hover:text-primary-green transition-all shadow-sm flex items-center space-x-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Business (2)</span>
                                </TabsTrigger>
                                <TabsTrigger value="suspended" className="text-[11px] font-bold uppercase px-5 py-2.5 rounded-[4px] border border-gray-200 bg-white data-active:bg-primary-green data-active:text-white data-active:border-primary-green hover:bg-green-50 hover:text-primary-green transition-all shadow-sm flex items-center space-x-2">
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Suspended (1)</span>
                                </TabsTrigger>
                                <TabsTrigger value="tier" className="text-[11px] font-bold uppercase px-5 py-2.5 rounded-[4px] border border-gray-200 bg-white data-active:bg-primary-green data-active:text-white data-active:border-primary-green hover:bg-green-50 hover:text-primary-green transition-all shadow-sm flex items-center space-x-2">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    <span>Tier Distribution</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {activeTab === "tier" ? (
                        <TierDistribution />
                    ) : (
                        <>
                            {/* Search and Export Row - 75% Search */}
                            <div className="flex items-center space-x-4">
                                <div className="relative flex-[3]">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B2BEC3]" />
                                    <Input
                                        placeholder="Search by name, phone, or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-11 bg-white border-gray-200 shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm text-[#2D3436] placeholder:text-[#B2BEC3] font-medium"
                                    />
                                </div>
                                <div className="flex-1 flex space-x-3">
                                    <Button className="flex-1 h-11 bg-white border border-gray-200 text-[#636E72] font-bold hover:bg-green-50 hover:text-primary-green hover:border-green-200 shadow-sm rounded-[4px] flex items-center justify-center transition-all">
                                        <FileDown className="w-4 h-4 mr-2" />
                                        <span>Export</span>
                                    </Button>
                                    <Link href="/users/create">
                                        <Button className="h-11 bg-primary-green text-white font-bold hover:bg-green-700 px-6 shadow-md shadow-green-100 rounded-[4px] flex items-center justify-center transition-all">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            <span>Create New</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Main Table */}
                            <UserTable users={filteredUsers} isLoading={isLoading} />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
