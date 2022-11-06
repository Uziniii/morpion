import { EventFile, EventClientData, Game, Events } from "../Interface/Events";

export const event: EventFile = {
    eventType: Events.REMATCH,
    event(c, data: EventClientData[Events.REMATCH], token, user, users, games) {

    }
}