import { SongType } from "./songType";

export type FolderType = {
    id?: number;
    parentId: number;
    folderName:string;
    userId: number;
    songs: SongType[];
}