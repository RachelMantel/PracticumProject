import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import Chart from "chart.js/auto";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatDividerModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild("usersChart") usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("songsChart") songsChartRef!: ElementRef<HTMLCanvasElement>;

  usersChart!: Chart;
  songsChart!: Chart;

  ngAfterViewInit(): void {
    this.initUsersChart();
    this.initSongsChart();
  }

  initUsersChart(): void {
    const ctx = this.usersChartRef.nativeElement.getContext("2d");
    if (ctx) {
      this.usersChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "New Users",
              data: [65, 78, 90, 105, 125, 138, 150, 170, 185, 200, 220, 235],
              fill: true,
              backgroundColor: "rgba(233, 30, 99, 0.2)",
              borderColor: "#E91E63",
              tension: 0.4,
              pointBackgroundColor: "#E91E63",
              pointBorderColor: "#fff",
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  }

  initSongsChart(): void {
    const ctx = this.songsChartRef.nativeElement.getContext("2d");
    if (ctx) {
      this.songsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["0-5", "6-10", "11-20", "21-30", "31-50", "51+"],
          datasets: [
            {
              label: "Number of Users",
              data: [120, 85, 60, 35, 20, 10],
              backgroundColor: [
                "rgba(233, 30, 99, 0.7)",
                "rgba(255, 87, 34, 0.7)",
                "rgba(156, 39, 176, 0.7)",
                "rgba(33, 150, 243, 0.7)",
                "rgba(76, 175, 80, 0.7)",
                "rgba(255, 193, 7, 0.7)",
              ],
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  const item = tooltipItems[0];
                  return `${item.label} songs`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Users",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Songs per User",
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  }
}