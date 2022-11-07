import WebSocketServer from "../WSServer";
import http from "http"
import express from "express"
import WSEvent from "../Classes/WSEvent";

interface UsersData {
    room: string;
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
    }
)

wsServer.setEvents([
    
    new WSEvent<UsersData, Storage>({
        typeEvent: "CREATE_ROOM",
        event({ 
            type, 
            data,
            server, 
            storage: {
                Room 
            } 
        }) {
            
        },
    })
])