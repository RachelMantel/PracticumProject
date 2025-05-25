import { Component, type OnInit, type OnDestroy, HostListener, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatSliderModule } from "@angular/material/slider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatRippleModule } from "@angular/material/core"
import type { Subscription } from "rxjs"
import { trigger, transition, style, animate } from "@angular/animations"
import type { Song } from "../../models/song.model"
import { SongsService } from "../../services/songs/songs.service"

@Component({
  selector: "app-audio-player",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSliderModule, MatTooltipModule, MatRippleModule],
  templateUrl: "./audio-player.component.html",
  styleUrls: ["./audio-player.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("200ms ease-out", style({ opacity: 1 }))]),
      transition(":leave", [style({ opacity: 1 }), animate("150ms ease-in", style({ opacity: 0 }))]),
    ]),
    trigger("slideUp", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  private songsService = inject(SongsService)

  isPlaying = false
  currentTime = 0
  duration = 0
  volume = 1
  currentSong: Song | null = null
  isModalOpen = false
  isDraggingTime = false
  isDraggingVolume = false
  previousVolume = 1
  isMuted = false

  private subscriptions: Subscription[] = []

  @HostListener("document:keydown.escape")
  onEscapeKey() {
    this.closeModal()
  }

  @HostListener("document:keydown.space", ["$event"])
  onSpaceKey(event: KeyboardEvent) {
    if (this.isModalOpen) {
      event.preventDefault()
      this.togglePlay()
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.songsService.isPlaying.subscribe((isPlaying) => {
        this.isPlaying = isPlaying
      }),

      this.songsService.currentTime.subscribe((time) => {
        if (!this.isDraggingTime) {
          this.currentTime = time
        }
      }),

      this.songsService.duration.subscribe((duration) => {
        this.duration = duration
      }),

      this.songsService.volume.subscribe((volume) => {
        if (!this.isDraggingVolume) {
          this.volume = volume
          this.isMuted = volume === 0
        }
      }),

      this.songsService.currentPlayingSong.subscribe((song) => {
        if (song) {
          this.currentSong = song
          this.isModalOpen = true
        }
      }),

      this.songsService.shouldOpenModal.subscribe((shouldOpen) => {
        if (shouldOpen && this.currentSong) {
          this.isModalOpen = true
        }
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
    this.closeModal()
  }

  seek(event: any): void {
    const value = event.value !== undefined ? event.value : event
    if (value !== undefined) {
      this.songsService.seekTo(value)
    }
  }

  startDraggingTime(): void {
    this.isDraggingTime = true
  }

  stopDraggingTime(event: any): void {
    this.isDraggingTime = false
    this.seek(event)
  }

  startDraggingVolume(): void {
    this.isDraggingVolume = true
  }

  stopDraggingVolume(event: any): void {
    this.isDraggingVolume = false
    this.setVolume(event)
  }

  setVolume(event: any): void {
    const value = event.value !== undefined ? event.value : event
    if (value !== undefined) {
      this.songsService.setVolume(value)
      if (value > 0) {
        this.previousVolume = value
      }
      this.isMuted = value === 0
    }
  }

  toggleMute(): void {
    if (this.isMuted) {
      // Unmute
      this.songsService.setVolume(this.previousVolume)
      this.isMuted = false
    } else {
      // Mute
      this.previousVolume = this.volume
      this.songsService.setVolume(0)
      this.isMuted = true
    }
  }

  formatTime(time: number): string {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  closeModal(): void {
    // רק סוגרים את המודל, לא מאפסים את השיר הנוכחי
    this.isModalOpen = false

    // לא עוצרים את השיר, רק משהים אותו
    this.songsService.pauseSong()
  }

  // Helper method to get mood color for styling
  getMoodColor(): string {
    if (!this.currentSong) return "#E91E63"

    const mood = this.currentSong.mood_category?.toLowerCase() || ""

    switch (mood) {
      case "happy":
        return "#FFD54F"
      case "sad":
        return "#64B5F6"
      case "energetic":
      case "excited":
        return "#FF8A65"
      case "calm":
        return "#81C784"
      default:
        return "#E91E63"
    }
  }

  // Get volume icon based on current volume
  getVolumeIcon(): string {
    if (this.isMuted || this.volume === 0) {
      return "volume_off"
    } else if (this.volume < 0.5) {
      return "volume_down"
    } else {
      return "volume_up"
    }
  }

  // Calculate progress percentage for background gradient
  getProgressPercentage(): number {
    if (!this.duration) return 0
    return (this.currentTime / this.duration) * 100
  }
}
