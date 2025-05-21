import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { Song } from '../../models/song.model';
import { SongsService } from '../../services/songs/songs.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  currentSong: Song | null = null;
  isExpanded = true;
  isModalOpen = false;

  private subscriptions: Subscription[] = [];

  constructor(public songsService: SongsService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.songsService.isPlaying.subscribe((isPlaying) => {
        this.isPlaying = isPlaying;
      }),

      this.songsService.currentTime.subscribe((time) => {
        this.currentTime = time;
      }),

      this.songsService.duration.subscribe((duration) => {
        this.duration = duration;
      }),

      this.songsService.volume.subscribe((volume) => {
        this.volume = volume;
      }),

      this.songsService.currentPlayingSong.subscribe((song) => {
        this.currentSong = song;
        if (song) {
          this.isModalOpen = true;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.songsService.pauseSong();
    } else {
      this.songsService.resumeSong();
    }
  }

  stop(): void {
    this.songsService.stopSong();
    this.closeModal();
  }

  seek(event: any): void {
    const value = event.value !== undefined ? event.value : event;
    if (value !== undefined) {
      this.songsService.seekTo(value);
    }
  }

  setVolume(event: any): void {
    const value = event.value !== undefined ? event.value : event;
    if (value !== undefined) {
      this.songsService.setVolume(value);
    }
  }

  formatTime(time: number): string {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.songsService.stopSong();
  }

  // Helper method to get mood color for styling
  getMoodColor(): string {
    if (!this.currentSong) return '#E91E63';
    
    const mood = this.currentSong.mood_category?.toLowerCase() || '';
    
    switch (mood) {
      case 'happy': return '#FFD54F';
      case 'sad': return '#64B5F6';
      case 'energetic': return '#FF8A65';
      case 'calm': return '#81C784';
      default: return '#E91E63';
    }
  }
}