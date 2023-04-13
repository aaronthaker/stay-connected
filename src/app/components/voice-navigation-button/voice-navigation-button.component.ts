import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-voice-navigation-button',
  templateUrl: './voice-navigation-button.component.html',
  styleUrls: ['./voice-navigation-button.component.scss'],
})

export class VoiceNavigationButtonComponent implements OnInit, OnDestroy {
  private recognition: any;

  constructor(private router: Router, private liveAnnouncer: LiveAnnouncer) {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  ngOnInit(): void {
    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      this.handleVoiceCommand(command);
    };
  }

  ngOnDestroy(): void {
    this.recognition.stop();
  }

  startRecognition(): void {
    this.recognition.start();
    this.liveAnnouncer.announce('Listening for voice command');
  }

  handleVoiceCommand(command: string): void {
    console.log(command)
    if (command.includes('events')) {
      this.router.navigate(['/events']);
    } else if (command.includes('messages') || command.includes('message') || command.includes('conversation') || command.includes('convo') || command.includes('convos')) {
      this.router.navigate(['/messages']);
    } else if (command.includes('matched') || command.includes('match') || command.includes('matches') || command.includes('users')) {
      this.router.navigate(['/matched-users']);
    } else if (command.includes('profile' || 'account')) {
      this.router.navigate(['/profile']);
    } else if (command.includes('settings')) {
      this.router.navigate(['/settings']);
    } else if (command.includes('home')) {
      this.router.navigate(['/home']);
    } else if (command.includes('main')) {
      this.router.navigate(['/settings']);
    } else if (command.includes('log out' || 'logout' || 'log-out')) {
      this.router.navigate(['/settings']);
    }
  }
}
