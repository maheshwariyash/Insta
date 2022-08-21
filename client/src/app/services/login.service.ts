import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}
  loadingUser: Observable<any>;
  // isLoading = true;
  user: BehaviorSubject<any> = new BehaviorSubject(undefined);
  friendReqList: BehaviorSubject<any> = new BehaviorSubject([]);
  notifications: BehaviorSubject<any> = new BehaviorSubject([]);

  login(obj: any) {
    this.http
      .post('http://localhost:8000/user/login', obj, {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        if (!data.isValid && data.isregis) {
          this.router.navigateByUrl('/register');
        } else if (!data.isValid && !data.isregis) {
        } else if (!data.user.username) {
          console.log(data.message);
          this.user.next(data.user);
          this.router.navigate(['/verification']);
        } else {
          this.user.next(data.user);
          this.router.navigate(['/home']);
        }
      });
  }

  register(obj: any) {
    this.http
      .post('http://localhost:8000/user/register', obj, {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        if (data.isRegistered) {
          if (!data?.user?.username) {
            console.log(data.message);
            this.user.next(data.user);
            this.router.navigateByUrl('/verification');
          } else {
            console.log(data.message);
            this.user.next(data.user);
            this.router.navigate(['/home']);
          }
        } else if (!data.isRegistered) {
          this.router.navigate(['/register']);
        } else {
          console.log(data.message);
          this.router.navigate(['/login']);
        }
      });
  }

  logout() {
    this.user.next(null);
    return this.http.get('http://localhost:8000/user/logout', {
      withCredentials: true,
    });
  }

  forgotPassword(data: any) {
    return this.http.post('http://localhost:8000/user/forgot-password', {
      email: data,
    });
  }

  resetPassword(data: any, resetToken: any) {
    return this.http.post(
      `http://localhost:8000/user/reset-password/${resetToken}`,
      data
    );
  }

  checkUserExist(data: any) {
    return this.http.post(
      'http://localhost:8000/user/checkuser',
      { userName: data },
      {
        withCredentials: true,
      }
    );
  }

  checkEmailExist(data: any) {
    return this.http.post('http://localhost:8000/user/checkemail', {
      email: data,
    });
  }

  getUserById(id: any) {
    return this.http.get(`http://localhost:8000/user/${id}`, {
      withCredentials: true,
    });
  }

  userupdated(obj: any) {
    return this.http.post('http://localhost:8000/user/update-profile', obj, {
      withCredentials: true,
    });
  }

  addfriend(id: any) {
    return this.http.get(`http://localhost:8000/user/addfriend/${id}`, {
      withCredentials: true,
    });
  }

  getFriendReq() {
    this.http
      .get(`http://localhost:8000/user/friendreq`, {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this.friendReqList.next(data[0].user);
      });
  }

  getFriendList(id: any) {
    return this.http.get(`http://localhost:8000/user/friendlist/${id}`, {
      withCredentials: true,
    });
  }

  onFriendReqConfirm(id: any) {
    return this.http.post('http://localhost:8000/user/confirm', id, {
      withCredentials: true,
    });
  }

  onFriendReqDelete(id: any) {
    return this.http.post('http://localhost:8000/user/delete', id, {
      withCredentials: true,
    });
  }

  onUnfriend(id: any) {
    return this.http.get(`http://localhost:8000/user/unfriend/${id}`, {
      withCredentials: true,
    });
  }

  findPeople(obj: any) {
    return this.http.post('http://localhost:8000/user/search', obj, {
      withCredentials: true,
    });
  }

  getNotification() {
    this.http
      .get('http://localhost:8000/user/notification', {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);

        this.notifications.next(data);
      });
  }

  getUser() {
    this.loadingUser = this.http.get('http://localhost:8000/user/login', {
      withCredentials: true,
    });
    this.loadingUser.subscribe(
      (data: any) => {
        console.log('qwertyu', data);
        if (data.user) {
          // this.isLoading = false;
          this.user.next(data.user);
          this.router.navigate(['/home']);
        } else {
          // this.isLoading = false;
          this.user.next(null);
        }
      },
      (err) => {
        console.log('Invalid Token', err);
      }
    );
  }
}
