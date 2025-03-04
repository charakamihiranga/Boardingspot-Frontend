import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../services/api.ts";
import {User} from "../model/User.ts";

const initialState  = {
    isAuthenticated: false,
    user: {
        _id: "",
        fullName: "",
        email: "",
        gender: "",
    },
    error: ""
}

export const loginUser = createAsyncThunk(
    'user/login',
    async (user: {email: string, password: string}) => {
            const response = await api.post("auth/signin",
                user,
                { withCredentials: true }
            );
            return response.data;
    }
);
export const registerUser = createAsyncThunk(
    'user/signup',
    async (user: User, {rejectWithValue}) => {
            try {
                const response = await api.post('auth/signup', user);
                return response.data;
            } catch (error: any) {
                if (error.response) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("An unexpected error occurred.");
            }

    }
);
export const googleAuth = createAsyncThunk(
    'user/googleAuth',
    async (token: string, { rejectWithValue }) => {
      try {
          const response = await api.post('auth/google', {token});
          return response.data;
      }  catch (error: any) {
          return rejectWithValue(error.response?.data?.message || "Google login failed");
      }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                _id: "",
                fullName: "",
                email: "",
                gender: "",
            };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                throw action.payload;
            })
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
        builder.addCase(googleAuth.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        });
        builder.addCase(googleAuth.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;