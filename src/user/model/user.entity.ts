import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MensajeEntity } from "src/chat/model/mensaje/mensaje.entity";
import { RoomEntity } from "src/chat/model/sala-chat/room.entity";
import { BeforeInsert, ManyToMany, Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToMany } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @ManyToMany(() => RoomEntity, room => room.users)
    rooms: RoomEntity[]

    @OneToMany(() => ConnectedUserEntity, connection => connection.user)
    connections: ConnectedUserEntity[];

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedRooms: JoinedRoomEntity[];

    @OneToMany(() => MensajeEntity, mensaje => mensaje.user)
    mensajes: MensajeEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }

}