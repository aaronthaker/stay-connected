import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/messages/messages.service';
import { User } from 'src/app/users/user.model';
import { UserService } from 'src/app/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {

  displayedUsers: User[] = [];
  currentUserId: string | null;
  displayedUser: User;
  currentUser: User;
  currentUserDislikes: string[] | undefined;
  currentUserLikes: string[] | undefined;

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
        this.displayedUsers = users.filter(user =>
          user._id !== this.currentUserId &&
          !this.currentUserDislikes?.includes(user._id) &&
          !this.currentUserLikes?.includes(user._id)
        );
        this.displayedUser = this.displayedUsers[this.currentIndex];
      });
    })
  }

  onCrossClick(displayedUser: User) {
    this.userService.updateDislikedUsers(this.currentUserId, displayedUser._id).subscribe((response) => {
      console.log(response);
    });
    this.currentIndex++;
    this.displayedUser = this.displayedUsers[this.currentIndex];
  }

  onTickClick(displayedUser: User) {
    this.userService.updateLikedUsers(this.currentUserId, displayedUser._id).subscribe((response) => {
      // Check if the displayed user has liked the current user
      if (response.matched) {
        // Update the matchedUsers arrays for both users
        this.userService.updateMatchedUsers(this.currentUserId, displayedUser._id).subscribe();
      }
    });
    this.currentIndex++;
    this.displayedUser = this.displayedUsers[this.currentIndex];
  }


}
