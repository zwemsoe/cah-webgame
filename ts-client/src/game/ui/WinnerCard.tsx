import { WhiteCard } from "../../interfaces";

interface Props {
  card: WhiteCard;
}
export default function Blackcard(props: Props) {
  return (
    <>
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2 bg-white">
          <div className="px-6 py-4">
            <p className="text-black text-base">
              {props.card.content}
            </p>
          </div>
        </div>
    </>
  );
}
