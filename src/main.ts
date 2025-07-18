import { bootstrapApplication } from '@angular/platform-browser';
import { startServer } from '@planess/train-a-backend'
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { withHashLocation } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
startServer()
  .then(() => bootstrapApplication(AppComponent, {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withHashLocation()),
      provideClientHydration(withEventReplay())
    ],
  }))
  .catch((err) => console.error(err));
