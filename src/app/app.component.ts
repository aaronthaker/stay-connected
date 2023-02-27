import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Meet', url: '/folder/meet', icon: 'paper-plane' },
    { title: 'Messages', url: '/folder/messages', icon: 'mail' },
    { title: 'Events', url: '/folder/events', icon: 'calendar' },
    { title: 'Log Out', url: '/folder/log-out', icon: 'log-out' },
  ];
  constructor() {}
}
