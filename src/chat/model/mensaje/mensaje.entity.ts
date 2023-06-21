import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../sala-chat/room.entity";

@Entity({ name: 'mensajes' })
export class MensajeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, user => user.mensajes)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.mensajes)
    @JoinTable()
    room: RoomEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}