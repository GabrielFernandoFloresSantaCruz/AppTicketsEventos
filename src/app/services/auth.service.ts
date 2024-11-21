import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogued: boolean = false;
  profile: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    public db: DatabaseService,
    public router: Router
  ) {
    this.initAuthState();
  }

  private initAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Usuario autenticado
        this.isLogued = true;
        this.getProfile(user.uid);
      } else {
        // Usuario no autenticado
        this.isLogued = false;
        this.profile = null;
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
      }
    });
  }

  async registerUser(email: string, password: string, additionalData: { name: string; phone: string; username: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(this.firestore, `users/${userId}`);
      await setDoc(userDocRef, { ...additionalData, email });

      console.log('Usuario registrado y documento creado en Firestore');
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario. Intenta nuevamente.');
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);
      this.getProfile(userCredential.user.uid);
      this.router.navigateByUrl('/profile');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Credenciales incorrectas. Intenta nuevamente.');
    }
  }

  private async saveProfileToLocalStorage(uid: string): Promise<void> {
    try {
      const profile = await this.db.getDocumentById('users', uid).toPromise();
      if (profile) {
        localStorage.setItem('profile', JSON.stringify(profile));
        this.profile = profile;
      }
    } catch (error) {
      console.error('Error al guardar el perfil en localStorage:', error);
    }
  }

  getProfile(uid: string) {
    this.db.getDocumentById('users', uid).subscribe(
      (res: any) => {
        console.log('Perfil desde Firebase:', res);
        localStorage.setItem('profile', JSON.stringify({ ...res, uid }));
        this.profile = { ...res, uid };
      },
      (error: any) => console.error('Error al obtener el perfil:', error)
    );
  }

  verifyIsLogued(): boolean {
    return !!localStorage.getItem('user');
  }
}