interface Props {
  win: boolean | null | undefined;
  oppStillOn: boolean;
  rematchSuggest: boolean;
  backToMenu: () => void;
  rematch: () => void;
}

function AfterWinMenu({
  win,
  oppStillOn,
  rematchSuggest,
  backToMenu,
  rematch,
}: Props) {
  return <>
    {
      win !== null &&
      <div id="menu">
        <button onClick={() => backToMenu()}className="back-to-menu">Revenir au menu</button> 
        {oppStillOn && <button onClick={() => rematch()} className="rematch">Rejouer {rematchSuggest ? "1" : "0"}/2</button>}
      </div>
    }
  </>
}

export default AfterWinMenu