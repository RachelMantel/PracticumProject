import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { catchError, tap } from "rxjs/operators"
import type { Song } from "../../models/song.model"

@Injectable({
  providedIn: "root",
})
export class SongsService {
  private apiUrl = "https://tuneyourmood-server.onrender.com/api/Song/"
  private _songs = new BehaviorSubject<Song[]>([])
  private audioPlayer: HTMLAudioElement | null = null
  private _currentPlayingSong = new BehaviorSubject<Song | null>(null)
  private isBrowser: boolean

  // Audio player state
  private _isPlaying = new BehaviorSubject<boolean>(false)
  private _currentTime = new BehaviorSubject<number>(0)
  private _duration = new BehaviorSubject<number>(0)
  private _volume = new BehaviorSubject<number>(1)

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId)

    // Only initialize audio player if in browser environment
    if (this.isBrowser) {
      this.initAudioPlayer()
    }
  }

  private initAudioPlayer(): void {
    this.audioPlayer = new Audio()

    // Set up audio player event listeners
    this.audioPlayer.addEventListener("timeupdate", () => {
      this._currentTime.next(this.audioPlayer!.currentTime)
    })

    this.audioPlayer.addEventListener("durationchange", () => {
      this._duration.next(this.audioPlayer!.duration)
    })

    this.audioPlayer.addEventListener("play", () => {
      this._isPlaying.next(true)
    })

    this.audioPlayer.addEventListener("pause", () => {
      this._isPlaying.next(false)
    })

    this.audioPlayer.addEventListener("ended", () => {
      this._isPlaying.next(false)
      this._currentTime.next(0)
    })

    // Initialize volume
    this.audioPlayer.volume = 1
  }

  get songs(): Observable<Song[]> {
    return this._songs.asObservable()
  }

  get isPlaying(): Observable<boolean> {
    return this._isPlaying.asObservable()
  }

  get currentTime(): Observable<number> {
    return this._currentTime.asObservable()
  }

  get duration(): Observable<number> {
    return this._duration.asObservable()
  }

  get volume(): Observable<number> {
    return this._volume.asObservable()
  }

  get currentPlayingSong(): Observable<Song | null> {
    return this._currentPlayingSong.asObservable()
  }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl).pipe(
      tap((songs) => this._songs.next(songs)),
      catchError((error) => {
        console.error("Error fetching songs:", error)
        return of([])
      }),
    )
  }

  getSongsByUserId(userId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}user/${userId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching songs for user ${userId}:`, error)
        return of([])
      }),
    )
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}${id}`)
  }

  addSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, song)
  }

  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}${id}`, song)
  }

  deleteSong(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`)
  }

  getUploadUrl(fileName: string, contentType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}upload-url`, {
      params: { fileName, contentType },
    })
  }

  getDownloadUrl(fileName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}download-url/${encodeURIComponent(fileName)}`)
  }

  // Fixed download function that works directly with URLs
  downloadSong(filePath: string): Observable<any> {
    if (!this.isBrowser) return of({ success: false })

    // Extract filename from filepath
    const fileName = filePath.split("/").pop() || ""

    // First try to get a download URL from the API
    return this.getDownloadUrl(fileName).pipe(
      tap((response) => {
        if (response && response.downloadUrl) {
          // Create a temporary anchor element to trigger download
          const link = document.createElement("a")
          link.href = response.downloadUrl
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }),
      catchError((error) => {
        console.error("Error getting download URL:", error)

        // Fallback: try direct download with the original URL
        try {
          const link = document.createElement("a")
          link.href = filePath
          link.download = fileName
          link.target = "_blank" // Open in new tab if direct download fails
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (directError) {
          console.error("Error with direct download:", directError)
        }

        // Return an error object that components can handle
        return of({
          error: true,
          message: "Error downloading song. Attempted fallback download.",
        })
      }),
    )
  }

  // Enhanced audio player methods that accept either a Song object or a file path string
  playSong(songOrPath: Song | string): void {
    if (!this.isBrowser || !this.audioPlayer) return

    let song: Song
    let filePath: string

    // Handle both Song object and string path
    if (typeof songOrPath === "string") {
      filePath = songOrPath
      // Create a minimal song object if only path is provided
      song = {
        id: 0,
        userId:0,
        folderId:0,
        dateAdding:new Date(),
        songName: filePath.split("/").pop() || "Unknown Song",
        artist: "Unknown Artist",
        filePath: filePath,
        mood_category: "unknown",
      }
    } else {
      song = songOrPath
      filePath = song.filePath
    }

    console.log("Playing song:", song)
    console.log("File path:", filePath)

    // Check if it's the same song that's currently playing
    if (this._currentPlayingSong.value && this._currentPlayingSong.value.filePath === filePath) {
      // Toggle play/pause if it's the same song
      if (this.audioPlayer.paused) {
        this.audioPlayer.play().catch((error) => {
          console.error("Error playing audio:", error)
          alert("Failed to play the song. The file might be unavailable or in an unsupported format.")
        })
      } else {
        this.audioPlayer.pause()
      }
    } else {
      // Load and play new song
      this._currentPlayingSong.next(song)

      // Make sure the URL is properly encoded
      this.audioPlayer.src = filePath
      this.audioPlayer.load()
      this.audioPlayer.play().catch((error) => {
        console.error("Error playing audio:", error)
        alert("Failed to play the song. The file might be unavailable or in an unsupported format.")
      })
    }
  }

  pauseSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.pause()
  }

  resumeSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.play()
  }

  stopSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.pause()
    this.audioPlayer.currentTime = 0
    this._currentTime.next(0)
  }

  seekTo(time: number): void {
    if (!this.isBrowser || !this.audioPlayer || !this.audioPlayer.src) return
    this.audioPlayer.currentTime = time
  }

  setVolume(volume: number): void {
    if (!this.isBrowser || !this.audioPlayer) return
    // Volume should be between 0 and 1
    const newVolume = Math.max(0, Math.min(1, volume))
    this.audioPlayer.volume = newVolume
    this._volume.next(newVolume)
  }

  addSongToFolder(songId: number, folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}add-to-folder`, { songId, folderId })
  }

  removeSongFromFolder(songId: number, folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}remove-from-folder`, { songId, folderId })
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    if (!this.isBrowser) return new HttpHeaders()

    const token = localStorage.getItem("token")
    return new HttpHeaders({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    })
  }
}
