import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<Event[]>();

  getEvents() {
    this.http.get<{message: string, events: Event[]}>('http://localhost:3000/api/events').subscribe((eventData) => {
      console.log(eventData)
      this.events = eventData.events;
      this.eventsUpdated.next([...this.events]);
    })
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
      location: location
    }
    this.http.post<{message: string}>('http://localhost:3000/api/events', event).subscribe((res) => {
      console.log(res.message);
    })
    // Should put two below inside response above^
    this.events.push(event);
    this.eventsUpdated.next([...this.events])
  }

  constructor(private http: HttpClient) { }
}
