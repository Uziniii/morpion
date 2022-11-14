import ServerEvent from "../../../websocket/Classes/ServerEvent";
import { EventsClientData, Events, EventsServerData } from "../Interface/Events";
import Storage from "../Interface/Storage";
import UserData from "../Interface/UserData";

const JOIN_ROOM = new ServerEvent<UserData, Storage, EventsClientData[Events.JOIN_ROOM], EventsServerData>({
  typeEvent: Events.JOIN_ROOM,
  event({
    type,
    data,
    server,
    storage: {
      roomMap
    },
    user 
  }) {
    if (data.inviteCode === undefined) return;

    let game = roomMap.get(data.inviteCode)

    if (game === undefined) return user.send<any>(Events.JOIN_ROOM, {
      error: "Room doesn't exist"
    })

    game.setInvite = user.getToken
    user.data.room = game.getId

    let toSend = {
      whoStart: game.whoStart,
      game: game.type
    }

    user.send<Events.JOIN_ROOM>(Events.JOIN_ROOM, toSend)
    server.getUser(game.creator)?.send<Events.JOIN_ROOM>(Events.JOIN_ROOM, toSend)
  }
})

export default JOIN_ROOM;
