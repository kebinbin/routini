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

  it("tolerates an optional trailing slash", () => {
    const routes: RouteDefinition[] = [
      { path: "/about", component: Page },
      { path: "/product/:id", component: Page },
    ];
    expect(matchRoute(routes, "/about/").route?.path).toBe("/about");
    expect(matchRoute(routes, "/product/42/").params).toEqual({ id: "42" });
  });

  it("matches case-sensitively", () => {
    const routes: RouteDefinition[] = [
      { path: "/about", component: Page },
      { path: "/:lang/docs", component: Page },
    ];
    // Static segments must match case exactly (no catch-all → undefined).
    expect(matchRoute(routes, "/About").route).toBeUndefined();
    expect(matchRoute(routes, "/en/Docs").route).toBeUndefined();
    // A :param still captures whatever case the URL uses.
    expect(matchRoute(routes, "/en/docs").params).toEqual({ lang: "en" });
  });

  it("compares static segments literally, not as patterns", () => {
    const routes: RouteDefinition[] = [{ path: "/files/a.b", component: Page }];
    // "." is a literal dot here, not a regex "any char".
    expect(matchRoute(routes, "/files/a.b").route?.path).toBe("/files/a.b");
    expect(matchRoute(routes, "/files/axb").route).toBeUndefined();
  });

  it("does not let a :param swallow a missing segment", () => {
    const routes: RouteDefinition[] = [{ path: "/user/:name", component: Page }];
    expect(matchRoute(routes, "/user").route).toBeUndefined();
  });
});
