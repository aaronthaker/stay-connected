import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

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

  userEmail: string | null;

  constructor(private authService: AuthService, private router: Router) {}

  public appPages = [
    { title: 'Home', url: '/home', icon: 'heart' },
    { title: 'Matches', url: '/matches', icon: 'people' },
    { title: 'Messages', url: '/messages', icon: 'chatbox' },
    { title: 'Events', url: '/events', icon: 'calendar' }
];

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = localStorage.getItem('userEmail'); // Get the userEmail from local storage
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

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

}
