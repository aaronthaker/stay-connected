import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Event } from '../event.model';
import { EventsService } from '../events.service';
import { DatePipe } from '@angular/common';
import { SoundService } from 'src/app/sound.service';
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
  touchDevice: boolean;

  constructor(
    public eventService: EventsService,
    private authService: AuthService,
    public datePipe: DatePipe,
    public soundService: SoundService,
    ) { }

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
    this.touchDevice = this.isTouchDevice();
  }

  readEventInfo(event: Event) {
    const eventTitle = `Title: ${event.title}`;
    const formattedDate = this.datePipe.transform(event.date, 'medium');
    const eventDate = `Date: ${formattedDate}`;
    const eventLocation = `Location: ${event.location}`;
    const eventDescription = `Description: ${event.description}`;

    const eventInfo = [eventTitle, eventDate, eventLocation, eventDescription].join('. ');

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(eventInfo);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  }

  onDelete(eventId: string) {
    this.eventService.deleteEvent(eventId);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();

    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

}
