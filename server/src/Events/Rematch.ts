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
        if (user.data.room === null) return

        const game = roomMap.get(user.data.room)

        if (game === undefined || game.invite === null) return

        const invite = server.getUser(game.invite)
        const creator = server.getUser(game.creator)

        if (invite === undefined || creator === undefined) return;

        if (game.rematch === undefined) {
            invite.send<Events.REMATCH>(Events.REMATCH, {
                who: user.getToken === invite.getToken
            })

            creator.send<Events.REMATCH>(Events.REMATCH, {
                who: user.getToken === creator.getToken
            })

            game.rematch = user.getToken;

            return
        }

        const newGame = new Room(roomMap, server, game.type, user.getToken, game.getId)

        roomMap.set(newGame.getId, newGame)

        console.log(newGame);

        invite.send<Events.JOIN_ROOM>(Events.JOIN_ROOM, {
            rematch: true,
            game: newGame.type,
            whoStart: newGame.whoStart
        })

        creator.send<Events.JOIN_ROOM>(Events.JOIN_ROOM, {
            rematch: true,
            game: newGame.type,
            whoStart: newGame.whoStart
        })
    }
})

export default REMATCH;
