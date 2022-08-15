import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ViewprofileComponent } from './pages/viewprofile/viewprofile.component';
import { FriendrequestComponent } from './pages/friendrequest/friendrequest.component';
import { FeedComponent } from './pages/feed/feed.component';
import { SinglepostComponent } from './pages/singlepost/singlepost.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { VerificationComponent } from './pages/verification/verification.component';
import { FriendslistComponent } from './pages/friendslist/friendslist.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { DatePipe } from './pipes/date.pipe';
import { CommentdatePipe } from './pipes/commentdate.pipe';
import { ChatlistComponent } from './pages/chatlist/chatlist.component';
import { ChatsortPipe } from './pipes/chatsort.pipe';
import { LikedpostsComponent } from './pages/likedposts/likedposts.component';
import { ShortmsgPipe } from './pipes/shortmsg.pipe';
import { HiddenpostsComponent } from './pages/hiddenposts/hiddenposts.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './component/loader/loader.component';
import { DatedivPipe } from './pipes/datediv.pipe';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent,
    NavbarComponent,
    AddpostComponent,
    SidebarComponent,
    ChatComponent,
    ViewprofileComponent,
    FriendrequestComponent,
    FeedComponent,
    SinglepostComponent,
    RegisterComponent,
    LoginComponent,
    VerificationComponent,
    FriendslistComponent,
    ReversePipe,
    DatePipe,
    CommentdatePipe,
    ChatlistComponent,
    ChatsortPipe,
    LikedpostsComponent,
    ShortmsgPipe,
    HiddenpostsComponent,
    LoaderComponent,
    DatedivPipe,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [],
  entryComponents: [MatDialogModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
