import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MessagesService } from './messages/messages.service';
import { SharedService } from './shared.service';
import { ModalController } from '@ionic/angular';
import { ConfirmLogoutModalComponent } from './confirm-logout-modal/confirm-logout-modal.component';

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
  interval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService,
    private sharedService: SharedService,
    private modalController: ModalController
  ) { }

  public appPages = [
    { title: 'Home', url: '/home', icon: 'heart' },
    { title: 'Messages', url: '/messages', icon: 'chatbox' },
    { title: 'Events', url: '/events', icon: 'calendar' }
  ];

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.sharedService.conversationSelected.subscribe(() => {
      setTimeout(() => {
        this.updateUnreadMessagesCount();
      }, 500);
    });
    this.messagesService.listenForNewMessages().subscribe(message => {
      this.updateUnreadMessagesCount();
    });
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = localStorage.getItem('userEmail');
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userEmail = this.authService.getUserEmail();
      });
    this.updateUnreadMessagesCount();
  }

  updateUnreadMessagesCount() {
    if (this.authService.getIsAuth()) {
      this.messagesService.getUnreadMessages().subscribe((messages) => {
        this.unreadMessagesCount = messages.length;
      });
    }
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.presentConfirmLogoutModal();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  async presentConfirmLogoutModal() {
    const modal = await this.modalController.create({
      component: ConfirmLogoutModalComponent,
      cssClass: 'my-custom-class'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.confirm) {
      this.authService.logout();
    }
}


}
