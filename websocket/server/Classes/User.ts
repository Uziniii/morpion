import { connection } from "websocket";
import { Token } from "../Interface/User";

class User<UsersData> {
    protected token: Token;
    protected c: connection;
    protected data: UsersData;

    constructor (token: Token, c: connection) {
        this.token = token;
        this.c = c;
    }
    
    close () {
        this.c.close();
    }
}

export default User;