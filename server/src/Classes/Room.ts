import Collection from "../../../websocket/server/Classes/Collection";
import { Token } from "../../../websocket/server/Interface/User";
import EventWSServer from "../../../websocket/server/WSServer";
import { Board } from "../Interface/Events";

class Room {
    private id: Token;
    public type: "morpion" | "4pow";
    public creator: Token;
    public invite: Token | null = null;
    public whoStart: number;
    public count: number = 0;
    public board: Board = [];
    public alive: boolean = true;
    public timeout: NodeJS.Timeout;

    constructor(roomMap: Collection<any, any>, server: EventWSServer<any, any, any>, type: "morpion" | "4pow", creator: Token) {
        this.id = (
            Date.now() +
            +(
                [...Array(10)].map(
                    () => Math.floor(Math.random() * 10)
                ).join("")
            )
        ).toString(16);
        this.type = type;
        this.creator = creator;
        this.whoStart = Math.floor(Math.random());

        switch (type) {
            case "morpion":
                this.board = [...Array(3)].map(() => [...Array(3).fill("")]);
                break;
            
            case "4pow":
                this.board = [...Array(6)].map(() => [...Array(7).fill("")]);
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
