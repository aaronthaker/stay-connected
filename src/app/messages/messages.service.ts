import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  get currentUserId(): string | null {
    return this.authService.getUserId();
  }

}
