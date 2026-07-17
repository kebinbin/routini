import { create } from "zustand";
import { persist } from "zustand/middleware";

// The feed's layout is a personal UI preference (not shareable content), so it
// lives in a persisted store rather than the URL — it survives navigating into
// an artist and back, and survives reloads.
export type FeedView = "classic" | "immersive" | "compact" | "grid";

interface ViewState {
  view: FeedView;
  setView: (v: FeedView) => void;
}

export const useFeedView = create<ViewState>()(
  persist((set) => ({ view: "immersive", setView: (view) => set({ view }) }), {
    name: "sona-feed-view",
  }),
);
