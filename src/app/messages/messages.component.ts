import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/users.service';
import { MessagesService } from './messages.service';
import { User } from '../users/user.model';
import { Message } from './message.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  matchedUsers: User[] = [];

  constructor(
    public userService: UserService,
    public messagesService: MessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
    this.getMatchedUsers();
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
    this.selectedUser = user;
    this.router.navigate(['/conversation', user._id]);
  }

  getMatchedUsers(): void {
    this.messagesService.getMatchedUsers(this.currentUserId).subscribe((users: User[]) => {
      this.matchedUsers = users;
      console.log(this.matchedUsers)
    });
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
