"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "@/context/search-context";
import { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/user.service";
import { notificationService, Notification } from "@/services/notification.service";
import { systemService } from "@/services/system.service";
import Link from "next/link";

interface TopbarProps {
    onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const { searchQuery, setSearchQuery } = useSearch();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [systemStatus, setSystemStatus] = useState<"UP" | "DOWN">("UP");

    useEffect(() => {
        userService.getProfile()
            .then((data) => setProfile(data))
            .catch((err) => {
                console.error("Topbar: Failed to fetch user profile:", err.message);
                // Silently fail — topbar stays functional with fallback values
            });

        notificationService.getNotifications()
            .then((data) => setNotifications(data))
            .catch(() => {});

        systemService.checkHealth()
            .then(res => {
                if (res && (res.status === "UP" || res.status === "DOWN")) {
                    setSystemStatus(res.status);
                } else {
                    setSystemStatus("DOWN");
                }
            })
            .catch(() => setSystemStatus("DOWN"));
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length; 

    const displayName = profile
        ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Admin"
        : "Admin";

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const roleLabel = profile?.role ?? "Admin";

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center space-x-4">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-6 w-6 text-gray-600" />
                </Button>

                {/* Search Bar */}
                <div className="hidden sm:block flex-1 max-w-sm md:max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search users, pickups..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all text-sm w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Right Actions Section */}
            <div className="flex items-center space-x-3 md:space-x-6">
                {/* System Status Label */}
                <Badge className={`hidden md:flex ${systemStatus === "UP" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} hover:opacity-80 border-none px-3 py-1 items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wide rounded-[4px]`}>
                    <div className={`w-1.5 h-1.5 rounded-[2px] ${systemStatus === "UP" ? "bg-green-600" : "bg-red-600"} animate-pulse`} />
                    <span>{systemStatus === "UP" ? "All Systems Operational" : "System Disturbance Detected"}</span>
                </Badge>

                <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-[2px] border-2 border-white">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {/* User Profile Dropdown — powered by GET /api/v1/users/me */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-2 md:space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-md transition-all group outline-none focus:ring-2 focus:ring-primary-green/20 border-none bg-transparent">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-green transition-colors">
                                {displayName}
                            </p>
                            <div className="flex items-center justify-end text-[10px] text-gray-500 font-semibold uppercase tracking-tight">
                                <div className="w-1.5 h-1.5 rounded-[2px] bg-orange-500 mr-1" />
                                {roleLabel}
                            </div>
                        </div>
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-primary-green/20 ring-1 ring-white rounded-md">
                            <AvatarImage
                                src={profile?.avatarUrl ?? ""}
                                alt={displayName}
                                className="rounded-md"
                            />
                            <AvatarFallback className="bg-primary-green text-white font-bold text-xs uppercase rounded-md">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900 leading-tight truncate">{displayName}</span>
                                    {profile?.email && (
                                        <span className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                                            {profile.email}
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href="/profile" className="flex w-full cursor-pointer" />}>
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-default opacity-50">Security Status</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-default opacity-50">Admin Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 font-semibold">Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
