import { create } from "zustand";
import { persist } from "zustand/middleware";
import { activitiesFor } from "./activity";
import { useFollowStore } from "./follow";

// Which activity items you've already opened. The bell badge counts only the
// unseen ones, and visiting /activity marks the current batch seen — so the
// count actually goes back down instead of only ever climbing.
interface SeenState {
  seen: string[]; // activity ids
  markSeen: (ids: string[]) => void;
}

export const useSeenStore = create<SeenState>()(
  persist(
    (set) => ({
      seen: [],
      markSeen: (ids) =>
        set((s) => {
          const next = new Set(s.seen);
          let changed = false;
          for (const id of ids) {
            if (!next.has(id)) {
              next.add(id);
              changed = true;
            }
          }
          return changed ? { seen: [...next] } : s;
        }),
    }),
    { name: "sona-activity-seen" },
  ),
);

// Reactive count of activities you haven't opened yet — drives the bell badge.
export function useUnseenCount(): number {
  const following = useFollowStore((s) => s.following);
  const seen = useSeenStore((s) => s.seen);
  const seenSet = new Set(seen);
  return activitiesFor(following).filter((a) => !seenSet.has(a.id)).length;
}
