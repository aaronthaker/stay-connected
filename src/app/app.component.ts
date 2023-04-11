import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
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
  userName: string | null;
  unreadMessagesCount = 0;
  interval: any;

  touchDevice: boolean;
  hoverTimeout: any;

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
    this.userName = localStorage.getItem('userName');
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userEmail = this.authService.getUserEmail();
        this.userName = this.authService.getUserName();
      });
    this.updateUnreadMessagesCount();
    this.touchDevice = this.isTouchDevice();
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(target: EventTarget | null) {
    if (!this.touchDevice && target instanceof HTMLElement) {
      const elementId = target.getAttribute('id');
      if (elementId) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          this.speakElementText(elementId);
        }, 1500);
      }
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave(target: EventTarget | null) {
    if (!this.touchDevice && target instanceof HTMLElement) {
      clearTimeout(this.hoverTimeout);
    }
  }

  speakElementText(elementId: string) {
    let textToSpeak = '';
    const pagePrefix = 'page-';
    if (elementId.startsWith(pagePrefix)) {
      if (elementId) {
        textToSpeak = elementId.substring(5);
      }
    }

    if (textToSpeak) {
      this.speakText(textToSpeak);
    }
  }


  speakText(textToSpeak: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      // Handle the case where the browser doesn't support speech synthesis
      console.error('Speech synthesis is not supported in this browser.');
    }
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
