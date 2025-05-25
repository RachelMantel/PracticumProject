import { Routes } from '@angular/router';
import { guardGuard } from './guards/guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'users/:id/edit',
    loadComponent: () =>
      import('./components/edit-user/edit-user.component').then(m => m.EditUserComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'users/:id/songs',
    loadComponent: () =>
      import('./components/user-songs/user-songs.component').then(m => m.UserSongsComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'songs',
    loadComponent: () =>
      import('./components/songs/songs.component').then(m => m.SongsComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/graph-dashboard/graph-dashboard.component').then(m => m.GraphDashboardComponent),
    canActivate: [guardGuard]
  },
];
