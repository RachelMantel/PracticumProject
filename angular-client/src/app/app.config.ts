import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/authInterceptor';


export const appConfig: ApplicationConfig = {
  providers: [
        provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
  ]};
