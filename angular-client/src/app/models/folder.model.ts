
import { Song } from "./song.model";

export class Folder {
    constructor(
    public parentId: number, 
    public folderName: string,
    public userId: number,
    public songs: Song[],
    public id?: number,
    ) {}
  }