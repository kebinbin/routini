import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Link } from "./Link";
import { EVENTS } from "../consts";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
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
});
