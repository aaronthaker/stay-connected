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

  // user: User;
  displayedUsers: User[] = [];
  currentUserId: string | null;
  displayedUser: User;

  userSub: Subscription;
  currentIndex = 0;

  constructor(
    private messagesService: MessagesService,
    private userService: UserService,
    ) {}

  ngOnInit() {
    this.currentUserId = this.messagesService.currentUserId;
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.displayedUsers = users.filter(user => user._id !== this.currentUserId);
      this.displayedUser = this.displayedUsers[this.currentIndex];
    });
  }

  onCrossClick() {
    // Get the next user
    this.currentIndex++;
    this.displayedUser = this.displayedUsers[this.currentIndex];
    // Logic to add the displayedUser._id to likedUsers
  }

  onTickClick() {
    // Get the next user
    this.currentIndex++;
    this.displayedUser = this.displayedUsers[this.currentIndex];
  }

}
