import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { catchError, tap, map } from "rxjs/operators"
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
  private isAudioLoaded = false
  private retryCount = 0
  private maxRetries = 2

  // Audio player state - מוגדרים כ-BehaviorSubject כדי לאפשר שימוש ב-next
  private _isPlaying = new BehaviorSubject<boolean>(false)
  private _currentTime = new BehaviorSubject<number>(0)
  private _duration = new BehaviorSubject<number>(0)
  private _volume = new BehaviorSubject<number>(1);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initAudioPlayer();
    }
  }

  private initAudioPlayer(): void {
    this.audioPlayer = new Audio()

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

    this.audioPlayer.addEventListener("loadeddata", () => {
      this.isAudioLoaded = true
      console.log("Audio loaded successfully")
    })

    this.audioPlayer.addEventListener("canplay", () => {
      this.isAudioLoaded = true
      console.log("Audio can play now")
    })

    this.audioPlayer.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      this.isAudioLoaded = false
      
      // אם יש שגיאה בטעינת האודיו, ננסה שוב אם לא הגענו למספר הניסיונות המקסימלי
      if (this.retryCount < this.maxRetries && this._currentPlayingSong.value) {
        this.retryCount++
        console.log(`Retrying playback (attempt ${this.retryCount})...`)
        setTimeout(() => {
          this.retryPlayback()
        }, 1000)
      } else {
        this.retryCount = 0
      }
    })

    this.audioPlayer.volume = 1
  }

  private retryPlayback(): void {
    if (!this.isBrowser || !this.audioPlayer || !this._currentPlayingSong.value) return
    
    const song = this._currentPlayingSong.value
    console.log("Retrying playback for:", song.songName)
    
    this.audioPlayer.src = song.filePath
    this.audioPlayer.load()
    this.audioPlayer.play().catch((error) => {
      console.error("Error in retry playback:", error)
      if (this.retryCount >= this.maxRetries) {
        alert("Failed to play the song after multiple attempts. The file might be unavailable or in an unsupported format.")
        this.retryCount = 0
      }
    })
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

  getDownloadUrl(fileName: string): Observable<string> {
    return this.http.get<string>(`/api/songs/download-url?fileName=${encodeURIComponent(fileName)}`);
  }  

  downloadSong(filePath: string): Observable<any> {
    return this.http.get(filePath, { responseType: 'blob' }).pipe(
      tap((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getFileNameFromPath(filePath);
        a.click();
        window.URL.revokeObjectURL(url);
      }),
      map(() => ({ success: true })),
      catchError((err) => {
        console.error('Download error:', err);
        return of({ success: false, error: true, message: 'Download failed' });
      })
    );
  }
  
  private getFileNameFromPath(path: string): string {
    return path.split('/').pop() || 'song.mp3';
  }
  

  playSong(songOrPath: Song | string): void {
    if (!this.isBrowser || !this.audioPlayer) return

    // איפוס מונה הניסיונות בכל פעם שמנגנים שיר חדש
    this.retryCount = 0
    this.isAudioLoaded = false

    let song: Song
    let filePath: string

    if (typeof songOrPath === "string") {
      filePath = songOrPath
      song = {
        id: 0,
        userId: 0,
        folderId: 0,
        dateAdding: new Date(),
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

    // בדיקה אם זה אותו שיר שכבר מנוגן
    const currentSong = this._currentPlayingSong.value
    const isSameSong = currentSong && currentSong.filePath === filePath

    if (isSameSong && this._isPlaying.value) {
      // אם זה אותו שיר וכבר מנגן, נעצור אותו
      this.pauseSong()
      return
    } else if (isSameSong && !this._isPlaying.value) {
      // אם זה אותו שיר אבל הוא מושהה, נמשיך את הנגינה
      this.resumeSong()
      return
    }

    // Always update the current playing song
    this._currentPlayingSong.next(song)

    // Always set a new source and play
    this.audioPlayer.src = filePath
    this.audioPlayer.load()
    
    // נוסיף השהייה קצרה לפני הנגינה כדי לתת לדפדפן זמן לטעון את הקובץ
    setTimeout(() => {
      this.audioPlayer!.play().catch((error) => {
        console.error("Error playing audio:", error)
        
        // אם יש שגיאה, ננסה שוב אחרי השהייה קצרה
        setTimeout(() => {
          if (!this.isAudioLoaded && this.retryCount < this.maxRetries) {
            this.retryCount++
            console.log(`Auto-retrying playback (attempt ${this.retryCount})...`)
            this.audioPlayer!.play().catch((retryError) => {
              console.error("Error in auto-retry playback:", retryError)
              alert("Failed to play the song. The file might be unavailable or in an unsupported format.")
              this.retryCount = 0
            })
          }
        }, 1000)
      })
    }, 300)
  }

  pauseSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.pause()
  }

  resumeSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.play().catch(error => {
      console.error("Error resuming playback:", error)
      
      // אם יש שגיאה בהמשך הנגינה, ננסה לטעון מחדש את השיר
      if (this._currentPlayingSong.value) {
        this.retryCount = 0
        this.playSong(this._currentPlayingSong.value)
      }
    })
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

  private getAuthHeaders(): HttpHeaders {
    if (!this.isBrowser) return new HttpHeaders()

    const token = localStorage.getItem("token")

    return new HttpHeaders({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    })
  }
}