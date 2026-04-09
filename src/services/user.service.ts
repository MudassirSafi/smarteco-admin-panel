import { apiGet, apiDelete } from '../lib/api-client';

export interface UserProfile {
    id: string;
    phone: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userType: string;
    role: string;
    avatarUrl: string | null;
    ecoPoints: number;
    ecoTier: string;
    totalPickups: number;
}

export interface UserRecord {
    id: string;
    name: string;
    phone: string;
    location: string;
    type: "Residential" | "Business";
    tier: string;
    points: number;
    pickups: number;
    status: "Active" | "Suspended";
}

export interface DashboardStats {
    users: {
        total: number;
        residential: number;
        business: number;
        active: number;
        suspended: number;
        newThisWeek: number;
        tierDistribution: {
            ECO_STARTER: number;
            ECO_WARRIOR: number;
            ECO_CHAMPION: number;
        };
    };
    pickups: {
        totalCompleted: number;
        todayScheduled: number;
        todayCompleted: number;
    };
    revenue: {
        totalRWF: number;
        thisMonthRWF: number;
        todayRWF: number;
    };
    collectors: {
        total: number;
        avgRating: number;
    };
    recentActivity?: Array<{
        id: string;
        type: 'USER_REGISTRATION' | 'PICKUP_COMPLETED' | 'PAYMENT_RECEIVED' | 'SYSTEM_ALERT';
        user: string;
        time: string | Date;
        detail?: string;
    }>;
    pickupTrend?: Array<{
        name: string;
        pickups: number;
        waste: number;
    }>;
    activeCollectors?: Array<{
        id: string;
        name: string;
        status: string;
        pickupsToday: number;
        avatar: string;
    }>;
}

function mapTier(ecoTier: string): string {
    switch (ecoTier) {
        case 'ECO_CHAMPION': return 'Eco Champion';
        case 'ECO_WARRIOR': return 'Eco Warrior';
        default: return 'Eco Starter';
    }
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response: any = await apiGet('/users/me');
        return response.data;
    },

    getUsers: async (): Promise<UserRecord[]> => {
        try {
            const response: any = await apiGet('/admin/users');
            const list = Array.isArray(response) ? response : (response?.data ?? []);
            return list.map((u: any) => ({
                id: String(u.id).slice(0, 8).toUpperCase(),
                name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.phone,
                phone: u.phone || 'No Phone',
                location: u.location || 'Kigali, Rwanda',
                type: u.userType === 'BUSINESS' ? 'Business' : 'Residential',
                tier: mapTier(u.ecoTier),
                points: u.ecoPoints ?? 0,
                pickups: u.totalPickups ?? 0,
                status: u.isActive === false ? 'Suspended' : 'Active',
            }));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    },

    getDashboardStats: async (): Promise<DashboardStats | null> => {
        try {
            const response: any = await apiGet('/admin/dashboard');
            // If the response itself is { success: true, data: { ... } }
            const stats = response?.data || response;
            if (stats && stats.users) {
                return stats;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            return null;
        }
    },

    deleteUser: async (id: string): Promise<boolean> => {
        try {
            await apiDelete(`/admin/users/${id}`);
            return true;
        } catch (error) {
            console.error(`Failed to delete user ${id}:`, error);
            throw error;
        }
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<boolean> => {
        try {
            const res: any = await apiPatch('/users/me', data);
            return res.success;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }
};
