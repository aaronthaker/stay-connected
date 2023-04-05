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

  constructor(private http: HttpClient, private router: Router) { }

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
              imagePath: any;
              creator: any;
            }) => {
              return {
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                id: event._id,
                imagePath: event.imagePath,
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

  addEvent(title: string, description: string, date: string, location: string, image: File) {
    const eventData = new FormData();
    eventData.append('title', title);
    eventData.append('description', description);
    eventData.append('date', date);
    eventData.append('location', location);
    eventData.append('image', image, title);

    this.http
      .post<{ message: string; eventId: string; imagePath: string }>(
        'http://localhost:3000/api/events',
        eventData
      )

      .subscribe((res) => {
        const id = res.eventId;
        const event: Event = {
          id: id,
          title: title,
          description: description,
          date: date,
          location: location,
          imagePath: res.imagePath,
          creator: null
        };
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/events']);
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
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      location: string;
      date: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/events/' + id);
  }

  updateEvent(id: string, title: string, description: string, location: string, date: string, image: File | string) {
    let eventData: Event | FormData;

    if (typeof image === 'object') {
      eventData = new FormData();
      eventData.append('id', id);
      eventData.append('title', title);
      eventData.append('description', description);
      eventData.append('location', location);
      eventData.append('date', date);
      eventData.append('image', image, title);
    } else {
      eventData = {
        id: id,
        title: title,
        description: description,
        location: location,
        date: date,
        imagePath: image,
        creator: null
      };
    }

    this.http
      .put<{ message: string; imagePath: string }>('http://localhost:3000/api/events/' + id, eventData)
      .subscribe((res) => {
        const updatedEvents = [...this.events];
        const oldEventIndex = updatedEvents.findIndex((e) => e.id === id);
        const updatedEvent: Event = {
          id: id,
          title: title,
          description: description,
          location: location,
          date: date,
          imagePath: res.imagePath,
          creator: null
        };
        updatedEvents[oldEventIndex] = updatedEvent;
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/']);
      });
  }
}
