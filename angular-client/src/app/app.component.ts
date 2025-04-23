import { Component } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tuneyourmood-admin';

  constructor(private router: Router){}
  ngOnInit(){
   this.router.navigate(['/login'])
  }
}
