import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "./Router";
import { Route } from "./Route";
import { Outlet } from "./Outlet";
import { Navigate } from "./Navigate";
import { Link } from "./Link";
import { navigate } from "../utils/navigate";
import { EVENTS } from "../consts";
import type { RouteDefinition } from "./Router";

const Home = () => <div>home page</div>;
const About = () => <div>about page</div>;
const NotFound = () => <div>not found</div>;

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Router", () => {
  it("renders the component matching the current path", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", component: About },
    ];
    window.history.replaceState({}, "", "/about");
    render(<Router routes={routes} />);
    expect(screen.getByText("about page")).toBeTruthy();
  });

  it("renders the catch-all when no specific route matches", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "*", component: NotFound },
    ];
    window.history.replaceState({}, "", "/missing");
    render(<Router routes={routes} />);
    expect(screen.getByText("not found")).toBeTruthy();
  });

  it("re-renders when the browser fires popstate", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", component: About },
    ];
    render(<Router routes={routes} />);
    expect(screen.getByText("home page")).toBeTruthy();

    act(() => {
      window.history.replaceState({}, "", "/about");
      window.dispatchEvent(new Event(EVENTS.POPSTATE));
    });

    expect(screen.getByText("about page")).toBeTruthy();
  });

  it("re-renders on programmatic navigate()", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", component: About },
    ];
    render(<Router routes={routes} />);
    expect(screen.getByText("home page")).toBeTruthy();

    act(() => {
      navigate("/about");
    });

    expect(screen.getByText("about page")).toBeTruthy();
  });

  // Guards the one guarantee View Transitions depend on: the new route's DOM
  // must be committed *inside* the startViewTransition callback (that's what
  // the flushSync in navigate() is for — the browser screenshots the page
  // right after the callback returns). If flushSync is ever removed, the DOM
  // read inside the fake still shows the old page and this test fails.
  it("commits the new route synchronously inside startViewTransition", () => {
    // Widened view of `document`: lib.dom types startViewTransition as always
    // present, but happy-dom doesn't implement it, so tests stub it on and off.
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => unknown;
    };
    let domInsideCallback = "";
    doc.startViewTransition = vi.fn((cb: () => void) => {
      cb();
      domInsideCallback = document.body.textContent ?? "";
    });

    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", component: About },
    ];
    render(<Router routes={routes} />);

    act(() => {
      navigate("/about", { viewTransition: true });
    });

    expect(domInsideCallback).toContain("about page");
    expect(screen.getByText("about page")).toBeTruthy();
    delete doc.startViewTransition;
  });

  it("scrolls to the URL hash after a path+hash navigation", async () => {
    const scrollSpy = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollSpy;

    const Docs = () => <section id="api">api section</section>;
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/docs", component: Docs },
    ];
    render(<Router routes={routes} />);
    // No hash on the initial route — nothing should scroll yet.
    expect(scrollSpy).not.toHaveBeenCalled();

    act(() => {
      navigate("/docs#api");
    });

    await waitFor(() => expect(scrollSpy).toHaveBeenCalledTimes(1));

    Element.prototype.scrollIntoView = original;
  });

  it("scrolls to the hash on initial load (deep link, no Link involved)", async () => {
    const scrollSpy = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollSpy;

    // URL already carries the hash before the app mounts — as if typed into
    // the address bar, refreshed, or followed from an external link.
    window.history.replaceState({}, "", "/docs#api");
    const Docs = () => <section id="api">api section</section>;
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/docs", component: Docs },
    ];
    render(<Router routes={routes} />);

    await waitFor(() => expect(scrollSpy).toHaveBeenCalledTimes(1));

    Element.prototype.scrollIntoView = original;
  });

  it("renders <Route> children as routes (works after minification)", () => {
    window.history.replaceState({}, "", "/about");
    render(
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Outlet />
      </Router>,
    );
    expect(screen.getByText("about page")).toBeTruthy();
  });

  it("renders a lazy route through Suspense with the global fallback", async () => {
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () => Promise.resolve({ default: Home }),
      },
    ];
    render(<Router routes={routes} loading={<div>loading...</div>} />);
    expect(screen.getByText("loading...")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("home page")).toBeTruthy());
  });

  it("prefers per-route loading over global loading", () => {
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () => new Promise(() => {}),
        loading: <div>route-specific spinner</div>,
      },
    ];
    render(<Router routes={routes} loading={<div>global spinner</div>} />);
    expect(screen.getByText("route-specific spinner")).toBeTruthy();
  });

  it("throws in development when a route has both lazy and component", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const routes: RouteDefinition[] = [
      {
        path: "/",
        component: Home,
        lazy: () => Promise.resolve({ default: Home }),
      },
    ];
    expect(() => render(<Router routes={routes} />)).toThrow(
      /both lazy and component/,
    );
    errorSpy.mockRestore();
  });

  it("warns in development when no route matches and no catch-all is defined", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    window.history.replaceState({}, "", "/missing");
    render(<Router routes={[{ path: "/", component: Home }]} />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('No route matched "/missing"'),
    );
  });

  it("warns when an unstable routes array contains lazy routes", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const App = () => {
      // The misuse: a fresh routes array (and lazy thunk) every render.
      const routes: RouteDefinition[] = [
        { path: "/", lazy: () => Promise.resolve({ default: Home }) },
      ];
      return <Router routes={routes} loading={<div>loading...</div>} />;
    };
    const { rerender } = render(<App />);
    rerender(<App />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("changed reference between renders"),
    );
  });

  it("does not warn for an unstable eager-only routes array", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const App = () => {
      const routes: RouteDefinition[] = [{ path: "/", component: Home }];
      return <Router routes={routes} />;
    };
    const { rerender } = render(<App />);
    rerender(<App />);
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("changed reference between renders"),
    );
  });

  // Regression test: prior to the useSyncExternalStore refactor, this case
  // failed because child effects (Navigate's useEffect) ran before the parent
  // Router's useEffect attached its event listener. The URL changed but
  // Router's state did not, leaving the stale <Navigate /> in the Outlet.
  // useSyncExternalStore eliminates the race because React reconciles the
  // snapshot after every commit.
  it("handles a <Navigate /> in the initial route tree (no race on mount)", async () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: () => <Navigate to="/about" /> },
      { path: "/about", component: About },
    ];
    render(<Router routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("about page")).toBeTruthy();
    });
    expect(window.location.pathname).toBe("/about");
  });

  it("throws when a lazy module has no default export", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () =>
          Promise.resolve({} as unknown as { default: React.ComponentType }),
      },
    ];
    render(<Router routes={routes} loading={<div>loading...</div>} />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });
});

