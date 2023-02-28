import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {

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
