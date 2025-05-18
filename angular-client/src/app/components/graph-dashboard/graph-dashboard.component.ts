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
    this.userSub = this.userService.users.subscribe(users => {
      const regDates = users.map(u => new Date(u.dateRegistration));
      this.createChart('userLineChart', 'line', this.countByMonth(regDates), 'Users Registered Per Month', '#E91E63');
      this.createChart('userByDayChart', 'bar', this.countByDayOfWeek(regDates), 'Registrations by Day of Week', '#9C27B0');
    });

    this.songSub = this.songService.songs.subscribe(songs => {
      const songDates = songs.map(s => new Date(s.dateAdding));
      this.createChart('songBarChart', 'bar', this.countByMonth(songDates), 'Songs Uploaded Per Month', '#3F51B5');
      this.createChart('songByHourChart', 'bar', this.countByHour(songDates), 'Uploads by Hour of Day', '#009688');
    });

    this.userService.getUsers();
    this.songService.getAllSongs();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.songSub?.unsubscribe();
    this.charts.forEach(chart => chart.destroy());
  }

  private createChart(canvasId: string, type: 'bar' | 'line', data: { labels: string[], values: number[] }, title: string, color: string) {
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    const chart = new Chart(canvasId, {
      type,
      data: {
        labels: data.labels,
        datasets: [{
          label: title,
          data: data.values,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          fill: type === 'line',
          tension: 0.3,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.charts.push(chart);
  }

  private countByMonth(dates: Date[]): { labels: string[], values: number[] } {
    const map = new Map<string, number>();
    dates.forEach(d => {
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      map.set(key, (map.get(key) || 0) + 1);
    });
    const sorted = [...map.entries()].sort();
    return {
      labels: sorted.map(e => e[0]),
      values: sorted.map(e => e[1])
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

  private countByHour(dates: Date[]): { labels: string[], values: number[] } {
    const counts = new Array(24).fill(0);
    dates.forEach(d => {
      counts[d.getHours()]++;
    });
    return {
      labels: counts.map((_, i) => i.toString().padStart(2, '0') + ':00'),
      values: counts
    };
  }
}
