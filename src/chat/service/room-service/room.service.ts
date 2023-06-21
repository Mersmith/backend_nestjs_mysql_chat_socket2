import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/sala-chat/room.entity';
import { RoomI } from 'src/chat/model/sala-chat/room.interface';
import { UserI } from 'src/user/model/user.inteface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {

    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) { }

    async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
        const newRoom = await this.addCreatorToRoom(room, creator);
        return this.roomRepository.save(newRoom);
    }

    async getRoom(roomId: number): Promise<RoomEntity> {
        return this.roomRepository
          .createQueryBuilder('room')
          .leftJoinAndSelect('room.users', 'users')
          .where('room.id = :roomId', { roomId })
          .getOne();
      }

    async getRoomsForUser(usuarioId: number, paginacionOpciones: IPaginationOptions): Promise<Pagination<RoomI>> {
        const cantidadDeSalasPorPaginacion = typeof paginacionOpciones.limit === 'number' ? paginacionOpciones.limit : parseInt(paginacionOpciones.limit, 10);
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.users', 'users')
            .where('users.id = :usuarioId', { usuarioId })
            //.leftJoinAndSelect('room.users', 'all_users')
            .orderBy('room.updated_at', 'DESC')
            .limit(cantidadDeSalasPorPaginacion);
        return paginate(query, paginacionOpciones)
    }

    async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
        room.users.push(creator);
        return room;
    }

}
