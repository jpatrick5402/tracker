import text from "@styles/text.module.css";

interface ListItem {
  id?: string;
  [key: string]: string | undefined;
}

export default function List({
  items,
  title,
}: {
  items: ListItem[];
  title?: string;
}) {
  return (
    <div className="w-full bg-gray-400">
      <p className={`${text.heading} text-center`}>{title}</p>
      {items.map((item, i) => {
        return (
          <li key={i}>
            {Object.keys(item).map((key, i2) => {
              return key != "id" ? (
                <input type="text" defaultValue={item[key]} key={i2} />
              ) : null;
            })}
          </li>
        );
      })}
    </div>
  );
}
