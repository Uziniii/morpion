import { connection } from "websocket"

export type Token = string;

export interface User {
    token: Token;
    c: connection;
    data: any;
}