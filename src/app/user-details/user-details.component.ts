import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/messages/messages.service';
import { User } from 'src/app/users/user.model';
import { UserService } from 'src/app/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1000ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  displayedUsers: User[] = [];
  currentUserId: string | null;
  displayedUser: User;
  currentUser: User;
  currentUserDislikes: string[] | undefined;
  currentUserLikes: string[] | undefined;
  commonInterests: boolean = false;
  touchDevice: boolean;
  likedYouToo: boolean = false;

  userSub: Subscription;
  currentIndex = 0;

  hoverTimeout: any;

  constructor(
    private messagesService: MessagesService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.currentUserId = this.messagesService.currentUserId;
    this.userService.getUser(this.currentUserId).subscribe((user) => {
      this.currentUser = user;
      this.currentUserLikes = user.likedUsers;
      this.currentUserDislikes = user.dislikedUsers;
      this.userSub = this.userService.getUsers().subscribe(users => {
        const usersWithCommonInterests = users.filter(user =>
          user._id !== this.currentUserId &&
          !this.currentUserDislikes?.includes(user._id) &&
          !this.currentUserLikes?.includes(user._id) &&
          this.hasCommonInterests(user, this.currentUser)
        );
        const usersWithoutCommonInterests = users.filter(user =>
          user._id !== this.currentUserId &&
          !this.currentUserDislikes?.includes(user._id) &&
          !this.currentUserLikes?.includes(user._id) &&
          !this.hasCommonInterests(user, this.currentUser)
        );
        this.displayedUsers = [...usersWithCommonInterests, ...usersWithoutCommonInterests];
        this.displayedUser = this.displayedUsers[this.currentIndex];
        this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
      });
    });
    this.touchDevice = this.isTouchDevice();
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  ngOnDestroy() {
    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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

  hasCommonInterests(user1: User, user2: User): boolean {
    return user1.interests!.some(interest => user2.interests?.includes(interest));
  }

  onCrossClick(displayedUser: User) {
    this.userService.updateDislikedUsers(this.currentUserId, displayedUser._id).subscribe(() => {
    });
    this.currentIndex++;
    this.displayedUser = this.displayedUsers[this.currentIndex];
    this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
  }

  onTickClick(displayedUser: User) {
    this.userService.updateLikedUsers(this.currentUserId, displayedUser._id).subscribe((response) => {
      if (response.matched) {
        this.userService.updateMatchedUsers(this.currentUserId, displayedUser._id).subscribe();
        this.likedYouToo = true;
        setTimeout(() => {
          this.currentIndex++;
          this.displayedUser = this.displayedUsers[this.currentIndex];
          this.likedYouToo = false;
          this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
        }, 5000);
      } else {
        this.currentIndex++;
        this.displayedUser = this.displayedUsers[this.currentIndex];
        this.likedYouToo = false;
        this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
      }
    });
  }

  navigateToConversation(userId: string) {
    this.router.navigate(['/conversation', userId]);
  }

  onUserProfileSelected(userId: string) {
    this.router.navigate(['/other-profile', userId]);
  }

  onListenToProfileClick() {
    if (this.displayedUser) {
      const profileText = `
        Name: ${this.displayedUser.name}, ${this.displayedUser.age}.
        Location: ${this.displayedUser.location}.
        Bio: ${this.displayedUser.bio}.
      `;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(profileText);
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      } else {
        // Handle the case where the browser doesn't support speech synthesis
        console.error('Speech synthesis is not supported in this browser.');
      }
    }
  }

}
