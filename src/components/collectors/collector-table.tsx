"use client";

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
    MapPin,
    Star,
    Eye,
    Pencil,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CollectorRecord } from "@/services/collector.service";

interface CollectorTableProps {
    collectors: CollectorRecord[];
    isLoading?: boolean;
    onView?: (collector: CollectorRecord) => void;
    onEdit?: (collector: CollectorRecord) => void;
}

export function CollectorTable({ collectors, isLoading, onView, onEdit }: CollectorTableProps) {
    if (isLoading) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 rounded-sm border-2 border-primary-green border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading collectors...</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-100 h-12">
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[120px]">Collector ID</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[150px]">Zone</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[120px]">Status</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[100px]">Vehicle</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[100px]">Rating</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[140px]">Total Pickups</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[180px]">Performance</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {collectors.map((collector) => (
                        <TableRow key={collector.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all h-20 group">
                            <TableCell className="px-6 font-bold text-gray-500 text-xs tracking-tighter uppercase">{collector.id}</TableCell>
                            <TableCell className="px-6">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 border border-gray-100 rounded-md">
                                        <AvatarFallback className="bg-primary-green text-white font-bold text-xs rounded-md">
                                            {collector.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-green transition-colors">{collector.name}</span>
                                        <span className="text-[11px] text-gray-400 font-bold mt-0.5">{collector.phone}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6">
                                <div className="flex items-center space-x-1.5 text-gray-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-sm font-semibold">{collector.zone}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6">
                                <Badge className={cn(
                                    "px-3 py-1 text-[10px] font-bold uppercase border-none rounded-[4px] shadow-sm",
                                    collector.status === "On Route" && "bg-blue-100/80 text-blue-700",
                                    collector.status === "Available" && "bg-green-100/80 text-green-700",
                                    collector.status === "Offline" && "bg-gray-100/80 text-gray-600"
                                )}>
                                    {collector.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 text-sm font-bold text-[#2D3436]">{collector.vehicle}</TableCell>
                            <TableCell className="px-6">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-bold text-[#2D3436]">{collector.rating}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 text-sm font-bold text-[#2D3436]">{collector.totalPickups.toLocaleString()}</TableCell>
                            <TableCell className="px-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    collector.performance >= 95 ? "bg-green-500" : "bg-blue-600"
                                                )}
                                                style={{ width: `${collector.performance}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-[#2D3436] w-9 text-right">{collector.performance}%</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => onView?.(collector)}
                                        className="p-2 hover:bg-gray-100 hover:text-primary-green rounded-lg border border-transparent transition-all text-gray-400"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(collector)}
                                        className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded-lg border border-transparent transition-all text-gray-400"
                                        title="Edit Collector"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
