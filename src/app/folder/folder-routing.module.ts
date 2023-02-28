import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsListComponent } from './events/events-list/events-list.component';

import { FolderPage } from './folder.page';
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
    component: FolderPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
