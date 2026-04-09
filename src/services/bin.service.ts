"use client";

import { apiGet, apiPost } from "@/lib/api-client";

// ─── Frontend Display Interfaces (Do Not Change) ─────────────────────────────

export interface BinRecord {
    id: string;
    user: {
        name: string;
        address: string;
    };
    type: 'Organic' | 'Recyclable' | 'E-Waste' | 'Glass' | 'Hazardous';
    fillLevel: number;
    lastEmptied: string;
    alertStatus: 'Critical' | 'Full' | 'Nearly Full' | 'Normal';
    collector: string;
    history: { time: string; level: number }[];
}

export interface BinStats {
    total: number;
    alerts: number;
    active: number;
    maintenance: number;
}

export interface AssignmentRecord {
    binId: string;
    collector: string;
    assignedAt: string;
    status: 'In Progress' | 'Completed' | 'Pending';
}

// ─── API Types (Matching Backend) ────────────────────────────────────────────

interface BackendBin {
    id: string;
    qrCode: string;
    wasteType: string;
    fillLevel: number;
    status: string;
    lastEmptied: string;
}

interface UserBinsResponse {
    success: boolean;
    data: BackendBin[];
}

interface SingleBinResponse {
    success: boolean;
    data: BackendBin & {
        pickups?: {
            id: string;
            reference: string;
            status: string;
            scheduledDate: string;
            completedAt?: string;
        }[];
    };
}

interface ReportBinDto {
    issueType: string; // 'FULL' | 'DAMAGED' | 'MAINTENANCE'
    description?: string;
}

interface UpdateFillLevelDto {
    fillLevel: number;
}

interface ScanBinDto {
    qrCode: string;
    latitude: number;
    longitude: number;
}

interface GenericResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// ─── Helper Functions to Map Backend Data -> Frontend Types ──────────────────

function mapWasteType(wType: string): BinRecord['type'] {
    switch (wType) {
        case 'ORGANIC': return 'Organic';
        case 'RECYCLABLE': return 'Recyclable';
        case 'EWASTE': return 'E-Waste';
        case 'GLASS': return 'Glass';
        case 'HAZARDOUS': return 'Hazardous';
        default: return 'Organic'; // Fallback
    }
}

function calculateAlertStatus(fillLevel: number): BinRecord['alertStatus'] {
    if (fillLevel >= 95) return 'Critical';
    if (fillLevel >= 80) return 'Full';
    if (fillLevel >= 60) return 'Nearly Full';
    return 'Normal';
}

function mapBackendBinToFrontend(bb: BackendBin): BinRecord {
    return {
        id: bb.qrCode, // We use QRCode for the admin display string
        user: { name: "Self (Resident)", address: "User Address" }, // Mapped from logged-in session context
        type: mapWasteType(bb.wasteType),
        fillLevel: bb.fillLevel,
        lastEmptied: bb.lastEmptied ? new Date(bb.lastEmptied).toISOString().split('T')[0] : 'N/A',
        alertStatus: calculateAlertStatus(bb.fillLevel),
        collector: "Unassigned", // Collector is assigned via Pickups, not natively on bins for residents
        history: [
            // Extrapolate a fake smooth history curve for the demo based on the current fillLevel
            { time: "00:00", level: Math.max(0, bb.fillLevel - 40) },
            { time: "06:00", level: Math.max(0, bb.fillLevel - 20) },
            { time: "12:00", level: Math.max(0, bb.fillLevel - 10) },
            { time: "18:00", level: bb.fillLevel },
            { time: "24:00", level: bb.fillLevel }
        ]
    };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const binService = {
    /**
     * GET /api/v1/bins
     * Fetch bins for current user
     */
    getBins: async (): Promise<BinRecord[]> => {
        const res = await apiGet<{ success: boolean; data: any[] }>('/admin/bins');
        if (res.success && res.data) {
            return res.data.map(bb => ({
                id: bb.qrCode,
                user: {
                    name: `${bb.user?.firstName || ''} ${bb.user?.lastName || ''}`.trim() || 'Resident',
                    address: bb.user?.address || 'Kigali'
                },
                type: mapWasteType(bb.wasteType),
                fillLevel: bb.fillLevel,
                lastEmptied: bb.lastEmptied ? new Date(bb.lastEmptied).toISOString().split('T')[0] : 'N/A',
                alertStatus: calculateAlertStatus(bb.fillLevel),
                collector: bb.pickups?.[0]?.collector?.user 
                    ? `${bb.pickups[0].collector.user.firstName} ${bb.pickups[0].collector.user.lastName}`
                    : "Unassigned",
                history: [
                    { time: "00:00", level: Math.max(0, bb.fillLevel - 40) },
                    { time: "06:00", level: Math.max(0, bb.fillLevel - 20) },
                    { time: "12:00", level: Math.max(0, bb.fillLevel - 10) },
                    { time: "18:00", level: bb.fillLevel },
                    { time: "24:00", level: bb.fillLevel }
                ]
            }));
        }
        return [];
    },

    /**
     * GET /api/v1/bins/{id}
     * Fetch single bin (Also can be used to populate admin views if requested)
     */
    getBin: async (id: string): Promise<BinRecord> => {
        const res = await apiGet<SingleBinResponse>(`/bins/${id}`);
        return mapBackendBinToFrontend(res.data);
    },

    /**
     * Aggregates stats dynamically based on the user's bin data for visually rendering Admin charts
     */
    getStats: async (): Promise<BinStats> => {
        const res = await apiGet<{ success: boolean; data: any }>('/admin/analytics/bins');
        if (res.success && res.data) {
            return {
                total: res.data.total || 0,
                alerts: res.data.alerts || 0,
                active: res.data.active || 0,
                maintenance: res.data.maintenance || 0
            };
        }
        return { total: 0, alerts: 0, active: 0, maintenance: 0 };
    },

    /**
     * GET /api/v1/pickups
     * For Admin Assignments, we cross-pollinate with Pickup data, 
     * but since it's just resident bins right now, we shape an extrapolated visual
     */
    getAssignments: async (): Promise<AssignmentRecord[]> => {
        const res = await apiGet<UserBinsResponse>('/bins');
        
        // Build mock assignments from the live bins to keep the Dashboard visually intact
        return res.data.map((bin) => ({
            binId: bin.qrCode,
            collector: "Simulated Collector",
            assignedAt: new Date().toISOString().slice(0,16).replace('T', ' '),
            status: "Pending"
        }));
    },

    /**
     * POST /api/v1/bins/{id}/report
     */
    reportBin: async (id: string, dto: ReportBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/report`, dto);
    },

    /**
     * POST /api/v1/bins/{id}/fill-level
     */
    updateFillLevel: async (id: string, dto: UpdateFillLevelDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/fill-level`, dto);
    },

    /**
     * POST /api/v1/bins/scan
     */
    scanBin: async (dto: ScanBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>('/bins/scan', dto);
    }
};
