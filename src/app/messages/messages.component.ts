import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/users.service';
import { MessagesService } from './messages.service';
import { User } from '../users/user.model';
import { Message } from './message.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SharedService } from '../shared.service';

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
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.getMatchedUsers();
      this.messagesService.listenForNewMessages();
    });
    this.messagesService.listenForUnreadMessages().subscribe(message => {
      this.unreadMessages.push(message);
      this.updateUnreadCounts();
    });

    this.messagesService.listenForNewMessages().subscribe(message => {
      this.unreadMessages.push(message);
      this.updateUnreadCounts();
    });
  }


  getUnreadCount(userId: string): number {
    if (this.unreadCounts[userId]) {
      return this.unreadCounts[userId];
    } else {
      return 0;
    }
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
    this.sharedService.conversationSelected.next(user._id);
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
    if (this.authService.getIsAuth()) {
      this.messagesService.getUnreadMessages().subscribe(messages => {
        this.unreadMessages = messages;
        this.updateUnreadCounts();
      });
    }
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

  unmatchUser(user: User) {
    this.userService.unmatchUser(this.currentUserId, user._id).subscribe(response => {
      this.matchedUsers = this.matchedUsers.filter(matchedUser => matchedUser._id !== user._id);
    });
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
