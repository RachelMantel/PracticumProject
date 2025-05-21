import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { SongCardComponent } from "../song-card/song-card.component"
import type { User } from "../../models/user.model"
import type { Song } from "../../models/song.model"
import { ActivatedRoute, Router } from "@angular/router"
import { UsersService } from "../../services/users/users.service"
import { SongsService } from "../../services/songs/songs.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-user-songs",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    SongCardComponent,
  ],
  templateUrl: "./user-songs.component.html",
  styleUrl: "./user-songs.component.css",
})
export class UserSongsComponent implements OnInit {
  user: User | null = null
  songs: Song[] = []
  loading = true
  loadingSongs = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private songsService: SongsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get("id"))
    if (userId) {
      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user
          this.loading = false

          this.songsService.getSongsByUserId(userId).subscribe({
            next: (songs) => {
              this.songs = songs
              this.loadingSongs = false
            },
            error: (error) => {
              console.error("Error fetching songs:", error)
              this.loadingSongs = false
              this.snackBar.open("Error loading songs", "Close", { duration: 3000 })
            },
          })
        },
        error: (error) => {
          console.error("Error fetching user:", error)
          this.loading = false
          this.snackBar.open("Error loading user", "Close", { duration: 3000 })
        },
      })
    }
  }

  goBack(): void {
    this.router.navigate(["/users", this.user?.id])
  }

  goToUsers(): void {
    this.router.navigate(["/users"])
  }

  playSong(song: Song): void {
    console.log(song+"++++");
    
    this.songsService.playSong(song)
  }

  downloadSong(filePath: string): void {
    this.songsService.downloadSong(filePath).subscribe({
      next: (response) => {
        if (response && response.downloadUrl) {
          const link = document.createElement("a")
          link.href = response.downloadUrl
          link.download = filePath.split("/").pop() || "song"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          this.snackBar.open("Failed to get download URL", "Close", { duration: 3000 })
        }
      },
      error: (error) => {
        console.error("Error getting download URL:", error)
        this.snackBar.open("Error downloading song", "Close", { duration: 3000 })
      },
    })
  }

  deleteSong(songId: number): void {
    if (confirm("Are you sure you want to delete this song?")) {
      this.songsService.deleteSong(songId).subscribe({
        next: () => {
          this.songs = this.songs.filter((song) => song.id !== songId)
          this.snackBar.open("Song deleted successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting song:", error)
          this.snackBar.open("Error deleting song", "Close", { duration: 3000 })
        },
      })
    }
  }

  updateSong(updatedSong: Song): void {
    this.songsService.updateSong(updatedSong.id || 0, updatedSong).subscribe({
      next: (song) => {
        const index = this.songs.findIndex((s) => s.id === song.id)
        if (index !== -1) {
          this.songs[index] = song
        }
        this.snackBar.open("Song updated successfully", "Close", { duration: 3000 })
      },
      error: (error) => {
        console.error("Error updating song:", error)
        this.snackBar.open("Error updating song", "Close", { duration: 3000 })
      },
    })
  }
}
