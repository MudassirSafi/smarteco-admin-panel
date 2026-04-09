"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Shield, Calendar, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { userService, UserProfile } from "@/services/user.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await userService.getProfile();
                setProfile(data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                });
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage("");
        try {
            await userService.updateProfile(formData);
            setSuccessMessage("Profile updated successfully!");
            // Refresh local profile state
            const updated = await userService.getProfile();
            setProfile(updated);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
                <div className="w-8 h-8 border-2 border-primary-green border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    const initials = profile 
        ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() 
        : "AD";

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    
                    {/* Header with Navigation */}
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-primary-green">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight uppercase">Admin Profile</h1>
                            <p className="text-[12px] md:text-sm text-gray-500 font-bold mt-1">Manage your account settings and preferences</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        
                        {/* Left Column: Avatar & Quick Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
                                <div className="h-24 bg-gradient-to-r from-primary-green to-green-600" />
                                <div className="px-6 pb-8 -mt-12 flex flex-col items-center">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-1 ring-gray-100 mb-4 rounded-2xl">
                                        <AvatarImage src={profile?.avatarUrl ?? ""} />
                                        <AvatarFallback className="bg-primary-green text-white text-3xl font-bold rounded-2xl">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h2>
                                    <p className="text-sm font-bold text-primary-green uppercase tracking-wider mt-1">{profile?.role || "Global Admin"}</p>
                                    
                                    <div className="w-full mt-8 space-y-4 pt-6 border-t border-gray-50">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">Account ID</span>
                                            <span className="font-mono text-gray-700 font-bold">{profile?.id.substring(0, 8).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">Joined</span>
                                            <span className="text-gray-700 font-bold">Jan 2024</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">Status</span>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-green-600 font-bold uppercase text-[10px]">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none shadow-lg bg-white rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-primary-green" /> Security Overview
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Last Login</p>
                                        <p className="text-xs font-bold text-gray-700">Today, 09:24 AM</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">IP Address</p>
                                        <p className="text-xs font-bold text-gray-700">197.243.2.144</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Settings Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-xl bg-white rounded-2xl">
                                <CardHeader className="border-b border-gray-50 px-8 py-6">
                                    <CardTitle className="text-lg font-bold text-gray-900">Personal Information</CardTitle>
                                    <p className="text-xs text-gray-400 font-medium">Update your account details and contact information</p>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input 
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-bold text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input 
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-bold text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input 
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all font-bold text-gray-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number (Read-only)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-50" />
                                                <Input 
                                                    disabled
                                                    value={profile?.phone || ""}
                                                    className="pl-10 h-12 bg-gray-100 border-none rounded-xl font-bold text-gray-400"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 italic">Contact support to change your verified phone number.</p>
                                        </div>

                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                            {successMessage ? (
                                                <div className="flex items-center text-green-600 text-sm font-bold">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    {successMessage}
                                                </div>
                                            ) : <div />}
                                            
                                            <Button 
                                                type="submit" 
                                                className="bg-primary-green hover:bg-green-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg bg-white rounded-2xl p-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all">
                                <div>
                                    <h4 className="text-gray-900 font-bold tracking-tight">Two-Factor Authentication</h4>
                                    <p className="text-xs text-gray-400 font-medium">Add an extra layer of security to your account.</p>
                                </div>
                                <div className="h-6 w-11 bg-gray-200 rounded-full relative transition-all group-hover:bg-primary-green/20">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
