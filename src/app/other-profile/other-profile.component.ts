import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/user.model';
import { UserService } from '../users/users.service';
import { SoundService } from '../sound.service';

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
    private soundService: SoundService,
  ) {
  }

  ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(this.otherUserId).subscribe((user: any) => {
      this.otherUser = user;
    });
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

}
