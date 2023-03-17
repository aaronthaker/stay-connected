import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<Event[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getEvents() {
    this.http
      .get<{ message: string; events: any }>('http://localhost:3000/api/events')
      .pipe(
        map((eventData) => {
          return eventData.events.map(
            (event: {
              title: any;
              description: any;
              location: any;
              date: any;
              _id: any;
              creator: any;
            }) => {
              return {
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                id: event._id,
                creator: event.creator
              };
            }
          );
        })
      )
      .subscribe((transformedEvents) => {
        this.events = transformedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  addEvent(title: string, description: string, date: string, location: string) {
    const event: Event = {
      id: 'null',
      title: title,
      description: description,
      date: date,
      location: location,
    };
    this.http
      .post<{ message: string; eventId: string }>(
        'http://localhost:3000/api/events',
        event
      )
      .subscribe((res) => {
        const id = res.eventId;
        event.id = id;
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/']);
      });
  }

  deleteEvent(eventId: string) {
    this.http
      .delete('http://localhost:3000/api/events/' + eventId)
      .subscribe(() => {
        const updatedEvents = this.events.filter(
          (event) => event.id !== eventId
        );
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEvent(id: string) {
    // return {...this.events.find(e => e.id === id)};
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      location: string;
      date: string;
    }>('http://localhost:3000/api/events/' + id);
  }

  updateEvent(
    id: string,
    title: string,
    description: string,
    location: string,
    date: string
  ) {
    const event: Event = {
      id: id,
      title: title,
      description: description,
      location: location,
      date: date,
    };
    this.http
      .put('http://localhost:3000/api/events/' + id, event)
      .subscribe((res) => {
        const updatedEvents = [...this.events];
        const oldEventIndex = updatedEvents.findIndex((e) => e.id === event.id);
        updatedEvents[oldEventIndex] = event;
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/']);
      });
  }
}
