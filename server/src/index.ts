import http from "http"
import express from "express"
import { server as wsServer } from "websocket"
import { readdirSync } from "fs"
import { Events, EventFile, Game, EventClientData } from "./Interface/Events"

const app = express()
const server = http.createServer(app)
const ws = new wsServer({
    httpServer: server,
    autoAcceptConnections: true
})

let events: Map<EventFile["eventType"], EventFile["event"]> = new Map()

readdirSync("./server/out/Events/")
.filter((x) => x.endsWith(".js"))
.forEach((file) => {
    let { eventType, event } = require(`./Events/${file}`).event    

    events.set(eventType, event)
})

let users = {}
let closeRef = {}
let games: { [key: string]: Game } = {}

app.use("/assets", express.static("../dist/assets"))

app.get("/", (req, res) => {
    res.sendFile("../dist/index.html")
})

app.get("/room", (req, res) => {
    let id = req.query.id as string | undefined
    
    if (id === undefined) return res.send({
        error: "No id",
        roomExist: false
    })

    if (games[id] === undefined && games[id].invite === null) return res.send({
        error: "This room doesn't exist",
        roomExist: false
    })

    return res.send({
        roomExist: true
    })
})

ws.on("connect", (c) => {
    let token = (
        Date.now() +
        +(
            [...Array(10)].map(
                () => Math.floor(Math.random() * 10)
            ).join("")
        )
    ).toString(16)

    users[token] = {
        id: {
            adress: c.socket.remoteAddress,
            port: c.socket.remotePort
        },
        c: c,
        token,
        room: null
    }

    closeRef[`${c.socket.remoteAddress}:${c.socket.remotePort}`] = token

    c.send(JSON.stringify({
        event: Events.CREATE_TOKEN,
        data: {
            token
        }
    }))

    console.log(`New connection : token : ${token}`);

    c.on("message", (msg) => {
        if (msg.type !== "utf8") return
        
        try {
            let { token, event, data }: {
                token: string,
                event: Events,
                data: EventClientData
            } = JSON.parse(msg.utf8Data)
            
            events.get(event)?.call(this, c, data, token, users[token], users, games)
        } catch (error) {
            console.log(error);
        }
    })
})

ws.on("close", (c) => {
    let ref = `${c.socket.remoteAddress}:${c.socket.remotePort}`
    let token = closeRef[ref]

    console.log(`Close connection : token : ${token}`);

    if (users[token].room !== null) delete games[users[token].room]

    delete users[token]
    delete closeRef[ref]
})

server.listen(3000, () => console.log("Server On on port : 3000"))

// Games cleanup interval
setInterval(() => {
    for(let id in games) {
        let game = games[id]

        if (game.timestamp >= Date.now() && game.invite === null) delete games[id]
    }
}, 120000)
