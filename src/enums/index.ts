export enum UserType {
  Admin = 'Admin',
  User = 'User',
}

export enum RoomEventType {
  UsersConnected = 'UsersConnected',
  UserJoined = 'UserJoined',
  UserLeft = 'UserLeft',

  TopicChose = 'TopicChose',

  VoteSubmitted = 'VoteSubmitted',
  VotesRevealed = 'VotesRevealed',
}
