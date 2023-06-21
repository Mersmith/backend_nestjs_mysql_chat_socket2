import { UserI } from "src/user/model/user.inteface"; 
import { RoomI } from "../sala-chat/room.interface"; 

export interface JoinedRoomI {
    id?: number;
    socketId: string;
    user: UserI;
    room: RoomI;
}