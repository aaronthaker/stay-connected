import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
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
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;
  userId: string | null;

  constructor(public eventService: EventsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.eventService.getEvents();
    this.userId = this.authService.getUserId();
    this.eventsSub = this.eventService.getEventUpdateListener().subscribe((events: Event[]) => {
      this.isLoading = false;
      this.events = events;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(eventId: string) {
    this.eventService.deleteEvent(eventId);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