describe("Router error handling", () => {
  // React logs caught errors to console.error; silence it so the test output
  // stays clean (and so failures are about assertions, not noise).
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("shows the default fallback when a lazy chunk fails (no white screen)", async () => {
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () =>
          Promise.reject(
            new Error("Failed to fetch dynamically imported module"),
          ),
      },
    ];
    render(<Router routes={routes} loading={<div>loading...</div>} />);
    await waitFor(() =>
      expect(screen.getByText(/couldn.t be loaded/i)).toBeTruthy(),
    );
  });

  it("catches an eager render error with the generic fallback", () => {
    const Boom = () => {
      throw new Error("boom");
    };
    render(<Router routes={[{ path: "/", component: Boom }]} />);
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
  });

  it("renders a custom errorFallback node", async () => {
    const routes: RouteDefinition[] = [
      { path: "/", lazy: () => Promise.reject(new Error("nope")) },
    ];
    render(
      <Router
        routes={routes}
        loading={<div>loading...</div>}
        errorFallback={<div>custom oops</div>}
      />,
    );
    await waitFor(() => expect(screen.getByText("custom oops")).toBeTruthy());
  });

  it("passes { error, isChunkError } to a function errorFallback", async () => {
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () =>
          Promise.reject(
            new Error("Failed to fetch dynamically imported module"),
          ),
      },
    ];
    render(
      <Router
        routes={routes}
        loading={<div>loading...</div>}
        errorFallback={({ error, isChunkError }) => (
          <div>
            {isChunkError ? "chunk" : "bug"}: {error.message}
          </div>
        )}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText(/^chunk: Failed to fetch/)).toBeTruthy(),
    );
  });

  it("calls onError when a route throws", async () => {
    const onError = vi.fn();
    const routes: RouteDefinition[] = [
      { path: "/", lazy: () => Promise.reject(new Error("kaboom")) },
    ];
    render(
      <Router
        routes={routes}
        loading={<div>loading...</div>}
        onError={onError}
      />,
    );
    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("reset() retries a failed lazy import", async () => {
    let attempt = 0;
    const routes: RouteDefinition[] = [
      {
        path: "/",
        lazy: () => {
          attempt += 1;
          return attempt === 1
            ? Promise.reject(
                new Error("Failed to fetch dynamically imported module"),
              )
            : Promise.resolve({ default: Home });
        },
      },
    ];
    render(
      <Router
        routes={routes}
        loading={<div>loading...</div>}
        errorFallback={({ reset }) => (
          <button onClick={reset}>retry</button>
        )}
      />,
    );
    // First attempt failed → custom fallback.
    await waitFor(() => expect(screen.getByText("retry")).toBeTruthy());
    // Retry busts the cache, re-imports; the second attempt resolves.
    fireEvent.click(screen.getByText("retry"));
    await waitFor(() => expect(screen.getByText("home page")).toBeTruthy());
  });

  it("clears the error automatically when navigating to a working route", async () => {
    window.history.replaceState({}, "", "/bad");
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      {
        path: "/bad",
        lazy: () =>
          Promise.reject(
            new Error("Failed to fetch dynamically imported module"),
          ),
      },
    ];
    render(<Router routes={routes} loading={<div>loading...</div>} />);
    await waitFor(() =>
      expect(screen.getByText(/couldn.t be loaded/i)).toBeTruthy(),
    );

    act(() => navigate("/"));
    await waitFor(() => expect(screen.getByText("home page")).toBeTruthy());
  });
});

