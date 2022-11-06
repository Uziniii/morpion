import WebSocketServer from "../WSServer";

interface UsersData {
    room: string;
}

const wsServer = new WebSocketServer<UsersData>({
    httpServer
})

wsServer.getUser("aze")