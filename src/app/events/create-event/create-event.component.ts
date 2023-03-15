import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Event } from '../event.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  enteredEventTitle = '';
  enteredEventLocation = '';
  enteredEventDate = '';
  enteredEventDescription = '';
  private editMode: boolean = false;
  private eventId: string | null;
  event: Event;
  isLoading = false;

  constructor(
    public eventService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.editMode = true;
        this.eventId = paramMap.get('eventId')!;
        this.isLoading = true;
        this.eventService.getEvent(this.eventId).subscribe((eventData) => {
          this.isLoading = false;
          this.event = {
            id: eventData._id,
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            date: eventData.date,
          };
        });
      } else {
        this.editMode = false;
        this.eventId = null;
      }
    });
  }

  onSaveEvent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.editMode) {
      this.eventService.addEvent(
        form.value.title,
        form.value.description,
        form.value.date,
        form.value.location
      );
    } else if (this.editMode) {
      this.eventService.updateEvent(
        this.eventId!,
        form.value.title,
        form.value.description,
        form.value.location,
        form.value.date
      );
    }
    form.resetForm();
  }

  onSubmitClick() {
    this.router.navigate(['/events']);
  }
}
