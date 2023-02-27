import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Meet', url: '/meet', icon: 'paper-plane' },
    { title: 'Messages', url: '/messages', icon: 'mail' },
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'Log Out', url: '/log-out', icon: 'log-out' },
  ];
  constructor() {}
}
