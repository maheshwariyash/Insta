import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { VerificationGuard } from './guards/verification.guard';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { ChatComponent } from './pages/chat/chat.component';
import { FeedComponent } from './pages/feed/feed.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { FriendrequestComponent } from './pages/friendrequest/friendrequest.component';
import { FriendslistComponent } from './pages/friendslist/friendslist.component';
import { HiddenpostsComponent } from './pages/hiddenposts/hiddenposts.component';
import { HomeComponent } from './pages/home/home.component';
import { LikedpostsComponent } from './pages/likedposts/likedposts.component';
import { LoginComponent } from './pages/login/login.component';
import { PostComponent } from './pages/post/post.component';
import { RegisterComponent } from './pages/register/register.component';
import { SinglepostComponent } from './pages/singlepost/singlepost.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { ViewprofileComponent } from './pages/viewprofile/viewprofile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: PostComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'feed',
        component: FeedComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'viewprofile/:id',
        component: ViewprofileComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'addpost',
        component: AddpostComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'friendrequest',
        component: FriendrequestComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'likedpost',
        component: LikedpostsComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'hiddenpost',
        component: HiddenpostsComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'friendlist/:id',
        component: FriendslistComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'spost/:id',
        component: SinglepostComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
      {
        path: 'chat/:id',
        component: ChatComponent,
        canActivate: [AuthGuard, VerificationGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
