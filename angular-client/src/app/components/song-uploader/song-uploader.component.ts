import { Component, EventEmitter, Output, inject, PLATFORM_ID, Inject, type OnInit } from "@angular/core"
import { CommonModule, isPlatformBrowser } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { animate, style, transition, trigger } from "@angular/animations"
import type { Song } from "../../models/song.model"
import { SongsService } from "../../services/songs/songs.service"
import { AuthService } from "../../services/auth/auth.service"
import { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-song-uploader",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: "./song-uploader.component.html",
  styleUrls: ["./song-uploader.component.scss"],
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ transform: "translateY(50px)", opacity: 0 }),
        animate("500ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("400ms ease-out", style({ opacity: 1 }))]),
    ]),
    trigger("growIn", [
      transition(":enter", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("500ms ease-out", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class SongUploaderComponent implements OnInit {
  @Output() uploadSuccess = new EventEmitter<void>()

  private http = inject(HttpClient)
  private songService = inject(SongsService)
  private authService = inject(AuthService)
  private snackBar = inject(MatSnackBar)
  private isBrowser: boolean

  file: File | null = null
  progress = 0
  uploading = false
  uploadComplete = false
  dragActive = false

  moodChoices = ["natural", "happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]

  songDetails: Song = {
    songName: "",
    artist: "",
    filePath: "",
    dateAdding: new Date(),
    mood_category: "happy",
    userId: 0,
    folderId: -1,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getUserId()
    }
  }

  getUserId(): void {
    try {
      const token = this.authService.getToken()
      if (token) {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )

        const payload = JSON.parse(jsonPayload)
        if (payload && payload.nameid) {
          this.songDetails.userId = Number.parseInt(payload.nameid, 10)
        }
      }
    } catch (error) {
      console.error("Error getting user ID from token:", error)
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const selectedFile = input.files?.[0]
    if (selectedFile) {
      this.setFile(selectedFile)
    }
  }

  setFile(selectedFile: File) {
    this.file = selectedFile
    const songName = selectedFile.name.replace(/\.[^/.]+$/, "")
    this.songDetails = { ...this.songDetails, songName }
  }

  handleDrag(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === "dragenter" || event.type === "dragover") {
      this.dragActive = true
    } else if (event.type === "dragleave") {
      this.dragActive = false
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.dragActive = false

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0]
      this.setFile(droppedFile)
    }
  }

  handleUpload() {
    if (!this.file) {
      this.snackBar.open("Please select a file to upload", "Close", { duration: 3000 })
      return
    }

    if (!this.songDetails.artist) {
      this.snackBar.open("Please enter an artist name", "Close", { duration: 3000 })
      return
    }

    this.uploading = true
    this.progress = 0

    // Create FormData
    const formData = new FormData()
    formData.append("file", this.file)

    // Upload the file directly
    const uploadUrl = "https://tuneyourmood-server.onrender.com/api/Song/upload"

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.progress < 90) {
        this.progress += 5
      }
    }, 300)

    this.http.post<{ filePath: string }>(uploadUrl, formData).subscribe({
      next: (response) => {
        clearInterval(progressInterval)
        this.progress = 95

        // Create song record with the file path
        const newSong: Song = {
          ...this.songDetails,
          filePath: response.filePath,
        }

        this.songService.addSong(newSong).subscribe({
          next: () => {
            this.progress = 100
            this.uploadComplete = true
            this.uploading = false
            this.snackBar.open("Song uploaded successfully!", "Close", { duration: 3000 })

            // Refresh songs list
            this.songService.getAllSongs().subscribe()

            // Emit success event
            setTimeout(() => {
              this.uploadSuccess.emit()
            }, 1500)
          },
          error: (error) => {
            console.error("Error adding song record:", error)
            this.snackBar.open("Error adding song record", "Close", { duration: 3000 })
            this.uploading = false
          },
        })
      },
      error: (error) => {
        clearInterval(progressInterval)
        console.error("Error uploading file:", error)
        this.snackBar.open("Error uploading file", "Close", { duration: 3000 })
        this.uploading = false
      },
    })
  }
}
