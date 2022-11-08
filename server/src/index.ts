import http from "http"
import express from "express"
import { server as wsServer } from "websocket"
import { readdirSync } from "fs"
import { Events, EventFile, Game, Games, Users, EventClientData } from "./Interface/Events"
import { join } from "path"
import EventWSServer from "../../websocket/server/WSServer"
import UserData from "./Interface/UserData"

const app = express()
const server = http.createServer(app)
const ws = new EventWSServer<UserData, >({
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

let users: Users = {}
let closeRef = {}
let games: Games = {}

app.use("/assets", express.static(join(__dirname, "../dist/assets")))

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"))
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

  if (users[token].room !== null) {
    let room = games[users[token].room as string]

    let toSend = JSON.stringify({
      event: Events.LEAVE_ROOM,
      data: {

      }
    })

    users[room.creator].c.send(toSend)
    users[room?.invite as string]?.c.send(toSend)

    delete games[users[token].room as string]
  }

  delete users[token]
  delete closeRef[ref]
})

server.listen(3000, () => console.log("Server On on port : 3000"))

// Games cleanup interval
setInterval(() => {
  for (let id in games) {
    let game = games[id]

    if (game.timestamp >= Date.now() && game.invite === null) delete games[id]
  }
}, 120000)
