import { describe, it, expect, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { Router } from "../components/Router";
import { useLocation } from "./useLocation";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

function LocationProbe() {
  const { path, navigate } = useLocation();
  return (
    <div>
      <span data-testid="path">{path}</span>
      <button onClick={() => navigate("/next")}>go</button>
    </div>
  );
}

describe("useLocation", () => {
  it("returns the current path from context", () => {
    window.history.replaceState({}, "", "/here");
    const { getByTestId } = render(
      <Router routes={[{ path: "*", component: LocationProbe }]} />,
    );
    expect(getByTestId("path").textContent).toBe("/here");
  });

  it("returns a navigate function that updates the path", () => {
    const { getByTestId, getByText } = render(
      <Router routes={[{ path: "*", component: LocationProbe }]} />,
    );
    expect(getByTestId("path").textContent).toBe("/");

    act(() => {
      getByText("go").click();
    });

    expect(getByTestId("path").textContent).toBe("/next");
  });
});
