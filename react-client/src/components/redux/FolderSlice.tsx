import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import Swal from 'sweetalert2';
import { FolderType } from '../../models/folderType';
import { SongType } from '../../models/songType';

const API_URL = 'https://localhost:7238/api/Folder';
// const API_URL ="https://tuneyourmood-server.onrender.com/api/Folder"


export const selectSongsByFolder = (folderId: number) => (state: any) => state.folders.songsByFolder[folderId] || [];
// Function to get authorization headers
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export type FolderState = {
    folders: FolderType[] | null;
    songsByFolder: { [folderId: number]: SongType[] }; // עדכון: שירים ממוינים לפי תיקיות
    loading: boolean;
    error: string | null;
};

// Initial state
const initialState: FolderState = {
    folders: [], // רשימת התיקיות
    songsByFolder: {}, // מפת תיקיות -> שירים
    loading: false,
    error: null,
};

// Fetch folders for the logged-in user
export const fetchUserFolders = createAsyncThunk(
    'Folders/fetchUserFolders',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/user`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (e: any) {
            // Swal.fire('Error!', 'Failed to fetch folders.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Add a new folder
export const addFolder = createAsyncThunk(
    'Folders/addFolder',
    async (newFolder: FolderType, thunkAPI) => {
        try {
            const response = await axios.post(API_URL, newFolder, {
                headers: getAuthHeader(),
            });
            // Swal.fire('Success!', 'Folder has been created!', 'success');
            return response.data;
        } catch (e: any) {
            // Swal.fire('Error!', 'Failed to create folder.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Update a folder
export const updateFolder = createAsyncThunk(
    'Folders/updateFolder',
    async (folder: FolderType, thunkAPI) => {
        try {
            const response = await axios.put(`${API_URL}/${folder.id}`, folder, {
                headers: getAuthHeader(),
            });
            // Swal.fire('Success!', 'Folder has been updated!', 'success');
            return response.data;
        } catch (e: any) {
            // Swal.fire('Error!', 'Failed to update folder.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Delete a folder
export const deleteFolder = createAsyncThunk(
    'Folders/deleteFolder',
    async (folderId: number, thunkAPI) => {
        try {
            await axios.delete(`${API_URL}/${folderId}`, {
                headers: getAuthHeader(),
            });
            // Swal.fire('Success!', 'Folder has been deleted!', 'success');
            return folderId;
        } catch (e: any) {
            // Swal.fire('Error!', 'Failed to delete folder.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Fetch songs by folder ID
export const fetchSongsByFolder = createAsyncThunk(
    'Folders/fetchSongsByFolder',
    async (folderId: number, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/songs/${folderId}`, {
                headers: getAuthHeader(),
            });
            return { folderId, songs: response.data }; // מחזירים גם את ה-folderId לצד השירים
        } catch (e: any) {
            // Swal.fire('Error!', 'Failed to fetch songs for folder.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Add song to a specific folder
export const addSongToFolder = createAsyncThunk(
    'Folders/addSongToFolder',
    async ({ folderId, song }: { folderId: number, song: SongType }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/songs/${folderId}`, song, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// Delete song from a specific folder
export const deleteSongFromFolder = createAsyncThunk(
    'Folders/deleteSongFromFolder',
    async ({ folderId, songId }: { folderId: number, songId: number }, thunkAPI) => {
        try {
             await axios.delete(`${API_URL}/songs/${folderId}/${songId}`, {
                headers: getAuthHeader(),
            });
            return { folderId, songId }; // נחזיר את המידע שצריך לעדכן את ה-state
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);


const FolderSlice = createSlice({
    name: 'Folders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user folders
            .addCase(fetchUserFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = action.payload;
            })
            .addCase(fetchUserFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch songs by folder
            .addCase(fetchSongsByFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsByFolder.fulfilled, (state, action) => {
                state.loading = false;
                const { folderId, songs } = action.payload;
                state.songsByFolder[folderId] = songs;
            })
            .addCase(fetchSongsByFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update folder
            .addCase(updateFolder.fulfilled, (state, action) => {
                if (state.folders) {
                    state.folders = state.folders.map(folder =>
                        folder.id === action.payload.id ? action.payload : folder
                    );
                }
            })

            // Delete folder
            .addCase(deleteFolder.fulfilled, (state, action) => {
                if (state.folders) {
                    state.folders = state.folders.filter(folder => folder.id !== action.payload);
                }
            })

            // Add song to folder
            .addCase(addSongToFolder.fulfilled, (state, action) => {
                const { folderId, song } = action.payload;
                if (!state.songsByFolder[folderId]) {
                    state.songsByFolder[folderId] = [];
                }
                state.songsByFolder[folderId].push(song);
            })
            .addCase(deleteSongFromFolder.pending, (state) => {
                state.loading = true;
            })
            // סיום פעולה בהצלחה
            .addCase(deleteSongFromFolder.fulfilled, (state, action) => {
                state.loading = false;
                // עדכון המידע על ידי הסרת השיר מתוך תיקיה
                const { folderId, songId } = action.payload;
                const folder = state.folders?.find((folder) => folder.id === folderId);
                if (folder) {
                    folder.songs = folder.songs.filter((song) => song.id !== songId);
                }
            })
    },
});


export default FolderSlice;
