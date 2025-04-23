import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component').then(m => m.LoginComponent) 
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./components/users/users.component').then(m => m.UsersComponent) 
    },
    // {path: 'users/:id',loadComponent: () => 
    //     import('./components/display-user/display-user.component').then(m => m.DisplayUserComponent)
    // }

];
