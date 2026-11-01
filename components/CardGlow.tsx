"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/*
 * The liquid fill behind /projects cards, after zha.com/projects. Watched
 * frame by frame with the cursor held still, the reference card:
 *   0s    a soft glow appears behind the text
 *   ~1s   the colour floods most of the card
 *   2–8s  it keeps moving on its own, gathering into blobs, filling again,
 *         drifting toward an edge, like liquid sloshing inside the card
 * It sits behind the card's content: photos cover it, text sits on it.
 *
 * Here it's one shader: domain-warped noise that flows over time, cut by a
 * soft threshold. `fill` eases 0 → 1 on hover, lowering the threshold so the
 * colour rises and floods the card. A slow "breath" in the threshold makes it
 * ebb and fill again while you stay. The cursor adds weight around itself, so
 * the fill starts from where you entered. Leaving drains it.
 *
 * One canvas for the whole grid hops to the hovered cell (`data-glow-cell`),
 * so there's only ever one WebGL context, and it stops rendering once drained.
 */

const FILL_IN = 0.9; // seconds to flood
const FILL_OUT = 0.45; // seconds to drain
// The glow colours are already pastel, so they can go on stronger than a
// saturated brand colour would without overwhelming the card.
const PEAK_OPACITY = 0.75;

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uFill;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv;
    p.x *= uAspect;
    float t = uTime * 0.32;

    // Domain warp: noise bends the coordinates of more noise, which reads as
    // liquid rather than cloud.
    // Low frequencies keep the blobs large and soft, like the reference.
    vec2 q = vec2(fbm(p * 0.9 + vec2(t, -t * 0.7)), fbm(p * 0.9 + vec2(5.2 - t * 0.6, 1.3 + t)));
    float field = fbm(p * 0.75 + 1.8 * q + vec2(t * 0.5, -t * 0.35));

    // Weight around the cursor, so the fill rises from where you are.
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    field += exp(-dot(d, d) / 0.09) * 0.28;

    // Lower threshold = more of the card covered. Fill floods it; the breath
    // lets it ebb and come back while you stay.
    float breath = sin(uTime * 0.7) * 0.06;
    float threshold = mix(1.05, 0.16, uFill) + breath * uFill;
    float a = smoothstep(threshold, threshold + 0.42, field) * uOpacity * uFill;

    gl_FragColor = vec4(uColor * a, a); // premultiplied
  }
`;

type Rgb = [number, number, number];

/** "#c0391b" → [r, g, b] in 0..1. */
function hexToRgb(raw: string): Rgb {
  const hex = raw.trim().replace("#", "");
  const value = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

/**
 * The rotation from `--glow-colors` in globals.css. A custom property's
 * computed value has its var() references resolved, so this reads hex values.
 */
function glowPalette(): Rgb[] {
  const root = getComputedStyle(document.documentElement);
  const list = root
    .getPropertyValue("--glow-colors")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith("#"))
    .map(hexToRgb);
  return list.length > 0 ? list : [hexToRgb(root.getPropertyValue("--color-red"))];
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Mount inside a `relative` wrapper that contains the grid. Cards opt in with
 * `data-glow-cell`. While the WebGL fill is running, the wrapper carries
 * `data-glow="webgl"`, which hides each card's CSS fallback glow.
 */
export default function CardGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        depth: false,
        // The fill is soft by nature; a lower resolution costs nothing visible.
        dpr: Math.min(window.devicePixelRatio || 1, 1),
      });
    } catch {
      return; // no WebGL: the CSS glow stays in charge
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.setAttribute("data-glow", "webgl");

    const palette = glowPalette();
    let colorIndex = -1;
    // A different colour every hover: random, but never the one just used.
    const nextColor = (): Rgb => {
      let pick = Math.floor(Math.random() * palette.length);
      if (palette.length > 1 && pick === colorIndex) pick = (pick + 1) % palette.length;
      colorIndex = pick;
      return palette[pick];
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uFill: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uAspect: { value: 1 },
        uColor: { value: palette[0] },
        uOpacity: { value: PEAK_OPACITY },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let cell: HTMLElement | null = null;
    let inside = false;
    let progress = 0; // 0 drained … 1 full, before easing
    const pointer = { x: 0.5, y: 0.5 };
    const smoothed = { x: 0.5, y: 0.5 };
    let start = performance.now();
    let last = performance.now();
    let raf = 0;

    const place = (next: HTMLElement) => {
      const box = container.getBoundingClientRect();
      const rect = next.getBoundingClientRect();
      canvas.style.transform = `translate(${rect.left - box.left}px, ${rect.top - box.top}px)`;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uAspect.value = rect.width / rect.height;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      progress = inside
        ? Math.min(1, progress + dt / FILL_IN)
        : Math.max(0, progress - dt / FILL_OUT);

      smoothed.x += (pointer.x - smoothed.x) * 0.08;
      smoothed.y += (pointer.y - smoothed.y) * 0.08;

      program.uniforms.uTime.value = (now - start) / 1000;
      program.uniforms.uFill.value = inside ? easeOut(progress) : progress * progress;
      program.uniforms.uMouse.value = [smoothed.x, 1 - smoothed.y];
      renderer.render({ scene: mesh });

      if (inside || progress > 0) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const next = (event.target as HTMLElement).closest<HTMLElement>("[data-glow-cell]");
      if (!next) {
        inside = false;
        return;
      }
      const rect = next.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;

      // Re-entering from outside the card counts as a new hover too, so the
      // colour changes even when you come back to the same card.
      if (next !== cell || (!inside && progress === 0)) {
        // A new hover fills from empty, starting where the cursor came in.
        cell = next;
        program.uniforms.uColor.value = nextColor();
        place(next);
        progress = 0;
        start = performance.now();
        smoothed.x = pointer.x;
        smoothed.y = pointer.y;
        canvas.style.opacity = "1";
      }
      inside = true;
      wake();
    };

    const onPointerLeave = () => {
      inside = false;
    };

    // A filter change or resize moves cards: drop the fill rather than leave
    // it floating where a card used to be.
    const reset = () => {
      cell = null;
      inside = false;
      progress = 0;
      canvas.style.opacity = "0";
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", reset);
    const observer = new MutationObserver(reset);
    observer.observe(container, { childList: true });

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", reset);
      observer.disconnect();
      container.removeAttribute("data-glow");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 opacity-0 transition-opacity duration-300"
    />
  );
}
