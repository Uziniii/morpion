import ServerEvent from "../../../websocket/server/Classes/ServerEvent";
import { EventsClientData, Events, EventsServerData } from "../Interface/Events";
import Storage from "../Interface/Storage";
import UserData from "../Interface/UserData";

const REMATCH = new ServerEvent<UserData, Storage, EventsClientData[Events.REMATCH], EventsServerData>({
    typeEvent: Events.REMATCH,
    event({
        type,
        data,
        server,
        storage: {
            roomMap
        },
        user
    }) {
        
    }
})

export default REMATCH;
