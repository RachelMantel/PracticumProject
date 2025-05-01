import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import Swal from 'sweetalert2';
import { SongType } from '../../models/songType';

// const API_URL = 'https://localhost:7238/api/Song';
const API_URL ="https://tuneyourmood-server.onrender.com/api/Song";

// שליפת ה-TOKEN מ-localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type SongState = {
  songs: SongType[] | null;
  songsByFolder: { [key: number]: any[] }; // Store songs per folder
  loading: boolean;
  error: string | null;
};

// State ראשוני
const initialState: SongState = {
  songs: null,
  songsByFolder: {},
  loading: false,
  error: null,
};

// פעולה לקבלת שירים של משתמש
export const fetchUserSongs = createAsyncThunk(
  'Songs/fetchUserSongs',
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: getAuthHeader(),
      });      
      return response.data;
    } catch (e: any) {
      // Swal.fire('Error!', 'Failed to fetch songs.', 'error');
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// פעולה להוספת שיר
export const addSong = createAsyncThunk(
  'Songs/addSong',
  async (newSong: SongType, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, newSong, {
        headers: getAuthHeader(),
      });
      // Swal.fire('succes!', 'Failed to add song.', 'error');      
      return response.data; // מחזירים את השיר החדש שנוסף
    } catch (e: any) {
      // Swal.fire('Error!', 'Failed to add song.', 'error');
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// פעולה לעדכון שיר
export const updateSong = createAsyncThunk(
  'Songs/updateSong',
  async (song: SongType, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${song.id}`, song, {
        headers: getAuthHeader(),
      });
      // Swal.fire('Success!', 'Song has been updated!', 'success');
      return response.data; // מחזירים את השיר המעודכן
    } catch (e: any) {
      // Swal.fire('Error!', 'Failed to update song.', 'error');
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// פעולה למחיקת שיר
export const deleteSong = createAsyncThunk(
  'Songs/deleteSong',
  async (songId: number, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${songId}`, {
        headers: getAuthHeader(),
      });
      // Swal.fire('Success!', 'Song has been deleted!', 'success');
      return songId; // מחזירים את ה-ID של השיר שנמחק
    } catch (e: any) {
      // Swal.fire('Error!', 'Failed to delete song.', 'error');
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// 🎯 Slice של השירים
const SongSlice = createSlice({
  name: 'Songs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // חיפוש שירים
      .addCase(fetchUserSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload; // מעדכן את רשימת השירים
      })
      .addCase(fetchUserSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // הוספת שיר
      .addCase(addSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.loading = false;
        if (state.songs) {
          state.songs.push(action.payload); // הוספת השיר החדש לרשימה
        }
      })
      .addCase(addSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // עדכון שיר
      .addCase(updateSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        state.loading = false;
        if (state.songs) {
          const index = state.songs.findIndex(song => song.id === action.payload.id);
          if (index !== -1) {
            state.songs[index] = action.payload; // מעדכן את השיר ברשימה
          }
        }
      })
      .addCase(updateSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // מחיקת שיר
      .addCase(deleteSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.loading = false;
        if (state.songs) {
          state.songs = state.songs.filter(song => song.id !== action.payload); // מסנן את השיר שנמחק
        }
      })
      .addCase(deleteSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default SongSlice;
