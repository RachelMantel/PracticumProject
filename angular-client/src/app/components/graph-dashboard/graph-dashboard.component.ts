import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription, forkJoin } from 'rxjs';
import { UsersService } from '../../services/users/users.service';
import { SongsService } from '../../services/songs/songs.service';
import type { User } from '../../models/user.model';
import type { Song } from '../../models/song.model';

Chart.register(...registerables);

@Component({
  selector: 'app-graph-dashboard',
  templateUrl: './graph-dashboard.component.html',
  styleUrls: ['./graph-dashboard.component.css'],
  standalone: true
})
export class GraphDashboardComponent implements OnInit, OnDestroy {

  private charts: Chart[] = [];
  private userSub?: Subscription;
  private songSub?: Subscription;
  private combinedSub?: Subscription;

  // צבעים יפים לעוגה
  private pieColors = [
    '#E91E63', '#FF5722', '#9C27B0', '#3F51B5', '#00BCD4',
    '#4CAF50', '#FF9800', '#795548', '#607D8B', '#F44336',
    '#2196F3', '#8BC34A', '#FFC107', '#673AB7', '#009688'
  ];

  constructor(
    private userService: UsersService,
    private songService: SongsService
  ) {}

  ngOnInit(): void {
    // טעינת נתוני משתמשים
    this.userSub = this.userService.getUsers().subscribe(users => {
      const regDates = users.map(u => new Date(u.dateRegistration));
      this.createChart('userLineChart', 'line', this.countByMonth(regDates), 'Users Registered Per Month', '#E91E63');
      this.createChart('userByDayChart', 'bar', this.countByDayOfWeek(regDates), 'Registrations by Day of Week', '#9C27B0');
    });

    // טעינת נתוני שירים
    this.songSub = this.songService.getAllSongs().subscribe(songs => {
      const songDates = songs.map(s => new Date(s.dateAdding));
      this.createChart('songBarChart', 'bar', this.countByMonth(songDates), 'Songs Uploaded Per Month', '#3F51B5');
    });

    // טעינת נתונים משולבים לעוגה
    this.combinedSub = forkJoin({
      users: this.userService.getUsers(),
      songs: this.songService.getAllSongs()
    }).subscribe(({ users, songs }) => {
      this.createSongsPerUserPieChart(users, songs);
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.songSub?.unsubscribe();
    this.combinedSub?.unsubscribe();
    this.charts.forEach(chart => chart.destroy());
  }

  private createChart(
    canvasId: string,
    type: 'bar' | 'line',
    data: { labels: string[], values: number[] },
    title: string,
    color: string
  ) {
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    const chart = new Chart(canvasId, {
      type,
      data: {
        labels: data.labels,
        datasets: [{
          label: title,
          data: data.values,
          backgroundColor: type === 'line' ? 'transparent' : color + '66',
          borderColor: color,
          borderWidth: 2,
          fill: type === 'line',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          title: {
            display: true,
            text: title,
            color: '#333',
            font: {
              size: 18,
              weight: 'bold',
              family: 'Poppins'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#000',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#555',
              font: {
                family: 'Poppins',
                size: 12
              }
            },
            grid: {
              color: '#eee'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#555',
              font: {
                family: 'Poppins',
                size: 12
              }
            },
            grid: {
              color: '#eee'
            }
          }
        }
      }
    });

    this.charts.push(chart);
  }

  private createSongsPerUserPieChart(users: User[], songs: Song[]): void {
    const existingChart = Chart.getChart('songsPerUserPieChart');
    if (existingChart) existingChart.destroy();

    // חישוב כמות שירים לכל משתמש
    const userSongCounts = this.calculateSongsPerUser(users, songs);
    
    // אם אין נתונים
    if (userSongCounts.labels.length === 0) {
      console.log('No data for pie chart');
      return;
    }

    const chart = new Chart('songsPerUserPieChart', {
      type: 'pie',
      data: {
        labels: userSongCounts.labels,
        datasets: [{
          data: userSongCounts.values,
          backgroundColor: this.pieColors.slice(0, userSongCounts.labels.length),
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutBounce'
        },
        plugins: {
          title: {
            display: true,
            text: 'Songs Distribution by User',
            color: '#333',
            font: {
              size: 18,
              weight: 'bold',
              family: 'Poppins'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#000',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} songs (${percentage}%)`;
              }
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#555',
              font: {
                family: 'Poppins',
                size: 12
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10
          }
        }
      }
    });

    this.charts.push(chart);
  }

  private calculateSongsPerUser(users: User[], songs: Song[]): { labels: string[], values: number[] } {
    // יצירת מפה של משתמשים
    const userMap = new Map<number, string>();
    users.forEach(user => {
      userMap.set(user.id || 0, user.name || `User ${user.id}`);
    });

    // ספירת שירים לכל משתמש
    const songCounts = new Map<number, number>();
    songs.forEach(song => {
      const userId = song.userId || 0;
      songCounts.set(userId, (songCounts.get(userId) || 0) + 1);
    });

    // המרה למערכים
    const labels: string[] = [];
    const values: number[] = [];

    songCounts.forEach((count, userId) => {
      const userName = userMap.get(userId) || `Unknown User (${userId})`;
      labels.push(userName);
      values.push(count);
    });

    // מיון לפי כמות שירים (מהגבוה לנמוך)
    const combined = labels.map((label, index) => ({
      label,
      value: values[index]
    }));

    combined.sort((a, b) => b.value - a.value);

    return {
      labels: combined.map(item => item.label),
      values: combined.map(item => item.value)
    };
  }

  private countByMonth(dates: Date[]): { labels: string[], values: number[] } {
    const allMonths = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i).toLocaleString('en-US', { month: 'short' })
    );

    const counts = new Array(12).fill(0);
    dates.forEach(d => {
      counts[d.getMonth()]++;
    });

    return {
      labels: allMonths,
      values: counts
    };
  }

  private countByDayOfWeek(dates: Date[]): { labels: string[], values: number[] } {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = new Array(7).fill(0);
    dates.forEach(d => {
      counts[d.getDay()]++;
    });
    return { labels: days, values: counts };
  }
}