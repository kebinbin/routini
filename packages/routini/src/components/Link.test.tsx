import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Link } from "./Link";
import { RouterContext } from "../context/RouterContext";
import { EVENTS } from "../consts";

const baseContext = {
  routeParams: {},
  currentPath: "/",
  content: null,
  preloadPath: () => {},
};

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Link", () => {
  it("renders an anchor with the correct href", () => {
    const { container } = render(<Link to="/about">about</Link>);
    const anchor = container.querySelector("a")!;
    expect(anchor.getAttribute("href")).toBe("/about");
    expect(anchor.textContent).toBe("about");
  });

  it("navigates on a primary click and dispatches pushstate", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(<Link to="/about">about</Link>);
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(window.location.pathname).toBe("/about");
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("does not navigate when a modifier key is held", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(<Link to="/about">about</Link>);
    const anchor = container.querySelector("a")!;

    for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
      fireEvent.click(anchor, { button: 0, [modifier]: true });
    }

    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("does not navigate on non-primary clicks", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(<Link to="/about">about</Link>);
    fireEvent.click(container.querySelector("a")!, { button: 1 });
    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("does not navigate when target is set to something other than _self", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(
      <Link to="/about" target="_blank">
        about
      </Link>,
    );
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("still navigates when target is explicitly _self", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(
      <Link to="/about" target="_self">
        about
      </Link>,
    );
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe("/about");
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("does not call navigate for a pure hash link", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(<Link to="#section">jump</Link>);
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("navigates to the path portion of a path+hash link", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    const { container } = render(<Link to="/docs#api">api</Link>);
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe("/docs");
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("replaces the history entry when the replace prop is set", () => {
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const pushSpy = vi.spyOn(window.history, "pushState");
    const { container } = render(
      <Link to="/about" replace>
        about
      </Link>,
    );
    fireEvent.click(container.querySelector("a")!, { button: 0 });
    expect(replaceSpy).toHaveBeenCalledWith({}, "", "/about");
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it("does not leak replace/viewTransition onto the rendered anchor", () => {
    const { container } = render(
      <Link to="/about" replace viewTransition>
        about
      </Link>,
    );
    const anchor = container.querySelector("a")!;
    expect(anchor.hasAttribute("replace")).toBe(false);
    expect(anchor.hasAttribute("viewtransition")).toBe(false);
  });
});

describe("Link preload", () => {
  const renderWithPreload = (
    preloadPath: (to: string) => void,
    ui: ReactElement,
  ) =>
    render(
      <RouterContext.Provider value={{ ...baseContext, preloadPath }}>
        {ui}
      </RouterContext.Provider>,
    );

  it('preload="hover" warms the route on pointer-enter', () => {
    const preloadPath = vi.fn();
    const { container } = renderWithPreload(
      preloadPath,
      <Link to="/about" preload="hover">
        about
      </Link>,
    );
    fireEvent.mouseEnter(container.querySelector("a")!);
    expect(preloadPath).toHaveBeenCalledWith("/about");
  });

  it('preload="hover" warms the route on keyboard focus', () => {
    const preloadPath = vi.fn();
    const { container } = renderWithPreload(
      preloadPath,
      <Link to="/about" preload="hover">
        about
      </Link>,
    );
    fireEvent.focus(container.querySelector("a")!);
    expect(preloadPath).toHaveBeenCalledWith("/about");
  });

  it("does not preload without the preload prop", () => {
    const preloadPath = vi.fn();
    const { container } = renderWithPreload(
      preloadPath,
      <Link to="/about">about</Link>,
    );
    const anchor = container.querySelector("a")!;
    fireEvent.mouseEnter(anchor);
    fireEvent.focus(anchor);
    expect(preloadPath).not.toHaveBeenCalled();
  });

  it("still calls a consumer-provided onMouseEnter / onFocus", () => {
    const preloadPath = vi.fn();
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();
    const { container } = renderWithPreload(
      preloadPath,
      <Link
        to="/about"
        preload="hover"
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
      >
        about
      </Link>,
    );
    const anchor = container.querySelector("a")!;
    fireEvent.mouseEnter(anchor);
    fireEvent.focus(anchor);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(preloadPath).toHaveBeenCalledTimes(2);
  });

  it('preload="render" warms the route in a deferred idle callback', () => {
    vi.useFakeTimers();
    const w = window as unknown as { requestIdleCallback?: unknown };
    const originalRIC = w.requestIdleCallback;
    w.requestIdleCallback = undefined; // force the setTimeout fallback
    const preloadPath = vi.fn();
    renderWithPreload(
      preloadPath,
      <Link to="/about" preload="render">
        about
      </Link>,
    );
    // Deferred to idle — nothing fires on mount.
    expect(preloadPath).not.toHaveBeenCalled();
    act(() => {
      vi.runAllTimers();
    });
    expect(preloadPath).toHaveBeenCalledWith("/about");
    w.requestIdleCallback = originalRIC;
    vi.useRealTimers();
  });

  it("does not leak the preload prop onto the rendered anchor", () => {
    const { container } = renderWithPreload(
      () => {},
      <Link to="/about" preload="hover">
        about
      </Link>,
    );
    expect(container.querySelector("a")!.hasAttribute("preload")).toBe(false);
  });

  it("is a no-op (does not throw) when rendered without a Router", () => {
    const { container } = render(
      <Link to="/about" preload="hover">
        about
      </Link>,
    );
    expect(() =>
      fireEvent.mouseEnter(container.querySelector("a")!),
    ).not.toThrow();
  });
});

describe('Link preload="viewport"', () => {
  let lastCallback: IntersectionObserverCallback | undefined;
  const observers: FakeIntersectionObserver[] = [];

  class FakeIntersectionObserver {
    observed = new Set<Element>();
    constructor(callback: IntersectionObserverCallback) {
      lastCallback = callback;
      observers.push(this);
    }
    observe(el: Element) {
      this.observed.add(el);
    }
    unobserve(el: Element) {
      this.observed.delete(el);
    }
    disconnect() {
      this.observed.clear();
    }
    takeRecords() {
      return [];
    }
  }

  const intersect = (el: Element, isIntersecting = true) =>
    lastCallback?.(
      [{ target: el, isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

  const renderViewport = (
    preloadPath: (to: string) => void,
    ui: ReactElement,
  ) =>
    render(
      <RouterContext.Provider value={{ ...baseContext, preloadPath }}>
        {ui}
      </RouterContext.Provider>,
    );

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  it("warms the route when the link scrolls into view", () => {
    const preloadPath = vi.fn();
    const { container } = renderViewport(
      preloadPath,
      <Link to="/about" preload="viewport">
        about
      </Link>,
    );
    const anchor = container.querySelector("a")!;
    expect(preloadPath).not.toHaveBeenCalled(); // still off-screen
    intersect(anchor);
    expect(preloadPath).toHaveBeenCalledWith("/about");
  });

  it("does not warm while the link is off-screen", () => {
    const preloadPath = vi.fn();
    const { container } = renderViewport(
      preloadPath,
      <Link to="/about" preload="viewport">
        about
      </Link>,
    );
    intersect(container.querySelector("a")!, false);
    expect(preloadPath).not.toHaveBeenCalled();
  });

  it("warms at most once, then stops observing", () => {
    const preloadPath = vi.fn();
    const { container } = renderViewport(
      preloadPath,
      <Link to="/about" preload="viewport">
        about
      </Link>,
    );
    const anchor = container.querySelector("a")!;
    intersect(anchor);
    intersect(anchor);
    expect(preloadPath).toHaveBeenCalledTimes(1);
  });

  it("shares a single observer across many links", () => {
    const preloadPath = vi.fn();
    const { container } = renderViewport(
      preloadPath,
      <>
        <Link to="/a" preload="viewport">
          a
        </Link>
        <Link to="/b" preload="viewport">
          b
        </Link>
        <Link to="/c" preload="viewport">
          c
        </Link>
      </>,
    );
    // One observer is ever constructed, and it observes every viewport link.
    expect(observers).toHaveLength(1);
    const anchors = container.querySelectorAll("a");
    expect(anchors).toHaveLength(3);
    anchors.forEach((a) => expect(observers[0].observed.has(a)).toBe(true));
  });

  it("is a no-op where IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const preloadPath = vi.fn();
    expect(() =>
      renderViewport(
        preloadPath,
        <Link to="/about" preload="viewport">
          about
        </Link>,
      ),
    ).not.toThrow();
    expect(preloadPath).not.toHaveBeenCalled();
  });
});
