import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import  { HttpClient } from "@angular/common/http"
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
  private maxRetries = 1 

  private _isPlaying = new BehaviorSubject<boolean>(false)
  private _currentTime = new BehaviorSubject<number>(0)
  private _duration = new BehaviorSubject<number>(0)
  private _volume = new BehaviorSubject<number>(1)
  private _shouldOpenModal = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    if (this.isBrowser) {
      this.initAudioPlayer()
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
    })

    this.audioPlayer.addEventListener("canplay", () => {
      this.isAudioLoaded = true
    })

    this.audioPlayer.addEventListener("error", (e) => {
      console.error("SongsService - Audio error:", e)
      this.isAudioLoaded = false

      // אם יש שגיאה בטעינת האודיו, ננסה שוב פעם אחת בלבד
      if (this.retryCount < this.maxRetries && this._currentPlayingSong.value) {
        this.retryCount++
        setTimeout(() => {
          this.retryPlayback()
        }, 1000)
      } else {
        console.error("SongsService - Max retry attempts reached")
        this.retryCount = 0
      }
    })

    this.audioPlayer.volume = 1
  }

  private retryPlayback(): void {
    if (!this.isBrowser || !this.audioPlayer || !this._currentPlayingSong.value) return

    const song = this._currentPlayingSong.value

    try {
      this.audioPlayer.src = song.filePath
      this.audioPlayer.load()
      this.audioPlayer.play().catch((error) => {
        console.error("SongsService - Error in retry playback:", error)
      })
    } catch (error) {
      console.error("SongsService - Error in retry playback:", error)
    }
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

  get shouldOpenModal(): Observable<boolean> {
    return this._shouldOpenModal.asObservable()
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
    return this.http.get<string>(`/api/songs/download-url?fileName=${encodeURIComponent(fileName)}`)
  }

  getDownloadUrl1(song: Song): Observable<string> {
    return this.http.post<string>(`https://your-api-url/songs/download-url`, song)
  }

  private getFileNameFromPath(path: string): string {
    return path.split("/").pop() || "song.mp3"
  }

  playSong(songOrPath: Song | string): void {

    if (!this.isBrowser || !this.audioPlayer) {
      console.error("SongsService - Browser or audio player not available")
      return
    }

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


    if (!filePath || filePath.trim() === "") {
      console.error("SongsService - Invalid file path")
      return
    }

    const currentSong = this._currentPlayingSong.value
    const isSameSong = currentSong && currentSong.filePath === filePath

    if (isSameSong && this._isPlaying.value) {
      this.pauseSong()
      return
    } else if (isSameSong && !this._isPlaying.value) {
      this.resumeSong()
      this._shouldOpenModal.next(true)
      return
    }

    this._currentPlayingSong.next(song)
    this._shouldOpenModal.next(true)

    try {
      this.audioPlayer.src = filePath
      this.audioPlayer.load()

      setTimeout(() => {
        if (!this.audioPlayer) return

        this.audioPlayer.play().catch((error) => {
          console.error("SongsService - Error playing audio:", error)
        })
      }, 300)
    } catch (error) {
      console.error("SongsService - Error setting audio source:", error)
    }
  }

  pauseSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return
    this.audioPlayer.pause()
  }

  resumeSong(): void {
    if (!this.isBrowser || !this.audioPlayer) return

    this._shouldOpenModal.next(true)

    this.audioPlayer.play().catch((error) => {
      console.error("SongsService - Error resuming playback:", error)
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

  openPlayerModal(): void {
    if (this._currentPlayingSong.value) {
      this._shouldOpenModal.next(true)
    }
  }
}
