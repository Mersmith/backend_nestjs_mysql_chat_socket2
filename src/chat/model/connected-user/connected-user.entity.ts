import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'connected_user' })
export class ConnectedUserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, user => user.connections)
  @JoinColumn()
  user: UserEntity;

}