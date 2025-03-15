import {IHostel, IHostelState} from "../types/types.ts";
import {Gender} from "../model/enum/Gender.ts";
import {RoomCategories} from "../model/enum/RoomCategories.ts";
import {ResidentType} from "../model/enum/ResidentType.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../services/api.ts";

const initialState: IHostelState = {
    step: 1,
    formData: {
        title: "",
        city: "",
        location: {latitude: 0, longitude: 0},
        description: "",
        genderPreference: Gender.ANY,
        capacity: 1,
        category: RoomCategories.SINGLE,
        rent: 0,
        mobileNo: 0,
        forWhom: ResidentType.ANYONE,
        foodAvailability: true,
        photos: [],
        owner: ""
    },
    selectedHostel: null,
    hostels: [],
    isLoading: false,
    successMessage: "",
    error: "",
    page: 1,
    totalPages: 0,
    totalItems: 0,
    hasMore: false
}

export const addHostel = createAsyncThunk(
    "hostel/addHostel",
    async (hostelData: IHostel) => {
            const formData = new FormData();

            for (const [key, value] of Object.entries(hostelData)) {
                if (key === "photos" && Array.isArray(value)) {
                    value.forEach(photo => formData.append("photos", photo));
                } else {
                    formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
                }
            }

            const response = await api.post("rooms", formData);
            return response.data;
    }
);

export const getHostels = createAsyncThunk(
    "hostel/getHostels",
    async (
        params: {
            city?: string;
            genderPreference?: string;
            capacity?: number;
            maxPrice?: number;
            foodAvailability?: boolean;
            forWhom?: string;
            category?: string;
            page?: number;
            limit?: number;
        }
    )=> {
        try {
            const response = await api.get("rooms", {params});
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
);

export const getBoardingsByLocationBounds = createAsyncThunk(
    "hostel/getBoardingsByLocationBounds",
    async (
        params: {
            neLat: number;
            neLng: number;
            swLat: number;
            swLng: number;
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const response = await api.get("room/nearby", {params});
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const hostelSlice = createSlice({
    name: "hostel",
    initialState,
    reducers: {
        nextStep: (state) => {
            state.step = Math.min(state.step + 1,4);
        },
        prevStep: (state) => {
            state.step = Math.min(state.step - 1,4);
        },
        updateFormData: (state, action) => {
            state.formData = {...state.formData, ...action.payload }
        },
        resetForm: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addHostel.pending, (state) => {
                state.isLoading = true;
                state.successMessage = "";
                state.error = "";
            })
            .addCase(addHostel.fulfilled, (state) => {
                state.isLoading = false;
                state.successMessage = "Hostel published successfully.";
            })
            .addCase(addHostel.rejected, (state, action) => {
                state.isLoading = false;
                throw action.payload;
            });
        builder
            .addCase(getHostels.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(getHostels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hostels = action.payload.data;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.totalItems;
                state.hasMore = action.payload.hasmore;
            })
            .addCase(getHostels.rejected, (state, action) => {
                state.isLoading = false;
                throw action.payload;
            });
        builder
            .addCase(getBoardingsByLocationBounds.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBoardingsByLocationBounds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hostels = action.payload.data;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.totalItems;
                state.hasMore = action.payload.hasMore;
            })
            .addCase(getBoardingsByLocationBounds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { nextStep, prevStep, updateFormData, resetForm } = hostelSlice.actions;
export default hostelSlice.reducer;