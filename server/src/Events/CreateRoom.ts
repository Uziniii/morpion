import ServerEvent from "../../../websocket/Classes/ServerEvent";
import { EventsClientData, EventsServerData, Events } from "../Interface/Events";
import UserData from "../Interface/UserData";
import Storage from "../Interface/Storage";
import Room from "../Classes/Room";

const CREATE_ROOM = new ServerEvent<UserData, Storage, EventsClientData[Events.CREATE_ROOM], EventsServerData>({
  typeEvent: Events.CREATE_ROOM,
  event({
    data,
    server,
    storage: {
      roomMap
    },
    user
  }) {
    let game = new Room(roomMap, server, data.game, user.getToken)

    if (!game.alive) return;

    roomMap.set(game.getId, game)
    user.data.room = game.getId

    user.send<Events.CREATE_ROOM>(Events.CREATE_ROOM, {
      inviteCode: game.getId
    })
  }
})

export default CREATE_ROOM
