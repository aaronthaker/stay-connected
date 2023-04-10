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
    }
    synth.speak(utterance);
  }
}
