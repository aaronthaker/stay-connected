import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getUser(userId: string | null): Observable<User> {
    const apiUrl = `http://localhost:3000/api/users/${userId}`;

    return this.http.get<{ message: string; user: any }>(apiUrl).pipe(
      map(response => {
        return new User(
          response.user._id,
          response.user.name,
          response.user.email,
          response.user.gender,
          response.user.age,
          response.user.location,
          response.user.bio,
          response.user.likedUsers,
          response.user.dislikedUsers,
          response.user.matchedUsers,
          response.user.interests,
          response.user.profileImageUrl
        );
      })
    );
  }

  getUsers(): Observable<User[]> {
    const apiUrl = 'http://localhost:3000/api/users';

    return this.http.get<{ message: string; users: any }>(apiUrl).pipe(
      map(response => {
        return response.users.map((user: any) => {
          return {
            ...user
          };
        });
      })
    );
  }

  updateUser(user: User): Observable<User> {
    const apiUrl = `http://localhost:3000/api/users/${user._id}`;

    return this.http.put<{ message: string; user: any }>(apiUrl, user).pipe(
      map(response => {
        return {
          ...response.user
        };
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  updateDislikedUsers(userId: string | null, dislikedUserId: string | null): Observable<any> {
    return this.http.put(`http://localhost:3000/api/user/${userId}/dislike`, { dislikedUserId });
  }

  updateLikedUsers(userId: string | null, likedUserId: string | null): Observable<any> {
    return this.http.put(`http://localhost:3000/api/user/${userId}/like`, { likedUserId });
  }

  updateMatchedUsers(userId1: string | null, userId2: string | null): Observable<any> {
    return this.http.put(`http://localhost:3000/api/user/match`, { userId1, userId2 });
  }


}
