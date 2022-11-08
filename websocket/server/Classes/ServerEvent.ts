import EventWSServer from "../WSServer";
import User from "./User";

type eventFunc<UsersData, Storage, EventData> = ({
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
    user: User<UsersData>
}) => any;

class ServerEvent<UsersData, Storage, EventData> {
    public typeEvent: string;
    protected event: eventFunc<UsersData, Storage, EventData>;

    constructor({
        typeEvent,
        event
    }: {
        typeEvent: string;
        event: eventFunc<UsersData, Storage, EventData>;
    }) {
        this.typeEvent = typeEvent;
        this.event = event;
    }

    public fire(data, wsServer, storage: Storage, user: User<UsersData>) {
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
