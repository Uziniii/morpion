import WebSocketServer from "../WSServer";
import http from "http"
import express from "express"
import ServerEvent from "../Classes/ServerEvent";
import { EventClientData } from "../../../server/src/Interface/Events"
import { w3cwebsocket } from "websocket"

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

    public token = "aa"
}

interface Storage {
    RoomManager: RoomManager
}

const wsServer = new WebSocketServer<UsersData, Storage>(
    {
        httpServer: server,
        autoAcceptConnections: true
    }, {
        RoomManager: new RoomManager()
    }, {
        room: null
    }
)

wsServer.setEvents([
    new ServerEvent<UsersData, Storage, EventClientData["CREATE_ROOM"]>({
        typeEvent: "CREATE_ROOM",
        event({
            type,
            data,
            server,
            user,
            storage: {
                RoomManager
            }
        }) {
            console.log(type);
            
            console.log(user.data);
        }
    })
])

server.listen(3000)

const client = new w3cwebsocket("ws://localhost:3000")

client.onopen = () => {
    client.onmessage = (msg) => {
        if (typeof msg.data !== "string") return;

        let token = JSON.parse(msg.data).data.token;

        client.send(JSON.stringify({
            event: "CREATE_ROOM",
            token,
            data: { } 
        }))
    }
}
