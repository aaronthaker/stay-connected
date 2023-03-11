import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'heart' },
    { title: 'Matches', url: '/matches', icon: 'people' },
    { title: 'Messages', url: '/messages', icon: 'chatbox' },
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'Log Out', url: '/log-out', icon: 'log-out' },
  ];
  constructor() {}
}
