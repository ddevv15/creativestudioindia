"use client";

/**
 * ScrollExpand, vendored from React Bits (reactbits.dev), TypeScript + Tailwind
 * variant. Kept close to the upstream source so it stays easy to diff against a
 * future version. Five deliberate changes, all marked ADAPTED below:
 *
 *   1. "use client" — required by the App Router; the upstream file assumes a
 *      client-only bundler.
 *   2. `title` widened from string to ReactNode, so the homepage can pass a real
 *      <h1>. Upstream renders the title in a plain <div>, which would leave the
 *      homepage with no top level heading at all.
 *   3. The <img> gets eager loading and high fetch priority. It is the largest
 *      element on the landing screen, so leaving it to lazy defaults delays the
 *      Largest Contentful Paint.
 *   4. `titleFade` — upstream hardcodes when the title leaves. When the frame
 *      opens from nothing, the title and the picture share the middle of the
 *      screen, so the caller has to be able to move that window.
 *   5. Two fixes for `enabled` being toggled after mount, which is how the
 *      homepage turns the effect off for reduced motion — it cannot know the
 *      answer until it is on the client, so the first render is always
 *      `enabled`. Upstream only ever sets it once, so neither shows up there.
 *      a. `enabled` is in the effect's dependency list. Without it nothing
 *         recomputes when the flag flips, and the frame sits at whatever
 *         progress it was last painted at until something else scrolls.
 *      b. The title no longer fades while `enabled` is false. Disabling the
 *         effect pins progress at 1, which upstream reads as "fully scrolled"
 *         and so fades the title away — leaving reduced-motion visitors on a
 *         hero with no heading on it at all.
 */

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const clamp = (v: number, a: number, b: number): number =>
  v < a ? a : v > b ? b : v;

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type ConfigKey =
  | "startWidth"
  | "startHeight"
  | "startRadius"
  | "endRadius"
  | "mediaZoom"
  | "scrollDistance"
  | "holdDistance"
  | "smoothing"
  | "overlayScrim"
  | "titleFade"
  | "useWindowScroll"
  | "enabled";

export interface ScrollExpandProps {
  src?: string;
  mediaType?: "image" | "video";
  poster?: string;
  alt?: string;
  /** ADAPTED: ReactNode rather than string, so a real heading can be passed. */
  title?: ReactNode;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  /**
   * ADAPTED: progress range over which the title fades and lifts away, as
   * `[start, end]`. Defaults to upstream's hardcoded window.
   */
  titleFade?: [number, number];
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function ScrollExpand({
  src = "",
  mediaType = "image",
  poster = "",
  alt = "",
  title,
  scrollHint = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  titleFade = [0.4, 0.88],
  useWindowScroll = false,
  enabled = true,
  children,
  className = "",
  style,
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<(HTMLImageElement & HTMLVideoElement) | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const propsRef = useRef<Required<Pick<ScrollExpandProps, ConfigKey>>>(
    {} as Required<Pick<ScrollExpandProps, ConfigKey>>,
  );
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    titleFade,
    useWindowScroll,
    enabled,
  };

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current)
      scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      // ADAPTED: caller-controlled window, and no fade at all while the effect
      // is off — see note 5 at the top of the file.
      const out = c.enabled
        ? smoothstep(c.titleFade[0], c.titleFade[1], p)
        : 0;
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty("--se-title-size", `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k =
        c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller: Window | HTMLDivElement = useWindowScroll ? window : root;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
    // ADAPTED: `enabled` belongs here — see note 5a at the top of the file.
  }, [applyProgress, useWindowScroll, enabled]);

  /**
   * ADAPTED: the resting zoom, for the same reason as restClipPath above.
   * applyProgress(0) scales the media to `mediaZoom`, but the markup carries no
   * transform, so the picture also popped from 1x to 1.35x on hydration.
   */
  const restTransform = { transform: `scale(${mediaZoom})` };

  const media =
    mediaType === "video" ? (
      <video
        ref={mediaRef}
        className="absolute inset-0 h-full w-full select-none object-cover origin-center [will-change:transform]"
        style={restTransform}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={mediaRef}
        className="absolute inset-0 h-full w-full select-none object-cover origin-center [will-change:transform]"
        style={restTransform}
        src={src}
        alt={alt}
        draggable={false}
        // ADAPTED: this is the landing screen's largest element, so it must not
        // wait behind lazy loading defaults.
        loading="eager"
        fetchPriority="high"
      />
    );

  /**
   * ADAPTED: the frame's resting geometry, derived from the props rather than
   * hardcoded in the markup.
   *
   * Upstream ships a literal `clip-path:inset(21% 29% 21% 29% round 24px)` on
   * the frame. That is exactly what applyProgress(0) computes — but only for
   * upstream's DEFAULT startWidth/startHeight/startRadius. Any caller that
   * overrides them, as the homepage does with 0/0/44, gets a server frame that
   * disagrees with the first client frame: the picture paints through a
   * half-open window and then snaps shut on hydration.
   *
   * Mirrors applyProgress at p = 0, where smoothstep(0, 1, 0) is 0.
   */
  const restInsetX = Math.max(0, (100 - startWidth) / 2);
  const restInsetY = Math.max(0, (100 - startHeight) / 2);
  const restClipPath = `inset(${restInsetY}% ${restInsetX}% ${restInsetY}% ${restInsetX}% round ${startRadius}px)`;

  /**
   * ADAPTED: reserve the scroll runway in the server markup.
   *
   * measure() sets the stage to one viewport and the track to
   * stageH * (1 + scrollDistance + holdDistance) — for the homepage, about two
   * and a half viewports. Neither height exists until that effect runs, so the
   * server sends a document roughly two viewports SHORT of its real height.
   *
   * The browser restores scroll against that short document, then the effect
   * adds the missing height and everything below the hero drops by it. Whether
   * the result looks correct or broken depends purely on where the scroll was
   * restored to, which is why it alternated between refreshes.
   *
   * Only meaningful when scrolling the window: the embedded variant measures
   * its own container, for which a viewport unit is the wrong answer.
   */
  const restTrackHeight = useWindowScroll
    ? // Rounded because the sum is floating point — 1 + 1.2 + 0.35 is
      // 2.5500000000000003, and that lands verbatim in the server HTML.
      `calc(100dvh * ${Number(
        (1 + Math.max(0, scrollDistance) + Math.max(0, holdDistance)).toFixed(4),
      )})`
    : undefined;

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full ${
        useWindowScroll
          ? ""
          : "overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      } ${className}`.trim()}
      style={style}
    >
      <div
        ref={trackRef}
        className="relative w-full"
        style={restTrackHeight ? { height: restTrackHeight } : undefined}
      >
        <div
          ref={stageRef}
          className="sticky top-0 w-full overflow-hidden [--se-title-size:4rem]"
          style={useWindowScroll ? { height: "100dvh" } : undefined}
        >
          <div
            ref={frameRef}
            className="absolute inset-0 [will-change:clip-path]"
            style={{ clipPath: restClipPath }}
          >
            {media}
            <div
              ref={scrimRef}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.35))] opacity-0"
            />
            {children ? (
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-center p-[6%] text-center opacity-0 [will-change:opacity,transform]"
              >
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div
              ref={titleRef}
              className="pointer-events-none absolute inset-0 m-0 flex items-center justify-center px-[6%] text-center [will-change:opacity,transform]"
            >
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 bottom-24 text-center font-sans text-[13px] tracking-[0.02em] text-white/55 [will-change:opacity,transform]"
            >
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
