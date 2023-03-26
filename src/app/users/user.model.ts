import { Message } from "../messages/message.model";

export class User {
  lastMessage: string;
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public gender?: string,
    public age?: string,
    public location?: string,
    public bio?: string,
    public likedUsers?: string[],
    public dislikedUsers?: string[],
    public matchedUsers?: string[],
    // public profilePicture: string
  ) {}
}
