import Collection from "../../../websocket/Classes/Collection";
import { Token } from "../../../websocket/Interface/User";
import EventWSServer from "../../../websocket/WSServer";
import { Board, Games } from "../Interface/Events";

class Room {
    private id: Token;
    public type: Games;
    public creator: Token;
    public invite: Token | null = null;
    public whoStart: number;
    public count: number = 0;
    public board: Board = [];
    public alive: boolean = true;
    public timeout: NodeJS.Timeout;
    public rematch: Token | undefined = undefined;

    constructor(roomMap: Collection<any, any>, server: EventWSServer<any, any, any>, type: Games, creator: Token, id?: string) {
        this.id = id ?? (
            Date.now() +
            +(
                [...Array(10)].map(
                    () => Math.floor(Math.random() * 10)
                ).join("")
            )
        ).toString(16);
        this.type = type;
        this.creator = creator;
        this.whoStart = Math.round(Math.random());

        switch (type) {
            case "morpion":
                this.board = [...Array(3)].map(() => [...Array(3).fill("")]);
                break;
            
            case "connect4":
                this.board = [...Array(7)].map(() => [...Array(6).fill("")]);
                break;
            
            default:
                this.alive = false;
        }

        if (!this.alive) roomMap.delete(this.id)

        this.timeout = setTimeout(() => {
            if (this.invite === null) server;
        }, 120_000)
    }

    public incrementCounter (): number {
        return this.count++;
    }

    public setCell (col: number, row: number, who: "x" | "o"): void {
        this.board[col][row] = who;
    }

    public set setInvite (invite: Token) {
        this.invite = invite
    }

    public get getId () {
        return this.id
    }
}

export default Room;
