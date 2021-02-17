import { BlackCard, WhiteCard } from "../../interfaces";

interface Props {
  type: string;
  card: WhiteCard | BlackCard;
}
export default function Card(props: Props) {
  return (
    <>
      {props.type === "black" ? (
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2 bg-black">
          <div className="px-6 py-4">
            <p className="text-white text-base">
              {props.card.content}
            </p>
          </div>
        </div>
      ) : (
        <button className="max-w-xs rounded overflow-hidden hover:bg-gray-300 shadow-lg my-2">
          <div className="px-6 py-4">
            <p className="text-black text-base">
                {props.card.content}
            </p>
          </div>
        </button>
      )}
    </>
  );
}
