import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {

  user: any;
  users: any[] = [
    { name: 'John', photo: '../../../../assets/faces/face1.jpg' },
    { name: 'Jane', photo: '../../../../assets/faces/face2.jpg' },
    { name: 'Jack', photo: '../../../../assets/faces/face3.jpg' },
    { name: 'Jill', photo: '../../../../assets/faces/face3.jpg' }
  ];
  currentIndex = 0;

  constructor() { }

  ngOnInit() {
    // Get the current user
    this.user = this.users[this.currentIndex];
  }

  onCrossClick() {
    // Get the next user
    this.currentIndex++;
    this.user = this.users[this.currentIndex];
  }

  onTickClick() {
    // Get the next user
    this.currentIndex++;
    this.user = this.users[this.currentIndex];
  }

}
