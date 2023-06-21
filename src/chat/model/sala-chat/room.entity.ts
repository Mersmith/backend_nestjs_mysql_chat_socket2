import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { JoinedRoomEntity } from "../joined-room/joined-room.entity";
import { MensajeEntity } from "../mensaje/mensaje.entity";

@Entity({ name: 'rooms' })
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => UserEntity)
    @JoinTable({ name: 'rooms_users' })
    users: UserEntity[];

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedUsers: JoinedRoomEntity[];

    @OneToMany(() => MensajeEntity, mensaje => mensaje.room)
    mensajes: MensajeEntity[];

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

}