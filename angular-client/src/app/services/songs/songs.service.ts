import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { Song } from "../../models/song.model"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class SongsService {

  private baseUrl = "https://localhost:7238/api/Song"
  public songs: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([])

  constructor(private http: HttpClient) {}

  getAllSongs() {
    this.http.get<Song[]>(this.baseUrl).subscribe((data) => this.songs.next(data))
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/${id}`)
  }

  addSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.baseUrl, song)
  }

  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.baseUrl}/${id}`, song)
  }

  deleteSong(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

  getUploadUrl(fileName: string, contentType: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/upload-url?fileName=${fileName}&contentType=${contentType}`)
  }

  getDownloadUrl(fileName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/download-url/${fileName}`)
  }

  getRandomSongByMood(mood: string): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/random-song-by-mood?mood=${mood}`)
  }

  getSongsByUserId(userId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/user/${userId}`)
  }

  loadSongsByUserId(userId: number) {
    this.http.get<Song[]>(`${this.baseUrl}/user/${userId}`).subscribe((data) => this.songs.next(data))
  }
}
