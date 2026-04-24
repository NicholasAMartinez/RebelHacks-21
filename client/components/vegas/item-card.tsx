import Link from "next/link";
import type { Item } from "@/lib/vegas-data";

type ItemCardProps = {
  item: Item;
  selected?: boolean;
  showSelectButton?: boolean;
  onSelect?: (item: Item) => void;
  showEditButton?: boolean;
  onEdit?: (item: Item) => void;
  editHref?: string;
  editDisabled?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (item: Item) => void;
  removeDisabled?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export function ItemCard({
  item,
  selected = false,
  showSelectButton = false,
  onSelect,
  showEditButton = false,
  onEdit,
  editHref,
  editDisabled = false,
  showRemoveButton = false,
  onRemove,
  removeDisabled = false,
  disabled = false,
  compact = false,
}: ItemCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-xl border bg-zinc-900/70 transition-all duration-300 ${
        selected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-zinc-800 hover:border-zinc-700 hover:shadow-2xl"
      }`}
    >
      <div className={`relative overflow-hidden ${compact ? "h-32" : "h-48"}`}>
        <img src={item.imageUrl || "/file.svg"} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          ${item.price}
        </div>
      </div>

      <div className={compact ? "p-3" : "p-4"}>
        <h3 className={`mb-1 break-words font-semibold text-white ${compact ? "text-base" : "text-lg"}`}>
          {item.name}
        </h3>
        <p
          className={`mb-3 break-words text-zinc-400 ${compact ? "max-h-8 overflow-hidden text-xs" : "min-h-10 text-sm"}`}
        >
          {item.description}
        </p>

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-zinc-400">
          <span>Condition: {item.condition}</span>
          <span>Owner: {item.ownerName}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
            {item.category}
          </span>

          {showSelectButton || showEditButton || showRemoveButton ? (
            <div className="flex flex-wrap items-center gap-2">
              {showSelectButton ? (
                <button
                  type="button"
                  onClick={() => {
                    if (disabled) return;
                    onSelect?.(item);
                  }}
                  disabled={disabled}
                  className={`rounded-md px-4 py-1 text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-primary text-white"
                      : disabled
                        ? "cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60"
                        : "bg-secondary text-white hover:bg-secondary/90"
                  }`}
                >
                  {selected ? "Selected" : disabled ? "Locked" : "Select"}
                </button>
              ) : null}

              {showEditButton ? (
                editHref ? (
                  <Link
                    href={editHref}
                    className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                      editDisabled
                        ? "pointer-events-none cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    aria-disabled={editDisabled}
                  >
                    Edit
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (editDisabled) return;
                      onEdit?.(item);
                    }}
                    disabled={editDisabled}
                    className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                      editDisabled
                        ? "cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    Edit
                  </button>
                )
              ) : null}

              {showRemoveButton ? (
                <button
                  type="button"
                  onClick={() => {
                    if (removeDisabled) return;
                    onRemove?.(item);
                  }}
                  disabled={removeDisabled}
                  className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                    removeDisabled
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60"
                      : "bg-zinc-600 text-white hover:bg-zinc-500"
                  }`}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
