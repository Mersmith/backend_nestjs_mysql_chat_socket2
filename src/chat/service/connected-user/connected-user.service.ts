import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user/connected-user.entity';
import { ConnectedUserI } from 'src/chat/model/connected-user/connected-user.inteface'; 
import { UserI } from 'src/user/model/user.inteface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {

    constructor(
        @InjectRepository(ConnectedUserEntity)
        private readonly conectarUsuarioRepositorio: Repository<ConnectedUserEntity>
    ) { }

    async crear(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
        return this.conectarUsuarioRepositorio.save(connectedUser);
    }

    async buscarPorUsuario(user: UserI): Promise<ConnectedUserI[]> {
        return this.conectarUsuarioRepositorio.find({ where: { user } });
    }

    async deleteBySocketId(socketId: string) {
        return this.conectarUsuarioRepositorio.delete({ socketId });
    }

    async deleteAll() {
        await this.conectarUsuarioRepositorio.createQueryBuilder().delete().execute();
    }

}
