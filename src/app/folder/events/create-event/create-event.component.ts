import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})

export class CreateEventComponent implements OnInit {

  enteredValue = '';
  newEvent = 'NO CONTENT';

  onAddEvent() {
    this.newEvent = this.enteredValue;
  }

  constructor() { }

  ngOnInit() {}

}
