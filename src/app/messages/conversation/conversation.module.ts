import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConversationComponent } from './conversation.component';
import { AnimationController } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConversationComponent
      }
    ])
  ],
  // declarations: [ConversationComponent],
  providers: [AnimationController]
})
export class ConversationModule {}
