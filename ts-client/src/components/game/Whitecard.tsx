import { WhiteCard, Player } from "../../interfaces";

interface Props {
  type?: string;
  card: WhiteCard;
  currentWhiteCard?: WhiteCard | undefined;
  judgeWhiteCard?: WhiteCard | undefined;
  handlePlayerSelect?: any;
  handleJudgeSelect?: any;
  currentPlayer?: Player | undefined;
  disabled?: Boolean;
}
export default function Whitecard(props: Props) {
  const judgeClass =
    "max-w-xs rounded overflow-hidden bg-gray-300 shadow-lg my-2";
  const playerClass = `max-w-xs rounded overflow-hidden hover:bg-gray-300 shadow-lg my-2 ${
    (props.currentWhiteCard?.id === props.card.id ||
      props.judgeWhiteCard?.id === props.card.id) &&
    "bg-gray-300"
  }`;

  const conditionalCSS =
    props.currentPlayer?.isJudge && props.type === "white"
      ? judgeClass
      : playerClass;
  return (
    <>
      {props.disabled ? (
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2">
          <div className="px-6 py-4">
            <p className="text-black text-base">{props.card.content}</p>
          </div>
        </div>
      ) : (
        <button
          className={conditionalCSS}
          onClick={() => {
            if (props.currentPlayer?.isJudge && props.type === "white-judge") {
              props.handleJudgeSelect(props.card);
            } else if (!props.currentPlayer?.isJudge) {
              props.handlePlayerSelect(props.card);
            }
          }}
        >
          <div className="px-6 py-4">
            <p className="text-black text-base">{props.card.content}</p>
          </div>
        </button>
      )}
    </>
  );
}
