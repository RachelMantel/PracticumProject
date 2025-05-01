export class Song {
  constructor(
    public userId: number,
    public songName: string, // Changed from songName to match template usage
    public artist: string,
    public filePath: string,
    public mood: string, // Changed from mood_category to match template usage
    public folderId: number,
    public id?: number,
    public dateAdding: Date = new Date() // Added to match template usage
  ) {}
}