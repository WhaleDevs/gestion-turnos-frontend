import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAR, 'es-AR');
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
