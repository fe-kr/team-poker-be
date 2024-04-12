import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { RoomEventType } from 'src/enums';

@WebSocketGateway({
  namespace: 'room',
  cors: { origin: '*' },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  async handleConnection(client: Socket) {
    const { roomId, name, type, id } = client.handshake.query;

    client.join(roomId);
    client.data = { name, type, id };
    this.io.to(roomId).emit(RoomEventType.UserJoined, { name, type, id });

    const sockets = await this.io.to(roomId).fetchSockets();
    client.emit(
      RoomEventType.UserJoined,
      sockets.map(({ data }) => data),
    );
  }

  async handleDisconnect(client: Socket) {
    const { roomId, name, type, id } = client.handshake.query;

    this.io.to(roomId).emit(RoomEventType.UserLeft, { name, type, id });
  }
}
