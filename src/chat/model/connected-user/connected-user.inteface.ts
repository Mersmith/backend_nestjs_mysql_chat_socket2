import { UserI } from "src/user/model/user.inteface"; 

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: UserI;
}