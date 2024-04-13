export enum UserType {
  Admin = 'Admin',
  User = 'User',
}

export enum RoomEventType {
  UserJoined = 'UserJoined',
  UserLeft = 'UserLeft',

  TopicChose = 'TopicChose',

  VoteSubmitted = 'VoteSubmitted',
  VotesRevealed = 'VotesRevealed',
}
