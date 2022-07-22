import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  data: any = {};
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private loginService: LoginService,
    private route: ActivatedRoute // Inject Firebase auth service
  ) {}
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result.user?.providerData[0]);
        console.log(result);
        this.data = result.user?.providerData[0];
        this.data.name = this.data.displayName;
        const path = this.route.snapshot.firstChild?.routeConfig?.path;
        if (path == 'register') {
          this.loginService.register(this.data);
        } else {
          this.loginService.login(this.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
