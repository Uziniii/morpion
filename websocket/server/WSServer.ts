import { server, IServerConfig } from "websocket"
import WSEvent from "./Classes/WSEvent";
import User from "./Classes/User";
import { Token } from "./Interface/User";

class EventWSServer<UsersData, Storage> {
    constructor(config: IServerConfig | undefined, storage: { [key: string]: any }) {
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

            c.on("message", (msg) => {
                if (msg.type !== "utf8") return

                try {
                    let { token, event: eventName, data } = JSON.parse(msg.utf8Data)
                
                    let user = this.getUser(token);
                    let event = this.getEvent(eventName);

                    if (event === undefined) return  

                    let storageToObject = {}

                    for (const [key, value] of this.storage) {
                        storageToObject[key] = value
                    }

                    // event.fire(data, this, storageToObject)
                } catch (error) {
                    console.log(error)
                }
            })

            c.on("close", () => this.deleteUser(user.token))
        })

        let storageToMap: ([string, any])[] = [];

        for (const x in storage) {
            storageToMap.push([ x, storage[x] ])
        }
        
        this.storage = new Map(...storageToMap);
    }

    private ws: server;
    private usersMap = new Map<string, User<UsersData>>()
    private events = new Map<string, WSEvent<UsersData, Storage>>()
    private storage: Map<string, any>;
    
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

    public getEvent(event: string): WSEvent<UsersData, Storage> | undefined {
        return this.events.get(event);
    }

    public setEvents(events: WSEvent<UsersData, Storage>[]) {
        events.forEach(event => this.events.set(event.typeEvent, event))
    }
}

export default EventWSServer;
