import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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
export class UserDetailsComponent implements OnInit {

  displayedUsers: User[] = [];
  currentUserId: string | null;
  displayedUser: User;
  currentUser: User;
  currentUserDislikes: string[] | undefined;
  currentUserLikes: string[] | undefined;
  showMatchMessage: boolean;
  commonInterests: boolean = false;

  userSub: Subscription;
  currentIndex = 0;

  constructor(
    private messagesService: MessagesService,
    private userService: UserService,
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
    })
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
      // Check if the displayed user has liked the current user
      if (response.matched) {
        // Update the matchedUsers arrays for both users
        this.userService.updateMatchedUsers(this.currentUserId, displayedUser._id).subscribe();
        this.showMatchMessage = true;
        // Set a delay before showing the next user and hiding the match message
        setTimeout(() => {
          this.currentIndex++;
          this.displayedUser = this.displayedUsers[this.currentIndex];
          this.showMatchMessage = false;
          this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
        }, 5000);
      } else {
        this.currentIndex++;
        this.displayedUser = this.displayedUsers[this.currentIndex];
        this.showMatchMessage = false;
        this.commonInterests = this.hasCommonInterests(this.currentUser, this.displayedUser);
      }

    });
  }


}
