import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/sala-chat/room.interface';
import { UserI } from 'src/user/model/user.inteface';
import { Repository } from 'typeorm';
@Injectable()
export class JoinedRoomService {

    constructor(
        @InjectRepository(JoinedRoomEntity)
        private readonly joinedRoomRepository: Repository<JoinedRoomEntity>
    ) { }

    async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
        return this.joinedRoomRepository.save(joinedRoom);
    }

    async findByUser(user: UserI): Promise<JoinedRoomI[]> {
        return this.joinedRoomRepository.find({ where: user });
    }

    /*async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
        return this.joinedRoomRepository.find({ where: { id: room.id } });
    }*/

    async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
        return this.joinedRoomRepository.find({
          where: { room: { id: room.id } },
          relations: ['user', 'room'],
        });
      }

    async deleteBySocketId(socketId: string) {
        return this.joinedRoomRepository.delete({ socketId });
    }

    async deleteAll() {
        await this.joinedRoomRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }
    
}