import EventWSServer from "../WSServer";

type eventFunc<UsersData, Storage, EventData> = ({
    type,
    data,
    server,
    storage
}: {
    type: string,
    data: EventData,
    server: EventWSServer<UsersData, Storage>,
    storage: Storage
}) => any;

class WSEvent<UsersData, Storage, EventData> {
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

    public fire(data, wsServer, storage: Storage) {
        this.event({
            type: this.typeEvent,
            data,
            server: wsServer,
            storage
        });
    }
}

export default WSEvent;
