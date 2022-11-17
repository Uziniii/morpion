import AfterWinMenu from "../AfterWinMenu";

interface Props {
  board: string[][];
  inviteCode: string;
  showCode: boolean;
  onPlay: (col: number, row: number) => void;
  topSentence: string;
  win: boolean | undefined | null;
  backToMenu: () => void;
  oppStillOn: boolean;
  whoRematch: boolean | undefined;
  rematch: () => void;
}

export default function Morpion({
  showCode,
  inviteCode,
  board,
  onPlay,
  topSentence,
  win,
  backToMenu,
  oppStillOn,
  whoRematch,
  rematch 
}: Props) {
  return (
    <div id="morpion" className="morpion">
      {showCode && <h1>Code d'invitation : {inviteCode}</h1>}
      {!showCode && <h1>{topSentence}</h1>}

      <div className="board">
        {board.map((x, i) => {
          return <div className="cell" key={i}>
            {x.map((y, j) => {
              if (y === "" && win === null) return (
                <div key={j} onClick={() => onPlay(i, j)} className="cursor-pointer">
                  <span></span>
                </div>
              )

              return (
                <div key={j} className="cursor-default">
                  <span>{y}</span>
                </div>
              )
            })}
          </div>
        })}
      </div>

      <AfterWinMenu 
        win={win}
        oppStillOn={oppStillOn}
        whoRematch={whoRematch}
        backToMenu={backToMenu}
        rematch={rematch}
      />
    </div>
  )
}