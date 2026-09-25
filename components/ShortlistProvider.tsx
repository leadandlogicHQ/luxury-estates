"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

export interface ShortlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  count: number;
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (item: ShortlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);
const STORAGE_KEY = "le-shortlist";

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [ready, setReady] = useState(false);

  /* Hydrate from localStorage after mount (no SSR mismatch) */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as ShortlistItem[]);
    } catch {
      /* corrupted storage — start fresh */
    }
    setReady(true);
  }, []);

  /* Persist on every change */
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage blocked — shortlist lives in memory for this session */
    }
  }, [items, ready]);

  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const remove = useCallback((id: string) => {
    setItems((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const toggle = useCallback(
    (item: ShortlistItem) => {
      const exists = items.some((i) => i.id === item.id);
      setItems(exists ? items.filter((i) => i.id !== item.id) : [...items, item]);
      if (exists) toast.message("Removed from shortlist", { description: item.title });
      else toast.success("Saved to shortlist", { description: item.title });
    },
    [items]
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, ready, has, toggle, remove, clear }),
    [items, ready, has, toggle, remove, clear]
  );

  return (
    <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used within <ShortlistProvider>");
  return ctx;
}

export default ShortlistProvider;