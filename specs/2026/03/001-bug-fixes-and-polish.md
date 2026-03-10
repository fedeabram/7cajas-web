# 7 Cajas Website - Bug Fixes & Polish

Stage: `Completed`
Last Updated: 2026-03-10

## High-Level Objective

Fix all identified bugs, broken functionality, and code quality issues on the 7 Cajas static landing page. The site is a single-page vanilla HTML/CSS/JS website for a wholesale high oleic oil distributor in Argentina. The goal is to deliver a polished, fully functional, and maintainable codebase.

## Mid-Level Objectives

- [x] Fix HTML syntax errors (unclosed tags, missing semicolons)
- [x] Fix broken/incomplete CSS rules (truncated `box-shadow`, missing semicolons)
- [x] Implement missing map tooltip JavaScript functionality
- [x] Clean up CSS hacks (negative margins, excessive `!important`, duplicated rules)
- [x] Ensure responsive behavior works correctly on mobile
- [x] Fix form submission (WhatsApp redirect with pre-filled message)
- [x] Improve accessibility basics (alt texts, semantic structure)

## Context

### Current State

The website is a static single-page site with these sections:
1. **Hero** - Image slider with 4 slides, autoplay every 5s
2. **Header** - Fixed, transparent → dark on scroll, dual logos, nav, social icons
3. **Nosotros** - YouTube embed + descriptive text
4. **Nuestro Compromiso** - Gallery carousel with distribution images
5. **Expansión Nacional** - Interactive SVG map of Argentina with city points
6. **Productos** - 4 product cards opening detail modals
7. **Contacto** - Address/phone info, contact form, Google Maps embed
8. **Footer** - Logo, hours, copyright

**Tech stack**: Vanilla HTML/CSS/JS, Google Fonts (Orbitron, Inter), no build system.

### Identified Bugs

#### HTML Issues
1. **Line 353** (`index.html`): Unclosed `<p>` tag — `<p>` used instead of `</p>` before the WhatsApp link
2. **Line 255** (`style.css`): Missing semicolon after `padding-left: 30px`

#### CSS Issues
3. **Line 1212** (`style.css`): Incomplete `box-shadow` value — `box-shadow: 0 15px 40px rgba;` is missing the color function parameters
4. **Duplicated `.map-point` rule** — defined at lines 1223-1234 and again at lines 1247-1257 with conflicting styles
5. **Duplicated `.galeria-texto-layout`** — defined at lines 826-834 and overridden at lines 836-838
6. **Duplicated `#galeria` padding** — defined in multiple places with `!important` overrides
7. **Social icons hack** — `margin-top: -200px` on `.social-icons` (line 162) is fragile and breaks on different screen sizes

#### JavaScript Issues
8. **Map tooltip not functional** — HTML has `.map-tooltip` div and `.map-point` circles with `data-info` attributes, but `main.js` has no code to handle hover/click events on map points
9. **Form has no submission handler** — `<form>` has no `action`, no JS handler, no `mailto:` — submit does nothing

#### CSS Code Quality
10. Excessive use of `!important` throughout (30+ instances)
11. Multiple redundant `@media (max-width: 768px)` blocks that could be consolidated
12. Inconsistent use of CSS custom variables (some colors hardcoded, some use `var()`)

## Proposed Solution

Fix all identified bugs in a systematic order: HTML syntax first, then CSS bugs, then JavaScript functionality, and finally code quality cleanup.

- **Form** → WhatsApp redirect with pre-filled message (consistent with existing WhatsApp CTA)
- **Map** → Tooltip on hover showing city name from `data-info`. No click modal needed.

<!-- FEEDBACK: proposed_solution
Decisions resolved:
1. Form → WhatsApp redirect
2. Map → Tooltip on hover only
Status: RESOLVED
-->

## Implementation Notes

<!-- FEEDBACK: implementation_approach
Status: RESOLVED
-->

### Phase 1: HTML Syntax Fixes

Fix broken HTML that could cause parsing/rendering issues.

