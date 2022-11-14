import { connection } from "websocket"

export type Board = string[][]

export type Games = "morpion" | "connect4"

export type UserType = "invite" | "creator"

export enum Events {
  CREATE_TOKEN = "CREATE_TOKEN",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  REMATCH = "REMATCH",
  MORPION_PLAY = "MORPION_PLAY",
  MORPION_FINISH = "MORPION_FINISH",
  CONNECT4_PLAY = "CONNECT4_PLAY",
  CONNECT4_FINISH = "CONNECT4_FINISH",
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
    game: Games;
  },
  "LEAVE_ROOM": {
    who: boolean;
  },
  "REMATCH": {
    whoStart: number;
    game: Games;
  },
  "MORPION_PLAY": {
    board: Board;
  },
  "MORPION_FINISH": {
    board: Board;
    win: boolean | undefined;
  },
  "CONNECT4_PLAY": {
    board: Board;
  },
  "CONNECT4_FINISH": {
    board: Board;
    win: boolean | undefined;
  }
}

export interface EventsClientData {
  "CREATE_ROOM": {
    game: Games;
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
  "CONNECT4_PLAY": {
    col: number;
    row: null;
  }
}
