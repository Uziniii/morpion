import AfterWinMenu from "../AfterWinMenu";

interface Props {
  board: string[][] | string;
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

export default function Connect4({
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
  return <div id="connect4" className="connect4">
    {showCode && <h1>Code d'invitation : {inviteCode}</h1>}
    {!showCode && <h1>{topSentence}</h1>}

    {
      typeof board === "string"
      ? board
      : <div className="board grid-cols-7 bg-blue-500 border-4 rounded-sm border-blue-600">
        {board.map((x, i) => {
          return <div key={i}>
            {x.map((color, j) => {
              console.log(color);
              

              if (color !== "") return <div key={j} className={`case ${color === "r" ? "!bg-red-600" : "!bg-yellow-300"}`}></div>

              return <div key={j} onClick={() => onPlay(i, j)} className="cursor-pointer case"></div>
            })}
          </div>
        })}
      </div>
    }

    <AfterWinMenu
      win={win}
      backToMenu={backToMenu}
      oppStillOn={oppStillOn}
      rematch={rematch}
      whoRematch={whoRematch}
    />
  </div>
}