- [x] Step 1.1: Fix unclosed `<p>` tag in contact section
  - MODIFY `index.html` — change `<p>` to `</p>` on line 353:
    ```diff
    -      <p style="display:flex; align-items:center; gap:10px; font-weight:bold;">
    +      </p>
    +      <p style="display:flex; align-items:center; gap:10px; font-weight:bold;">
    ```
    Note: The `<p>` on line 352 for the WhatsApp icon is never closed. We need to close it before opening the new `<p>` for the WhatsApp link.

**Verification**: Open `index.html` in browser, verify contact section renders correctly with address, phone, and WhatsApp link each on their own line.

---

### Phase 2: CSS Bug Fixes

Fix broken CSS rules that cause rendering issues.

- [x] Step 2.1: Add missing semicolon in `.hero-content-wrapper`
  - MODIFY `css/style.css` — line 255:
    ```diff
    -  padding-left: 30px
    +  padding-left: 30px;
    ```

- [x] Step 2.2: Fix incomplete `box-shadow` on `.galeria-slide-inner`
  - MODIFY `css/style.css` — line 1212:
    ```diff
    -  box-shadow: 0 15px 40px rgba;
    +  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    ```

- [x] Step 2.3: Merge duplicated `.map-point` rules into one
  - MODIFY `css/style.css` — remove the first `.map-point` block (lines 1223-1234), keep and consolidate into the second block (lines 1247-1257) adding the `filter` glow from the first:
    ```diff
    +/* Map interactive points */
     .map-point {
       fill: #F4A261;
       cursor: pointer;
    +  filter: drop-shadow(0 0 6px #F4A261)
    +          drop-shadow(0 0 12px rgba(244, 162, 97, 0.6));
       transition: transform 0.25s ease, filter 0.25s ease;
    +  transform-box: fill-box;
    +  transform-origin: center;
     }

     .map-point:hover {
    -  transform: scale(1.3);
    +  transform: scale(1.9);
       filter: drop-shadow(0 0 8px #F4A261)
               drop-shadow(0 0 18px rgba(244,162,97,0.8));
     }
    ```

- [x] Step 2.4: Merge duplicated `.galeria-texto-layout` rules
  - MODIFY `css/style.css` — merge the second block (lines 836-838) `row-gap: 2.5rem` into the first block (lines 826-834) and delete the duplicate.

- [x] Step 2.5: Fix social icons positioning — replace `margin-top: -200px` hack
  - MODIFY `css/style.css` — restructure `.header-inner` to use flexbox properly:
    ```diff
    +.header-inner {
    +  width: 100%;
    +  display: flex;
    +  flex-direction: column;
    +  padding: 0;
    +  margin: 0;
    +}

     .social-icons {
       display: flex;
       gap: 1.5rem;
       justify-content: flex-end;
       margin: 0;
    -  margin-top: -200px;
    -  margin-right: 5%;
    +  margin-right: 5%;
     }
    ```
  - MODIFY `index.html` — move `.social-icons` div inside `.logo-container` or restructure header layout so social icons sit in the top-right naturally via flexbox.

**Verification**: Open page in browser. Check: hero text is properly spaced, gallery images have subtle shadow, map points glow, social icons are positioned correctly in header without negative margins.

---

### Phase 3: JavaScript — Map Tooltips

Add hover tooltip functionality for the interactive Argentina map.

- [x] Step 3.1: Add map tooltip JS to `main.js`
  - MODIFY `js/main.js` — add inside the `DOMContentLoaded` handler:
    ```javascript
    // MAP TOOLTIPS
    const mapPoints = document.querySelectorAll('.map-point');
    const mapTooltip = document.getElementById('map-tooltip');

    if (mapTooltip && mapPoints.length > 0) {
      mapPoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
          const info = point.getAttribute('data-info');
          mapTooltip.textContent = info;
          mapTooltip.style.opacity = '1';
        });

        point.addEventListener('mousemove', (e) => {
          const container = point.closest('.expansion-img');
          const rect = container.getBoundingClientRect();
          mapTooltip.style.left = (e.clientX - rect.left) + 'px';
          mapTooltip.style.top = (e.clientY - rect.top - 40) + 'px';
        });

        point.addEventListener('mouseleave', () => {
          mapTooltip.style.opacity = '0';
        });
      });
    }
    ```

