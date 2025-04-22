import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { UserType } from "../../models/userType";

const API_URL = "https://localhost:7238/api/User";
// const API_URL ="https://tuneyourmood-server.onrender.com/api/User";


export type UsersState = {
  users: UserType[] | null;
  user: UserType | null;
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: null,
  user: null,
  loading: false,
  error: null,
};

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: { userId: number; name: string; email: string; password?: string }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${userData.userId}`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedUser = response.data; // הנתונים המעודכנים מהשרת

      console.log("Updated user data:", JSON.stringify(updatedUser, null, 2));

      localStorage.setItem("user", JSON.stringify(updatedUser));
      thunkAPI.dispatch({ type: "auth/setUser", payload: updatedUser });

      return updatedUser;

      
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);



// פעולה למשיכת פרטי המשתמש
export const getUser = createAsyncThunk(
  "users/getUser",
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data; // החזרת פרטי המשתמש
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// Slice
const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // עדכון פרטי המשתמש
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // עדכון פרטי המשתמש
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default UserSlice;
