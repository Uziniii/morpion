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

export default function FourPow({
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

    <div className="board grid-cols-7 bg-black">
      {board.map(x => {
        return <div className="">
          {x.map(y => {
            return <div className="w-8 h-8 border-4 rounded bg-slate-600">
              
            </div>
          })}
        </div>
      })}
    </div>

    <AfterWinMenu
      win={win}
      backToMenu={backToMenu}
      oppStillOn={oppStillOn}
      rematch={rematch}
      whoRematch={whoRematch}
    />
  </div>
}