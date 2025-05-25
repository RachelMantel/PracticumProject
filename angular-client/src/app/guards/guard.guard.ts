import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const guardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const url = state.url;

  if (url === '' || url === '/' || url === '/home') {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true; 
  } else {
    router.navigate(['/login']);
    return false;
  }
};
