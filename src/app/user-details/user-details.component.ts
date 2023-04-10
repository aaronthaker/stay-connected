import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/messages/messages.service';
import { User } from 'src/app/users/user.model';
import { UserService } from 'src/app/users/users.service';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

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
export class UserDetailsComponent implements OnInit {

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
    private modalController: ModalController,
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

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  async openImage(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imageUrl: imageUrl,
      },
    });
    return await modal.present();
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

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(target: EventTarget | null) {
    if (!this.touchDevice && target instanceof HTMLElement) {
      const elementId = target.getAttribute('id');
      if (elementId) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          this.speakElementText(elementId);
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
    switch (elementId) {
      case 'location-span':
        textToSpeak = this.displayedUser?.location!;
        break;
      case 'name':
        textToSpeak = `${this.displayedUser?.name!}, ${this.displayedUser?.age!}`;
        break;
      case 'bio':
        textToSpeak = this.displayedUser?.bio!;
        break;
      case 'match-message':
        textToSpeak = 'You have common interests with this person!';
        break;
      case 'profileButton':
        textToSpeak = 'See this user\'s full profile.';
        break;
      case 'tick-button':
        textToSpeak = 'Like';
        break;
      case 'cross-button':
        textToSpeak = 'Dislike';
        break;
      default:
        break;
    }
    if (textToSpeak) {
      this.speakText(textToSpeak);
    }
  }

}
