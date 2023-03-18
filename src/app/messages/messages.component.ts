// messages.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/users.service';
import { MessagesService } from './messages.service';
import { User } from '../users/user.model';
import { Message, NewMessage } from './message.model';
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
    this.selectedUser = user;

    this.messageSub = this.messagesService.getMessages(this.currentUserId, user._id).subscribe(messages => {
      this.messages = messages;
    });
  }

  onSendMessage() {
    if (this.messageContent && this.messageContent.trim()) {
      const message: NewMessage = {
        senderId: this.currentUserId,
        receiverId: this.selectedUser._id,
        content: this.messageContent
      };

      this.messagesService.sendMessage(message).subscribe((newMessage: Message) => {
        this.messages.push(newMessage);
        this.messageContent = '';
      });
    }
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
