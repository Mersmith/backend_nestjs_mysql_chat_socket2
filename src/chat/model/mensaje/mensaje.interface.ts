import { UserI } from "src/user/model/user.inteface"; 
import { RoomI } from "../sala-chat/room.interface"; 

export interface MensajeI {
  id?: number;
  text: string;
  user: UserI;
  room: RoomI;
  created_at: Date;
  updated_at: Date;
}