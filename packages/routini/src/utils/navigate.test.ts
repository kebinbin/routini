import { describe, it, expect, beforeEach, vi } from "vitest";
import { navigate } from "./navigate";
import { EVENTS } from "../consts";

describe("navigate", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("pushes the new path onto history", () => {
    const spy = vi.spyOn(window.history, "pushState");
    navigate("/about");
    expect(spy).toHaveBeenCalledWith({}, "", "/about");
    expect(window.location.pathname).toBe("/about");
    spy.mockRestore();
  });

  it("dispatches the pushstate event so the Router can react", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    navigate("/x");
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });

  it("supports multiple sequential calls", () => {
    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    navigate("/a");
    navigate("/b");
    navigate("/c");
    expect(handler).toHaveBeenCalledTimes(3);
    expect(window.location.pathname).toBe("/c");
    window.removeEventListener(EVENTS.NAVIGATE, handler);
  });
});
