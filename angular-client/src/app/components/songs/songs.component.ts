import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { SongCardComponent } from "../song-card/song-card.component"
import type { Song } from "../../models/song.model"
import { SongsService } from "../../services/songs/songs.service"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-songs",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SongCardComponent,
  ],
  templateUrl: "./songs.component.html",
  styleUrl: "./songs.component.css",
})
export class SongsComponent implements OnInit {
  songs: Song[] = []
  loading = true

  constructor(
    private songService: SongsService,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.songService.getAllSongs().subscribe({
      next: (songs) => {
        this.songs = songs
        this.loading = false
      },
      error: (error) => {
        console.error("Error fetching songs:", error)
        this.loading = false
        this.snackBar.open("שגיאה בטעינת השירים", "סגור", { duration: 3000 })
      },
    })
  }

  deleteSong(songId: number): void {
    if (confirm("האם אתה בטוח שברצונך למחוק שיר זה?")) {
      this.songService.deleteSong(songId).subscribe({
        next: () => {
          this.songs = this.songs.filter((song) => song.id !== songId)
          this.snackBar.open("השיר נמחק בהצלחה", "סגור", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting song:", error)
          this.snackBar.open("שגיאה במחיקת השיר", "סגור", { duration: 3000 })
        },
      })
    }
  }

  playSong(song: Song): void {
    try {
      this.songService.playSong(song)
    } catch (error) {
      console.error("Error playing song:", error)
      this.snackBar.open("שגיאה בהשמעת השיר", "סגור", { duration: 3000 })
    }
  }

  downloadSong(filePath: string): void {
    this.songService.downloadSong(filePath).subscribe({
      next: (response) => {
        if (response && response.error) {
          this.snackBar.open(response.message || "בעיה בהורדה, בדוק את הקונסול", "סגור", { duration: 3000 })
        } else if (response && response.success) {
          this.snackBar.open("השיר הורד בהצלחה", "סגור", { duration: 3000 })
        }
      },
      error: (error) => {
        console.error("Error downloading song:", error)
        this.snackBar.open("שגיאה בהורדת השיר", "סגור", { duration: 3000 })
      },
    })
  }

  updateSong(updatedSong: Song): void {
    this.songService.updateSong(updatedSong.id || 0, updatedSong).subscribe({
      next: (song) => {
        const index = this.songs.findIndex((s) => s.id === song.id)
        if (index !== -1) {
          this.songs[index] = song
        }
        this.snackBar.open("השיר עודכן בהצלחה", "סגור", { duration: 3000 })
      },
      error: (error) => {
        console.error("Error updating song:", error)
        this.snackBar.open("שגיאה בעדכון השיר", "סגור", { duration: 3000 })
      },
    })
  }
}
