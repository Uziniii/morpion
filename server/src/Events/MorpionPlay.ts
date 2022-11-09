import ServerEvent from "../../../websocket/server/Classes/ServerEvent";
import { Board, EventsClientData, Events, EventsServerData } from "../Interface/Events";
import Storage from "../Interface/Storage";
import UserData from "../Interface/UserData";

const MORPION_PLAY = new ServerEvent<UserData, Storage, EventsClientData[Events.MORPION_PLAY], EventsServerData>({
  typeEvent: Events.MORPION_PLAY,
  event({
    type,
    data,
    server,
    storage: {
      roomMap
    },
    user 
  }) {
    if (user.data.room === null) return

    let game = roomMap.get(user.data.room)

    if (game === undefined || game.invite === null) return

    let creator = server.getUser(game.creator);
    let invite = server.getUser(game.invite);

    if (creator === undefined || invite === undefined) return;
    if (data.col === undefined && data.row === undefined) return;

    let playFromWho = game.invite === user.getToken ? "invite" : "creator"
    let wichTurn = game.count % 2 === game.whoStart ? "invite" : "creator"

    if (playFromWho !== wichTurn) return

    game.setCell(data.col, data.row, playFromWho === "invite" ? "o" : "x")

    let inviteWin = false
    let win = false

    // Check the horizontal and vertical win
    for (let i = 0; i < game.board.length; i++) {
      let colJoin = ""

      for (let j = 0; j < game.board.length; j++) {
        colJoin += game.board[j][i]
      }

      if (
        game.board[i].join("") === "xxx" ||
        game.board[i].join("") === "ooo" ||
        colJoin === "xxx" ||
        colJoin === "ooo"
      ) {
        if (user.getToken === invite.getToken) inviteWin = true

        win = true
      }

      if (win) break
    }

    if (!win) {
      let checkDiagonal = (grid: Board) => {
        if (win) return

        let diagonalJoin = ""

        for (let j = 0; j < grid.length; j++) {
          diagonalJoin += grid[j][j]
        }

        if (diagonalJoin === "xxx" || diagonalJoin === "ooo") {
          if (user.getToken === (invite as any).getToken) inviteWin = true

          win = true
        }
      }

      checkDiagonal(game.board)
      checkDiagonal(game.board.slice().reverse())
    }

    game.incrementCounter()

    if (win || game.count === 9) {
      creator.send<Events.MORPION_FINISH>(Events.MORPION_FINISH, {
        win: win ? !inviteWin : undefined,
        board: game.board
      })

      invite.send<Events.MORPION_FINISH>(Events.MORPION_FINISH, {
        win: win ? inviteWin : undefined,
        board: game.board
      })

      return
    } else {
      let toSend = {
        board: game.board
      }

      creator.send<Events.MORPION_PLAY>(Events.MORPION_PLAY, toSend)
      invite.send<Events.MORPION_PLAY>(Events.MORPION_PLAY, toSend)
    }
  },
})

export default MORPION_PLAY;
