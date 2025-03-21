import {Gender} from "./enum/Gender.ts";

export class Hostel {
    _id: string;
    title: string;
    city: string;
    location: { latitude: number; longitude: number };
    description: string;
    genderPreference: Gender;
    capacity: number;
    category: string;
    rent: number;
    mobileNo: number;
    forWhom: string;
    foodAvailability: boolean;
    photos: string[];
    owner: string;
    createdAt: string;

    constructor(data: Partial<Hostel>) {
        this._id = data._id ?? "";
        this.title = data.title ?? "";
        this.city = data.city ?? "";
        this.location = data.location ?? { latitude: 0, longitude: 0 };
        this.description = data.description ?? "";
        this.genderPreference = data.genderPreference ?? Gender.ANY;
        this.capacity = data.capacity ?? 0;
        this.category = data.category ?? "";
        this.rent = data.rent ?? 0;
        this.mobileNo = data.mobileNo ?? 0;
        this.forWhom = data.forWhom ?? "";
        this.foodAvailability = data.foodAvailability ?? false;
        this.photos = data.photos ?? [];
        this.owner = data.owner ?? "";
        this.createdAt = data.createdAt ?? new Date().toISOString();
    }
}
