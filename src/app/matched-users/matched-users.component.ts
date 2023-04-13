import { Component, OnInit } from '@angular/core';
import { User } from '../users/user.model';
import { Message } from '../messages/message.model';
import { Subscription } from 'rxjs';
import { UserService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SharedService } from '../shared.service';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-matched-users',
  templateUrl: './matched-users.component.html',
  styleUrls: ['./matched-users.component.scss'],
})
export class MatchedUsersComponent implements OnInit {
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

  constructor(
    public userService: UserService,
    public messagesService: MessagesService,
    private router: Router,
    private authService: AuthService,
    private soundService: SoundService,
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

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
