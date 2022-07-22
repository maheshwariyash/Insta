import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  recentChats: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  addpost(obj: any) {
    return this.http.post('http://localhost:8000/post/addpost', obj, {
      withCredentials: true,
    });
  }

  getuserpostById(id: any) {
    return this.http.get(`http://localhost:8000/post/userpost/${id}`, {
      withCredentials: true,
    });
  }

  getPostById(id: any) {
    return this.http.get(`http://localhost:8000/post/${id}`, {
      withCredentials: true,
    });
  }

  getFeedPost(currentPage: any) {
    return this.http.get(
      `http://localhost:8000/post/feed?currentPage=${currentPage}`,
      {
        withCredentials: true,
      }
    );
  }

  getHomePost(currentPage: any) {
    return this.http.get(
      `http://localhost:8000/post/home?currentPage=${currentPage}`,
      {
        withCredentials: true,
      }
    );
  }

  deletePostById(id: any) {
    return this.http.patch(`http://localhost:8000/post/delete/${id}`, id, {
      withCredentials: true,
    });
  }

  getcomments(id: any) {
    return this.http.get(`http://localhost:8000/post/getcomments/${id}`, {
      withCredentials: true,
    });
  }

  toLikePost(id: any) {
    this.http
      .get(`http://localhost:8000/post/liked/${id}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  toUnlikePost(id: any) {
    this.http
      .get(`http://localhost:8000/post/unliked/${id}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  toHidePost(id: any) {
    this.http
      .get(`http://localhost:8000/post/hide/${id}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  toUnhidePost(id: any) {
    this.http
      .get(`http://localhost:8000/post/unhide/${id}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  getLikedPosts() {
    return this.http.get('http://localhost:8000/post/likedpost', {
      withCredentials: true,
    });
  }

  getHiddenPosts() {
    return this.http.get('http://localhost:8000/post/hiddenpost', {
      withCredentials: true,
    });
  }

  getMessages(id: any, currentPage: any) {
    return this.http.get(
      `http://localhost:8000/chat/getmessages/${id}?currentPage=${currentPage}`,
      {
        withCredentials: true,
      }
    );
  }

  getRecentChats() {
    this.http
      .get('http://localhost:8000/chat/recentchats', {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.recentChats.next(data);
      });
  }
}
