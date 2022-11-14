import ServerEvent from "../../../websocket/Classes/ServerEvent";
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
        const game = roomMap.get(user.getToken)

        if (game === undefined || game?.invite === null) return;

        const invite = server.getUser(game.invite)
        const creator = server.getUser(game.creator)

        if (invite === undefined || creator === undefined) return;

        invite.send<Events.LEAVE_ROOM>(Events.LEAVE_ROOM, {
            who: user.getToken === invite.getToken
        })

        creator.send<Events.LEAVE_ROOM>(Events.LEAVE_ROOM, {
            who: user.getToken === invite.getToken
        })
    }
})

export default LEAVE_ROOM;
