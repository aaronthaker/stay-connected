import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/users.service';
import { MessagesService } from './messages.service';
import { User } from '../users/user.model';
import { Message } from './message.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

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
  unreadMessages: Message[] = [];
  interval: any;
  unreadCounts: { [userId: string]: number } = {};

  constructor(
    public userService: UserService,
    public messagesService: MessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.getMatchedUsers();
      this.messagesService.listenForNewMessages();
    });
    this.startTimer();
  }

  getUnreadCount(userId: string): number {
    if (this.unreadCounts[userId]) {
      return this.unreadCounts[userId];
    } else {
      return 0;
    }
  }

ngOnDestroy() {
  this.stopTimer();
  if (this.userSub) {
    this.userSub.unsubscribe();
  }
  if (this.messageSub) {
    this.messageSub.unsubscribe();
  }
}

  startTimer() {
    this.interval = setInterval(() => {
      this.getUnreadMessages();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  onUserSelected(user: User) {
    this.selectedUser = user;
    this.router.navigate(['/conversation', user._id]);
    this.getUnreadMessages();
  }

  getMatchedUsers(): void {
    this.messagesService.getMatchedUsers(this.currentUserId).subscribe((users: User[]) => {
      this.matchedUsers = users;
    });
  }

  ionViewWillEnter() {
    this.getUnreadMessages();
  }

  getUnreadMessages() {
    this.messagesService.getUnreadMessages().subscribe(messages => {
      this.unreadMessages = messages;
      this.updateUnreadCounts();
    });
  }

  updateUnreadCounts() {
    this.unreadCounts = {};
    for (const message of this.unreadMessages) {
      if (!this.unreadCounts[message.senderId!]) {
        this.unreadCounts[message.senderId!] = 0;
      }
      this.unreadCounts[message.senderId!]++;
    }
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
