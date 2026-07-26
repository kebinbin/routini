import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useRef } from "react";
import { act, render } from "@testing-library/react";
import { Router } from "../components/Router";
import { navigate } from "./navigate";
import { EVENTS } from "../consts";
import type { RouteDefinition } from "../components/Router";

const routes: RouteDefinition[] = [
  { path: "/", component: () => <div>home</div> },
  { path: "/about", component: () => <div>about</div> },
  { path: "/products", component: () => <div>products</div> },
];

// happy-dom doesn't drive real scrolling — mock window.scrollTo (spy) and a
// settable window.scrollY, and fire a scroll event to feed the position cache.
let scrollY = 0;
let scrollToSpy: ReturnType<typeof vi.fn>;

function setScroll(y: number) {
  scrollY = y;
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

// Simulate a back/forward to an entry by restoring its saved history.state.
function popTo(state: unknown, url: string) {
  act(() => {
    window.history.replaceState(state, "", url);
    window.dispatchEvent(new Event(EVENTS.POPSTATE));
  });
}

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  scrollY = 0;
  Object.defineProperty(window, "scrollY", {
    get: () => scrollY,
    configurable: true,
  });
  scrollToSpy = vi.fn((opts?: ScrollToOptions) => {
    if (typeof opts?.top === "number") scrollY = opts.top; // reflect the scroll back
  });
  window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("scroll restoration", () => {
  it("does nothing unless opted in", () => {
    render(<Router routes={routes} />);
    act(() => navigate("/about"));
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("scrolls to top on a forward navigation", () => {
    render(<Router routes={routes} scrollRestoration />);
    act(() => navigate("/about"));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("restores the saved position on back/forward", () => {
    render(<Router routes={routes} scrollRestoration />);
    const homeState = window.history.state; // the id assigned to "/"

    setScroll(500); // scroll home
    act(() => navigate("/about")); // forward → top (0), new entry

    scrollToSpy.mockClear();
    popTo(homeState, "/"); // back to home

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 500, behavior: "instant" });
  });

  it("does not reset scroll on a query-only navigation", () => {
    window.history.replaceState({}, "", "/products");
    render(<Router routes={routes} scrollRestoration />);

    act(() => navigate("/products?sort=asc")); // same pathname, query changes
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("restores a nested container instead of the window", () => {
    const scrollElTo = vi.fn();
    function App() {
      const ref = useRef<HTMLDivElement>(null);
      return (
        <div ref={ref}>
          {/* stub the element's scroll API happy-dom doesn't implement */}
          <Router routes={routes} scrollRestoration scrollContainer={ref} />
        </div>
      );
    }
    const { container } = render(<App />);
    const el = container.firstChild as HTMLDivElement;
    el.scrollTo = scrollElTo as unknown as typeof el.scrollTo;

    act(() => navigate("/about"));
    expect(scrollElTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(scrollToSpy).not.toHaveBeenCalled(); // window untouched
  });
});
