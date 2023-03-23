import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { User } from '../users/user.model';
import { UserService } from '../users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  currentUserId: string;
  currentUser: User;
  editMode = false;

  constructor(
    private messagesService: MessagesService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.currentUserId = this.messagesService.currentUserId!;
    this.userService.getUser(this.currentUserId).subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  toggleEditMode() {
    if (this.editMode) {
      this.userService.updateUser(this.currentUser).subscribe((user: User) => {
        console.log('User updated:', user);
      });
    }
    this.editMode = !this.editMode;
  }

}
