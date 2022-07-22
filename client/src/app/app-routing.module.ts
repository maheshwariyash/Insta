import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { ChatComponent } from './pages/chat/chat.component';
import { FeedComponent } from './pages/feed/feed.component';
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
    path: 'verification',
    component: VerificationComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: PostComponent,
      },
      {
        path: 'feed',
        component: FeedComponent,
      },
      {
        path: 'viewprofile/:id',
        component: ViewprofileComponent,
      },
      {
        path: 'addpost',
        component: AddpostComponent,
      },
      {
        path: 'friendrequest',
        component: FriendrequestComponent,
      },
      {
        path: 'likedpost',
        component: LikedpostsComponent,
      },
      {
        path: 'hiddenpost',
        component: HiddenpostsComponent,
      },
      {
        path: 'friendlist/:id',
        component: FriendslistComponent,
      },
      {
        path: 'spost/:id',
        component: SinglepostComponent,
      },
      {
        path: 'chat/:id',
        component: ChatComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
