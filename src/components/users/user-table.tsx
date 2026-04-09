"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    Pencil,
    MapPin,
    Phone,
    User,
    Shield,
    Zap,
    Building2,
    Home,
    CheckCircle2,
    AlertCircle,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRecord } from "@/services/user.service";
import { UserDetailsModal } from "./user-details-modal";

interface UserTableProps {
    users: UserRecord[];
    isLoading?: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 rounded-sm border-2 border-primary-green border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-100">
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 py-4">User ID</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Name</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Phone</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Type</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Tier</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-center">EcoPoints</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-center">Pickups</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Status</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50 border-gray-100 group transition-colors">
                            <TableCell className="px-6 py-4">
                                <span className="text-[10px] font-semibold text-primary-green bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-100/50 uppercase">{user.id}</span>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-primary-green transition-colors">{user.name}</span>
                                    <div className="flex items-center text-[10px] text-[#636E72] font-semibold mt-0.5 uppercase">
                                        <MapPin className="w-3 h-3 mr-1 text-[#B2BEC3]" />
                                        {user.location}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex items-center text-xs font-semibold text-[#636E72]">
                                    <Phone className="w-3 h-3 mr-2 text-[#B2BEC3]" />
                                    {user.phone}
                                </div>
                            </TableCell>
                            <TableCell className="px-4">
                                <Badge className={cn(
                                    "px-2 py-0.5 text-[9px] font-bold uppercase border-none rounded-[4px] flex items-center w-fit space-x-1 shadow-sm",
                                    user.type === "Business" ? "bg-purple-100/50 text-purple-700" : "bg-blue-100/50 text-blue-700"
                                )}>
                                    {user.type === "Business" ? <Building2 className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                    <span>{user.type}</span>
                                </Badge>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex items-center space-x-1.5">
                                    <Shield className={cn(
                                        "w-3.5 h-3.5",
                                        user.tier === "Eco Champion" ? "text-[#E67E22]" : user.tier === "Eco Warrior" ? "text-[#3498DB]" : "text-[#BDC3C7]"
                                    )} />
                                    <span className="text-xs font-bold text-[#2D3436] whitespace-nowrap">{user.tier}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 text-center">
                                <div className="inline-flex items-center space-x-1 bg-yellow-50 px-2.5 py-1 rounded-[4px] border border-yellow-100 shadow-sm">
                                    <Zap className="w-3 h-3 text-[#F1C40F] fill-[#F1C40F]" />
                                    <span className="text-[11px] font-bold text-[#D4AC0D]">{user.points}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 text-center">
                                <span className="text-sm font-bold text-[#2D3436]">{user.pickups}</span>
                            </TableCell>
                            <TableCell className="px-4">
                                <Badge className={cn(
                                    "px-2 py-0.5 text-[9px] font-bold uppercase border-none rounded-[4px] flex items-center w-fit space-x-1 shadow-sm",
                                    user.status === "Active" ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"
                                )}>
                                    {user.status === "Active" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                                    <span>{user.status}</span>
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                        className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-blue-200"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                        className="p-1.5 hover:bg-green-50 hover:text-green-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-green-200"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-red-200"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <UserDetailsModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setTimeout(() => setSelectedUser(null), 200); // clear after animation
                }}
            />
        </div>
    );
}
