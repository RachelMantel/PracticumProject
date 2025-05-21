import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { SidebarComponent } from "./components/sidebar/sidebar.component"
import { AudioPlayerComponent } from "./components/audio-player/audio-player.component"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, AudioPlayerComponent, MatSidenavModule,MatIconModule],
  template: `
    <div class="app-container">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" [opened]="true" class="app-sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        
        <mat-sidenav-content class="content-container">
          <div class="toolbar">
            <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
              <mat-icon>menu</mat-icon>
            </button>
            <!-- <h1 class="app-title">Tune Your Mood!2</h1> -->
          </div>
          
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
          
          <app-audio-player></app-audio-player>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
    }
    
    .sidenav-container {
      flex: 1;
      width: 100%;
      height: 100%;
    }
    
    .app-sidenav {
      width: 250px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }
    
    .content-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .toolbar {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 88px;
      background-color: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    
    .menu-button {
      margin-right: 16px;
    }
    
    .app-title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      background: linear-gradient(90deg, #e91e63, #ff5722);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .main-content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background-color: #f5f5f5;
    }
  `,
  ],
})
export class AppComponent {
  title = "ai-music-app"
}
