import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AnimationController, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsListComponent } from './events/events-list/events-list.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { UserDetailsComponent } from './home/user-details/user-details.component';
import { HomeComponent } from './home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './messages/conversation/conversation.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AccessibilityComponent } from './settings/accessibility/accessibility.component';
import { HelpComponent } from './settings/help/help.component';
import { LanguageComponent } from './settings/language/language.component';
import { NotificationsComponent } from './settings/notifications/notifications.component';
import { PreferencesComponent } from './settings/preferences/preferences.component';
import { PrivacyComponent } from './settings/privacy/privacy.component';
import { SocketIoModule } from 'ngx-socket-io';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { ConfirmLogoutModalComponent } from './confirm-logout-modal/confirm-logout-modal.component';
import { ImageViewerComponent } from './home/user-details/image-viewer/image-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsListComponent,
    CreateEventComponent,
    UserDetailsComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    MessagesComponent,
    ConversationComponent,
    ProfileComponent,
    SettingsComponent,
    AccessibilityComponent,
    HelpComponent,
    LanguageComponent,
    NotificationsComponent,
    PreferencesComponent,
    PrivacyComponent,
    OtherProfileComponent,
    ConfirmLogoutModalComponent,
    ImageViewerComponent
  ],
  imports: [
    IonicModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    SocketIoModule.forRoot({
      url: 'http://localhost:3000',
      options: {}
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AnimationController
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
