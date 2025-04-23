export class Song{
    constructor(
        public userId: number,
        public songName: string,
        public artist: string,
        public filePath: string,
        public mood_category: string,
        public folderId: number,
        public id?: number,
       ){
     }
}