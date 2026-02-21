export interface Item {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  ownerId: string;
  ownerName: string;
  availableForGamble: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  items: Item[];
  wins: number;
  totalBets: number;
}

export const categories = [
  "All",
  "Sports",
  "Clothing",
  "Electronics",
  "Accessories",
  "Outdoor",
] as const;

type UnknownItemRow = Record<string, unknown>;

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toBooleanValue(value: unknown, fallback = true) {
  if (typeof value === "boolean") return value;
  return fallback;
}

function toConditionValue(value: unknown): Item["condition"] {
  const condition = toStringValue(value, "Good");
  if (condition === "New" || condition === "Like New" || condition === "Good" || condition === "Fair") {
    return condition;
  }
  return "Good";
}

export function mapRowToItem(row: UnknownItemRow): Item {
  const rawId = row.item_id ?? row.id;
  const id = typeof rawId === "number" || typeof rawId === "string" ? rawId : String(rawId ?? "");
  const ownerId = toStringValue(row.user_id ?? row.owner_id ?? row.ownerId, "");
  const nestedProfile = row.profile;
  const nestedProfiles = row.profiles;
  const profileName =
    typeof nestedProfile === "object" && nestedProfile !== null
      ? toStringValue((nestedProfile as UnknownItemRow).name)
      : typeof nestedProfiles === "object" && nestedProfiles !== null
        ? toStringValue((nestedProfiles as UnknownItemRow).name)
        : "";

  return {
    id,
    name: toStringValue(row.name, "Untitled Item"),
    description: toStringValue(row.desc ?? row.description, ""),
    price: toNumberValue(row.price, 0),
    imageUrl: toStringValue(row.url ?? row.image_url ?? row.imageUrl, ""),
    category: toStringValue(row.category, "Misc"),
    condition: toConditionValue(row.condition),
    ownerId,
    ownerName: toStringValue(
      row.owner_name ?? row.ownerName ?? row.user_name ?? profileName,
      ownerId ? `User ${ownerId.slice(0, 8)}` : "Unknown",
    ),
    availableForGamble: toBooleanValue(row.available_for_gamble ?? row.availableForGamble, true),
  };
}
