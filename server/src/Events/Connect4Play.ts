import ServerEvent from "../../../websocket/Classes/ServerEvent";
import { EventsClientData, Events, EventsServerData, Board } from "../Interface/Events";
import Storage from "../Interface/Storage";
import UserData from "../Interface/UserData";

const CONNECT4_PLAY = new ServerEvent<UserData, Storage, EventsClientData[Events.CONNECT4_PLAY], EventsServerData>({
    typeEvent: Events.CONNECT4_PLAY,
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

        const game = roomMap.get(user.data.room)

        if (game === undefined || game.invite === null) return;

        const invite = server.getUser(game.invite)
        const creator = server.getUser(game.creator)

        if (invite === undefined || creator === undefined) return;
        if (data.col === undefined) return;

        let playFromWho = game.invite === user.getToken ? "invite" : "creator"
        let wichTurn = game.count % 2 === game.whoStart ? "invite" : "creator"

        if (playFromWho !== wichTurn) return;

        let reduceCol = (col: number): number => 
            game.board[col].reduce(
                (acc: any, cur) =>
                    (typeof acc === "string"
                        ? 0
                        : acc
                    ) +
                    (cur !== ""
                        ? 1
                        : 0)
                , 0)

        let colReduced: number = reduceCol(data.col)

        if (colReduced >= 6) return

        game.setCell(data.col, 5 - colReduced, playFromWho === "invite" ? "r" : "y")
        game.incrementCounter()

        const check = (grid: Board) => {
            let win: { win: boolean, color?: "r" | "y" | string } = { win: false };

            grid.forEach(z => {
                if (win.win) return;
                for (const clc of ["r", "y"]) {
                    if (z.join("").search(clc.repeat(4)) === 0) {
                        win = { win: true, color: clc };
                        break;
                    };
                }
            })

            return win;
        }

        const checkVertical = (grid: Board) => {
            let grid2: Board = [];

            for (let i = 0; i < grid.length + 1; i++) {
                grid2.push([...Array(6)]);
                grid.forEach((x, j) => grid2[i][j] = grid[j][i])
            }

            return check(grid2);
        }

        const checkDiagonal = (grid: Board) => {
            let win: { win: boolean, color?: "r" | "y" | string } = { win: false };
            let diagonal: boolean[] = []

            for (const clc of ["r", "y"]) {
                grid.forEach((x, i) => {
                    if (win.win) return

                    for (let j = 0; j < x.length; j++) {
                        let row = x[j]
                        if (row === clc && i <= 2 && j <= 3) {
                            for (let k = 0; k < 4; k++) diagonal.push(grid[i + k][j + k] === clc)
                        }

                        if (diagonal.length === 4) {
                            if (diagonal.every(x => x === true)) {
                                win = { win: true, color: clc }
                                break
                            } else diagonal = []
                        } else if (diagonal.length > 4) diagonal = []
                    }
                })
            }

            return win;
        }

        const checkWin = (grid: Board) => {
            grid = grid.slice()
            return (check(grid).win || checkVertical(grid).win || checkDiagonal(grid).win || checkDiagonal(grid.reverse()).win)
        }

        let inviteWin = false
        let win = checkWin(game.board)

        let equality = game.board.reduce(
            (acc, cur, i) => 
                acc + reduceCol(i)
        , 0)
        
        if (win || equality === game.getBoardSize) {
            if (user.getToken === invite.getToken) inviteWin = true

            creator.send<Events.MORPION_FINISH>(Events.MORPION_FINISH, {
                win: win ? !inviteWin : undefined,
                board: game.board
            })

            invite.send<Events.MORPION_FINISH>(Events.MORPION_FINISH, {
                win: win ? inviteWin : undefined,
                board: game.board
            })

            return
        }

        let toSend = {
            board: game.board
        }

        creator.send<Events.MORPION_PLAY>(Events.MORPION_PLAY, toSend)
        invite.send<Events.MORPION_PLAY>(Events.MORPION_PLAY, toSend)
    }
})

export default CONNECT4_PLAY;
