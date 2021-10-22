import { Collection, DeleteResult, MongoClient } from 'mongodb';
import {
  IUser,
  IServerState,
  IIssue,
  IChatMessage,
  IGameState,
  IGameSettings,
  IVote,
  IAverageValue,
} from './state';
import fs from 'fs';
import path from 'path';

type StateDocument = IServerState & Document;

export const createState = async (
  collection: unknown,
  gameID: string,
  users: IUser[],
  issues: IIssue[] = [],
  chatHistory: IChatMessage[] = [],
  game: IGameState = {
    votes: [],
    averageValues: [],
    statistics: [],
    currentTimer: { minutes: 0, seconds: 0 },
  }
): Promise<StateDocument> => {
  console.time('add new State in DB');
  await (collection as Collection).insertOne({
    gameID,
    currentPage: 'lobby',
    users,
    issues,
    chatHistory,
    game,
  });
  console.timeEnd('add new State in DB');
  console.time('get new State from DB');
  const result = await (collection as Collection).findOne({ gameID });
  console.timeEnd('get new State from DB');
  return result as StateDocument;
};

export const getState = async (collection: unknown, gameID: string): Promise<StateDocument> => {
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const removeSTate = async (collection: unknown, gameID: string): Promise<DeleteResult> => {
  const result = await (collection as Collection).deleteOne({ gameID });
  return result;
};

export const addUser = async (
  collection: unknown,
  gameID: string,
  user: IUser
): Promise<StateDocument> => {
  await (collection as Collection).updateOne({ gameID }, { $push: { users: user } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const kickUser = async (
  collection: unknown,
  gameID: string,
  userID: string
): Promise<StateDocument> => {
  await (collection as Collection).updateOne({ gameID }, { $pull: { users: { id: userID } } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const avatarUpload = async (
  collection: unknown,
  gameID: string,
  userID: string,
  avatarName: string,
  avatarData: string | ArrayBuffer | null
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const photoDir = path.resolve(__dirname, './temp/');
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
  }
  const fileName = `${Date.now()}${avatarName}`;
  const writer = fs.createWriteStream(path.resolve(photoDir, fileName), {
    encoding: 'base64',
  });
  writer.write(avatarData);
  writer.end();
  const avatar = `https://blooming-dusk-20813.herokuapp.com/temp/${fileName}`;
  const newUsers = state.users.map((user) =>
    user.id === userID ? { ...user, avatar } : user
  );
  await (collection as Collection).updateOne({ gameID }, { $set: { users: newUsers } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const changeGameName = async (
  collection: unknown,
  gameID: string,
  gameName: string
): Promise<StateDocument> => {
  await (collection as Collection).updateOne({ gameID }, { $set: { gameName } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const changeCurrentPage = async (
  collection: unknown,
  gameID: string,
  currentPage: 'lobby' | 'game' | 'result'
): Promise<StateDocument> => {
  await (collection as Collection).updateOne({ gameID }, { $set: { currentPage } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const addIssue = async (
  collection: unknown,
  gameID: string,
  issue: IIssue
): Promise<StateDocument> => {
  console.time('add new Issue in DB');
  await (collection as Collection).updateOne({ gameID }, { $push: { issues: issue } });
  console.timeEnd('add new Issue in DB');
  console.time('get new Issue from DB');
  const result = await (collection as Collection).findOne({ gameID });
  console.timeEnd('get new Issue from DB');
  return result as StateDocument;
};

export const deleteIssue = async (
  collection: unknown,
  gameID: string,
  issueID: number | string
): Promise<StateDocument> => {
  await (collection as Collection).updateOne(
    { gameID },
    { $pull: { issues: { id: issueID } } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const editIssue = async (
  collection: unknown,
  gameID: string,
  newIssue: IIssue
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const newIssues = state.issues.map((issue) =>
    issue.id === newIssue.id ? newIssue : issue
  );
  await (collection as Collection).updateOne({ gameID }, { $set: { issues: newIssues } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const updateIssues = async (
  collection: unknown,
  gameID: string,
  issues: IIssue[]
): Promise<StateDocument> => {
  await (collection as Collection).updateOne({ gameID }, { $set: { issues } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const changeSettings = async (
  collection: unknown,
  gameID: string,
  gameSettings: IGameSettings
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const minutes = Number(gameSettings.timerMinutes);
  const seconds = Number(gameSettings.timerSeconds);
  const currentTimer = { minutes, seconds };
  const newGame = { ...state.game, currentTimer };
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { gameSettings, game: newGame } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const setCurrentTimer = async (
  collection: unknown,
  gameID: string,
  currentTimer: { minutes: number; seconds: number }
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const newGame = { ...state.game, currentTimer };
  await (collection as Collection).updateOne({ gameID }, { $set: { game: newGame } });
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const startRound = async (
  collection: unknown,
  gameID: string,
  voteResult: string = 'In progress',
  roundStatus: 'in progress' | 'awaiting' = 'in progress',
  votes: IVote[] = [],
  averageValues: IAverageValue[] = [],
  showRestartControls: boolean = false
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const newUsers = state.users.map((user) => ({ ...user, voteResult }));
  const newGame = {
    ...state.game,
    roundStatus,
    votes,
    averageValues,
    showRestartControls,
  };
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { game: newGame, users: newUsers } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const restartRound = async (
  collection: unknown,
  gameID: string,
  voteResult: string = 'In progress',
  roundStatus: 'in progress' | 'awaiting' = 'in progress',
  votes: IVote[] = [],
  averageValues: IAverageValue[] = [],
  showRestartControls: boolean = false
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });

  const currentIssue = { ...state.game.currentIssue, status: 'current' };

  const newIssues = state.issues.map((issue) =>
    issue.id === currentIssue.id
      ? { ...issue, status: currentIssue.status }
      : issue
  );

  const newUsers = state.users.map((user) => ({ ...user, voteResult }));

  const statistics = state.game.statistics.slice(0, -1);

  const minutes = Number(state.gameSettings.timerMinutes);
  const seconds = Number(state.gameSettings.timerSeconds);
  const currentTimer = { minutes, seconds };

  const newGame = {
    ...state.game,
    currentIssue,

    roundStatus,
    votes,
    averageValues,
    statistics,
    showRestartControls,
    currentTimer,
  };
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { issues: newIssues, game: newGame, users: newUsers } }
  );

  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const resetGame = async (
  collection: unknown,
  gameID: string,
  voteResult: string = '-',
  emptyIssue: IIssue = {
    id: '',
    title: '',
    link: '',
    priority: 'low',
    status: 'awaiting',
    score: '-',
  },
  showRestartControls: boolean = false
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const minutes = Number(state.gameSettings.timerMinutes);
  const seconds = Number(state.gameSettings.timerSeconds);
  const currentTimer = { minutes, seconds };

  const newUsers = state.users.map((user) => ({ ...user, voteResult }));
  const newGame = {
    ...state.game,
    currentTimer,
    currentIssue: emptyIssue,
    showRestartControls,
  };
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { game: newGame, users: newUsers } }
  );

  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const setCurrentIssue = async (
  collection: unknown,
  gameID: string,
  currentIssue: IIssue
): Promise<StateDocument> => {
  console.time('get state from DB');
  const state = await (collection as Collection).findOne({ gameID });
  console.timeEnd('get state from DB');
  console.time('set current Issue in DB');
  const newIssues = state.issues.map((issue) => {
    if (issue.id === currentIssue.id) {
      return { ...issue, status: currentIssue.status };
    }
    if (issue.status === 'current') {
      return { ...issue, status: 'awaiting' };
    }
    return issue;
  });
  const newGame = { ...state.game, currentIssue };
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { game: newGame, issues: newIssues } }
  );
  console.timeEnd('set current Issue in DB');
  console.time('get current Issue from DB');
  const result = await (collection as Collection).findOne({ gameID });
  console.timeEnd('get current Issue from DB');
  return result as StateDocument;
};

export const stopRound = async (
  collection: unknown,
  gameID: string,
  roundStatus: 'in progress' | 'awaiting' = 'awaiting',
  showRestartControls: boolean = true
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });

  const currentIssue = { ...state.game.currentIssue, status: 'resolved' };

  const newIssues = state.issues.map((issue) =>
    issue.id === currentIssue.id
      ? { ...issue, status: currentIssue.status }
      : issue
  );

  const averageValues: { value: string; percents: number }[] = [];
  const totalVotes = state.game.votes.length;
  const votesCounter: { [key: string]: number } = {};
  const votesValues: string[] = [];
  state.game.votes.forEach((vote) => {
    if (!votesValues.includes(vote.value)) {
      votesValues.push(vote.value);
      votesCounter[vote.value] = 1;
    } else {
      votesCounter[vote.value] += 1;
    }
  });
  Object.entries(votesCounter)
    .sort((a, b) => a[1] - b[1])
    .forEach(([voteValue, counter]) => {
      const percents = Math.round((counter / totalVotes) * 10000) / 100;
      averageValues.push({ value: voteValue, percents });
    });

  const statistics = [
    ...state.game.statistics,
    {
      issue: currentIssue,
      votes: state.game.votes,
      averageValues: averageValues,
    },
  ];

  const newGame = {
    ...state.game,
    roundStatus,
    currentIssue,
    averageValues,
    statistics,
    showRestartControls,
  };

  await (collection as Collection).updateOne(
    { gameID },
    { $set: { issues: newIssues, game: newGame } }
  );

  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const setVote = async (
  collection: unknown,
  gameID: string,
  userID: string,
  value: string,
  voteResult: string
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const votes = state.game.votes;
  const newVotes = votes.find((vote) => vote.memberId === userID)
    ? votes.map((vote) =>
        vote.memberId === userID ? { memberId: userID, value } : vote
      )
    : [...votes, { memberId: userID, value }];

  const newGame = { ...state.game, votes: newVotes };
  const newUsers = state.users.map((user) =>
    user.id === userID ? { ...user, voteResult } : user
  );
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { game: newGame, users: newUsers } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const changeVote = async (
  collection: unknown,
  gameID: string,
  userID: string,
  value: string,
  voteResult: string
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const votes = state.game.votes;

  const newVotes = votes.map((vote) =>
    vote.memberId === userID ? { memberId: userID, value } : vote
  );
  console.log(newVotes);
  const averageValues: { value: string; percents: number }[] = [];
  const totalVotes = newVotes.length;
  const votesCounter: { [key: string]: number } = {};
  const votesValues: string[] = [];
  newVotes.forEach((vote) => {
    if (!votesValues.includes(vote.value)) {
      votesValues.push(vote.value);
      votesCounter[vote.value] = 1;
    } else {
      votesCounter[vote.value] += 1;
    }
  });
  Object.entries(votesCounter)
    .sort((a, b) => a[1] - b[1])
    .forEach(([voteValue, counter]) => {
      const percents = Math.round((counter / totalVotes) * 10000) / 100;
      averageValues.push({ value: voteValue, percents });
    });

  const statistics = [
    ...state.game.statistics.slice(0, -1),
    {
      issue: state.game.currentIssue,
      votes: newVotes,
      averageValues: averageValues,
    },
  ];

  const newGame = { ...state.game, votes: newVotes, averageValues, statistics };
  const newUsers = state.users.map((user) =>
    user.id === userID ? { ...user, voteResult } : user
  );
  await (collection as Collection).updateOne(
    { gameID },
    { $set: { game: newGame, users: newUsers } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const incrementKickCounter = async (
  collection: unknown,
  gameID: string,
  userID: string
): Promise<StateDocument> => {
  const state = await (collection as Collection).findOne({ gameID });
  const user = state.users.find((item) => item.id === userID);
  let result;
  if (user)
    if (user.kickCounter >= Math.floor((state.users.length - 1) / 2)) {
      await (collection as Collection).updateOne(
        { gameID },
        { $pull: { users: { id: userID } } }
      );
      result = await (collection as Collection).findOne({ gameID });
    } else if (user.kickCounter < Math.floor((state.users.length - 1) / 2)) {
      const newValue = user.kickCounter + 1;
      const newUsers = state.users.map((user) =>
        user.id === userID ? { ...user, kickCounter: newValue } : user
      );
      await (collection as Collection).updateOne(
        { gameID },
        { $set: { game: gameID, users: newUsers } }
      );
      result = await (collection as Collection).findOne({ gameID });
    }
  result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};

export const setMessages = async (
  collection: unknown,
  gameID: string,
  clientMessage: IChatMessage
): Promise<StateDocument> => {
  const { userId, message, time } = clientMessage;
  const messageTime = new Date(time);
  const messageToHistory = {
    userId: userId,
    message: message,
    time: `${messageTime.getHours()}:${messageTime.getMinutes()} `,
    messageId: time,
  };
  await (collection as Collection).updateOne(
    { gameID },
    { $push: { chatHistory: messageToHistory } }
  );
  const result = await (collection as Collection).findOne({ gameID });
  return result as StateDocument;
};
