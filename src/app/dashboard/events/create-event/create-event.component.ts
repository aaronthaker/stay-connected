import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  host: {
    'class': 'modal-content',
    'style': 'width:100%; height: 100%;'
}
})
export class CreateEventComponent implements OnInit {
  enteredEventTitle = '';
  enteredEventLocation = '';
  enteredEventDate = '';
  enteredEventDescription = '';

  @Output() eventCreated = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  addEvent() {
    const event = {
      event: this.enteredEventTitle,
      location: this.enteredEventLocation,
      date: this.enteredEventDate,
      description: this.enteredEventDescription
    };
    this.eventCreated.emit(event);
  }

}
