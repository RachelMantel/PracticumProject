import { Component, type OnInit, type OnDestroy } from "@angular/core"
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
import type { Subscription } from "rxjs"

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
  template: `
    @if(loading) {
      <div class="spinner-container">
        <mat-spinner color="accent"></mat-spinner>
      </div>
    } @else {
      <div class="songs-container">
        <div class="header-container">
          <h2 class="header">All Songs</h2>
        </div>
        
        <div class="songs-grid">
          @for(song of songs; track song.id) {
            <app-song-card
              [song]="song"
              (play)="playSong($event)"
              (delete)="deleteSong($event)"
              (edit)="updateSong($event)">
            </app-song-card>
          }
        </div>
      </div>
    }
  `,
  styleUrls: ["./songs.component.css"],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: Song[] = []
  loading = true
  private subscriptions: Subscription[] = []

  constructor(
    private songsService: SongsService,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadSongs()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  loadSongs(): void {
    const sub = this.songsService.getAllSongs().subscribe({
      next: (songs) => {
        this.songs = songs
        this.loading = false
      },
      error: (error) => {
        console.error("Error fetching songs:", error)
        this.loading = false
        this.snackBar.open("Error loading songs", "Close", { duration: 3000 })
      },
    })
    this.subscriptions.push(sub)
  }

  deleteSong(songId: number): void {
    if (confirm("Are you sure you want to delete this song?")) {
      const sub = this.songsService.deleteSong(songId).subscribe({
        next: () => {
          this.songs = this.songs.filter((song) => song.id !== songId)
          this.snackBar.open("Song deleted successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting song:", error)
          this.snackBar.open("Error deleting song", "Close", { duration: 3000 })
        },
      })
      this.subscriptions.push(sub)
    }
  }

  // בדיוק אותה פונקציה כמו ב-UserSongsComponent!
  playSong(song: Song): void {
    console.log("Playing song: " + JSON.stringify(song))
    // פשוט קורא ישירות לשירות בלי getDownloadUrl
    this.songsService.playSong(song)
  }

  updateSong(updatedSong: Song): void {
    const sub = this.songsService.updateSong(updatedSong.id || 0, updatedSong).subscribe({
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
    this.subscriptions.push(sub)
  }
}