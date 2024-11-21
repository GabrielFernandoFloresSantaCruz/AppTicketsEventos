import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
///////// importar firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

///////// importar httopclient module de forma global
import { HttpClientModule } from '@angular/common/http';
import { NgModel, ReactiveFormsModule } from '@angular/forms';

///// para login y registro ////
import { Auth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule,  AngularFireAuthModule,
      CommonModule),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB6qvoendAEzdGNGoFRLCuEEJeBsZKdXR4",
      authDomain: "progra-2-471fc.firebaseapp.com",
      projectId: "progra-2-471fc",
      storageBucket: "progra-2-471fc.firebasestorage.app",
      messagingSenderId: "616130273237",
      appId: "1:616130273237:web:1e7856108d420cf04de75c"
    })),
    ////// para login y registro
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
