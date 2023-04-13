import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SoundService } from 'src/app/sound.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage: string;
  private authStatusSub: Subscription;
  successMessage = '';
  private hoverTimeout: any;
  onboardingMessage = "Welcome to the Stay Connected login screen. To access your account, please enter your email and password in the provided fields. If you need assistance, you can hover over any part of the form and have the information red aloud to you. To enable this feature, simply hover over the input fields, buttons, or links for 2 seconds, and a description will be spoken. Once you have filled in your details, click the 'Login' button to enter the application. If you don't have an account yet, click the 'Sign up' link at the bottom of the form to register for a new account.";
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private soundService: SoundService,
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.queryParams.subscribe((params) => {
      if (params['signup'] === 'success') {
        this.successMessage = 'Signup successful, now login.';
      }
    });
  }

  startHover(field: string) {
    this.hoverTimeout = setTimeout(() => {
      this.speak(field);
    }, 2000);
  }

  stopHover() {
    clearTimeout(this.hoverTimeout);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password, (errorMessage) => {
      this.isLoading = false;
      this.errorMessage = errorMessage;
    });
  }

  speak(field: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    if (field === 'email') {
      utterance.text = 'Email input field';
    } else if (field === 'password') {
      utterance.text = 'Password input field';
    } else if (field === 'onboardingMessage') {
      utterance.text = this.onboardingMessage;
    } else if (field === 'login-button') {
      utterance.text = 'Login';
    } else if (field === 'signup-message') {
      utterance.text = 'Do you not have an account? Click here to sign up.';
    } else if (field === 'hover-onboarding') {
      utterance.text = 'Click here to play the onboarding message.';
    } else {
      utterance.text = field;
    }
    synth.speak(utterance);
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

}
