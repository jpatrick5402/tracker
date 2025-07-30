"use client";
import { useState, useTransition, useRef, useMemo } from "react";
import { saveItem } from "@/lib/save";

type SortDirection = 'asc' | 'desc' | null;

export default function List({
  items,
  columns,
  type,
}: {
  items: Record<string, any>[];
  columns: string[];
  type: "task" | "project";
}) {
  const [itemList, setItemList] = useState(items);
  const [isPending, startTransition] = useTransition();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Handle column header click for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction for same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Memoized sorted list
  const sortedItemList = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return itemList;
    }

    return [...itemList].sort((a, b) => {
      const aVal = (a[sortColumn] || '').toString().toLowerCase();
      const bVal = (b[sortColumn] || '').toString().toLowerCase();
      
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [itemList, sortColumn, sortDirection]);

  const handleInputChange = (itemId: string, column: string, value: string) => {
    const updatedList = itemList.map((item) =>
      item.id === itemId ? { ...item, [column]: value } : item
    );
    setItemList(updatedList);

    const itemToUpdate = updatedList.find(item => item.id === itemId);

    // Clear existing timeout for this item
    if (saveTimeouts.current[itemId]) {
      clearTimeout(saveTimeouts.current[itemId]);
    }

    // Set new timeout for debounced save
    saveTimeouts.current[itemId] = setTimeout(() => {
      startTransition(async () => {
        try {
          await saveItem("update", type, itemToUpdate, itemId);
        } catch (error) {
          console.error("Failed to update item:", error);
        }
      });
    }, 500);
  };

  const handleAddItem = () => {
    startTransition(async () => {
      const newItem = {
        name: `New ${type}`,
        description: "",
        status: type === "task" ? "new" : undefined,
      };

      const response = await saveItem("create", type, newItem);
      if (response.data) {
        setItemList([...itemList, response.data]);
      }
    });
  };

  const handleDeleteItem = (index: number) => {
    startTransition(async () => {
      const itemToDelete = itemList[index];
      const optimisticList = itemList.filter((_, i) => i !== index);
      setItemList(optimisticList);

      try {
        await saveItem("delete", type, undefined, itemToDelete.id);
      } catch (error) {
        // Revert on failure
        setItemList(itemList);
        console.error("Failed to delete item:", error);
      }
    });
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
        My {type}s
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th 
                  scope="col" 
                  className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none" 
                  key={column}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                    <div className="flex flex-col">
                      <svg 
                        className={`w-3 h-3 ${sortColumn === column && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg 
                        className={`w-3 h-3 -mt-1 ${sortColumn === column && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItemList.map((item) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={item.id}
              >
                {columns.map((column, i2) => (
                  <td className="px-6 py-4" key={i2}>
                    <input
                      type="text"
                      value={item[column] || ""}
                      className="w-full bg-transparent border-none focus:ring-0 dark:text-white"
                      onChange={(e) =>
                        handleInputChange(item.id, column, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    onClick={() => handleDeleteItem(itemList.findIndex(i => i.id === item.id))}
                    title={`Delete ${type}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleAddItem}
          disabled={isPending}
        >
          {isPending ? "Adding..." : `Add ${type}`}
        </button>
      </div>
    </div>
  );
}
