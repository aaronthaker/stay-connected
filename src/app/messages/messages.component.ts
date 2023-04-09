import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  touchDevice: boolean;
  hoverTimeout: any;

  constructor(
    public userService: UserService,
    public messagesService: MessagesService,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user._id !== this.currentUserId);
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
    this.touchDevice = this.isTouchDevice();
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(target: EventTarget | null) {
    if (!this.touchDevice && target instanceof HTMLElement) {
      const elementId = target.getAttribute('id');
      if (elementId) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          this.speakElementText(elementId);
          console.log(elementId)
        }, 1500);
      }
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave(target: EventTarget | null) {
    if (!this.touchDevice && target instanceof HTMLElement) {
      clearTimeout(this.hoverTimeout);
    }
  }

  speakElementText(elementId: string) {
    let textToSpeak = '';
    const matchedUserNamePrefix = 'matched-user-name-';
    if (elementId.startsWith(matchedUserNamePrefix)) {
      const userId = elementId.slice(matchedUserNamePrefix.length);
      const matchedUser = this.matchedUsers.find(user => user._id === userId);
      if (matchedUser) {
        textToSpeak = matchedUser.name;
      }
    } else {
      switch (elementId) {
        case 'matched-users-title':
          textToSpeak = 'Matched Users';
          break;
        case 'unmatchBtn':
          textToSpeak = 'Unmatch';
          break;
        default:
          break;
      }
    }

    if (textToSpeak) {
      this.speakText(textToSpeak);
    }
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

  onUserProfileSelected(userId: string) {
    this.router.navigate(['/other-profile', userId]);
  }

  get currentUserId() {
    return this.messagesService.currentUserId;
  }

}
