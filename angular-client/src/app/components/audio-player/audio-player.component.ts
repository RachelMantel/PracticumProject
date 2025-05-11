import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatSliderModule } from "@angular/material/slider"
import { MatTooltipModule } from "@angular/material/tooltip"
import type { Subscription } from "rxjs"
import type { Song } from "../../models/song.model"
import { SongsService } from "../../services/songs/songs.service"

@Component({
  selector: "app-audio-player",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSliderModule, MatTooltipModule],
  templateUrl: "./audio-player.component.html",
  styleUrls: ["./audio-player.component.css"],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  isPlaying = false
  currentTime = 0
  duration = 0
  volume = 1
  currentSong: Song | null = null

  private subscriptions: Subscription[] = []

  constructor(public songsService: SongsService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.songsService.isPlaying.subscribe((isPlaying) => {
        this.isPlaying = isPlaying
      }),

      this.songsService.currentTime.subscribe((time) => {
        this.currentTime = time
      }),

      this.songsService.duration.subscribe((duration) => {
        this.duration = duration
      }),

      this.songsService.volume.subscribe((volume) => {
        this.volume = volume
      }),

      this.songsService.currentPlayingSong.subscribe((song) => {
        this.currentSong = song
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.songsService.pauseSong()
    } else {
      this.songsService.resumeSong()
    }
  }

  stop(): void {
    this.songsService.stopSong()
  }

  seek(event: any): void {
    // Handle both older and newer Angular Material slider event formats
    const value = event.value !== undefined ? event.value : event
    if (value !== undefined) {
      this.songsService.seekTo(value)
    }
  }

  setVolume(event: any): void {
    // Handle both older and newer Angular Material slider event formats
    const value = event.value !== undefined ? event.value : event
    if (value !== undefined) {
      this.songsService.setVolume(value)
    }
  }

  formatTime(time: number): string {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }
}
