import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MessagesService } from './messages/messages.service';

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
  unreadMessagesCount = 0;

  constructor(private authService: AuthService, private router: Router, private messagesService: MessagesService) { }

  public appPages = [
    { title: 'Home', url: '/home', icon: 'heart' },
    { title: 'Messages', url: '/messages', icon: 'chatbox' },
    { title: 'Events', url: '/events', icon: 'calendar' }
  ];

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = localStorage.getItem('userEmail'); // Get the userEmail from local storage
    this.updateUnreadMessagesCount();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userEmail = this.authService.getUserEmail(); // Update userEmail on login/logout
      });
  }

  updateUnreadMessagesCount() {
    this.messagesService.getUnreadMessages().subscribe((messages) => {
      this.unreadMessagesCount = messages.length;
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
