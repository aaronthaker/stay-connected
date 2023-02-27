import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  enteredValue = '';
  newEvent = 'NO CONTENT';

  onAddEvent() {
    this.newEvent = this.enteredValue;
  }


  existingEvents = [
    {
      event: "Cunty",
      location: "CuntyCity",
      date: "Tomorrow"
    },
    {
      event: "Test",
      location: "Test",
      date: "Test"
    }
  ];


  constructor() { }

  ngOnInit() {}

}
