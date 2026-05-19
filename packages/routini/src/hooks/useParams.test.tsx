import { describe, it, expect, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { Router } from "../components/Router";
import { useParams } from "./useParams";
import { navigate } from "../utils/navigate";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

function ParamsProbe() {
  const params = useParams<{ id?: string; lang?: string }>();
  return <div data-testid="params">{JSON.stringify(params)}</div>;
}

describe("useParams", () => {
  it("returns the matched route's params from context", () => {
    window.history.replaceState({}, "", "/product/42");
    const { getByTestId } = render(
      <Router routes={[{ path: "/product/:id", component: ParamsProbe }]} />,
    );
    expect(JSON.parse(getByTestId("params").textContent!)).toEqual({
      id: "42",
    });
  });

  it("updates when navigation changes the matched params", () => {
    window.history.replaceState({}, "", "/product/1");
    const { getByTestId } = render(
      <Router routes={[{ path: "/product/:id", component: ParamsProbe }]} />,
    );
    expect(JSON.parse(getByTestId("params").textContent!)).toEqual({ id: "1" });

    act(() => {
      navigate("/product/99");
    });

    expect(JSON.parse(getByTestId("params").textContent!)).toEqual({
      id: "99",
    });
  });
});
