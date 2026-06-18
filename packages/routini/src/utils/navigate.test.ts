import { describe, it, expect, beforeEach, vi } from "vitest";
import { navigate } from "./navigate";
import { EVENTS, VIEW_TRANSITION_STATE_KEY } from "../consts";

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

  it("replaces the current history entry with { replace: true }", () => {
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const pushSpy = vi.spyOn(window.history, "pushState");
    navigate("/about", { replace: true });
    expect(replaceSpy).toHaveBeenCalledWith({}, "", "/about");
    expect(pushSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe("/about");
    replaceSpy.mockRestore();
    pushSpy.mockRestore();
  });

  it("wraps the navigation in startViewTransition when requested and supported", () => {
    const startViewTransition = vi.fn((cb: () => void) => cb());
    doc.startViewTransition = startViewTransition;

    const handler = vi.fn();
    window.addEventListener(EVENTS.NAVIGATE, handler);
    navigate("/about", { viewTransition: true });

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe("/about");

    window.removeEventListener(EVENTS.NAVIGATE, handler);
    delete doc.startViewTransition;
  });

  it("falls back to instant navigation when startViewTransition is unsupported", () => {
    delete doc.startViewTransition; // happy-dom default, made explicit
    navigate("/about", { viewTransition: true });
    expect(window.location.pathname).toBe("/about");
  });

  it("does not start a view transition unless asked", () => {
    const startViewTransition = vi.fn((cb: () => void) => cb());
    doc.startViewTransition = startViewTransition;
    navigate("/about");
    expect(startViewTransition).not.toHaveBeenCalled();
    delete doc.startViewTransition;
  });

  it("tags history.state so back/forward replays the transition", () => {
    const startViewTransition = vi.fn((cb: () => void) => cb());
    doc.startViewTransition = startViewTransition;
    navigate("/about", { viewTransition: true });
    expect(window.history.state).toEqual({
      [VIEW_TRANSITION_STATE_KEY]: true,
    });
    delete doc.startViewTransition;
  });

  it("tags both ends of the animated edge — the entry left and the one pushed", () => {
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const pushSpy = vi.spyOn(window.history, "pushState");
    const startViewTransition = vi.fn((cb: () => void) => cb());
    doc.startViewTransition = startViewTransition;

    navigate("/about", { viewTransition: true });

    // The entry we leave is tagged in place (same URL); the new one is pushed tagged.
    expect(replaceSpy).toHaveBeenCalledWith(
      { [VIEW_TRANSITION_STATE_KEY]: true },
      "",
      expect.any(String),
    );
    expect(pushSpy).toHaveBeenCalledWith(
      { [VIEW_TRANSITION_STATE_KEY]: true },
      "",
      "/about",
    );

    replaceSpy.mockRestore();
    pushSpy.mockRestore();
    delete doc.startViewTransition;
  });

  it("does not tag history.state for a plain navigation", () => {
    navigate("/about");
    expect(window.history.state).toEqual({});
  });
});

// happy-dom doesn't implement the View Transitions API; tests attach/remove a
// minimal stub through this widened view of `document` instead of fighting
// lib.dom's types, which declare startViewTransition as always present.
const doc = document as unknown as {
  startViewTransition?: (cb: () => void) => unknown;
};
