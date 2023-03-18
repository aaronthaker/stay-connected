import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  constructor(private authService: AuthService) {}

  get currentUserId(): string | null {
    return this.authService.getUserId();
  }

}
