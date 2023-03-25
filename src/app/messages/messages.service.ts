import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Message } from './message.model';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  get currentUserId(): string | null {
    return this.authService.getUserId();
  }

  getConversation(otherUserIds: string[]): Observable<Message[]> {
    console.log({ userIds: otherUserIds })
    const apiUrl = `http://localhost:3000/api/messages/conversation`;

    return this.http
      .post<{ message: string; messages: any }>(apiUrl, { userIds: otherUserIds })
      .pipe(
        map(response => {
          return response.messages.map((message: any) => {
            return {
              id: message._id,
              senderId: message.senderId._id,
              receiverId: message.receiverId._id,
              content: message.content,
              timestamp: new Date(message.timestamp)
            };
          }).sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          });
        })
      );
}

  sendMessage(message: Message): Observable<{ message: string }> {
    const apiUrl = 'http://localhost:3000/api/messages';

    return this.http.post<{ message: string }>(apiUrl, message);
  }

  getMatchedUsers(userId: string | null): Observable<User[]> {
    // Replace with the correct API endpoint
    return this.http.get<User[]>(`http://localhost:3000/api/user/${userId}/matches`);
}

}
