import { Injectable } from '@nestjs/common';
import { MensajeEntity } from 'src/chat/model/mensaje/mensaje.entity';
import { MensajeI } from 'src/chat/model/mensaje/mensaje.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RoomI } from 'src/chat/model/sala-chat/room.interface';
@Injectable()
export class MensajeService {

    constructor(
        @InjectRepository(MensajeEntity)
        private readonly messageRepository: Repository<MensajeEntity>
    ) { }

    async create(message: MensajeI): Promise<MensajeI> {
        return this.messageRepository.save(this.messageRepository.create(message));
    }

    async findMessagesForRoom(room: RoomI, options: IPaginationOptions): Promise<Pagination<MensajeI>> {
        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.user', 'user')
            .orderBy('message.created_at', 'DESC');

        return paginate(query, options);
    }

}
