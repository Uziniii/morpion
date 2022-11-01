import { connection } from "websocket"

export type Board = string[][]

export enum Events {
  CREATE_TOKEN = "CREATE_TOKEN",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  REMATCH = "REMATCH",
  MORPION_PLAY = "MORPION_PLAY",
  MORPION_FINISH = "MORPION_FINISH",
  POW4_PLAY = "POW4_PLAY",
  POW4_FINISH = "POW4_FINISH",
}

export interface EventsServerData {
  "CREATE_TOKEN": {
    token: string;
  },
  "CREATE_ROOM": {
    inviteCode: string;
  },
  "JOIN_ROOM": {
    whoStart: number;
    game: "morpion" | "4pow";
  },
  "LEAVE_ROOM": {
    who: boolean;
  },
  "REMATCH": {
    whoStart: number;
    game: "morpion" | "4pow";
  },
  "MORPION_PLAY": {
    board: Board;
  },
  "MORPION_FINISH": {
    board: Board;
    win: boolean | undefined;
  },
  "POW4_PLAY": {
    board: Board;
  },
  "POW4_FINISH": {
    board: Board;
    win: boolean | undefined;
  }
}

export interface EventClientData {
  "CREATE_ROOM": {
    game: "morpion" | "4pow";
  },
  "JOIN_ROOM": {
    inviteCode: string;
  },
  "LEAVE_ROOM": {},
  "REMATCH": {},
  "MORPION_PLAY": {
    col: number;
    row: number;
  },
  "POW4_PLAY": {
    col: number;
    row: null;
  }
}

export interface User {
  token: string;
  id: {
    adress: string;
    port: number;
  };
  c: connection;
  room: string | null;
}

export interface Game {
  type: "morpion" | "4pow";
  timestamp: number;
  creator: string;
  invite: string | null;
  whoStart: number;
  count: number;
  board: Board;
}

export interface EventFile {
  eventType: Events;
  event: (
    c: connection,
    data: any,
    token: string,
    user: User,
    users: {
      [code: string]: User
    },
    games: {
      [code: string]: Game
    }
  ) => any;
}
