import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  onboardingMessage = 'Welcome to Stay Connected. Please login using your email and password below.';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
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
    }
    synth.speak(utterance);
  }
}
