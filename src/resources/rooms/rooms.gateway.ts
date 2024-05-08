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
import { RoomEventType } from 'src/constants/enum';

import { VotesService } from '../votes/votes.service';

@WebSocketGateway({
  namespace: 'room',
  cors: { origin: process.env.CLIENT_URL },
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

    client.broadcast.to(roomId).emit(RoomEventType.USER_JOINED, client.data);

    const { usersData } = await this.fetchSocketsUsersData(roomId);

    client.emit(RoomEventType.USERS_CONNECTED, usersData);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.USER_LEFT, client.data);
  }

  @SubscribeMessage(RoomEventType.TOPIC_CREATED)
  handleTopicCreate(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.TOPIC_CREATED, topicId);
  }

  @SubscribeMessage(RoomEventType.TOPIC_CHOSE)
  handleTopicChose(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(RoomEventType.TOPIC_CHOSE, topicId);
  }

  @SubscribeMessage(RoomEventType.VOTE_SUBMITTED)
  async handleUserVoted(
    @MessageBody() data: { topicId: string; vote: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, id, name } = client.data;
    const payload = { ...data, id, userName: name };

    await this.votesService.createVote(payload);

    client.broadcast.to(roomId).emit(RoomEventType.VOTE_SUBMITTED, payload);
  }

  @SubscribeMessage(RoomEventType.VOTES_REVEALED)
  async handleVotesRevealed(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    const results = await this.votesService.calculateVotesResult(topicId);

    this.io.to(roomId).emit(RoomEventType.VOTES_REVEALED, { topicId, results });
  }

  @SubscribeMessage(RoomEventType.VOTES_RESET)
  async handleVotesReset(
    @MessageBody() topicId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.data;

    await this.votesService.deleteVotesByTopicId(topicId);

    client.broadcast.to(roomId).emit(RoomEventType.VOTES_RESET, topicId);
  }
}
