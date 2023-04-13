import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.model';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { UserService } from '../users/users.service';
import { ViewWillEnter } from '@ionic/angular';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, ViewWillEnter {
  contacts$ = this.messagesService.getMatchedUsers(this.messagesService.currentUserId);
  unreadMessages: Message[] = [];
  unreadMessagesSub: Subscription;
  conversations: any[] = [];

  users: User[] = [];
  messages: Message[] = [];
  selectedUser: User;
  messageContent: string;
  userSub: Subscription;
  messageSub: Subscription;
  matchedUsers: User[] = [];
  interval: any;
  unreadCounts: { [userId: string]: number } = {};
  touchDevice: boolean;

  constructor(
    public messagesService: MessagesService,
    public userService: UserService,
    private soundService: SoundService
    ) { }

  ngOnInit(): void {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user._id !== this.currentUserId);
      this.messagesService.listenForNewMessages();
    });
    this.messagesService.getUnreadMessages().subscribe((unreadMessages) => {
      this.unreadMessages = unreadMessages;
    });
    this.messagesService.listenForNewMessages().subscribe(message => {
      this.unreadMessages.push(message);
      this.updateUnreadCounts();

      // Update the last message of the corresponding conversation
      const conversation = this.conversations.find(conv => conv.contact._id === message.senderId);
      if (conversation) {
        conversation.lastMessage = message;
      } else {
        // If the conversation doesn't exist yet, create it
        this.userService.getUser(message.senderId!).subscribe(user => {
          this.conversations.push({
            contact: user,
            lastMessage: message
          });
        });
      }
    });

    this.unreadMessagesSub = this.messagesService
      .listenForUnreadMessages()
      .subscribe((message: Message) => {
        this.unreadMessages.push(message);
      });

    this.contacts$.subscribe((contacts) => {
      this.conversations = contacts.map((contact) => {
        return {
          contact: contact,
          lastMessage: null,
        };
      });

      this.updateLastMessages();
    });
    this.initializeData();
    this.touchDevice = this.isTouchDevice();
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  ngOnDestroy(): void {
    if (this.unreadMessagesSub) {
      this.unreadMessagesSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  getUnreadMessageCount(contact: User): number {
    return this.unreadMessages.filter(
      (message) =>
        message.senderId === contact._id && message.receiverId === this.messagesService.currentUserId
    ).length;
  }

  updateLastMessages(): void {
    this.conversations.forEach((conversation, index) => {
      this.messagesService
        .getConversation(conversation.contact._id)
        .subscribe((messages) => {
          if (messages.length > 0) {
            conversation.lastMessage = messages[messages.length - 1];
          } else {
            this.conversations.splice(index, 1);
          }
        });
    });
  }

  initializeData(): void {
    this.contacts$.subscribe((contacts) => {
      this.conversations = contacts.map((contact) => {
        return {
          contact: contact,
          lastMessage: null,
        };
      });

      this.updateLastMessages();
    });

    this.messagesService.getUnreadMessages().subscribe((unreadMessages) => {
      this.unreadMessages = unreadMessages;
      this.updateUnreadCounts();
    });

  }

  ionViewWillEnter(): void {
    this.initializeData();
  }


  getUnreadCount(userId: string): number {
    if (this.unreadCounts[userId]) {
      return this.unreadCounts[userId];
    } else {
      return 0;
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

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  speakText(textToSpeak: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      // Handle the case where the browser doesn't support speech synthesis
      console.error('Speech synthesis is not supported in this browser.');
    }
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

}
