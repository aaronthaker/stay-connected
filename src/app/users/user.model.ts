export class User {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public gender?: string,
    public location?: string,
    public bio?: string
    // public profilePicture: string
  ) {}
}
