import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MessagesService } from './messages/messages.service';
import { SharedService } from './shared.service';
import { ModalController } from '@ionic/angular';
import { ConfirmLogoutModalComponent } from './confirm-logout-modal/confirm-logout-modal.component';
import { SoundService } from './sound.service';

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
  userName: string | null;
  unreadMessagesCount = 0;
  interval: any;

  touchDevice: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService,
    private sharedService: SharedService,
    private modalController: ModalController,
    private soundService: SoundService
  ) { }

  public appPages = [
    { title: 'Meet People', url: '/home', icon: 'heart' },
    { title: 'Matched Users', url: '/matched-users', icon: 'chatbox' },
    { title: 'Messages', url: '/messages', icon: 'people' },
    { title: 'Events', url: '/events', icon: 'calendar' },
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
    this.messagesService.listenForMessageRead().subscribe(() => {
      this.updateUnreadMessagesCount();
    });
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userEmail = this.authService.getUserEmail();
        this.userName = this.authService.getUserName();
      });
    this.updateUnreadMessagesCount();
    this.messagesService.listenForUnreadMessages().subscribe(() => {
      this.updateUnreadMessagesCount();
    });
    this.touchDevice = this.isTouchDevice();
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
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
    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
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
