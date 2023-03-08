import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  createEvent() {
    const newEvent = {
        event: this.enteredEventTitle,
        location: this.enteredEventLocation,
        date: this.enteredEventDate,
        description: this.enteredEventDescription
    }
    this.modalController.dismiss(newEvent);
  }

}
