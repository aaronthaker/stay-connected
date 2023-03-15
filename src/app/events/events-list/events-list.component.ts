import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from '../event.model';
import { EventsService } from '../events.service';
@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit, OnDestroy {

  events: Event[] = [];
  private eventsSub: Subscription
  isLoading = false;

  constructor(public eventService: EventsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.eventService.getEvents();
    this.eventsSub = this.eventService.getEventUpdateListener().subscribe((events: Event[]) => {
      this.isLoading = false;
      this.events = events;
    });
  }

  onDelete(eventId: string) {
    this.eventService.deleteEvent(eventId);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }

}
