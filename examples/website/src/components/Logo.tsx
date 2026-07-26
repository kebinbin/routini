import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  /**
   * Animate the node-fill + edge-grow sequence. Defaults to false so the
   * small Nav mark stays static; the hero opts in.
   */
  animated?: boolean;
}

type NodeId = 1 | 2 | 3 | 4 | 5;
type EdgeId = "1-2" | "2-3" | "2-4" | "3-5";

// Node positions
//   1 ── 2 ── 3
//        │     \
//        4      5
const NODES: Record<NodeId, { cx: number; cy: number }> = {
  1: { cx: 8, cy: 17 },
  2: { cx: 24, cy: 17 },
  3: { cx: 40, cy: 17 },
  4: { cx: 35, cy: 28 },
  5: { cx: 51, cy: 6 },
};

// Edge endpoints are trimmed exactly to the node radius (3) — flush against
// the circle's boundary, not floating short of it (an earlier 6.5 trim left
// a visible gap past the ring). Touching, not disconnected.
const EDGES: Record<
  EdgeId,
  { x1: number; y1: number; x2: number; y2: number }
> = {
  "1-2": { x1: 11, y1: 17, x2: 21, y2: 17 },
  "2-3": { x1: 27, y1: 17, x2: 37, y2: 17 },
  "2-4": { x1: 26.12, y1: 19.12, x2: 32.88, y2: 25.88 },
  "3-5": { x1: 42.12, y1: 14.88, x2: 48.88, y2: 8.12 },
};
const EDGE_LENGTH = 10;

const NODE_MS = 300; // time to fill one node
const EDGE_MS = 300; // time to grow one edge
const HOLD_MS = 2000; // pause at end of each pattern
const REST_MS = 2000; // empty hold between patterns

// Stroke weights. The ANIMATED_* pair is the animated mark's faint background
// edges and their "lit" weight; STATIC is the plain weight for the
// non-animated mark (nav, footer), which must read clearly at small sizes.
// INACTIVE was originally .05 — at the hero's render sizes (h-12 to h-24,
// ~48-96px) that scales to a sub-pixel stroke (~0.1-0.2px), which
// anti-aliases inconsistently across browsers/GPUs and can read as
// invisible; 0.6 is a real, consistent hairline without going as bold as an
// earlier 1/2.2/1.4 pass.
const STROKE_ANIMATED_INACTIVE = "0.6";
const STROKE_ANIMATED_ACTIVE = "1.4";
const STROKE_STATIC = "0.9";

