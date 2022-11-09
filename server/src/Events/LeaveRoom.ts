import ServerEvent from "../../../websocket/server/Classes/ServerEvent";
import { EventsClientData, Events, EventsServerData } from "../Interface/Events";
import Storage from "../Interface/Storage";
import UserData from "../Interface/UserData";

const LEAVE_ROOM = new ServerEvent<UserData, Storage, EventsClientData[Events.LEAVE_ROOM], EventsServerData>({
    typeEvent: Events.LEAVE_ROOM,
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

export default LEAVE_ROOM;
