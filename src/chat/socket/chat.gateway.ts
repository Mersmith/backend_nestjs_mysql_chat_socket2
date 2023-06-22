import { UnauthorizedException } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.inteface';
import { UserService } from 'src/user/service/user-service/user.service';
import { RoomService } from '../service/room-service/room.service';
import { RoomI } from '../model/sala-chat/room.interface';
import { PageI } from '../model/page.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { ConnectedUserI } from '../model/connected-user/connected-user.inteface';
import { JoinedRoomService } from '../service/joined-room/joined-room.service';
import { MensajeService } from '../service/mensaje/mensaje.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { MensajeI } from '../model/mensaje/mensaje.interface';
import { JoinedRoomI } from '../model/joined-room/joined-room.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200']
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private conectadoUsarioServicio: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private mensajeServicio: MensajeService
  ) { }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const usuarioConectado: UserI = await this.userService.getOne(decodedToken.user.id);

      if (!usuarioConectado) {
        return this.disconnect(socket)
      } else {
        socket.data.user = usuarioConectado;
        const rooms = await this.roomService.getRoomsForUser(usuarioConectado.id, { page: 1, limit: 10 });

        await this.conectadoUsarioServicio.crear({ socketId: socket.id, user: usuarioConectado })

        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket)
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.conectadoUsarioServicio.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const crearSalaChat: RoomI = await this.roomService.createRoom(room, socket.data.user);

    for (const user of crearSalaChat.users) {
      const conecciones: ConnectedUserI[] = await this.conectadoUsarioServicio.buscarPorUsuario(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, { page: 1, limit: 10 });
      for (const coneccionItem of conecciones) {
        await this.server.to(coneccionItem.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')//El método onPaginateRoom se suscribe al evento 'paginateRooms' del socket. 
  async onPaginateRoom(socket: Socket, paginacionOpciones: PageI) {//El primer parámetro es el socket que hace el evento.
    const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, this.handleIncomingPageRequest(paginacionOpciones));
    if (rooms.meta.totalPages >= rooms.meta.currentPage) {
      return this.server.to(socket.id).emit('rooms', rooms);//Hay paginación
    } else {
      return;//No hay paginación
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    const messages = await this.mensajeServicio.findMessagesForRoom(room, { limit: 10, page: 1 });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    // Save Connection to Room
    await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room });
    // Send last messages from Room to User
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MensajeI) {
    const createdMessage: MensajeI = await this.mensajeServicio.create({ ...message, user: socket.data.user });
    const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
    const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
    // TODO: Send new Message to all joined Users of the room (currently online)
    for (const user of joinedUsers) {
      console.log("115 - user.socketId", user)
      console.log("********")
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(paginacionOpciones: PageI) {
    //Del Frontend paginacionOpciones recibe cantidadDeSalasPorPaginacion y paginacionActualDeSalas
    paginacionOpciones.cantidadDeSalasPorPaginacion = paginacionOpciones.cantidadDeSalasPorPaginacion > 100 ? 100 : paginacionOpciones.cantidadDeSalasPorPaginacion;
    paginacionOpciones.paginacionActualDeSalas = paginacionOpciones.paginacionActualDeSalas + 1;

    const paginationOptions: IPaginationOptions = {
      limit: paginacionOpciones.cantidadDeSalasPorPaginacion,
      page: paginacionOpciones.paginacionActualDeSalas,
    };

    return paginationOptions;
  }

}
