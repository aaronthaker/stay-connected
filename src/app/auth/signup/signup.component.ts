import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private hoverTimeout: any;
  onboardingMessage = "Welcome to the Stay Connected signup screen. To create an account, please enter your email and password in the provided fields. If you need assistance, you can hover over any part of the form and have the information red aloud to you. To enable this feature, simply hover over the input fields, buttons, or links for 2 seconds, and a description will be spoken. Once you have filled in your details, click the 'Sign Up' button to complete the registration process. If you already have an account, click the 'Login' link at the bottom of the form to return to the login screen.";

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  startHover(field: string) {
    this.hoverTimeout = setTimeout(() => {
      this.speak(field);
    }, 2000);
  }

  stopHover() {
    clearTimeout(this.hoverTimeout);
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    // Stop any ongoing speech synthesis when the component is destroyed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speak(field: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    if (field === 'email') {
      utterance.text = 'Email input field';
    } else if (field === 'password') {
      utterance.text = 'Password input field';
    } else if (field === 'signup-button') {
      utterance.text = 'Sign Up';
    } else if (field === 'login-message') {
      utterance.text = 'Already have an account? Click here to log in.';
    } else if (field === 'hover-onboarding') {
      utterance.text = 'Click here to play the onboarding message.';
    } else if (field === 'onboardingMessage') {
      utterance.text = this.onboardingMessage;
    }
    synth.speak(utterance);
  }
}
