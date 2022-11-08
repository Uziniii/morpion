import { Board, EventsClientData, EventFile, Events } from "../Interface/Events";

export const event: EventFile = {
  eventType: Events.MORPION_PLAY,
  event(c, data: EventsClientData[Events.MORPION_PLAY], token, user, users, games) {
    if (user.room === null) return

    let game = games[user.room]

    if (game.invite === null) return

    let creator = users[game.creator]
    let invite = users[game.invite]

    if (game === undefined) return c.send(JSON.stringify({
      data: {
        error: "Your not in a room"
      }
    }));

    if (data.col === undefined && data.row === undefined) return;

    let playFromWho = game.invite === token ? "invite" : "creator"
    let wichTurn = game.count % 2 === game.whoStart ? "invite" : "creator"

    if (playFromWho !== wichTurn) return

    let boardCol = game.board[data.col].slice()

    boardCol[data.row] = playFromWho === "invite" ? "o" : "x"
    game.board[data.col] = boardCol

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
        if (token === invite.token) inviteWin = true

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
          if (token === invite.token) inviteWin = true

          win = true
        }
      }

      checkDiagonal(game.board)
      checkDiagonal(game.board.slice().reverse())
    }

    game.count++

    if (win || game.count === 9) {
      creator.c.send(JSON.stringify({
        event: Events.MORPION_FINISH,
        data: {
          win: win ? !inviteWin : undefined,
          board: game.board
        }
      }))

      invite.c.send(JSON.stringify({
        event: Events.MORPION_FINISH,
        data: {
          win: win ? inviteWin : undefined,
          board: game.board
        }
      }))

      return
    } else {
      let toSend = JSON.stringify({
        event: Events.MORPION_PLAY,
        data: {
          board: game.board
        }
      })

      creator.c.send(toSend)
      invite.c.send(toSend)
    }
  },
}
