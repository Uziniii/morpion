import EventWSServer from "../WSServer";

type eventFunc<UsersData> = ({
    type,
    data,
    server,
    storage
}: {
    type: string,
    data,
    server: EventWSServer<UsersData, Storage>
    storage
}) => any;

class WSEvent<UsersData, Storage> {
    public typeEvent: string;
    protected event: eventFunc<UsersData>;

    constructor({
        typeEvent,
        event
    }: {
        typeEvent: string;
        event: eventFunc<UsersData>;
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