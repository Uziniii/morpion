import { server, IServerConfig } from "websocket"
import ServerEvent from "./Classes/ServerEvent";
import User from "./Classes/User";
import { User as IUser, Token } from "./Interface/User";
import Collection from "./Classes/Collection";

interface MoreDataOptional {
    defaultData?: { [key: string]: any };
    onUserConnect?: (user: User<any, any>) => void;
    onUserMessage?: (user: User<any, any>, data: { [key: string]: any }) => void;
    onUserClose?: (user: User<any, any>) => void;
}

interface MoreData {
    defaultData: { [key: string]: any };
    onUserConnect: (user: User<any, any>) => void;
    onUserMessage: (user: User<any, any>, data: { [key: string]: any }) => void;
    onUserClose: (user: User<any, any>) => void;
}

class EventWSServer<UsersData, Storage, EventsServerData> {
    constructor(
        config: IServerConfig | undefined,
        storage: { [key: string]: any },
        moreData: MoreDataOptional | undefined = {
            defaultData: { },
            onUserConnect: () => {},
            onUserMessage: () => {},
            onUserClose: () => {}
        }
    ) {
        this.ws = new server(config);

        this.ws.on("connect", (c) => {
            let token = (
                Date.now() +
                +(
                    [...Array(10)].map(
                        () => Math.floor(Math.random() * 10)
                    ).join("")
                )
            ).toString(16);

            let user = new User<UsersData, EventsServerData>(token, c, (moreData as MoreData)?.defaultData);

            this.usersMap.set(user.getToken, user);

            (moreData as MoreData).onUserConnect(user);

            c.on("message", async (msg) => {
                if (msg.type !== "utf8") return
                (moreData as MoreData).onUserMessage(user, JSON.parse(msg.utf8Data));

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

            c.on("close", () => {
                (moreData as MoreData).onUserClose(user);

                this.deleteUser(user.getToken);
            })
        })

        this.storage = new Collection<string, any>().setJsonToMap(storage);
    }

    private ws: server;
    private usersMap = new Collection<string, User<UsersData, EventsServerData>>()
    private events = new Collection<string, ServerEvent<UsersData, Storage, any, any>>()
    private storage: Collection<string, any>;
    
    public getUser(id: Token): User<UsersData, EventsServerData> | undefined {
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

    public getEvent(event: string): ServerEvent<UsersData, Storage, any, any> | undefined {
        return this.events.get(event);
    }

    public setEvents(events: ServerEvent<UsersData, Storage, any, any>[]) {
        events.forEach(event => this.events.set(event.typeEvent, event))
    }

    get getStorage(): Storage {
        return this.storage.toJson() as Storage
    }
}

export default EventWSServer;
