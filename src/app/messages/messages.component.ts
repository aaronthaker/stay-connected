import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.model';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  contacts$ = this.messagesService.getMatchedUsers(this.messagesService.currentUserId);
  unreadMessages: Message[] = [];
  unreadMessagesSub: Subscription;
  touchDevice: boolean;

  constructor(private messagesService: MessagesService) { }

  ngOnInit(): void {
    this.messagesService.getUnreadMessages().subscribe((unreadMessages) => {
      this.unreadMessages = unreadMessages;
    });

    this.unreadMessagesSub = this.messagesService
      .listenForUnreadMessages()
      .subscribe((message: Message) => {
        this.unreadMessages.push(message);
      });
    this.touchDevice = this.isTouchDevice();
  }

  ngOnDestroy(): void {
    if (this.unreadMessagesSub) {
      this.unreadMessagesSub.unsubscribe();
    }
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  getUnreadMessageCount(contact: User): number {
    return this.unreadMessages.filter(
      (message) =>
        message.senderId === contact._id && message.receiverId === this.messagesService.currentUserId
    ).length;
  }
}
