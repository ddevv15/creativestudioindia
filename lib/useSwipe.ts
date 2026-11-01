"use client";

import { useRef, useState } from "react";

// Drag must travel this far before it counts as a swipe rather than a tap.
const DRAG_SLOP = 10;
// Share of the slide width the projected landing must pass to change slide.
// Half (snap to nearest) asked a mouse to drag ~700px across a wide slide;
// a quarter feels like a decision without needing a flick.
const COMMIT_RATIO = 0.25;

/** Where a flick would come to rest, as scroll deceleration projects it. */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Horizontal swipe for slide carousels (HeroSlider, ProjectCarousel). Touch
 * and pen always. Mouse dragging is opt-in (`mouse`): ProjectCarousel wants
 * click-and-drag, while the hero keeps it off so its title link stays a plain
 * link. After a real drag, the click that follows is swallowed
 * (`onClickCapture`), so letting go never also counts as a click.
 *
 * `dragX` tracks the finger 1:1 (through `resist`, if given, for rubber-banding
 * at the ends). On release, the commit is decided by where the flick would
 * land, not by how far the finger travelled: past a quarter of the width
 * either way calls `onSwipe`.
 */
export function useSwipe({
  enabled,
  onSwipe,
  resist = (dx) => dx,
  mouse = false,
}: {
  enabled: boolean;
  onSwipe: (direction: 1 | -1) => void;
  resist?: (dx: number) => number;
  mouse?: boolean;
}) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  // The gesture's own bookkeeping lives in a ref, not state. A fast flick can
  // deliver its last move and the release before React re-renders, and state
  // read in onPointerUp would still be from the render before the drag began.
  const gesture = useRef<{
    x: number;
    y: number;
    dx: number;
    active: boolean;
    samples: { x: number; t: number }[];
  } | null>(null);
  const justDragged = useRef(false);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if (event.pointerType === "mouse" && (!mouse || event.button !== 0)) return;
    justDragged.current = false;
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      active: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (!start.active) {
      if (Math.abs(dy) > DRAG_SLOP && Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null; // a vertical scroll, not ours
        return;
      }
      if (Math.abs(dx) < DRAG_SLOP) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      start.active = true;
      setDragging(true);
    }

    start.samples = [...start.samples.slice(-4), { x: event.clientX, t: event.timeStamp }];
    start.dx = resist(dx);
    setDragX(start.dx);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start?.active) return;

    const first = start.samples[0];
    const elapsed = Math.max(event.timeStamp - first.t, 1);
    const velocity = ((event.clientX - first.x) / elapsed) * 1000; // px/s
    const landing = start.dx + project(velocity);
    const width = event.currentTarget.clientWidth;

    justDragged.current = true;
    if (landing < -width * COMMIT_RATIO) onSwipe(1);
    else if (landing > width * COMMIT_RATIO) onSwipe(-1);
    setDragging(false);
    setDragX(0);
  };

  return {
    dragX,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture: (event: React.MouseEvent) => {
        if (!justDragged.current) return;
        justDragged.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}
