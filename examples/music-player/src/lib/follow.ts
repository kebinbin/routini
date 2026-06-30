import { create } from "zustand";
import { persist } from "zustand/middleware";

// A single concept: following an artist (the heart). Persisted to localStorage,
// so your follows survive reloads. `following` is newest-first; `followedAt`
// records when each follow happened (epoch ms) so the activity page can show
// "Followed 3d ago" and order the full list.
interface FollowState {
  following: string[]; // artist ids
  followedAt: Record<string, number>;
  toggle: (id: string) => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set) => ({
      following: [],
      followedAt: {},
      toggle: (id) =>
        set((s) => {
          if (s.following.includes(id)) {
            const followedAt = { ...s.followedAt };
            delete followedAt[id];
            return { following: s.following.filter((x) => x !== id), followedAt };
          }
          return {
            following: [id, ...s.following],
            followedAt: { ...s.followedAt, [id]: Date.now() },
          };
        }),
    }),
    {
      name: "sona-follows",
      // Backfill timestamps for follows saved before we tracked them, spacing
      // them by the stored order (newest-first) so the times stay coherent.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const now = Date.now();
        const day = 86_400_000;
        const followedAt = { ...state.followedAt };
        let changed = false;
        state.following.forEach((id, i) => {
          if (followedAt[id] == null) {
            followedAt[id] = now - (i + 1) * day;
            changed = true;
          }
        });
        if (changed) state.followedAt = followedAt;
      },
    },
  ),
);

export const useIsFollowing = (id: string) =>
  useFollowStore((s) => s.following.includes(id));
