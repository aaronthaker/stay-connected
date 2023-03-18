import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Message } from './message.model';

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
    const apiUrl = `http://localhost:3000/api/messages/conversation`;

    return this.http
      .post<{ message: string; messages: any }>(apiUrl, { userIds: otherUserIds })
      .pipe(
        map(response => {
          return response.messages.map((message: any) => {
            return {
              id: message._id,
              senderId: message.sender,
              receiverId: message.receiver,
              content: message.content,
              timestamp: new Date(message.timestamp)
            };
          });
        })
      );
  }

  sendMessage(message: Message): Observable<{ message: string }> {
    const apiUrl = 'http://localhost:3000/api/messages';

    return this.http.post<{ message: string }>(apiUrl, message);
  }
}
