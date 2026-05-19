import { describe, it, expect } from "vitest";
import { matchRoute } from "./matchRoute";
import type { RouteDefinition } from "../components/Router";

const Page = () => null;

describe("matchRoute", () => {
  it("returns undefined route + empty params for an empty routes array", () => {
    expect(matchRoute([], "/")).toEqual({ route: undefined, params: {} });
  });

  it("matches an exact path and returns empty params", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Page },
      { path: "/about", component: Page },
    ];
    const result = matchRoute(routes, "/about");
    expect(result.route?.path).toBe("/about");
    expect(result.params).toEqual({});
  });

  it("extracts a single dynamic param", () => {
    const routes: RouteDefinition[] = [
      { path: "/product/:id", component: Page },
    ];
    const result = matchRoute(routes, "/product/42");
    expect(result.route?.path).toBe("/product/:id");
    expect(result.params).toEqual({ id: "42" });
  });

  it("extracts multiple dynamic params", () => {
    const routes: RouteDefinition[] = [
      { path: "/:lang/about", component: Page },
    ];
    const result = matchRoute(routes, "/en/about");
    expect(result.params).toEqual({ lang: "en" });
  });

  it("decodes URL-encoded characters in params", () => {
    const routes: RouteDefinition[] = [
      { path: "/user/:name", component: Page },
    ];
    const result = matchRoute(routes, "/user/jane%20doe");
    expect(result.params).toEqual({ name: "jane doe" });
  });

  it("uses catch-all only when no specific route matches", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: Page },
      { path: "*", component: Page },
    ];
    expect(matchRoute(routes, "/").route?.path).toBe("/");
    expect(matchRoute(routes, "/nope").route?.path).toBe("*");
  });

  it("treats catch-all as last resort regardless of position in the array", () => {
    const routes: RouteDefinition[] = [
      { path: "*", component: Page },
      { path: "/known", component: Page },
    ];
    expect(matchRoute(routes, "/known").route?.path).toBe("/known");
    expect(matchRoute(routes, "/missing").route?.path).toBe("*");
  });

  it("returns undefined when no route and no catch-all match", () => {
    const routes: RouteDefinition[] = [{ path: "/only", component: Page }];
    expect(matchRoute(routes, "/elsewhere")).toEqual({
      route: undefined,
      params: {},
    });
  });
});
