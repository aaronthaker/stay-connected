import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  enteredEventTitle = '';
  enteredEventLocation = '';
  enteredEventDate = '';
  enteredEventDescription = '';

  constructor(public eventService: EventsService) {}

  ngOnInit() {}

  onAddEvent(form: NgForm) {
    this.eventService.addEvent(form.value.title, form.value.description, form.value.date, form.value.location)
  }

}
