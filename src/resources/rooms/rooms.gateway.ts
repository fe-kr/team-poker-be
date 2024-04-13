import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
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

  async handleConnection(@ConnectedSocket() client: Socket) {
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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId, name, type, id } = client.handshake.query;

    this.io.to(roomId).emit(RoomEventType.UserLeft, { name, type, id });
  }

  @SubscribeMessage(RoomEventType.TopicChose)
  handleTopicChose(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.handshake.query;

    this.io.to(roomId).emit(RoomEventType.TopicChose, topicId);
  }

  @SubscribeMessage(RoomEventType.VoteSubmitted)
  handleUserVoted(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { roomId, name, id } = client.handshake.query;
    const { vote, topicId } = data;

    this.io
      .to(roomId)
      .emit(RoomEventType.TopicChose, { vote, topicId, name, id });
  }

  @SubscribeMessage(RoomEventType.VotesRevealed)
  handleVotesRevealed(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.handshake.query;

    this.io.to(roomId).emit(RoomEventType.VotesRevealed, topicId);
  }
}
