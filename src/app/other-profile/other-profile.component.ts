import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/user.model';
import { UserService } from '../users/users.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss'],
})
export class OtherProfileComponent implements OnInit {

  otherUserId: string;
  otherUser: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(this.otherUserId).subscribe((user: any) => {
      this.otherUser = user;
    });
  }
}
