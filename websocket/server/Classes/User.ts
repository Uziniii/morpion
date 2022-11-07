import { connection } from "websocket";
import { Token } from "../Interface/User";

class User<UsersData> {
    public token: Token;
    protected c: connection;
    // public data: UsersData;

    constructor (token: Token, c: connection) {
        this.token = token;
        this.c = c;
    }
    
    send (event, data) {
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