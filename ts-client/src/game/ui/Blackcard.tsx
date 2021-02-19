import { BlackCard } from "../../interfaces";

interface Props {
  card: BlackCard;
}
export default function Blackcard(props: Props) {
  return (
    <>
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2 bg-black">
          <div className="px-6 py-4">
            <p className="text-white text-base">
              {props.card.content}
            </p>
          </div>
        </div>
    </>
  );
}
