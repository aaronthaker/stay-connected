import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { MeetComponent } from './meet/meet.component';

const routes: Routes = [
  {
    path: 'meet',
    component: MeetComponent
  },
  {
    path: 'messages',
    component: FolderPage
  },
  {
    path: 'events',
    component: FolderPage
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
