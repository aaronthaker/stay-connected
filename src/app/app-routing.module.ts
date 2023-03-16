import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'matches',
    component: MatchesComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'events',
    component: EventsListComponent,
  },
  { path: 'events/create',
    component: CreateEventComponent
  },
  { path: 'events/edit/:eventId',
    component: CreateEventComponent
  },
  { path: 'login',
    component: LoginComponent
  },
  { path: 'signup',
    component: SignupComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
