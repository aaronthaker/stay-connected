import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../users/user.model';
import { Message } from '../message.model';
import { Observable } from 'rxjs';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnChanges {
  @Input() user: User;
  @Input() userId: string | null;
  messages$: Observable<Message[]>;

  constructor(private messagesService: MessagesService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.messages$ = this.messagesService.getMessages(this.user._id, this.userId);
    }
  }
}
