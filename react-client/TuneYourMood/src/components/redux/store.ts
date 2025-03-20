import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import SongSlice from "./SongSlice";
import UserSlice from "./UserSlice";
import FolderSlice from "./FolderSlice";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
        songs: SongSlice.reducer,
        users:UserSlice.reducer, 
        folders: FolderSlice.reducer,
    }
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store


