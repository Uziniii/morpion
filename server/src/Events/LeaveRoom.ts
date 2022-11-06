import { EventFile, EventClientData, Game, Events } from "../Interface/Events";

export const event: EventFile = {
    eventType: Events.LEAVE_ROOM,
    event(c, data: EventClientData[Events.LEAVE_ROOM], token, user, users, games) {
        
    }
}