import { JwtService } from '@nestjs/jwt';
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

  constructor(private jwtService: JwtService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { roomId, name, type, id } = this.jwtService.decode(
      <string>client.handshake.query.token,
    );

    client.join(roomId);
    client.data = { roomId, name, type, id };

    client.broadcast.to(roomId).emit(RoomEventType.UserJoined, client.data);

    const sockets = await this.io.to(roomId).fetchSockets();

    client.emit(
      RoomEventType.UsersConnected,
      sockets.map(({ data }) => data),
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.broadcast
      .to(client.data.roomId)
      .emit(RoomEventType.UserLeft, client.data);
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
