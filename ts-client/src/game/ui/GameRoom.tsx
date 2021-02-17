import ScoreBoard from "./ScoreBoard";
import { User, Player, WhiteCard, BlackCard } from "../../interfaces";
import { useState, useContext, useEffect } from "react";
import Whitecard from "./Whitecard";
import Blackcard from "./Blackcard";
import WinnerCard from "./WinnerCard";
import Timer from "./Timer";
import { SocketContext } from "../../contexts/SocketContext";

interface Props {
  currentUser: User;
  roomCode: string;
}

export default function GameRoom(props: Props) {
  const [pickTimer, setPickTimer] = useState(true);
  const [judgeTimer, setJudgeTimer] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [currentBlackCard, setCurrentBlackCard] = useState<BlackCard | null>(null);
  const [currentWhiteCard, setWhiteCard] = useState<WhiteCard>();
  const [judgeWhiteCard, setJudgeWhiteCard] = useState<WhiteCard>();
  const [winnerCard, setWinnerCard] = useState<WhiteCard>();
  const [playedCards, setPlayedCards] = useState<WhiteCard[]>([]);

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

    socket.on("game state update", ({ players, playedCards, winnerCard, blackCard }: { players: Player[], playedCards: WhiteCard[], winnerCard: WhiteCard, blackCard: BlackCard }) => {
      setPlayers(players);
      const player = extractCurrentPlayer(players);
      setCurrentPlayer(player);
      setPlayedCards(playedCards);
      setWinnerCard(winnerCard);
      setCurrentBlackCard(blackCard);
    });
  });

  const extractCurrentPlayer = (players: Player[]) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === props.currentUser?.id) {
        return players[i];
      }
    }
  };

  const handlePlayerSelect = (card: WhiteCard) => {
    setWhiteCard(card);
  };

  const handleJudgeSelect = (card: WhiteCard) => {
    setJudgeWhiteCard(card)
  }

  const handlePlayerTimesUp = () => {
    setPickTimer(!pickTimer);
    if(!currentPlayer?.isJudge){
        socket.emit("card select by player", {
        cardId: currentWhiteCard?.id,
        playerId: currentPlayer?.id,
        roomCode: props.roomCode,
        });
    } 
    setJudgeTimer(!judgeTimer);
  };

  const handleJudgeTimesUp = () => {
    setJudgeTimer(!judgeTimer);
    if(currentPlayer?.isJudge){
        socket.emit("card select by judge", {
            cardId: judgeWhiteCard?.id,
            playerId: currentPlayer?.id,
            roomCode: props.roomCode,
        });
    } 
    setPickTimer(!pickTimer);
  };

  const renderWhiteCards = () => {
    return (
      <div>
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
                  currentPlayer = {currentPlayer}
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
        {winnerCard && <WinnerCard card = {winnerCard} />}
      </div>
    );
  };

  const renderCardsReceived = () => {
      return (
        <div>
          <p>Cards received (Judge Mode) : </p>
            {playedCards.map((card: WhiteCard, i: any) => {
                return (
                    <div key={i}>
                        <Whitecard
                            type="white-judge"
                            card={card}
                            handleJudgeSelect={handleJudgeSelect}
                            judgeWhiteCard={judgeWhiteCard}
                            currentPlayer = {currentPlayer}
                        />
                    </div>
                );
            })}
      </div>
      );
  }

  return (
    <>
      <p>Game Room</p>
      <ScoreBoard players={players} />
      {pickTimer && <Timer time={20} handleTimesUp={handlePlayerTimesUp} start={pickTimer} />}
      {renderCurrentBlackCard()}
      {currentPlayer && renderWhiteCards()}
      {judgeTimer && <Timer time={20} handleTimesUp={handleJudgeTimesUp} start={judgeTimer} />}
      {currentPlayer?.isJudge && renderCardsReceived()}
    </>
  );
}
