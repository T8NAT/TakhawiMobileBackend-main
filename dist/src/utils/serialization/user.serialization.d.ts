import { User } from '../../types/userType';
import { Language } from '../../types/languageType';
export declare const serializeUser: (user: User | Partial<User>, lang: Language, role: string) => {
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    Hobbies: {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[] | undefined;
    rate: number | undefined;
    Vehicles: {
        Vehicle_Color: {
            name: string;
        } | undefined;
        Vehicle_Class: {
            name: string;
        } | undefined;
        Vehicle_Type: {
            name: string;
        } | undefined;
        Vehicle_Name: {
            name: string;
        } | undefined;
        id: number;
        serial_no: string;
        plate_alphabet: string;
        plate_alphabet_ar: string;
        plate_number: string;
        seats_no: number;
        vehicle_color_id: number;
        vehicle_class_id: number;
        vehicle_type_id: number;
        vehicle_name_id: number;
        production_year: number;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null;
    id: number;
    uuid: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    avatar: string | null;
    birth_date: Date | null;
    bio: string | null;
    national_id: string | null;
    gender: string;
    online_status: string;
    location: Json;
    prefered_language: string;
    profile_complted: number;
    phone_verified: boolean;
    switch_to_driver: boolean;
    is_blocked: boolean;
    discount_app_share_count: number;
    user_wallet_balance: number;
    driver_wallet_balance: number;
    driver_status: string;
    passenger_status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    cityId: number | null;
    User_FCM_Token?: import("../../types/userType").FCMToken[] | undefined;
} | {
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    Hobbies: {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[] | undefined;
    rate: number | undefined;
    Vehicles: {
        Vehicle_Color: {
            name: string;
        } | undefined;
        Vehicle_Class: {
            name: string;
        } | undefined;
        Vehicle_Type: {
            name: string;
        } | undefined;
        Vehicle_Name: {
            name: string;
        } | undefined;
        id: number;
        serial_no: string;
        plate_alphabet: string;
        plate_alphabet_ar: string;
        plate_number: string;
        seats_no: number;
        vehicle_color_id: number;
        vehicle_class_id: number;
        vehicle_type_id: number;
        vehicle_name_id: number;
        production_year: number;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null;
    id?: number | undefined;
    uuid?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: string | undefined;
    avatar?: string | null | undefined;
    birth_date?: Date | null | undefined;
    bio?: string | null | undefined;
    national_id?: string | null | undefined;
    gender?: string | undefined;
    online_status?: string | undefined;
    location?: any;
    prefered_language?: string | undefined;
    profile_complted?: number | undefined;
    phone_verified?: boolean | undefined;
    switch_to_driver?: boolean | undefined;
    is_blocked?: boolean | undefined;
    discount_app_share_count?: number | undefined;
    user_wallet_balance?: number | undefined;
    driver_wallet_balance?: number | undefined;
    driver_status?: string | undefined;
    passenger_status?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    deletedAt?: Date | null | undefined;
    cityId?: number | null | undefined;
    User_FCM_Token?: import("../../types/userType").FCMToken[] | undefined;
};
export declare const serializeUsers: (users: User[], lang: Language) => ({
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    Hobbies: {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[] | undefined;
    rate: number | undefined;
    Vehicles: {
        Vehicle_Color: {
            name: string;
        } | undefined;
        Vehicle_Class: {
            name: string;
        } | undefined;
        Vehicle_Type: {
            name: string;
        } | undefined;
        Vehicle_Name: {
            name: string;
        } | undefined;
        id: number;
        serial_no: string;
        plate_alphabet: string;
        plate_alphabet_ar: string;
        plate_number: string;
        seats_no: number;
        vehicle_color_id: number;
        vehicle_class_id: number;
        vehicle_type_id: number;
        vehicle_name_id: number;
        production_year: number;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null;
    id: number;
    uuid: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    avatar: string | null;
    birth_date: Date | null;
    bio: string | null;
    national_id: string | null;
    gender: string;
    online_status: string;
    location: Json;
    prefered_language: string;
    profile_complted: number;
    phone_verified: boolean;
    switch_to_driver: boolean;
    is_blocked: boolean;
    discount_app_share_count: number;
    user_wallet_balance: number;
    driver_wallet_balance: number;
    driver_status: string;
    passenger_status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    cityId: number | null;
    User_FCM_Token?: import("../../types/userType").FCMToken[] | undefined;
} | {
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    Hobbies: {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[] | undefined;
    rate: number | undefined;
    Vehicles: {
        Vehicle_Color: {
            name: string;
        } | undefined;
        Vehicle_Class: {
            name: string;
        } | undefined;
        Vehicle_Type: {
            name: string;
        } | undefined;
        Vehicle_Name: {
            name: string;
        } | undefined;
        id: number;
        serial_no: string;
        plate_alphabet: string;
        plate_alphabet_ar: string;
        plate_number: string;
        seats_no: number;
        vehicle_color_id: number;
        vehicle_class_id: number;
        vehicle_type_id: number;
        vehicle_name_id: number;
        production_year: number;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null;
    id?: number | undefined;
    uuid?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: string | undefined;
    avatar?: string | null | undefined;
    birth_date?: Date | null | undefined;
    bio?: string | null | undefined;
    national_id?: string | null | undefined;
    gender?: string | undefined;
    online_status?: string | undefined;
    location?: any;
    prefered_language?: string | undefined;
    profile_complted?: number | undefined;
    phone_verified?: boolean | undefined;
    switch_to_driver?: boolean | undefined;
    is_blocked?: boolean | undefined;
    discount_app_share_count?: number | undefined;
    user_wallet_balance?: number | undefined;
    driver_wallet_balance?: number | undefined;
    driver_status?: string | undefined;
    passenger_status?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    deletedAt?: Date | null | undefined;
    cityId?: number | null | undefined;
    User_FCM_Token?: import("../../types/userType").FCMToken[] | undefined;
})[];
