import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Single registration point for the whole app. AGENTS.md asks for one
// top-level registration; specs 05 and 22 name Nav.tsx, but a module is the
// better home — it registers once per process and cannot be duplicated by a
// component remounting. Import gsap from here, never from "gsap" directly.
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
