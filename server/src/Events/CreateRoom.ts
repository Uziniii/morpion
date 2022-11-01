import { EventFile, EventClientData, Game, Events } from "../Interface/Events";

export const event: EventFile = {
  eventType: Events.CREATE_ROOM,
  event(c, data: EventClientData[Events.CREATE_ROOM], token, user, users, games) {
    user.room = (
      Date.now() +
      +(
        [...Array(10)].map(
          () => Math.floor(Math.random() * 10)
        ).join("")
      )
    ).toString(16)

    let game: Game = {
      type: data.game,
      timestamp: Date.now(),
      creator: token,
      invite: null,
      whoStart: Math.round(Math.random()),
      count: 0,
      board: []
    }

    switch (data.game) {
      case "morpion":
        game.board = [...Array(3).fill([...Array(3).fill("")])]

        c.send(JSON.stringify({
          event: Events.CREATE_ROOM,
          data: {
            inviteCode: user.room
          }
        }))
        break;

      default:
        break;
    }

    games[user.room] = game
  }
}