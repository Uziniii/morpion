import ServerEvent from "../../../websocket/Classes/ServerEvent";
import Room from "../Classes/Room";
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
        const oldGame = roomMap.get(user.getToken)

        if (oldGame === undefined) return

        const newGame = new Room(roomMap, server, oldGame.type, user.getToken, oldGame.getId)

        roomMap.set(newGame.getId, newGame)
        roomMap.delete(oldGame.getId)
    }
})

export default REMATCH;
