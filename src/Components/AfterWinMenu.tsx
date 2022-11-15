interface Props {
  win: boolean | null | undefined;
  oppStillOn: boolean;
  whoRematch: boolean | undefined;
  backToMenu: () => void;
  rematch: () => void;
}

function AfterWinMenu({
  win,
  oppStillOn,
  whoRematch,
  backToMenu,
  rematch,
}: Props) {
  return <>
    {
      win !== null &&
      <div id="menu">
        <button onClick={() => backToMenu()} id="back-to-menu">Revenir au menu</button> 
        {oppStillOn && <button onClick={() => rematch()} className={whoRematch ? "!bg-green-500 !border-green-500" : ""} id="rematch">Rejouer {whoRematch === undefined ? "0" : "1"}/2</button>}
      </div>
    }
  </>
}

export default AfterWinMenu