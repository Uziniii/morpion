import { useState } from "react"
import { Games } from "../../server/src/Interface/Events";

interface Props {
  setInviteCode: (value: string) => void,
  inviteCode: string
  roomEvent: (event: "create" | "join", game?: Games) => Promise<boolean>;
}

export default function Room({ roomEvent, setInviteCode, inviteCode }: Props) {
  let [game, setGame] = useState<Games>("morpion")
  let [codeFound, setCodeFound] = useState(true)

  async function onClickRoom(event: "create" | "join") {
    if (event === "create") return roomEvent("create", game)
    else if (event === "join") {
      if (!(await roomEvent("join"))) setCodeFound(false)
    }
  }

  return (
    <div className="room">
      <div className="join-room">
        <input
          onChange={
            ({ target: { value } }) => setInviteCode(value)
          }
          value={inviteCode}
          placeholder="Code d'invitation"
          className={`w-full h-16 text-xl text-center border-2 ${codeFound ? "border-white" : "border-red-400"}`}
          maxLength={20}
          type="text"
        />
        <button onClick={() => onClickRoom("join")}>Rejoindre une salle</button>
      </div>
      <p className="m-4 text-xl">OU</p>
      <div className="create-room">
        <div className="flex justify-around border-2 border-white">
          <button onClick={() => setGame("morpion")} className={game === "morpion" ? "border-2" : ""}>Morpion</button>
          <button onClick={() => setGame("connect4")} className={game === "connect4" ? "border-2" : ""}>Puissance 4</button>
        </div>
        <button onClick={() => onClickRoom("create")}>Créer une salle</button>
      </div>
    </div>
  )
}