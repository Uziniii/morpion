import { useEffect, useState } from 'react'
import { Events, EventsServerData, EventsClientData, Games, UserType } from '../server/src/Interface/Events';
import Board from './Components/Board';
import Room from './Components/Room'
import wsEventHook, { sendEventFunc } from './Hooks/wsEventHook';

let game: Games;
let userType: UserType;

const url = (window as any).PROD as boolean ? window.location.host : "localhost:3000"
// const url = window.location.host

let ws = new WebSocket(`ws://${url}/`, "echo-protocol")

function App () {
  const [token, setToken] = useState<string>("")
  const sendEvent: sendEventFunc<EventsClientData> = wsEventHook(ws, token)

  useEffect(() => {
    console.count("app")

    try {
      ws.onmessage = msg => {
        if (token !== "") return

        let { event, data }: {
          event: keyof EventsServerData,
          data: EventsServerData[Events]
        } = JSON.parse(msg.data)

        if (event === "CREATE_TOKEN") setToken((data as EventsServerData[typeof event]).token)
      }

      ws.addEventListener("close", () => {
        ws = new WebSocket(`ws://${url}/`, "echo-protocol")
      })
    } catch (error) {
      console.log(error);
    }

    return () => {
      ws.onmessage = () => {}
    }
  }, [])

  const [inviteCode, setInviteCode] = useState("")
  const [inRoom, setInRoom] = useState(false)

  async function roomEvent(event: "create" | "join", gameType?: Games): Promise<boolean> {
    if (event === "create" && gameType !== undefined) {
      game = gameType
      userType = "creator"

      sendEvent<Events.CREATE_ROOM>(Events.CREATE_ROOM, {
        game: gameType
      })

      setInRoom(true)
    } else if (event === "join") {
      const res = await (await fetch(`http://${url}/room?id=${inviteCode}`)).json()

      if (res.roomExist) {
        userType = "invite"

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
          url={url} 
          game={game} 
          invitePropsCode={inviteCode} 
          userType={userType}
          sendEvent={sendEvent}
          setInRoom={setInRoom}
        />
      }
    </div>
  )
}

export default App
