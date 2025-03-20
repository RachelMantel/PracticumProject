import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FolderType } from '../../models/folderType';

const API_URL = 'https://localhost:7238/api/Folder';

// Function to get authorization headers
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export type FolderState = {
    folders: FolderType[] | null;
 
    loading: boolean;
    error: string | null;
};

// Initial state
const initialState: FolderState = {
    folders: null,

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
            Swal.fire('Error!', 'Failed to fetch folders.', 'error');
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
            Swal.fire('Success!', 'Folder has been created!', 'success');
            return response.data;
        } catch (e: any) {
            Swal.fire('Error!', 'Failed to create folder.', 'error');
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
            Swal.fire('Success!', 'Folder has been updated!', 'success');
            return response.data;
        } catch (e: any) {
            Swal.fire('Error!', 'Failed to update folder.', 'error');
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
            Swal.fire('Success!', 'Folder has been deleted!', 'success');
            return folderId;
        } catch (e: any) {
            Swal.fire('Error!', 'Failed to delete folder.', 'error');
            return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);



// 🎯 Create the Folder Slice
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
            // Add folder
            .addCase(addFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFolder.fulfilled, (state, action) => {
                state.loading = false;
                if (state.folders) {
                    state.folders.push(action.payload);
                }
            })
            .addCase(addFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update folder
            .addCase(updateFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFolder.fulfilled, (state, action) => {
                state.loading = false;
                if (state.folders) {
                    const index = state.folders.findIndex(folder => folder.id === action.payload.id);
                    if (index !== -1) {
                        state.folders[index] = action.payload;
                    }
                }
            })
            .addCase(updateFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete folder
            .addCase(deleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                state.loading = false;
                if (state.folders) {
                    state.folders = state.folders.filter(folder => folder.id !== action.payload);
                }
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })



    },
});

export default FolderSlice;
