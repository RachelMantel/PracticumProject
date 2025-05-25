import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatRippleModule } from "@angular/material/core"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatBadgeModule } from "@angular/material/badge"
import { animate, style, transition, trigger } from "@angular/animations"

interface QuickStat {
  label: string
  value: number
  icon: string
  color: string
  increase?: number
}

interface QuickAction {
  title: string
  icon: string
  description: string
  route: string
  color: string
}

interface Task {
  title: string
  count: number
  icon: string
  route: string
}

interface Update {
  title: string
  date: string
  description: string
  icon: string
}

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatProgressBarModule,
    MatBadgeModule,
  ],
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("0.5s ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
    trigger("staggerFadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("0.5s ease-out", style({ opacity: 1 }))]),
    ]),
  ],
})
export class HomePageComponent implements OnInit {
  adminName = "Admin"
  currentDate = new Date()

  // System information
  quickStats: QuickStat[] = [
    { label: "Users", value: 256, icon: "people", color: "#E91E63", increase: 12 },
    { label: "Songs", value: 390, icon: "music_note", color: "#FF5722", increase: 8 },
    { label: "Playlists", value: 48, icon: "queue_music", color: "#9C27B0", increase: 5 },
    { label: "Downloads", value: 3254, icon: "download", color: "#3F51B5", increase: 24 },
  ]

  // Quick actions for admin
  quickActions: QuickAction[] = [
    {
      title: "User Management",
      icon: "people",
      description: "View, edit and delete system users",
      route: "/users",
      color: "#E91E63",
    },
    {
      title: "Song Management",
      icon: "music_note",
      description: "Manage song library, add and edit songs",
      route: "/songs",
      color: "#FF5722",
    },
    {
      title: "Reports & Statistics",
      icon: "bar_chart",
      description: "View statistical data and detailed reports",
      route: "/reports",
      color: "#9C27B0",
    },
    {
      title: "System Settings",
      icon: "settings",
      description: "Change system settings and permissions",
      route: "/settings",
      color: "#3F51B5",
    },
  ]

  // Recent system updates
  recentUpdates: Update[] = [
    {
      title: "Song Recommendation Engine Upgrade",
      date: "05/15/2023",
      description: "Improved algorithm for mood-based song recommendations",
      icon: "auto_awesome",
    },
    {
      title: "New Format Support Added",
      date: "05/10/2023",
      description: "System now supports FLAC and high-quality AAC formats",
      icon: "high_quality",
    },
    {
      title: "User Interface Improvements",
      date: "05/05/2023",
      description: "Redesigned user interface for better experience",
      icon: "design_services",
    },
  ]

  // Admin tasks
  adminTasks: Task[] = [
    {
      title: "Approve New Songs",
      count: 12,
      icon: "playlist_add_check",
      route: "/songs/pending",
    },
    {
      title: "User Support Requests",
      count: 8,
      icon: "contact_support",
      route: "/support",
    },
    {
      title: "System Updates",
      count: 3,
      icon: "system_update",
      route: "/updates",
    },
  ]

  // System health metrics
  systemHealth = {
    cpu: 42,
    memory: 68,
    storage: 37,
    network: 85,
  }

  constructor() {}

  ngOnInit(): void {
    // You would typically get the admin name from an auth service
    // For now we'll just use a hardcoded value
    this.adminName = "Admin"
  }

  getGreeting(): string {
    const hour = this.currentDate.getHours()
    if (hour < 12 && hour>5) {
      return "Good Morning"
    } else if (hour > 12  && hour < 18) {
      return "Good Afternoon"
    } else if (hour >18 && hour <20 ) {
      return "Good Evening"
    } else {
      return "Good night"
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
