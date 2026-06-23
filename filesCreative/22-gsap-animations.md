Read AGENTS.md first and follow it strictly.

Study the existing section components and add GSAP ScrollTrigger animations to any section that does not already have them. Do not re-implement animations already built in earlier prompts.

Verify that GSAP and ScrollTrigger are registered exactly once — in Nav.tsx. If they are registered elsewhere, consolidate. If Nav.tsx already registers them, do not add another registration anywhere.

For each homepage section that is missing its entrance animation, add the following default pattern unless that section has a specific animation already defined in its prompt:
- Initial state: opacity: 0, y: 32
- Animated state: opacity: 1, y: 0
- Duration: 0.7s, ease: "power2.out"
- Trigger: "top 80%"
- Apply to: section headline, then body content 0.15s later

Add a scroll-progress indicator for the project detail page: a thin 2px red (#C0391B) line at the very top of the viewport that grows from 0% to 100% width as the user scrolls the page. Implement this using GSAP ScrollTrigger scrub: true on a fixed-position div.

Ensure all GSAP contexts are properly cleaned up in useEffect return functions to prevent memory leaks and double-fire on React Strict Mode.

Do not change any Sanity schemas, API routes, or page structure. Do not add new components — animate within existing ones only.
