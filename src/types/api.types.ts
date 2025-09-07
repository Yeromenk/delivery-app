export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface AddressSuggestion {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
}

export interface ProfileUpdatePayload {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}