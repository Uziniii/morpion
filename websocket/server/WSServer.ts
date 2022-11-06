import { server, IServerConfig } from "websocket"
import WSEvent from "./Classes/WSEvent";
import User from "./Classes/User";
import { Token } from "./Interface/User";

class EventWSServer<UsersData> {
    constructor(config: IServerConfig | undefined) {
        this.ws = new server(config);

        this.ws.on("connect", (c) => {
            let token = (
                Date.now() +
                +(
                    [...Array(10)].map(
                        () => Math.floor(Math.random() * 10)
                    ).join("")
                )
            ).toString(16)

            let user = new User<UsersData>(token, c)

            this.usersMap.set(token, user)
        })

        
    }

    private ws: server;
    private usersMap = new Map<string, User<UsersData>>()
    private events = new Map<string, WSEvent>()

    public getUser(id: Token): User<UsersData> | undefined {
        return this.usersMap.get(id);
    }

    public deleteUser(id: Token): boolean {
        let user = this.getUser(id);
        if (user === undefined) return false;

        user.close();
        this.usersMap.delete(id);

        return true;
    }

    public deleteAllUsers(): boolean {
        this.usersMap.forEach(user => user.close())
        this.usersMap.clear();

        return true;
    }

    public setEvents(events: WSEvent[]) {
        events.forEach(event => this.events.set(event.name, event))
    }
}

export default EventWSServer;
