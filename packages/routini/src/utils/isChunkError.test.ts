import { describe, it, expect } from "vitest";
import { isChunkError, markChunkError } from "./isChunkError";

describe("isChunkError", () => {
  it("recognises an error tagged by routini's loader (primary signal)", () => {
    const tagged = markChunkError(new Error("anything at all"));
    expect(isChunkError(tagged)).toBe(true);
  });

  it("recognises webpack's ChunkLoadError by name", () => {
    const err = new Error("Loading chunk 42 failed");
    err.name = "ChunkLoadError";
    expect(isChunkError(err)).toBe(true);
  });

  it.each([
    "Failed to fetch dynamically imported module: https://x/a.js", // Chromium
    "error loading dynamically imported module: https://x/a.js", // Firefox/Safari
    "Loading chunk 7 failed", // webpack
  ])("matches the known message %j as a fallback", (message) => {
    expect(isChunkError(new Error(message))).toBe(true);
  });

  it("returns false for an ordinary render error", () => {
    expect(isChunkError(new Error("Cannot read properties of undefined"))).toBe(
      false,
    );
  });

  it("returns false for non-error values", () => {
    expect(isChunkError(null)).toBe(false);
    expect(isChunkError("a string")).toBe(false);
    expect(isChunkError(undefined)).toBe(false);
  });

  it("markChunkError tolerates non-objects and frozen errors", () => {
    expect(() => markChunkError("oops")).not.toThrow();
    expect(() => markChunkError(Object.freeze(new Error("frozen")))).not.toThrow();
  });
});
