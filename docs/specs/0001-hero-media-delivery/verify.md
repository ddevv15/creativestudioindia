# Verify: hero media delivery · spec 0001 · updated 2026-09-09

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

Three of these were never exercised during the build and matter most: the reduced motion path, the missing image fallback, and the no JavaScript first paint. They are marked below.

## UI / manual

- [ ] Load `/` at 1200px wide → the image sits inset with Ink visible on all four sides, and its top left corner is cut away by a notch with rounded corners, including the concave joins → AC-2
- [ ] Load `/` → the headline sits inside the notch in Cormorant Garamond, and the text can be selected with the cursor (it is real text, not an image) → AC-3
- [ ] **Not yet exercised.** Disable JavaScript, load `/` → the notch still has a sensible shape from its CSS default, and the image is visible immediately → AC-2, AC-10
- [ ] Change `heroHeadline` in the Studio to a much longer sentence, publish, reload → the notch grows to fit it, with no clipped text and no overlap into the image → AC-4
- [ ] Load `/` at 390px wide → no notch, the headline sits above the image, and the image keeps its rounded corners → AC-5
- [ ] Load `/` → the "View our projects" button has square corners and navigates to `/projects` → AC-6
- [ ] **Not yet exercised.** Unset `heroMedia` on the `siteSettings` singleton in the Studio, reload `/` → the route returns 200 and shows `public/hero-default.jpg` in the same notched frame, not a broken image → AC-7
- [ ] Scroll down from the top of `/` → the nav goes from transparent to solid, and the browser console shows no Nav warning about a missing overlay element → AC-8
- [ ] **Not yet exercised.** Turn on Reduce Motion in the operating system, reload `/` → the headline is visible immediately with no line by line reveal → AC-9
- [ ] Load `/` → the section label "01 / Architecture" and the sub copy line are gone → AC-11
- [ ] Change the hero image in the Studio, reload → the new image appears; throttle the network in DevTools and reload to see the blurred placeholder before it loads → AC-10
- [ ] Set a hotspot on the hero image in the Studio, publish, reload → the crop follows the hotspot → AC-1

## Commands

- [ ] GROQ `*[_id == "siteSettings"][0].heroMedia.asset->_type` → returns `sanity.imageAsset`, never `sanity.fileAsset` → AC-1
- [ ] In the Studio, try to upload a video file into Hero Image → rejected, the field accepts images only → AC-1
- [ ] `npm run typecheck && npm run lint && npm run build` → all clean → AC-1
- [ ] DevTools Network, hard reload `/` → the hero image request is high priority and its width matches the viewport rather than the full 2560 source → AC-10

## Acceptance-criteria coverage

- AC-1 covered by the GROQ check, the Studio upload rejection, and the hotspot step
- AC-2 covered by the 1200px load and the no JavaScript step
- AC-3 covered by the text selection step
- AC-4 covered by the long headline step
- AC-5 covered by the 390px step
- AC-6 covered by the button step
- AC-7 covered by the unset `heroMedia` step
- AC-8 covered by the scroll step
- AC-9 covered by the Reduce Motion step
- AC-10 covered by the Network step, the blur step, and the no JavaScript step
- AC-11 covered by the label and sub copy step
