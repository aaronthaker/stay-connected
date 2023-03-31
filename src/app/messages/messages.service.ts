import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Message } from './message.model';
import { User } from '../users/user.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private socket: Socket
  ) { }

  get currentUserId(): string | null {
    return this.authService.getUserId();
  }

  getConversation(otherUserId: string): Observable<Message[]> {
    const apiUrl = `http://localhost:3000/api/messages/conversation/${otherUserId}`;
    return this.http
      .get<{ message: string; messages: any }>(apiUrl)
      .pipe(
        map(response => {
          return response.messages.map((message: any) => {
            return {
              id: message._id,
              senderId: message.senderId._id,
              receiverId: message.receiverId._id,
              content: message.content,
              unread: message.unread,
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
    message.unread = true;
    return this.http.post<{ message: string }>(apiUrl, message);
  }

  markMessageAsRead(messageId: string | null): Observable<{ message: string }> {
    const apiUrl = `http://localhost:3000/api/messages/${messageId}/read`;

    return this.http.patch<{ message: string }>(apiUrl, {});
  }

  getUnreadMessages(): Observable<Message[]> {
    const apiUrl = `http://localhost:3000/api/messages/unread/${this.currentUserId}`;

    return this.http.get<{ message: string; messages: any }>(apiUrl).pipe(
      map(response => {
        return response.messages.map((message: any) => {
          return {
            id: message._id,
            senderId: message.senderId._id,
            receiverId: message.receiverId._id,
            content: message.content,
            timestamp: new Date(message.timestamp),
            unread: message.unread
          };
        }).sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
      })
    );
  }

  getMatchedUsers(userId: string | null): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/api/user/${userId}/matches`);
  }

  listenForNewMessages(): void {
    console.log('Socket connection initialized:', this.socket);
    this.socket.fromEvent<Message>('newMessage').subscribe((message: any) => {
      if (message.message.receiverId == this.authService.getUserId()) {
        console.log('Received newMessage event with message:', message);
        this.socket.emit('newMessageReceived');
      }
    });
  }

}
