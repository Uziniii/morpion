import { useEffect, useState } from 'react'
import { Events, EventsServerData } from '../server/src/Interface/Events';
import Board from './Components/Board';
import Room from './Components/Room'

let game: "morpion" | "4pow";
let userType: "invite" | "creator"

const url = (window as any).PROD as boolean ? window.location.host : "localhost:3000"
// const url = window.location.host

let ws = new WebSocket(`ws://${url}/`, "echo-protocol")

function App () {
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    console.count("app")

    try {
      ws.onmessage = msg => {
        let { event, data }: {
          event: keyof EventsServerData,
          data: EventsServerData[Events]
        } = JSON.parse(msg.data)

        if (event === "CREATE_TOKEN") setToken((data as EventsServerData[typeof event]).token)
      }

      ws.onclose = () => {
        ws = new WebSocket(`ws://${url}/`, "echo-protocol")
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      ws.onmessage = () => {}
    }
  }, [])

  const [inviteCode, setInviteCode] = useState("")
  const [inRoom, setInRoom] = useState(false)

  async function roomEvent(event: "create" | "join", gameType?: "morpion" | "4pow"): Promise<boolean> {
    if (event === "create" && gameType !== undefined) {
      game = gameType
      userType = "creator"

      ws.send(JSON.stringify({
        token,
        event: "CREATE_ROOM",
        data: {
          game
        }
      }))

      setInRoom(true)
    } else if (event === "join") {
      const res = await (await fetch(`http://${url}/room?id=${inviteCode}`)).json()

      if (res.roomExist) {
        userType = "invite"

        ws.send(JSON.stringify({
          token,
          event: "JOIN_ROOM",
          data: {
            inviteCode
          }
        }))

        setInRoom(true)
      }
    }

    return false
  }

  return (
    <div className="flex justify-center w-full h-full place-items-center">
      {
        !inRoom && 
        <Room 
          inviteCode={inviteCode} 
          setInviteCode={setInviteCode} 
          roomEvent={roomEvent} 
        />
      }
      {
        inRoom && 
        <Board 
          ws={ws} 
          token={token} 
          url={url} 
          game={game} 
          invitePropsCode={inviteCode} 
          userType={userType}
          setInRoom={setInRoom}
        />
      }
    </div>
  )
}

export default App
