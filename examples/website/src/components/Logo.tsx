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
  4: { cx: 35.3, cy: 28.3 },
  5: { cx: 51.3, cy: 5.7 },
};

// All edges are ~16 units long (diagonals: 11.3√2 ≈ 16)
const EDGES: Record<
  EdgeId,
  { x1: number; y1: number; x2: number; y2: number }
> = {
  "1-2": { x1: 8, y1: 17, x2: 24, y2: 17 },
  "2-3": { x1: 24, y1: 17, x2: 40, y2: 17 },
  "2-4": { x1: 24, y1: 17, x2: 35.3, y2: 28.3 },
  "3-5": { x1: 40, y1: 17, x2: 51.3, y2: 5.7 },
};
const EDGE_LENGTH = 16;

const NODE_MS = 300; // time to fill one node
const EDGE_MS = 300; // time to grow one edge
const HOLD_MS = 2000; // pause at end of each pattern
const REST_MS = 2000; // empty hold between patterns

const STROKE_INACTIVE = ".05";
const STROKE_ACTIVE = ".25";

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
      strokeWidth={STROKE_INACTIVE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {animated ? (
        <>
          {/* Background edges — always visible, thin */}
          <line x1="8" y1="17" x2="24" y2="17" />
          <line x1="24" y1="17" x2="40" y2="17" />
          <line x1="24" y1="17" x2="35.3" y2="28.3" />
          <line x1="40" y1="17" x2="51.3" y2="5.7" />

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
                  strokeWidth={STROKE_ACTIVE}
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
              matching the edge behaviour exactly. */}
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
                fill="var(--color-ink)"
                strokeWidth={isActive ? STROKE_ACTIVE : STROKE_INACTIVE}
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
          <line x1="8" y1="17" x2="40" y2="17" />
          <line x1="24" y1="17" x2="35.3" y2="28.3" />
          <line x1="40" y1="17" x2="51.3" y2="5.7" />
          <circle cx="8" cy="17" r="3" fill="currentColor" />
          <circle cx="24" cy="17" r="3" fill="currentColor" />
          <circle cx="35.3" cy="28.3" r="3" fill="currentColor" />
          <circle cx="40" cy="17" r="3" fill="var(--color-ink)" />
          <circle cx="51.3" cy="5.7" r="3" fill="var(--color-ink)" />
        </>
      )}
    </svg>
  );
}
