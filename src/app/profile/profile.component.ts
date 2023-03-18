import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  dummyData = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    location: 'New York City, NY'
  };


  constructor() { }

  ngOnInit() {}

}
