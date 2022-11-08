import { EventFile, EventsClientData, Game, Events } from "../Interface/Events";

export const event: EventFile = {
    eventType: Events.LEAVE_ROOM,
    event(c, data: EventsClientData[Events.LEAVE_ROOM], token, user, users, games) {
        
    }
}