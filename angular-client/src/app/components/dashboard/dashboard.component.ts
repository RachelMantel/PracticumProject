import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { Chart } from "chart.js/auto";
import { delay, of } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("usersChart") usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("songsChart") songsChartRef!: ElementRef<HTMLCanvasElement>;

  usersChart!: Chart;
  songsChart!: Chart;

  usersPerMonth: number[] = [];
  songsPerUser: number[] = [];

  isLoaded = false;

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Chart rendering will be triggered after data is loaded
  }

  loadStats(): void {
    // Simulate API call (use your real service here)
    of({
      usersPerMonth: [65, 78, 90, 105, 125, 138, 150, 170, 185, 200, 220, 235],
      songsPerUser: [120, 85, 60, 35, 20, 10],
    })
      .pipe(delay(500)) // Simulate delay
      .subscribe((data) => {
        this.usersPerMonth = data.usersPerMonth;
        this.songsPerUser = data.songsPerUser;
        this.isLoaded = true;
        this.initCharts();
      });
  }

  initCharts(): void {
    this.initUsersChart();
    this.initSongsChart();
  }

  initUsersChart(): void {
    const ctx = this.usersChartRef.nativeElement.getContext("2d");
    if (!ctx) return;

    this.usersChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "New Users",
            data: this.usersPerMonth,
            fill: true,
            backgroundColor: "rgba(233, 30, 99, 0.2)",
            borderColor: "#E91E63",
            pointBackgroundColor: "#E91E63",
            pointBorderColor: "#fff",
            pointRadius: 5,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }

  initSongsChart(): void {
    const ctx = this.songsChartRef.nativeElement.getContext("2d");
    if (!ctx) return;

    this.songsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["0-5", "6-10", "11-20", "21-30", "31-50", "51+"],
        datasets: [
          {
            label: "Users Count",
            data: this.songsPerUser,
            backgroundColor: [
              "rgba(233, 30, 99, 0.7)",
              "rgba(255, 87, 34, 0.7)",
              "rgba(156, 39, 176, 0.7)",
              "rgba(33, 150, 243, 0.7)",
              "rgba(76, 175, 80, 0.7)",
              "rgba(255, 193, 7, 0.7)",
            ],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `${items[0].label} songs`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Users",
              color: "#555",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: {
            title: {
              display: true,
              text: "Songs per User",
              color: "#555",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: { display: false },
          },
        },
      },
    });
  }
}
