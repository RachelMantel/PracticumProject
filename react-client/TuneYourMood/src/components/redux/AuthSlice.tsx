import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { UserType } from "../../models/userType";

// API URL
const API_URL = "https://localhost:7238/api/Auth";

// Validate email format
const validateEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

export type AuthState = {
  token: string | null;
  user: UserType | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      // Validate the email format
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      const { token, user } = response.data;

      // Save to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire("Success!", "Your account has been created!", "success");
      return { token, user };
    } catch (e: any) {
      Swal.fire("Error!", e.message || "Registration failed. Please try again.", "error");
      return thunkAPI.rejectWithValue(e.message || e.response?.data?.message || e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ userNameOrEmail, password }: { userNameOrEmail: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { userNameOrEmail, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

// 🎯 Auth Slice
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export default AuthSlice;

