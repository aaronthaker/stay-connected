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

  constructor(
    public userService: UserService,
    public messagesService: MessagesService,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.getMatchedUsers();
      this.listenForNewMessages();
    });
    console.log('Socket connection initialized:', this.socket);
  }

  getUnreadCount(userId: string): number {
    return this.unreadMessages.filter(message => message?.senderId === userId).length;
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
    });
  }

  ionViewWillEnter() {
    this.messagesService.getUnreadMessages().subscribe(messages => {
      this.unreadMessages = messages;
    });
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

  listenForNewMessages(): void {
    this.socket.fromEvent<Message>('newMessage').subscribe((message: Message) => {
      console.log('Received newMessage event with message:', message);
      if (message.senderId === this.selectedUser?._id) {
        this.messages.push(message);
      } else {
        const index = this.matchedUsers.findIndex(user => user._id === message.senderId);
        if (index >= 0) {
          this.matchedUsers[index].lastMessage = message.content;
          this.unreadMessages.push(message);
        }
      }
    });
  }
}
