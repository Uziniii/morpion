import { EventFile, EventClientData, Events } from "../Interface/Events";

export const event: EventFile = {
  eventType: Events.JOIN_ROOM,
  event(c, data: EventClientData[Events.JOIN_ROOM], token, user, users, games) {
    let game = games[data?.inviteCode]

    if (game === undefined) c.send(JSON.stringify({
      event: Events.JOIN_ROOM,
      data: {
        error: "Room doesn't exist"
      }
    }))

    game.invite = token
    user.room = data.inviteCode

    let toSend = JSON.stringify({
      event: Events.JOIN_ROOM,
      data: {
        whoStart: games[data.inviteCode].whoStart,
        game: game.type
      }
    })

    c.send(toSend)
    users[game.creator].c.send(toSend)
  }
}
