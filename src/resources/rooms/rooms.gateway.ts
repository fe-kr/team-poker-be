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

import { VotesService } from '../votes/votes.service';

@WebSocketGateway({
  namespace: 'room',
  cors: { origin: '*' },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  constructor(
    private jwtService: JwtService,
    private votesService: VotesService,
  ) {}

  async fetchSocketsUsersData(roomId: string) {
    const sockets = await this.io.to(roomId).fetchSockets();

    return sockets.reduce(
      (acc, { data }) => {
        if (!acc.ids[data.id]) {
          acc.usersData.push(data);
          acc.ids[data.id] = data.id;
        }

        return acc;
      },
      { ids: {}, usersData: [] },
    );
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { roomId, name, type, id } = this.jwtService.decode(
      <string>client.handshake.query.token,
    );

    client.join(roomId);
    client.data = { roomId, name, type, id };

    client.broadcast.to(roomId).emit(RoomEventType.UserJoined, client.data);

    const { usersData } = await this.fetchSocketsUsersData(roomId);

    client.emit(RoomEventType.UsersConnected, usersData);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.UserLeft, client.data);
  }

  @SubscribeMessage(RoomEventType.TopicCreated)
  handleTopicCreate(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.TopicCreated, topicId);
  }

  @SubscribeMessage(RoomEventType.TopicChose)
  handleTopicChose(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.TopicChose, topicId);
  }

  @SubscribeMessage(RoomEventType.VoteSubmitted)
  async handleUserVoted(
    @MessageBody() data: { topicId: string; vote: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, id, name } = client.data;
    const payload = { ...data, id, userName: name };

    await this.votesService.createVote(payload);

    client.broadcast.to(roomId).emit(RoomEventType.VoteSubmitted, payload);
  }

  @SubscribeMessage(RoomEventType.VotesRevealed)
  async handleVotesRevealed(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    const results = await this.votesService.calculateVotesResult(topicId);

    this.io.to(roomId).emit(RoomEventType.VotesRevealed, { topicId, results });
  }

  @SubscribeMessage(RoomEventType.VotesReset)
  async handleVotesReset(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    await this.votesService.deleteVotesByTopicId(topicId);

    client.broadcast.to(roomId).emit(RoomEventType.VotesReset, topicId);
  }
}
