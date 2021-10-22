export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  jobPosition: string;
  isAdmin: boolean;
  role: 'observer' | 'player';
  avatar?: string;
  voteResult?: string;
  kickCounter: number;
}

export interface IIssue {
  id: number | string;
  title: string;
  link: string;
  priority: string;
  status: 'current' | 'resolved' | 'awaiting' | 'next';
  score: string;
}

export interface IGameSettings {
  cardChange: boolean;
  timerOn: boolean;
  allowEnterInGame: boolean;
  cardsAutoTurn: boolean;
  scoreType: string;
  scoreTypeShort: string;
  timerMinutes: string;
  timerSeconds: string;
  cardCover: string;
  cardValuesFinalSet: string[];
  isDefaultSettings: boolean;
}

export interface IAverageValue {
  value: string;
  percents: number;
}

export interface IVote {
  memberId: string;
  value: string;
}

export interface IGameState {
  currentIssue?: IIssue;
  showRestartControls?: boolean;
  currentTimer?: { minutes: number; seconds: number };
  roundStatus?: 'in progress' | 'awaiting';
  votes?: IVote[];
  averageValues?: IAverageValue[];
  statistics?: {
    issue: IIssue;
    votes: IVote[];
    averageValues: IAverageValue[];
  }[];
}

export interface IChatMessage {
  userId: string;
  message: string;
  time: string;
  messageId: number;
}

export interface IServerState {
  gameID: string;
  currentPage: 'lobby' | 'game' | 'result';
  users: IUser[];
  gameName?: string;
  issues?: IIssue[];
  gameSettings?: IGameSettings;
  additionalKeys?: string;
  game?: IGameState;
  chatHistory?: IChatMessage[];
}

export const STATE: IServerState[] = [];
