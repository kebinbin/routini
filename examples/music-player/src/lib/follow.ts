import { create } from "zustand";
import { persist } from "zustand/middleware";

// A single concept: following an artist (the heart). Persisted to localStorage,
// so your follows survive reloads. `following` is newest-first.
interface FollowState {
  following: string[]; // artist ids
  toggle: (id: string) => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set) => ({
      following: [],
      toggle: (id) =>
        set((s) => ({
          following: s.following.includes(id)
            ? s.following.filter((x) => x !== id)
            : [id, ...s.following],
        })),
    }),
    { name: "sona-follows" },
  ),
);

export const useIsFollowing = (id: string) =>
  useFollowStore((s) => s.following.includes(id));
