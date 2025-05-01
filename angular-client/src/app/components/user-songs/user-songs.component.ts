import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import type { User } from "../../models/user.model"
import type { Song } from "../../models/song.model"
import { ActivatedRoute, Router } from "@angular/router"
import { UsersService } from "../../services/users/users.service"
import { SongsService } from "../../services/songs/songs.service"
import { Observable } from "rxjs"

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
  ],
  templateUrl: "./user-songs.component.html",
  styleUrl: "./user-songs.component.css",
})
export class UserSongsComponent implements OnInit {
  user: User | null = null
  songs: Song[] = []
  songs$: Observable<Song[]> = this.songsService.songs // Reference to the BehaviorSubject in the service
  loading = true
  loadingSongs = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private songsService: SongsService,
  ) {}

  ngOnInit(): void {
    // Load all songs (if needed)
    this.songsService.getAllSongs()
    
    const userId = Number(this.route.snapshot.paramMap.get("id"))
    if (userId) {
      // Load user details
      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user
          this.loading = false

          // Load user's songs
          this.songsService.getSongsByUserId(userId).subscribe({
            next: (songs) => {
              this.songs = songs
              this.loadingSongs = false
            },
            error: (error) => {
              console.error("Error fetching songs:", error)
              this.loadingSongs = false
            },
          })
        },
        error: (error) => {
          console.error("Error fetching user:", error)
          this.loading = false
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

  getDownloadUrl(fileName: string): void {
    this.songsService.getDownloadUrl(fileName).subscribe({
      next: (response) => {
        window.open(response.downloadUrl, "_blank")
      },
      error: (error) => {
        console.error("Error getting download URL:", error)
      },
    })
  }
}