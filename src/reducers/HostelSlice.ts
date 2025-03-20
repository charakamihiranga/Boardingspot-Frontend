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

export const getHostelById = createAsyncThunk(
    "hostel/getHostelById",
    async (hostelId: string) => {
        try {
            const response = await api.get(`rooms/${hostelId}`);
            return response.data;
        } catch (e) {
            console.error(e)
            throw e;
        }
    }
);

export const getHostelsByUser = createAsyncThunk(
    "hostel/getHostelsByUser",
    async (userId: string) => {
        try {
            const response = await api.get(`rooms/owner/${userId}`);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
);

export const deleteHostel = createAsyncThunk(
    "hostel/deleteHostel",
    async (hostelId: string) => {
        try {
            const response = await api.delete(`rooms/${hostelId}`);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
);

export const updateHostel = createAsyncThunk(
    "hostel/updateHostel",
    async (hostelData: {id: string; updates: Partial<IHostel>}) => {
        try {
            const formData = new FormData();
            const { id, updates } = hostelData;
            Object.entries(updates).forEach(([key, value]) => {
                if (key == "photos" && Array.isArray(value)) {
                    value.forEach((photo) => formData.append("photos", photo))
                } else if ( typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value as string);
                }
            });
            const response = await api.patch(`rooms/${id}`, formData);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
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
        builder
            .addCase(getHostelsByUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHostelsByUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getHostelsByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hostels = action.payload;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.totalItems;
                state.hasMore = action.payload.hasMore;
            })
        builder
            .addCase(deleteHostel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteHostel.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteHostel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hostels = state.hostels.filter(hostel => hostel._id !== action.meta.arg);
            })
        builder
            .addCase(getHostelById.pending, (state) => {
                state.isLoading =true;
            })
            .addCase(getHostelById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getHostelById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedHostel = action.payload;
            })
        builder
            .addCase(updateHostel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateHostel.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateHostel.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedHostel = action.payload.hostel;
                state.hostels = state.hostels.map((hostel) =>
                    hostel._id === updatedHostel._id ? updatedHostel : hostel
                );
            });
    }
});

export const { nextStep, prevStep, updateFormData, resetForm } = hostelSlice.actions;
export default hostelSlice.reducer;