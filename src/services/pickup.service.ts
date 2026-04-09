"use client";

import { apiGet, apiPost, apiPatch } from "@/lib/api-client";

// ─── Frontend Display Interfaces (Do Not Change) ─────────────────────────────

export interface PickupRecord {
    id: string;
    user: {
        name: string;
        area: string;
    };
    wasteType: 'Organic' | 'Recyclable' | 'E-Waste' | 'Glass' | 'Hazardous';
    weight: string;
    collector: string;
    status: 'En Route' | 'Completed' | 'Scheduled' | 'In Progress';
    payment: 'Paid' | 'Pending' | 'Failed';
    timeSlot: string;
}

export interface PickupStats {
    total: number;
    today: number;
    completed: number;
    inProgress: number;
    scheduled: number;
}

// ─── API Types (Matching Backend) ────────────────────────────────────────────

interface CreatePickupDto {
    wasteType: string;
    scheduledDate: string; // YYYY-MM-DD
    timeSlot: string;
    address: string;
    latitude: number;
    longitude: number;
    notes?: string;
    binId?: string;
}

interface CancelPickupDto {
    reason?: string;
}

interface BackendPickup {
    id: string;
    reference: string;
    wasteType: string;
    scheduledDate: string;
    timeSlot: string;
    status: string;
    address: string;
    weightKg?: number;
    collector: {
        name: string | null;
        phone: string | null;
    } | null;
    payment: {
        status: string;
    } | null;
    createdAt: string;
}

interface GetPickupsResponse {
    success: boolean;
    data: BackendPickup[];
    meta: {
        total: number;
    };
}

interface GetSinglePickupResponse {
    success: boolean;
    data: BackendPickup;
}

interface GetActivePickupResponse {
    success: boolean;
    data: BackendPickup | null;
}

interface GenericActionResponse {
    success: boolean;
    message: string;
}

// ─── Helper Functions to Map Backend Data -> Frontend Types ──────────────────

function mapWasteType(wType: string): PickupRecord['wasteType'] {
    switch (wType) {
        case 'ORGANIC': return 'Organic';
        case 'RECYCLABLE': return 'Recyclable';
        case 'EWASTE': return 'E-Waste';
        case 'GLASS': return 'Glass';
        case 'HAZARDOUS': return 'Hazardous';
        default: return 'Organic'; // Fallback
    }
}

function mapStatus(status: string): PickupRecord['status'] {
    switch (status) {
        case 'EN_ROUTE': return 'En Route';
        case 'COMPLETED': return 'Completed';
        case 'PENDING':
        case 'CONFIRMED':
        case 'COLLECTOR_ASSIGNED': return 'Scheduled';
        case 'ARRIVED':
        case 'IN_PROGRESS': return 'In Progress';
        default: return 'Scheduled'; // Fallback forCANCELLED/FAILED conceptually maps elsewhere, or just Scheduled
    }
}

function mapPayment(paymentInfo: BackendPickup['payment']): PickupRecord['payment'] {
    if (!paymentInfo) return 'Pending';
    switch (paymentInfo.status) {
        case 'SUCCESS': return 'Paid';
        case 'FAILED': return 'Failed';
        default: return 'Pending';
    }
}

function mapTimeSlot(slot: string): string {
    const map: Record<string, string> = {
        'MORNING_8_10': '08:00 - 10:00',
        'MORNING_10_12': '10:00 - 12:00',
        'AFTERNOON_12_14': '12:00 - 14:00',
        'AFTERNOON_14_16': '14:00 - 16:00',
        'EVENING_16_18': '16:00 - 18:00'
    };
    return map[slot] || slot;
}

function mapBackendPickupToFrontend(bp: BackendPickup): PickupRecord {
    return {
        id: bp.reference, // Use Reference ECO-XYZ for Display ID
        user: {
            name: "Self", // In /pickups/me, it's always the authenticated user
            area: bp.address.split(',')[0] || bp.address,
        },
        wasteType: mapWasteType(bp.wasteType),
        weight: bp.weightKg ? `${bp.weightKg} kg` : '--',
        collector: bp.collector?.name || 'Unassigned',
        status: mapStatus(bp.status),
        payment: mapPayment(bp.payment),
        timeSlot: mapTimeSlot(bp.timeSlot),
    };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const pickupService = {
    /**
     * GET /api/v1/admin/pickups
     * Admin-only: Returns all pickups in the system.
     */
    async getPickups(): Promise<PickupRecord[]> {
        const res = await apiGet<{ success: boolean; data: any[] }>('/admin/pickups');
        if (res.success && res.data) {
            return res.data.map(p => ({
                id: p.reference || p.id,
                user: {
                    name: `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || 'Guest',
                    area: p.address?.split(',')[0] || 'Kigali'
                },
                wasteType: mapWasteType(p.wasteType),
                weight: p.weightKg ? `${p.weightKg} kg` : '--',
                collector: p.collector ? `${p.collector.firstName} ${p.collector.lastName}` : 'Unassigned',
                status: mapStatus(p.status),
                payment: mapPayment(p.payment),
                timeSlot: mapTimeSlot(p.timeSlot),
            }));
        }
        return [];
    },

    /**
     * GET /api/v1/admin/analytics/pickups
     * Admin-only: Aggregates stats from the analytics endpoint.
     */
    async getStats(): Promise<PickupStats> {
        const res = await apiGet<{ success: boolean; data: any }>('/admin/analytics/pickups');
        if (res.success && res.data) {
            return {
                total: res.data.total || 0,
                today: res.data.today || 0,
                completed: res.data.completed || 0,
                inProgress: res.data.inProgress || 0,
                scheduled: res.data.scheduled || 0
            };
        }
        return { total: 0, today: 0, completed: 0, inProgress: 0, scheduled: 0 };
    },

    /**
     * POST /api/v1/pickups
     * Schedule a new pickup.
     */
    async createPickup(dto: CreatePickupDto): Promise<GenericActionResponse> {
        return apiPost<GenericActionResponse>('/pickups', dto);
    },

    /**
     * GET /api/v1/pickups/active
     * Fetches currently active pickup if any.
     */
    async getActivePickup(): Promise<PickupRecord | null> {
        const res = await apiGet<GetActivePickupResponse>('/pickups/active');
        if (!res.data) return null;
        return mapBackendPickupToFrontend(res.data);
    },

    /**
     * GET /api/v1/pickups/{id}
     * Get details for single pickup by UUID
     */
    async getPickup(pickupId: string): Promise<PickupRecord> {
        const res = await apiGet<GetSinglePickupResponse>(`/pickups/${pickupId}`);
        return mapBackendPickupToFrontend(res.data);
    },

    /**
     * PATCH /api/v1/pickups/{id}/cancel
     * Cancels an active or pending pickup.
     */
    async cancelPickup(pickupId: string, reason?: string): Promise<GenericActionResponse> {
        return apiPatch<GenericActionResponse>(`/pickups/${pickupId}/cancel`, { reason });
    }
};
