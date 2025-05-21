import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users/users.service';
import { SongsService } from '../../services/songs/songs.service';

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

  constructor(
    private userService: UsersService,
    private songService: SongsService
  ) {}

  ngOnInit(): void {
    this.userSub = this.userService.getUsers().subscribe(users => {
      const regDates = users.map(u => new Date(u.dateRegistration));
      this.createChart('userLineChart', 'line', this.countByMonth(regDates), 'Users Registered Per Month', '#E91E63');
      this.createChart('userByDayChart', 'bar', this.countByDayOfWeek(regDates), 'Registrations by Day of Week', '#9C27B0');
    });

    this.songSub = this.songService.getAllSongs().subscribe(songs => {
      const songDates = songs.map(s => new Date(s.dateAdding));
      this.createChart('songBarChart', 'bar', this.countByMonth(songDates), 'Songs Uploaded Per Month', '#3F51B5');
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.songSub?.unsubscribe();
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

  private countByMonth(dates: Date[]): { labels: string[], values: number[] } {
    const allMonths = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i).toLocaleString('default', { month: 'short' })
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
