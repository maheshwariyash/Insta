import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
// import { VoiceRecognitionService } from 'src/app/services/voice-recognition.service';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any;
  search: String;
  faMicrophone = faMicrophone;
  faMicrophoneSlash = faMicrophoneSlash;

  // isRunning = false;

  constructor(
    private userservice: LoginService,
    private _snackBar: MatSnackBar,
    // private voicerecognition: VoiceRecognitionService,
    private ref: ChangeDetectorRef
  ) {
    this.userservice.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    // this.voicerecognition.isRunning.subscribe((data) => {
    //   this.isRunning = data;
    //   this.ref.detectChanges();
    // });
  }

  // toggleVoiceReco() {
  //   this.isRunning
  //     ? this.voicerecognition.abort()
  //     : this.voicerecognition.start();
  // }

  onLogout() {
    this.userservice.logout().subscribe((data: any) => {
      this._snackBar.open(data.message, 'Ok', {
        duration: 3000,
      });
      window.location.reload();

      console.log(data.message);
    });
  }
}