describe("Router preloading", () => {
  it("warms a lazy route's chunk when a Link to it is hovered", () => {
    const importSpy = vi.fn(() => Promise.resolve({ default: About }));
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", lazy: importSpy },
    ];
    render(
      <Router routes={routes}>
        <Link to="/about" preload="hover">
          to about
        </Link>
        <Outlet />
      </Router>,
    );
    // Only the matched route ("/") resolved; the lazy chunk stays cold.
    expect(importSpy).not.toHaveBeenCalled();
    fireEvent.mouseEnter(screen.getByText("to about"));
    expect(importSpy).toHaveBeenCalledTimes(1);
  });

  it("does not warm a lazy chunk when the Link has no preload prop", () => {
    const importSpy = vi.fn(() => Promise.resolve({ default: About }));
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", lazy: importSpy },
    ];
    render(
      <Router routes={routes}>
        <Link to="/about">to about</Link>
        <Outlet />
      </Router>,
    );
    const link = screen.getByText("to about");
    // No preload condition is ever met — hovering and focusing do nothing.
    fireEvent.mouseEnter(link);
    fireEvent.focus(link);
    expect(importSpy).not.toHaveBeenCalled();
  });

  it("warms each lazy chunk at most once across repeated preloads", () => {
    const importSpy = vi.fn(() => Promise.resolve({ default: About }));
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", lazy: importSpy },
    ];
    render(
      <Router routes={routes}>
        <Link to="/about" preload="hover">
          to about
        </Link>
        <Outlet />
      </Router>,
    );
    const link = screen.getByText("to about");
    fireEvent.mouseEnter(link);
    fireEvent.mouseLeave(link);
    fireEvent.mouseEnter(link);
    expect(importSpy).toHaveBeenCalledTimes(1);
  });

  it("does not preload eager routes (nothing to warm)", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Home },
      { path: "/about", component: About },
    ];
    render(
      <Router routes={routes}>
        <Link to="/about" preload="hover">
          to about
        </Link>
        <Outlet />
      </Router>,
    );
    // No throw, no work — eager routes have no chunk to fetch.
    expect(() =>
      fireEvent.mouseEnter(screen.getByText("to about")),
    ).not.toThrow();
  });
});
