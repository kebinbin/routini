import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { Navigate } from "./Navigate";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Navigate", () => {
  it("redirects to the target path on mount", () => {
    render(<Navigate to="/destination" />);
    expect(window.location.pathname).toBe("/destination");
  });

  it("renders nothing", () => {
    const { container } = render(<Navigate to="/destination" />);
    expect(container.firstChild).toBeNull();
  });

  // Replacing keeps the back button working: with a pushed entry, going back
  // lands on the route that redirected away, which immediately redirects
  // forward again — a back-button trap.
  it("replaces the current history entry by default", () => {
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const pushSpy = vi.spyOn(window.history, "pushState");
    render(<Navigate to="/destination" />);
    expect(replaceSpy).toHaveBeenCalledWith({}, "", "/destination");
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it("pushes a new history entry with replace={false}", () => {
    const pushSpy = vi.spyOn(window.history, "pushState");
    render(<Navigate to="/destination" replace={false} />);
    expect(pushSpy).toHaveBeenCalledWith({}, "", "/destination");
  });
});
