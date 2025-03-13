import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";


const API_URL = "https://localhost:7238/api/Auth";
// const API_URL = "https://localhost:5277/api/Auth";


// מבנה הנתונים של המשתמש
export type AuthState = {
  token: string | null;
  loading: boolean;
  error: string | null;
};


const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};


export const registerUser = createAsyncThunk(
  "register",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {name, email, password });
      localStorage.setItem("token", JSON.stringify(response.data.token));
      Swal.fire("Success!", "Your account has been created!", "success");
      return response.data;
    } catch (e: any) {
      Swal.fire("Error!", "Registration failed. Please try again.", "error");
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "login",
  async (
    { userNameOrEmail, password }: { userNameOrEmail: string; password: string },
    thunkAPI
  ) => {
    try {
      console.log(1)
      const response = await axios.post(`${API_URL}/login`, { userNameOrEmail, password });
      localStorage.setItem("token", JSON.stringify(response.data.token));
      Swal.fire("Success!", "You have successfully logged in!", "success");
      return response.data;
    } catch (e: any) {
      Swal.fire("Error!", "Login failed. Please check your credentials.", "error");
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
});

// **Reducer עם Slice**
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
        state.token = action.payload;
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
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
      });
  },
});

export default AuthSlice;

