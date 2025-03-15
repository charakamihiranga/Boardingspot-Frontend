import {Gender} from "../model/enum/Gender.ts";
import {RoomCategories} from "../model/enum/RoomCategories.ts";
import {ResidentType} from "../model/enum/ResidentType.ts";
import {Hostel} from "../model/Hostel.ts";

export interface IHostel {
    _id?: string;
    title: string;
    city: string;
    location: { latitude: number; longitude: number };
    description: string;
    genderPreference: Gender;
    capacity: number;
    category: RoomCategories;
    rent: number;
    mobileNo: number;
    forWhom: ResidentType;
    foodAvailability: boolean;
    photos: string[];
    owner: string;
    createdAt?: string;
}

export interface IHostelState {
    step: number;
    formData: {
        title: string;
        city: string;
        location: { latitude: number; longitude: number };
        description: string;
        genderPreference: Gender;
        capacity: number;
        category: RoomCategories;
        rent: number;
        mobileNo: number;
        forWhom: ResidentType;
        foodAvailability: boolean;
        photos: string[];
        owner: string;
    };
    selectedHostel: IHostel | null;
    hostels: IHostel[];
    isLoading: boolean;
    successMessage: string;
    error: string;
    page: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
}

export interface IHostelCardProps {
    hostels: Hostel[];
    openHostelDetails: (id: string) => void;
}

export interface ILocationBounds {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
}