**Verification**: Hover over each map point (La Plata, Rosario, Córdoba, Neuquén, Rawson). Tooltip should appear with city name and description, follow cursor, and disappear on mouse leave.

---

### Phase 4: JavaScript — Form WhatsApp Redirect

Add form submission that redirects to WhatsApp with the message pre-filled.

- [x] Step 4.1: Add form handler to `main.js`
  - MODIFY `js/main.js` — add inside the `DOMContentLoaded` handler:
    ```javascript
    // FORM → WHATSAPP
    const contactForm = document.querySelector('#contacto form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const tel = contactForm.querySelector('input[type="tel"]').value;
        const mensaje = contactForm.querySelector('textarea').value;

        const text = `Hola, soy ${nombre}.%0AEmail: ${email}${tel ? '%0ATel: ' + tel : ''}%0A%0A${mensaje}`;
        const waURL = `https://api.whatsapp.com/send?phone=542216837979&text=${text}`;
        window.open(waURL, '_blank');
      });
    }
    ```

**Verification**: Fill out the contact form and submit. Should open WhatsApp in new tab with the message pre-filled including name, email, phone (if provided), and message.

---

### Phase 5: CSS Code Quality Cleanup

Consolidate duplicated rules, reduce `!important` usage, and use CSS variables consistently.

- [x] Step 5.1: Replace hardcoded colors with CSS variables
  - MODIFY `css/style.css` — replace hardcoded instances:
    - `#F4A261` → `var(--color-primario)` (where not already)
    - `#264653` → `var(--color-secundario)` (where not already)
    - `#ffffff` / `#fff` → `var(--color-fondo)` (where appropriate)
    - `#333333` / `#333` → `var(--color-texto)` (where appropriate)
    - `#f2f2f2` → new variable `--color-fondo-gris`

- [x] Step 5.2: Consolidate `#galeria` padding declarations
  - MODIFY `css/style.css` — remove the duplicated `#galeria` padding rules, keep one authoritative rule:
    ```css
    #galeria {
      padding: 4rem 0;
      background-color: var(--color-secundario);
      color: var(--color-fondo);
    }
    ```

- [x] Step 5.3: Reduce `!important` usage
  - MODIFY `css/style.css` — remove `!important` where it can be replaced by proper specificity ordering. Keep `!important` only for:
    - Full-width breakout pattern (`.hero`, `#galeria`, `.mapa-section`, `footer` with `width: 100vw !important` and negative margins)
    - The `body` padding pattern

- [x] Step 5.4: Consolidate media queries
  - MODIFY `css/style.css` — merge the 8+ separate `@media (max-width: 768px)` blocks into 2-3 organized blocks at the end of the file, grouped by section.

- [x] Step 5.5: Remove unused `.city-modal` CSS (no modal needed per decision)
  - DELETE the `.city-modal` block from `css/style.css` (lines 1280-1331) since we're only doing tooltips.

**Verification**: Page should render identically to before the cleanup. Check all sections visually. Confirm no layout shifts or missing styles. Count `!important` occurrences — should be significantly reduced.

---

## Success Criteria

- [x] No HTML validation errors (unclosed tags fixed)
- [x] No broken CSS rules (all properties have valid values)
- [x] Map tooltips appear on hover showing city name from `data-info`
- [x] Contact form redirects to WhatsApp with pre-filled message
- [x] Social icons positioned correctly without negative margin hacks
- [x] `!important` count reduced by at least 60%
- [x] No duplicated CSS rule blocks
- [x] Page renders correctly on mobile (375px) and desktop (1440px)

## Notes

- The YouTube embed shows an error in the screenshot (Error 153) — this is likely a valid embed URL issue on YouTube's side, not a code bug. The iframe code itself is correct.
- The `video promo.mp4` file (95MB) exists locally but is not referenced in the HTML.
- No git repository is initialized for this project.
- The `.vscode` directory suggests VS Code is used for development.
