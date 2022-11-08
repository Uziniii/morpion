import { connection } from "websocket";
import { Token, User as IUser } from "../Interface/User";

class User<UsersData, EventsServerData> implements IUser {
    private token: Token;
    protected c: connection;
    public data: UsersData;

    constructor (token: Token, c: connection, data: any) {
        this.token = token;
        this.c = c;
        this.data = data
    }
    
    get getToken () {
        return this.token;
    }

    send<Event extends keyof EventsServerData>(event: string, data: EventsServerData[Event]) {
        this.c.send(JSON.stringify({
            event,
            data
        }))
    }

    close () {
        this.c.close();
    }
}

export default User;