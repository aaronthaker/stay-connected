import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(300)),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) {}

  public appPages = [
    { title: 'Home', url: '/home', icon: 'heart' },
    { title: 'Matches', url: '/matches', icon: 'people' },
    { title: 'Messages', url: '/messages', icon: 'chatbox' },
    { title: 'Login', url: '/login', icon: 'chatbox', needsAuth: false },
    { title: 'Signup', url: '/signup', icon: 'chatbox', needsAuth: false },
    { title: 'Events', url: '/events', icon: 'calendar' }
  ];

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
