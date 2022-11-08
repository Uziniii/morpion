import Collection from "../../../websocket/server/Classes/Collection";
import { Token } from "../../../websocket/server/Interface/User";
import { Board } from "../Interface/Events";

class Room {
    private id: Token;
    public type: "morpion" | "4pow" | false;
    public timestamp: number;
    public creator: Token;
    public invite: Token | null = null;
    public whoStart: number;
    public count: number = 0;
    public board: Board = [];

    constructor (roomMap: Collection<any, any>, type: "morpion" | "4pow", creator: Token) {
        this.id = (
            Date.now() +
            +(
                [...Array(10)].map(
                    () => Math.floor(Math.random() * 10)
                ).join("")
            )
        ).toString(16);
        this.timestamp = Date.now();
        this.type = type;
        this.creator = creator;
        this.whoStart = Math.floor(Math.random());

        switch (type) {
            case "morpion":
                this.board = [...Array(3).fill([...Array(3).fill("")])];
                break;
            
            case "4pow":
                this.board = [...Array(6).fill([...Array(7).fill("")])];
                break;
            
            default:
                this.type = false;
        }
    }

    public incrementCounter (): number {
        return this.count++;
    }

    public set setInvite (invite: Token) {
        this.invite = invite
    }

    public get getId () {
        return this.id
    }
}

export default Room;
