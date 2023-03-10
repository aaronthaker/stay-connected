import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EventsListComponent } from './events/events-list/events-list.component';
import { MeetComponent } from './meet/meet.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  {
    path: 'meet',
    component: MeetComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'events',
    component: EventsListComponent
  },
  {
    path: 'log-out',
    component: EventsListComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
