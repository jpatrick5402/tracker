"use client";
import text from "@styles/text.module.css";
import buttons from "@styles/buttons.module.css";
import { useEffect, useState } from "react";
import save from "@/lib/save";

interface ListItem {
  [key: string]: string | undefined;
}

export default function List({
  items,
  columns,
  type,
}: {
  items: ListItem[];
  columns: string[];
  type: string;
}) {
  const [itemList, setItemList] = useState(items);

  useEffect(() => {
    async function saveList(itemList: ListItem[], type: string) {
      await save({ [type]: itemList });
    }
    saveList(itemList, type);
  }, [itemList, type]);

  return (
    <div className="w-full flex-col items-center">
      <p className={`${text.heading} text-center`}>My {type}s</p>
      <div className="flex flex-col">
        <ul className="m-auto grid">
          <li>
            {columns.map((column) => {
              return (
                <input
                  className="border-1"
                  key={column}
                  type="text"
                  readOnly={true}
                  defaultValue={
                    column.charAt(0).toUpperCase() + column.slice(1)
                  }
                />
              );
            })}
          </li>
          {itemList.map((item, i) => {
            return (
              <li key={i}>
                {columns.map((column, i2) => {
                  return (
                    <input
                      type="text"
                      value={item[column]}
                      key={i2}
                      className="border-1"
                      onChange={(e) => {
                        setItemList((prev) =>
                          prev.map((item, index) => {
                            if (index !== i) return item;
                            return {
                              ...item,
                              [column]: e.target.value,
                            };
                          })
                        );
                      }}
                    />
                  );
                })}
              </li>
            );
          })}
        </ul>
        <button
          className={`${buttons.add} m-auto`}
          onClick={async () => {
            await save({ [type]: [...itemList, {}] });
            location.reload();
          }}
        >
          Add {type}
        </button>
      </div>
    </div>
  );
}
