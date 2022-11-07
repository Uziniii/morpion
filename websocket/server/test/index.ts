import WebSocketServer from "../WSServer";
import http from "http"
import express from "express"
import WSEvent from "../Classes/WSEvent";
import { EventClientData } from "../../../server/src/Interface/Events"

interface UsersData {
    room: string | null;
}

const app = express()
const server = http.createServer(app)

class Room {
    constructor() {

    }
}

class RoomManager {
    constructor() {

    }

    public token = ""
}

interface Storage {
    roomManager: RoomManager
}

const wsServer = new WebSocketServer<UsersData, Storage>(
    {
        httpServer: server,
        autoAcceptConnections: true
    }, {
        roomManager: RoomManager
    }, {
        room: null
    }
)

wsServer.setEvents([
    new WSEvent<UsersData, Storage, EventClientData["CREATE_ROOM"]>({
        typeEvent: "CREATE_ROOM",
        event({ 
            type,
            data,
            server,
            storage: {
                roomManager: RoomManager
            }
        }) {
            
        }
    })
])
