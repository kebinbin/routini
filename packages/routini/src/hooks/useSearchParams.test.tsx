import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";
import { useSearchParams } from "./useSearchParams";
import { navigate } from "../utils/navigate";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
});

function SearchProbe() {
  const [params, setParams] = useSearchParams();
  return (
    <div>
      <span data-testid="q">{params.get("q") ?? ""}</span>
      <span data-testid="sort">{params.get("sort") ?? ""}</span>
      <button onClick={() => setParams({ q: "react" })}>set-record</button>
      <button onClick={() => setParams("a=1&b=2")}>set-string</button>
      <button onClick={() => setParams(new URLSearchParams({ q: "usp" }))}>
        set-usp
      </button>
      <button onClick={() => setParams({ q: "vue" }, { replace: true })}>
        set-replace
      </button>
      <button onClick={() => setParams({})}>clear</button>
    </div>
  );
}

describe("useSearchParams", () => {
  it("reads the current query string", () => {
    window.history.replaceState({}, "", "/search?q=routers&sort=desc");
    const { getByTestId } = render(<SearchProbe />);
    expect(getByTestId("q").textContent).toBe("routers");
    expect(getByTestId("sort").textContent).toBe("desc");
  });

  it("re-renders when the setter updates the query", () => {
    window.history.replaceState({}, "", "/search");
    const { getByTestId, getByText } = render(<SearchProbe />);
    expect(getByTestId("q").textContent).toBe("");

    act(() => getByText("set-record").click());

    expect(window.location.search).toBe("?q=react");
    expect(getByTestId("q").textContent).toBe("react");
  });

  it("keeps the current pathname and drops the hash when setting params", () => {
    window.history.replaceState({}, "", "/search/results#top");
    const { getByText } = render(<SearchProbe />);

    act(() => getByText("set-record").click());

    expect(window.location.pathname).toBe("/search/results");
    expect(window.location.search).toBe("?q=react");
    expect(window.location.hash).toBe("");
  });

  it("accepts a raw query string and a URLSearchParams as init", () => {
    const { getByTestId, getByText } = render(<SearchProbe />);

    act(() => getByText("set-string").click());
    expect(window.location.search).toBe("?a=1&b=2");

    act(() => getByText("set-usp").click());
    expect(window.location.search).toBe("?q=usp");
    expect(getByTestId("q").textContent).toBe("usp");
  });

  it("clears the query (no trailing '?') when set to empty", () => {
    window.history.replaceState({}, "", "/search?q=x");
    const { getByTestId, getByText } = render(<SearchProbe />);
    expect(getByTestId("q").textContent).toBe("x");

    act(() => getByText("clear").click());

    expect(window.location.search).toBe("");
    expect(window.location.href.endsWith("?")).toBe(false);
    expect(getByTestId("q").textContent).toBe("");
  });

  it("replaces the history entry when replace is passed", () => {
    const pushSpy = vi.spyOn(window.history, "pushState");
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const { getByText } = render(<SearchProbe />);

    act(() => getByText("set-replace").click());

    expect(replaceSpy).toHaveBeenCalled();
    expect(pushSpy).not.toHaveBeenCalled();
    expect(window.location.search).toBe("?q=vue");
  });

  it("reacts to an external query-only navigation", () => {
    window.history.replaceState({}, "", "/search");
    const { getByTestId } = render(<SearchProbe />);

    act(() => navigate("/search?q=external"));

    expect(getByTestId("q").textContent).toBe("external");
  });

  it("reacts to back/forward (popstate)", () => {
    window.history.replaceState({}, "", "/search?q=first");
    const { getByTestId } = render(<SearchProbe />);
    expect(getByTestId("q").textContent).toBe("first");

    act(() => {
      window.history.replaceState({}, "", "/search?q=second");
      window.dispatchEvent(new Event("popstate"));
    });

    expect(getByTestId("q").textContent).toBe("second");
  });
});
