// users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

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


  // getUserUpdateListener() {
  //   return this.usersUpdated.asObservable();
  // }
}
