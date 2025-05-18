import {
  Component,
  EventEmitter,
  Output,
  inject,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Song } from "../../models/song.model";
import { SongsService } from "../../services/songs/songs.service";

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
  ],
  templateUrl: "./song-uploader.component.html",
  styleUrls: ["./song-uploader.component.scss"],
})
export class SongUploaderComponent {
  @Output() uploadSuccess = new EventEmitter<void>();

  songService = inject(SongsService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  file: File | null = null;
  progress = 0;
  uploading = false;
  uploadComplete = false;
  dragActive = false;

  moodChoices = [
    "natural", "happy", "sad", "excited", "angry",
    "relaxed", "hopeful", "grateful", "nervous"
  ];

  songDetails: Song = {
    songName: "",
    artist: "",
    filePath: "",
    dateAdding: new Date(),
    mood_category: "happy",
    userId: this.getUserId(),
    folderId: -1,
  };

  getUserId(): number {
    if (this.isBrowser) {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      return user?.id ?? 1;
    }
    return 1;
  }

  getAuthHeaders() {
    if (this.isBrowser) {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];
    if (selectedFile) {
      this.setFile(selectedFile);
    }
  }

  setFile(selectedFile: File) {
    this.file = selectedFile;
    const songName = selectedFile.name.replace(/\.[^/.]+$/, "");
    this.songDetails = { ...this.songDetails, songName };
  }

  handleDrag(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      this.dragActive = true;
    } else if (event.type === "dragleave") {
      this.dragActive = false;
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      this.setFile(droppedFile);
    }
  }



//   async handleUpload() {
//     if (!this.file) return

//     this.uploading = true
//     this.progress = 0

//     try {
//       // Get presigned URL for upload
//       const uploadUrlResponse = await this.songService.getUploadUrl(this.file.name, this.file.type).toPromise()
//       const presignedUrl = uploadUrlResponse.url

//       // Upload file to presigned URL
//       await this.songService
//         .uploadFileToUrl(presignedUrl, this.file, (progress) => {
//           this.progress = progress
//         })
//         .toPromise()

//       // Get download URL for the uploaded file
//       const downloadResponse = await this.songService.getDownloadUrl(this.file.name).toPromise()
//       const uploadedFileUrl = downloadResponse.downloadUrl

//       // Create song record
//       const newSong: Song = {
//         ...this.songDetails,
//         filePath: uploadedFileUrl,
//       }

//       await this.songService.addSong(newSong).toPromise()
//       this.uploadComplete = true

//       // Delay to show success animation
//       setTimeout(() => {
//         this.uploadSuccess.emit()
//       }, 1500)
//     } catch (error) {
//       console.error("Upload error:", error)
//     } finally {
//       this.uploading = false
//     }
//   }
 }
