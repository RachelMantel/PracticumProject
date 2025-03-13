export type SongType = {
    id?: number;
    dateAdding: Date;
    userId: number;
    songName: string;
    artist: string;
    playlistName?: string; 
    filePath: string;
    moodCategory: string;
}