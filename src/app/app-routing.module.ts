import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { HomeComponent } from './home/home.component';
import { ConversationComponent } from './messages/conversation/conversation.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { AccessibilityComponent } from './settings/accessibility/accessibility.component';
import { HelpComponent } from './settings/help/help.component';
import { LanguageComponent } from './settings/language/language.component';
import { NotificationsComponent } from './settings/notifications/notifications.component';
import { PreferencesComponent } from './settings/preferences/preferences.component';
import { PrivacyComponent } from './settings/privacy/privacy.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    component: EventsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/create',
    component: CreateEventComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/edit/:eventId',
    component: CreateEventComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'conversation/:id',
    component: ConversationComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/accessibility',
    component: AccessibilityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/help',
    component: HelpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/language',
    component: LanguageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/preferences',
    component: PreferencesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/privacy',
    component: PrivacyComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
