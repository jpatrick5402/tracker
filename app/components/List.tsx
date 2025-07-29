import text from "@styles/text.module.css";

export default function List({
  items,
  title,
}: {
  items: Record<string, any>[];
  title?: string;
}) {
  return (
    <ol className="w-full bg-gray-400">
      <p className={`${text.heading} text-center`}>{title}</p>
      {items.map((item, i) => {
        return (
          <li key={i} draggable={true}>
            {Object.keys(item).map((key, i2) => {
              return key != "id" ? (
                <input type="text" defaultValue={item[key]} key={i2} />
              ) : null;
            })}
          </li>
        );
      })}
    </ol>
  );
}
