interface Props {
  type: string;
  content: string;
}
export default function Card(props: Props) {
  return (
    <>
      {props.type === "black" ? (
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2 bg-black">
          <div className="px-6 py-4">
            <p className="text-white text-base">
              {props.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2">
          <div className="px-6 py-4">
            <p className="text-black text-base">
                {props.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
