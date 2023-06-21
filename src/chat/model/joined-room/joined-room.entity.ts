import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../sala-chat/room.entity";

@Entity({ name: 'joined_room' })
export class JoinedRoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, user => user.joinedRooms)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => RoomEntity, room => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;

}