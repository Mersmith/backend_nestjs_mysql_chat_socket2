import { Module } from '@nestjs/common';
import { ChatGateway } from './socket/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room-service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/sala-chat/room.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user/connected-user.entity';
import { MensajeEntity } from './model/mensaje/mensaje.entity';
import { JoinedRoomEntity } from './model/joined-room/joined-room.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { MensajeService } from './service/mensaje/mensaje.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature(
      [
        RoomEntity,
        ConnectedUserEntity,
        MensajeEntity,
        JoinedRoomEntity
      ])
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService, JoinedRoomService, MensajeService]
})
export class ChatModule { }
