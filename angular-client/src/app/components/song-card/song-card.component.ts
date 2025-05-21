import { Component, Input, Output, EventEmitter, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { Song } from "../../models/song.model"
import type { Subscription } from "rxjs"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatDividerModule } from "@angular/material/divider"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatMenuModule } from "@angular/material/menu"
import { MatSelectModule } from "@angular/material/select"
import { SongsService } from "../../services/songs/songs.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-song-card",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: "./song-card.component.html",
  styleUrls: ["./song-card.component.css"],
})
export class SongCardComponent implements OnInit, OnDestroy {
  @Input() song!: Song
  @Input() isInFolderView = false

  @Output() play = new EventEmitter<Song>()
  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<Song>()
  @Output() download = new EventEmitter<string>()

  isEditing = false
  isPlaying = false
  isDownloading = false
  editedSong: Song = {} as Song
  private currentPlayingSong: Song | null = null
  private subscriptions: Subscription[] = []

  moodChoices = ["happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]

  constructor(
    private songsService: SongsService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.resetEditedSong()
    this.subscriptions.push(
      this.songsService.isPlaying.subscribe((isPlaying) => this.updatePlayingState(isPlaying)),
      this.songsService.currentPlayingSong.subscribe((song) => {
        this.currentPlayingSong = song
        this.updatePlayingState(this.isPlaying)
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }

  resetEditedSong(): void {
    this.editedSong = { ...this.song }
  }

  updatePlayingState(isPlaying: boolean): void {
    this.isPlaying = this.currentPlayingSong?.id === this.song.id ? isPlaying : false
  }

  handlePlayClick(event: Event): void {
    event.stopPropagation()
    this.play.emit(this.song)
    try {
      this.songsService.playSong(this.song)
      // אין צורך להוסיף קוד כאן כי הסרוויס כבר מטפל בפתיחת המודל
    } catch (err) {
      this.snackBar.open("שגיאה בהפעלת השיר", "סגור", { duration: 3000 })
    }
  }

  handleEditClick(): void {
    this.isEditing = true
  }

  handleSaveEdit(): void {
    this.edit.emit(this.editedSong)
    this.isEditing = false
  }

  handleCancelEdit(): void {
    this.resetEditedSong()
    this.isEditing = false
  }

  handleDeleteClick(event: Event): void {
    event.stopPropagation()
    this.delete.emit(this.song.id)
  }

  handleDownloadClick(event: Event): void {
    event.stopPropagation()

    this.songsService.getDownloadUrl(this.song.filePath).subscribe({
      next: (url: string) => {
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", this.song.filePath)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      error: (err) => {
        console.error("Failed to get download URL", err)
        this.snackBar.open("ההורדה נכשלה", "סגור", { duration: 3000 })
      },
    })
  }

  navigateToSongDetails(event: Event): void {
    if (!this.isEditing) {
      event.stopPropagation()
      this.router.navigate(["/songs", this.song.id])
    }
  }

  generateColor(str: string): string {
    if (!str) return "hsl(340, 80%, 65%)"
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = ((hash % 30) + 340) % 360
    return `hsl(${h}, 80%, 65%)`
  }
}
