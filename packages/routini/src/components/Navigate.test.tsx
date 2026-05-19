import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { Navigate } from "./Navigate";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
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
});
