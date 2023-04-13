import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../messages.service';
import { UserService } from '../../users/users.service';
import { Message } from '../message.model';
import { User } from 'src/app/users/user.model';
import { AnimationController, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SoundService } from 'src/app/sound.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  public user: User;
  public messages: any[] = [];
  public newMessage: string;
  newMessageSub: Subscription;
  touchDevice: boolean;

  @ViewChild('content', { static: false }) content: IonContent;

  constructor(
    private route: ActivatedRoute,
    public messagesService: MessagesService,
    private userService: UserService,
    private soundService: SoundService,
    private animationCtrl: AnimationController
  ) {
    this.touchDevice = this.isTouchDevice();
  }

  ngOnInit() {
    const otherUserId = this.route.snapshot.params['id'];
    this.userService.getUser(otherUserId).subscribe(user => {
      this.user = user;
    });
    this.messagesService.getConversation(otherUserId).subscribe(messages => {
      this.messages = messages;
      this.markMessagesAsRead();
      this.scrollToBottom();
    });
    this.newMessageSub = this.messagesService.listenForNewMessages().subscribe((message: Message) => {
      if (message.senderId === this.user._id && message.receiverId === this.messagesService.currentUserId) {
        this.messages.push(message);
        this.markMessagesAsRead();
        this.scrollToBottom();
      }
    });
  }

  sayLastTenMessages() {
    const startIndex = Math.max(this.messages.length - 10, 0);
    const lastTenMessages = this.messages.slice(startIndex);
    for (const message of lastTenMessages) {
      const senderName = message.senderId === this.messagesService.currentUserId ? 'You' : this.user.name;
      const textToSpeak = `${senderName}: ${message.content}`;
      this.speakText(textToSpeak);
    }
  }

  speakText(textToSpeak: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  ngOnDestroy() {
    if (this.newMessageSub) {
      this.newMessageSub.unsubscribe();
    }
    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 300);
  }

  markMessagesAsRead() {
    const messageIds: string[] = [];
    this.messages.forEach(message => {
      if (message.unread && message.receiverId === this.messagesService.currentUserId) {
        if (message._id) {
          message.id = message._id;
          delete message._id;
        }
        messageIds.push(message.id);
        this.messagesService.markMessageAsRead(message.id).subscribe(() => {
          this.messagesService.broadcastMessageRead(); // Add this line
        });
      }
    });
    if (messageIds.length > 0) {
      this.messagesService.updateUnreadMessagesCount(messageIds);
    }
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  sendMessage() {
    const message: Message = {
      id: null,
      senderId: this.messagesService.currentUserId,
      receiverId: this.user._id,
      content: this.newMessage,
      timestamp: new Date(),
      unread: true
    };
    this.messagesService.sendMessage(message).subscribe(() => {
      this.messages.push(message);
      this.newMessage = '';

      // Animation
      setTimeout(() => {
        const index = this.messages.length - 1;
        const messageElement = document.querySelector(`[data-index="${index}"]`);
        if (messageElement) {
          const animation = this.animationCtrl.create()
            .addElement(messageElement)
            .duration(300)
            .iterations(1)
            .fromTo('opacity', '0', '1')
            .fromTo('transform', 'translateY(30px)', 'translateY(0)');
          animation.play();
        }
      }, 0);
    });
  }
}
