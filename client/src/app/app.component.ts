import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  title = 'Insta';
  loadSub: Subscription;
  user: {};

  constructor(
    private userservice: LoginService,
    private loader: LoaderService
  ) {
    this.loadSub = this.loader.loadingObs().subscribe((showLoader) => {
      this.isLoading = showLoader;
    });
    this.userservice.getUser();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.loadSub.unsubscribe();
  }
}
