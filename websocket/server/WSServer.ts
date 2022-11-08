import { server, IServerConfig } from "websocket"
import ServerEvent from "./Classes/ServerEvent";
import User from "./Classes/User";
import { Token } from "./Interface/User";
import Collection from "./Classes/Collection";

class EventWSServer<UsersData, Storage> {
    constructor(config: IServerConfig | undefined, storage: { [key: string]: any }, defaultData = { }) {
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

            let user = new User<UsersData>(token, c, defaultData)

            this.usersMap.set(token, user)

            user.send("CREATE_TOKEN", {
                token
            })

            c.on("message", (msg) => {
                if (msg.type !== "utf8") return

                try {
                    let { token, event: eventName, data } = JSON.parse(msg.utf8Data)
                
                    let user = this.getUser(token);
                    let event = this.getEvent(eventName);

                    if (event === undefined || user === undefined) return

                    event.fire(data, this, this.storage.toJson() as Storage, user)
                } catch (error) {
                    console.log(error)
                }
            })

            c.on("close", () => this.deleteUser(user.token))
        })

        this.storage = new Collection<string, any>().setJsonToMap(storage);
    }

    private ws: server;
    private usersMap = new Collection<string, User<UsersData>>()
    private events = new Collection<string, ServerEvent<UsersData, Storage, any>>()
    private storage: Collection<string, any>;
    
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

    public getEvent(event: string): ServerEvent<UsersData, Storage, any> | undefined {
        return this.events.get(event);
    }

    public setEvents(events: ServerEvent<UsersData, Storage, any>[]) {
        events.forEach(event => this.events.set(event.typeEvent, event))
    }
}

export default EventWSServer;
