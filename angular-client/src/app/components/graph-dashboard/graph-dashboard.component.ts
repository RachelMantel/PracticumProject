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

  private userChart?: Chart;
  private songChart?: Chart;

  private userSub?: Subscription;
  private songSub?: Subscription;

  constructor(
    private userService: UsersService,
    private songService: SongsService
  ) {}

  ngOnInit(): void {
    this.userSub = this.userService.users.subscribe(users => {
      const userData = this.countByMonth(users.map(u => new Date(u.dateRegistration).toISOString()));
      this.createUserChart(userData);
    });

    this.songSub = this.songService.songs.subscribe(songs => {
      const songData = this.countByMonth(songs.map(s => new Date(s.dateAdding).toISOString()));
      this.createSongChart(songData);
    });

    this.userService.getUsers();
    this.songService.getAllSongs();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.songSub?.unsubscribe();
    this.userChart?.destroy();
    this.songChart?.destroy();
  }

  countByMonth(dates: string[]): number[] {
    const counts = new Array(12).fill(0);
    dates.forEach(dateStr => {
      const date = new Date(dateStr);
      const month = date.getMonth();
      counts[month]++;
    });
    return counts;
  }

  createUserChart(data: number[]): void {
    if (this.userChart) this.userChart.destroy();
    this.userChart = new Chart('userChart', {
      type: 'bar',
      data: {
        labels: this.getMonthLabels(),
        datasets: [{
          label: 'Users Registered',
          data,
          backgroundColor: '#E91E63'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Registrations Per Month'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createSongChart(data: number[]): void {
    if (this.songChart) this.songChart.destroy();
    this.songChart = new Chart('songChart', {
      type: 'bar',
      data: {
        labels: this.getMonthLabels(),
        datasets: [{
          label: 'Songs Uploaded',
          data,
          backgroundColor: '#3F51B5'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Songs Uploaded Per Month'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getMonthLabels(): string[] {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }
}


// import { Component, AfterViewInit, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
// import { UsersService } from '../../services/users/users.service';
// import { SongsService } from '../../services/songs/songs.service';
// import { Chart, ChartTypeRegistry } from 'chart.js';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// @Component({
//   selector: 'app-graph-dashboard',
//   standalone: true,
//   templateUrl: './graph-dashboard.component.html',
//   styleUrls: ['./graph-dashboard.component.scss']
// })
// export class GraphDashboardComponent implements AfterViewInit {
//   @ViewChild('userChartCanvas') userChartCanvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('songChartCanvas') songChartCanvas!: ElementRef<HTMLCanvasElement>;

//   private destroyRef = inject(DestroyRef);
//   private userChart?: Chart;
//   private songChart?: Chart;

//   constructor(
//     private userService: UsersService,
//     private songService: SongsService
//   ) {}

//   ngAfterViewInit(): void {
//     this.userService.users.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(users => {
//       const dates = users.map(u => new Date(u.dateRegistration).toISOString());
//       const usersPerMonth = this.countByMonth(dates);
//       this.createChart(this.userChartCanvas.nativeElement, 'Users Joined per Month', usersPerMonth, 'userChart');
//     });

//     this.songService.songs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(songs => {
//       const dates = songs.map(s => new Date(s.dateAdding).toISOString());
//       const songsPerMonth = this.countByMonth(dates);
//       this.createChart(this.songChartCanvas.nativeElement, 'Songs Uploaded per Month', songsPerMonth, 'songChart');
//     });
//   }

//   private createChart(canvas: HTMLCanvasElement, title: string, dataMap: Map<string, number>, chartId: string) {
//     const existingChart = Chart.getChart(chartId as keyof ChartTypeRegistry);
//     if (existingChart) {
//       existingChart.destroy();
//     }

//     const labels = Array.from(dataMap.keys());
//     const values = Array.from(dataMap.values());

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const newChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [{
//           label: title,
//           data: values,
//           backgroundColor: '#E91E63'
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           title: {
//             display: true,
//             text: title
//           }
//         }
//       }
//     });

//     // assign chart to correct property to allow cleanup
//     if (chartId === 'userChart') this.userChart = newChart;
//     else if (chartId === 'songChart') this.songChart = newChart;
//   }

//   private countByMonth(dates: string[]): Map<string, number> {
//     const map = new Map<string, number>();
//     dates.forEach(dateStr => {
//       const date = new Date(dateStr);
//       const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
//       map.set(month, (map.get(month) || 0) + 1);
//     });
//     return new Map([...map.entries()].sort()); // sorted map
//   }
// }
