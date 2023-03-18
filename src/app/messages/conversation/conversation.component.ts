import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../messages.service';
import { UserService } from '../../users/users.service';
import { Message } from '../message.model';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  public user: User;
  public messages: Message[] = [];
  public newMessage: string;

  constructor(
    private route: ActivatedRoute,
    public messagesService: MessagesService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const otherUserId = this.route.snapshot.params['id'];
    this.userService.getUser(otherUserId).subscribe(user => {
      this.user = user;
    });
    const currentUserId = this.messagesService.currentUserId;
    this.messagesService.getConversation([currentUserId, otherUserId]).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    const message: Message = {
      id: null,
      senderId: this.messagesService.currentUserId,
      receiverId: this.user._id,
      content: this.newMessage,
      timestamp: new Date()
    };
    this.messagesService.sendMessage(message).subscribe(() => {
      this.messages.push(message);
      this.newMessage = '';
    });
  }
}
