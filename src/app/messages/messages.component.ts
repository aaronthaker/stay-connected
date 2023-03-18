// messages.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/users.service';
import { MessagesService } from './messages.service';
import { User } from '../users/user.model';
import { Message } from './message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  users: User[] = [];
  messages: Message[] = [];
  selectedUser: User;
  messageContent: string;
  userSub: Subscription;
  messageSub: Subscription;

  constructor(public userService: UserService, public messagesService: MessagesService) {}

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  onUserSelected(user: User) {
    console.log(user)
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
