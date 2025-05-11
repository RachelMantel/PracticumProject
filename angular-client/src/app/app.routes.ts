import { Routes } from '@angular/router';

export const routes: Routes = [
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
            import('./components/users/users.component').then(m => m.UsersComponent) 
    },
    {
        path: 'users/:id',
        loadComponent: () =>
            import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent) 
    },
    {
        path: 'users/:id/edit',
        loadComponent: () =>
            import('./components/edit-user/edit-user.component').then(m => m.EditUserComponent) 
    },
    {
        path: 'users/:id/songs',
        loadComponent: () =>
            import('./components/user-songs/user-songs.component').then(m => m.UserSongsComponent) 
      },
      {
        path: 'songs',
        loadComponent: () =>
            import('./components/songs/songs.component').then(m => m.SongsComponent) 
      },
      {
        path: 'dashboard',
        loadComponent: () =>
            import('./components/graph-dashboard/graph-dashboard.component').then(m => m.GraphDashboardComponent) 
      }


];