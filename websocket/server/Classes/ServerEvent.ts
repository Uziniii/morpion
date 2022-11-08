import EventWSServer from "../WSServer";
import User from "./User";

type eventFunc<UsersData, Storage, EventData, EventsServerData> = ({
    type,
    data,
    server,
    storage,
    user
}: {
    type: string,
    data: EventData,
    server: EventWSServer<UsersData, Storage>,
    storage: Storage,
    user: User<UsersData, EventsServerData>
}) => any;

class ServerEvent<UsersData, Storage, EventData, EventsServerData> {
    public typeEvent: string;
    protected event: eventFunc<UsersData, Storage, EventData, EventsServerData>;

    constructor({
        typeEvent,
        event
    }: {
        typeEvent: string;
        event: eventFunc<UsersData, Storage, EventData, EventsServerData>;
    }) {
        this.typeEvent = typeEvent;
        this.event = event;
    }

    public fire(data, wsServer, storage: Storage, user: User<UsersData, EventsServerData>) {
        this.event({
            type: this.typeEvent,
            data,
            server: wsServer,
            storage,
            user
        });
    }
}

export default ServerEvent;
