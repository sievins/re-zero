"use client";

import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface Item {
  id: string;
  label: string;
}

const items: Item[] = [
  {
    id: "item1",
    label:
      "Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 Item 1 ",
  },
  { id: "item2", label: "Item 2" },
  {
    id: "item3",
    label:
      "Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 Item 3 ",
  },
  { id: "item4", label: "Item 4" },
  { id: "item5", label: "Item 5" },
  { id: "item6", label: "Item 6" },
];

export function TaskList() {
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);

  const handleHighlight = (id: string) => {
    const isHighlighted = highlightedItems.includes(id);
    if (isHighlighted) {
      setHighlightedItems(highlightedItems.filter((item) => item !== id));
    } else {
      setHighlightedItems([...highlightedItems, id]);
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id}>
          <div
            className={cn(
              "flex w-[32rem] items-center rounded-md p-2 transition-colors",
              highlightedItems.includes(item.id) ? "bg-primary/40" : "",
            )}
          >
            <Checkbox id={item.id} />
            <label
              htmlFor={item.id}
              className="ml-2 max-w-sm text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.label}
            </label>
            <button
              onClick={() => handleHighlight(item.id)}
              className="ml-auto text-sm text-primary hover:underline focus:outline-none"
            >
              Mark
            </button>
          </div>
          {index < items.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}
