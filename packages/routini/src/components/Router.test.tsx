import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Router } from "./Router";
import { Route } from "./Route";
import { Outlet } from "./Outlet";
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
