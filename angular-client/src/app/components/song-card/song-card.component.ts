import { Component, Input, Output, EventEmitter, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatChipsModule } from "@angular/material/chips"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import type { Song } from "../../models/song.model"
import type { Folder } from "../../models/folder.model"
import type { Subscription } from "rxjs"
import { Router } from "@angular/router"
import { SongsService } from "../../services/songs/songs.service"
import { MatSnackBar } from "@angular/material/snack-bar"

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
  ],
  templateUrl: "./song-card.component.html",
  styleUrls: ["./song-card.component.css"],
})
export class SongCardComponent implements OnInit, OnDestroy {
  @Input() song!: Song
  @Input() folders: Folder[] = []
  @Input() isInFolderView = false

  @Output() play = new EventEmitter<Song>()
  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<Song>()
  @Output() download = new EventEmitter<string>()
  @Output() moveSong = new EventEmitter<{ song: Song; folderId: number }>()

  isEditing = false
  isPlaying = false
  editedSong: Song = {} as Song
  private subscriptions: Subscription[] = []
  private currentPlayingSong: Song | null = null
  isDownloading = false

  // Mood choices
  moodChoices = ["happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]

  constructor(
    public router: Router,
    private songsService: SongsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.resetEditedSong()

    // Subscribe to the player state to update UI
    this.subscriptions.push(
      this.songsService.isPlaying.subscribe((isPlaying) => {
        // Update playing state if this is the current song
        this.updatePlayingState(isPlaying)
      }),

      this.songsService.currentPlayingSong.subscribe((song) => {
        this.currentPlayingSong = song
        // Update playing state when current song changes
        this.updatePlayingState(this.isPlaying)
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  private updatePlayingState(isPlaying: boolean) {
    // Only update if this is the current song
    if (this.currentPlayingSong?.id === this.song.id) {
      this.isPlaying = isPlaying
    } else {
      this.isPlaying = false
    }
  }

  resetEditedSong() {
    this.editedSong = { ...this.song }
  }

  // Generate a color based on the song name
  generateColor(str: string): string {
    if (!str) return "hsl(340, 80%, 65%)" // Default color if no string

    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generate colors in the pink/orange range
    const h = ((hash % 30) + 340) % 360 // Hue between 340-370 (pinks/reds/oranges)
    return `hsl(${h}, 80%, 65%)`
  }

  handlePlayClick(event: Event) {
    event.stopPropagation()
    this.play.emit(this.song)

    // Direct call to service for immediate feedback
    try {
      this.songsService.playSong(this.song)
    } catch (error) {
      console.error("Error playing song:", error)
      this.snackBar.open("שגיאה בהשמעת השיר", "סגור", { duration: 3000 })
    }
  }

  handleEditClick() {
    this.isEditing = true
  }

  handleSaveEdit() {
    this.edit.emit(this.editedSong)
    this.isEditing = false
  }

  handleCancelEdit() {
    this.resetEditedSong()
    this.isEditing = false
  }

  handleDeleteClick(event: Event) {
    event.stopPropagation()
    this.delete.emit(this.song.id)
  }

  handleDownloadClick(event: Event) {
    event.stopPropagation()

    if (this.isDownloading) return

    this.isDownloading = true

    // Emit for parent component handling
    this.download.emit(this.song.filePath)

    // Also handle download directly for immediate feedback
    this.songsService.downloadSong(this.song.filePath).subscribe({
      next: (response) => {
        this.isDownloading = false
        if (response && response.error) {
          this.snackBar.open(response.message || "בעיה בהורדה, בדוק את הקונסול", "סגור", { duration: 3000 })
        } else if (response && response.success) {
          this.snackBar.open("השיר הורד בהצלחה", "סגור", { duration: 3000 })
        }
      },
      error: (error) => {
        this.isDownloading = false
        console.error("Error downloading song:", error)
        this.snackBar.open("שגיאה בהורדת השיר", "סגור", { duration: 3000 })
      },
    })
  }

  handleMoveSong(folderId: number) {
    this.moveSong.emit({ song: this.song, folderId })
  }

  navigateToSongDetails(event: Event) {
    if (!this.isEditing) {
      event.stopPropagation()
      this.router.navigate(["/songs", this.song.id])
    }
  }
}