export function Logo({ className, animated = false }: LogoProps) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [activeNodes, setActiveNodes] = useState<Set<NodeId>>(() =>
    animated && reduceMotion ? new Set<NodeId>([1, 2, 4]) : new Set(),
  );
  const [activeEdges, setActiveEdges] = useState<Set<EdgeId>>(() =>
    animated && reduceMotion ? new Set<EdgeId>(["1-2", "2-4"]) : new Set(),
  );

  useEffect(() => {
    if (!animated || reduceMotion) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    const runCycle = () => {
      let t = 0;

      // Pattern A: 1 → edge 1-2 → 2 → edge 2-4 → 4
      const nA = new Set<NodeId>();
      const eA = new Set<EdgeId>();
      at(t, () => {
        nA.add(1);
        setActiveNodes(new Set(nA));
      });
      t += NODE_MS;
      at(t, () => {
        eA.add("1-2");
        setActiveEdges(new Set(eA));
      });
      t += EDGE_MS;
      at(t, () => {
        nA.add(2);
        setActiveNodes(new Set(nA));
      });
      t += NODE_MS;
      at(t, () => {
        eA.add("2-4");
        setActiveEdges(new Set(eA));
      });
      t += EDGE_MS;
      at(t, () => {
        nA.add(4);
        setActiveNodes(new Set(nA));
      });
      t += NODE_MS + HOLD_MS;
      at(t, () => {
        setActiveNodes(new Set());
        setActiveEdges(new Set());
      });
      t += REST_MS;

      // Pattern B: 1 → edge 1-2 → 2 → edge 2-3 → 3 → edge 3-5 → 5
      const nB = new Set<NodeId>();
      const eB = new Set<EdgeId>();
      at(t, () => {
        nB.add(1);
        setActiveNodes(new Set(nB));
      });
      t += NODE_MS;
      at(t, () => {
        eB.add("1-2");
        setActiveEdges(new Set(eB));
      });
      t += EDGE_MS;
      at(t, () => {
        nB.add(2);
        setActiveNodes(new Set(nB));
      });
      t += NODE_MS;
      at(t, () => {
        eB.add("2-3");
        setActiveEdges(new Set(eB));
      });
      t += EDGE_MS;
      at(t, () => {
        nB.add(3);
        setActiveNodes(new Set(nB));
      });
      t += NODE_MS;
      at(t, () => {
        eB.add("3-5");
        setActiveEdges(new Set(eB));
      });
      t += EDGE_MS;
      at(t, () => {
        nB.add(5);
        setActiveNodes(new Set(nB));
      });
      t += NODE_MS + HOLD_MS;
      at(t, () => {
        setActiveNodes(new Set());
        setActiveEdges(new Set());
      });
      t += REST_MS;

      at(t, runCycle);
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animated, reduceMotion]);

  return (
    <svg
      role="img"
      aria-label="routini"
      viewBox="0 0 58 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={animated ? STROKE_ANIMATED_INACTIVE : STROKE_STATIC}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {animated ? (
        <>
          {/* Background edges — always visible, thin. Endpoints match EDGES
              above exactly, flush against every (hollow) node's boundary. */}
          <line x1="11" y1="17" x2="21" y2="17" />
          <line x1="27" y1="17" x2="37" y2="17" />
          <line x1="26.12" y1="19.12" x2="32.88" y2="25.88" />
          <line x1="42.12" y1="14.88" x2="48.88" y2="8.12" />

          {/* Animated thick edges — grow on top of the background lines */}
          {(Object.entries(EDGES) as [EdgeId, (typeof EDGES)[EdgeId]][]).map(
            ([id, { x1, y1, x2, y2 }]) => {
              const isActive = activeEdges.has(id);
              return (
                <line
                  key={id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={STROKE_ANIMATED_ACTIVE}
                  strokeDasharray={EDGE_LENGTH}
                  strokeDashoffset={isActive ? 0 : EDGE_LENGTH}
                  style={{
                    transition: isActive
                      ? `stroke-dashoffset ${EDGE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                      : "none",
                  }}
                />
              );
            },
          )}

          {/* Node rings — hollow circles whose stroke thickens on activation,
              matching the edge behaviour exactly. fill="none" (not a
              hardcoded --color-ink patch) so the hole is genuinely
              transparent and reads correctly over any backdrop, including
              the hero's gradient. */}
          {(
            Object.entries(NODES) as [string, { cx: number; cy: number }][]
          ).map(([id, { cx, cy }]) => {
            const isActive = activeNodes.has(Number(id) as NodeId);
            return (
              <circle
                key={`ring-${id}`}
                cx={cx}
                cy={cy}
                r="3"
                fill="none"
                strokeWidth={
                  isActive ? STROKE_ANIMATED_ACTIVE : STROKE_ANIMATED_INACTIVE
                }
                style={{
                  transition: isActive
                    ? `stroke-width ${NODE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                    : "none",
                }}
              />
            );
          })}
        </>
      ) : (
        <>
          {/* Same trim as the animated variant, applied uniformly (even where
              a node is solid) so every line is flush against its node. */}
          <line x1="11" y1="17" x2="37" y2="17" />
          <line x1="26.12" y1="19.12" x2="32.88" y2="25.88" />
          <line x1="42.12" y1="14.88" x2="48.88" y2="8.12" />
          <circle cx="8" cy="17" r="3" fill="currentColor" />
          <circle cx="24" cy="17" r="3" fill="currentColor" />
          <circle cx="35" cy="28" r="3" fill="currentColor" />
          <circle cx="40" cy="17" r="3" fill="none" />
          <circle cx="51" cy="6" r="3" fill="none" />
        </>
      )}
    </svg>
  );
}
