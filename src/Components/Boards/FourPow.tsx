interface Props {
  board: string[][];
  inviteCode: string;
  showCode: boolean;
  onPlay: (col: number, row: number) => void;
  topSentence: string;
  win: boolean | undefined | null;
  backToMenu: () => void;
  oppStillOn: boolean;
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
  rematch
}: Props) {
  return <div>

  </div>
}