import ScoreBoard from "./ScoreBoard";
import { User, Player, WhiteCard, BlackCard, Setting } from "../../interfaces";
import { useState, useContext, useEffect } from "react";
import Whitecard from "./Whitecard";
import Blackcard from "./Blackcard";
import WinnerCard from "./WinnerCard";
import { SocketContext } from "../../contexts/SocketContext";

interface Props {
  currentUser: User;
  roomCode: string;
  setting: Setting;
  history: any;
}

export default function GameRoom(props: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [currentBlackCard, setCurrentBlackCard] = useState<BlackCard | null>(
    null
  );
  const [currentWhiteCard, setWhiteCard] = useState<WhiteCard>();
  const [judgeWhiteCard, setJudgeWhiteCard] = useState<WhiteCard>();
  const [winnerCard, setWinnerCard] = useState<WhiteCard>();
  const [winnerPlayer, setWinnerPlayer] = useState<string>();
  const [playedCards, setPlayedCards] = useState<WhiteCard[]>([]);
  const [judgeMode, setJudgeMode] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [hideNext, setHideNext] = useState(true);
  const [hideSubmit, setHideSubmit] = useState(false);
  const [round, setRound] = useState<Number>(1);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(
      "game init update",
      ({ players, blackCard }: { players: Player[]; blackCard: BlackCard }) => {
        setPlayers(players);
        const player = extractCurrentPlayer(players);
        setCurrentPlayer(player);
        setCurrentBlackCard(blackCard);
        setWhiteCard(player?.cards[0]);
      }
    );

    socket.on(
      "game state update player",
      ({
        players,
        playedCards,
      }: {
        players: Player[];
        playedCards: WhiteCard[];
      }) => {
        setPlayers(players);
        const player = extractCurrentPlayer(players);
        setCurrentPlayer(player);
        setPlayedCards(playedCards);
        setJudgeMode(true);
        setSubmitClicked(false);
        setHideSubmit(true);
      }
    );
    socket.on(
      "game state update judge",
      ({
        players,
        winnerCard,
      }: {
        players: Player[];
        winnerCard: WhiteCard;
      }) => {
        setPlayers(players);
        const player = extractCurrentPlayer(players);
        setCurrentPlayer(player);
        setWinnerCard(winnerCard);
        setWinnerPlayer(extractPlayerById(winnerCard.cardOwner));
        setJudgeMode(false);
        setSubmitClicked(false);
        setHideNext(false);
      }
    );

    socket.on(
      "next turn client",
      ({
        players,
        blackCard,
        round,
      }: {
        players: Player[];
        blackCard: BlackCard;
        round: Number;
      }) => {
        setPlayers(players);
        const player = extractCurrentPlayer(players);
        setCurrentPlayer(player);
        setCurrentBlackCard(blackCard);
        setPlayedCards([]);
        setWinnerCard(undefined);
        setWinnerPlayer(undefined);
        setJudgeWhiteCard(undefined);
        setJudgeMode(false);
        setSubmitClicked(false);
        setNextClicked(false);
        setHideSubmit(false);
        setHideNext(true);
        setRound(round);
      }
    );
  });

  const extractCurrentPlayer = (players: Player[]) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === props.currentUser?.id) {
        return players[i];
      }
    }
  };

  const extractPlayerById = (playerId: string | undefined) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === playerId) {
        return players[i].name;
      }
    }
  };

  const handlePlayerSelect = (card: WhiteCard) => {
    setWhiteCard(card);
  };

  const handleJudgeSelect = (card: WhiteCard) => {
    setJudgeWhiteCard(card);
  };

  const renderWhiteCards = () => {
    return (
      <div>
        {!currentPlayer?.isJudge && !hideSubmit && renderSubmitButton()}
        <p>Your cards: </p>
        {currentPlayer &&
          currentPlayer.cards.map((card: WhiteCard, i: any) => {
            return (
              <div key={i}>
                <Whitecard
                  type="white"
                  card={card}
                  handlePlayerSelect={handlePlayerSelect}
                  currentWhiteCard={currentWhiteCard}
                  currentPlayer={currentPlayer}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const renderCurrentBlackCard = () => {
    return (
      <div>
        <p>Black card: </p>
        {currentBlackCard && <Blackcard card={currentBlackCard} />}
        {winnerCard && winnerPlayer && (
          <WinnerCard card={winnerCard} name={winnerPlayer} />
        )}
      </div>
    );
  };

  const renderCardsReceived = () => {
    return (
      <div>
        {renderSubmitButton()}
        <p>Cards received (Judge Mode) : </p>
        {playedCards.map((card: WhiteCard, i: any) => {
          return (
            <div key={i}>
              <Whitecard
                type="white-judge"
                card={card}
                handleJudgeSelect={handleJudgeSelect}
                judgeWhiteCard={judgeWhiteCard}
                currentPlayer={currentPlayer}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderCardsPlayed = () => {
    return (
      <div>
        <p>Cards played : </p>
        {playedCards.map((card: WhiteCard, i: any) => {
          return (
            <div key={i}>
              <Whitecard card={card} disabled={true} />
            </div>
          );
        })}
      </div>
    );
  };

  const handleSubmit = () => {
    if (judgeMode) {
      if (judgeWhiteCard) {
        socket.emit("card select by judge", {
          cardId: judgeWhiteCard?.id,
          playerId: currentPlayer?.id,
          roomCode: props.roomCode,
        });
        setSubmitClicked(true);
      }
    } else {
      if (currentWhiteCard) {
        socket.emit("card select by player", {
          cardId: currentWhiteCard?.id,
          playerId: currentPlayer?.id,
          roomCode: props.roomCode,
        });
        setSubmitClicked(true);
      }
    }
  };

  const renderSubmitButton = () => {
    return (
      <div>
        <button
          className={`${
            submitClicked ? "bg-green-500" : "bg-red-500"
          } hover:bg-yellow-300 text-white h-10 w-28 `}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  };

  const handleNext = () => {
    setNextClicked(true);
    socket.emit("next turn", {
      playerId: currentPlayer?.id,
      roomCode: props.roomCode,
    });
  };

  const renderNextButton = () => {
    return (
      <div>
        <button
          className={`${
            nextClicked ? "bg-green-500" : "bg-yellow-500"
          } hover:bg-red-300 text-white h-10 w-28 `}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    );
  };

  const renderGameOver = () => {
    return (
      <div>
        <p>Game Over</p>
        <button
          className="bg-blue-500 hover:bg-red-300 text-white h-10 w-28 "
          onClick={() => {
            props.history.push("/");
          }}
        >
          Back to Home
        </button>
      </div>
    );
  };

  return (
    <>
      <p>Game Room</p>
      <ScoreBoard players={players} />
      {round > props.setting.rounds ? (
        renderGameOver()
      ) : (
        <div>
          <p className="text-2xl">Round: {round}</p>
          <div className="grid grid-cols-3 gap-10 mt-11">
            <div>{currentPlayer && renderWhiteCards()}</div>
            <div>
              {!hideNext && renderNextButton()}
              {renderCurrentBlackCard()}
              {playedCards && renderCardsPlayed()}
            </div>
            <div>
              {currentPlayer?.isJudge && judgeMode && renderCardsReceived()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
