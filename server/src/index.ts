import http from "http"
import express from "express"
import { Events, EventsServerData } from "./Interface/Events"
import { join } from "path"
import EventWSServer from "../../websocket/server/WSServer"
import UserData from "./Interface/UserData"
import Storage from "./Interface/Storage"
import Collection from "../../websocket/server/Classes/Collection"

const app = express()
const server = http.createServer(app)

const ws = new EventWSServer<UserData, Storage, EventsServerData>(
  {
    httpServer: server,
    autoAcceptConnections: true
  },
  {
    roomMap: new Collection()
  },
  {
    defaultData: {
      room: null
    },
    onUserConnect(user) {
      console.log(`New connection : token : ${user.getToken}`);

      user.send(Events.CREATE_TOKEN, {
        token: user.getToken
      })
    },
    onUserClose(user) {
      console.log(`Close connection : token : ${user.getToken}`);
    },
  }
)

ws.setEvents([

])

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

  if (ws.getStorage.roomMap.get(id) === undefined && ws.getStorage.roomMap.get(id)?.invite !== null) return res.send({
    error: "This room doesn't exist",
    roomExist: false
  })

  return res.send({
    roomExist: true
  })
})

server.listen(3000, () => console.log("Server On on port : 3000"))

// ws.on("connect", (c) => {
//   let token = (
//     Date.now() +
//     +(
//       [...Array(10)].map(
//         () => Math.floor(Math.random() * 10)
//       ).join("")
//     )
//   ).toString(16)

//   users[token] = {
//     c: c,
//     token,
//     room: null
//   }

//   closeRef[`${c.socket.remoteAddress}:${c.socket.remotePort}`] = token

//   c.send(JSON.stringify({
//     event: Events.CREATE_TOKEN,
//     data: {
//       token
//     }
//   }))

//   console.log(`New connection : token : ${token}`);

//   c.on("message", (msg) => {
//     if (msg.type !== "utf8") return

//     try {
//       let { token, event, data }: {
//         token: string,
//         event: Events,
//         data: EventsClientData
//       } = JSON.parse(msg.utf8Data)

//       events.get(event)?.call(this, c, data, token, users[token], users, games)
//     } catch (error) {
//       console.log(error);
//     }
//   })
// })

// ws.on("close", (c) => {
//   let ref = `${c.socket.remoteAddress}:${c.socket.remotePort}`
//   let token = closeRef[ref]

//   console.log(`Close connection : token : ${token}`);

//   if (users[token].room !== null) {
//     let room = games[users[token].room as string]

//     let toSend = JSON.stringify({
//       event: Events.LEAVE_ROOM,
//       data: {

//       }
//     })

//     users[room.creator].c.send(toSend)
//     users[room?.invite as string]?.c.send(toSend)

//     delete games[users[token].room as string]
//   }

//   delete users[token]
//   delete closeRef[ref]
// })
