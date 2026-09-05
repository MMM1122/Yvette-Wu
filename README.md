# Portfolio — Chenyu (Yvette) Wu

A one-page living portfolio for a data and software job search in Vancouver, BC. The entire site is built into a single, highly refined HTML file with zero external asset hosting: React, styles, photos, interactive widgets, and Easter eggs all live inside `index.html`.

**Live:** [https://mmm1122.github.io/Yvette-Wu/](https://mmm1122.github.io/Yvette-Wu/)

---

## Why One File

The site is designed to be easily shared, opened offline, and resilient against missing assets or broken CDN links:

| Layer | Implementation |
|---|---|
| React 18 + ReactDOM | Inlined production builds, zero CDN dependencies |
| Styles | Self-contained `<style>` block with dynamic CSS variables |
| Visual Assets | Base64 data URIs embedded directly in the markup |
| Components | Native `React.createElement` (no build step, Babel, or bundlers needed) |
| Footprint | ~880 KB total payload served in a single HTTP request |

The only external dependencies are Google Fonts ([Zen Old Mincho](https://fonts.google.com/specimen/Zen+Old+Mincho) for editorial display and [Public Sans](https://fonts.google.com/specimen/Public+Sans) for body and charts) and an optional Google Apps Script endpoint for the guestbook.

---

## Interactive Details & Easter Eggs

Beyond a clean resume and project showcase, this portfolio weaves in subtle physical and cultural interactions that reflect personality and craft:

* **Dynamic Cursor Lighting & Glow**: Ambient light subtly shifts across the viewport tracking cursor coordinates. Cards and backdrops react with layered depth, specular paper highlights, and realistic edge contours without cluttering legibility.
* **"Open the Door" Portrait Interaction**: Instead of an ordinary headshot gallery, the hero profile is tucked behind a tactile door frame. Click to swing the door open and reveal the portrait beneath, or click again to close it with smooth physics and accessible ARIA states.
* **Interactive Wooden Fish (木鱼 · Pause)**: A calming micro-interaction section before departure. Clicking the wooden fish triggers haptic visual feedback, a gentle percussive tick, and floating "功德 +1 / Merit +1" counters for a brief moment of mindful pause.
* **Scroll & Handscroll (手卷) Art Direction**: Wide viewports reveal a continuous vertical mounted edge running along the page gutter, punctuated by English vertical slip tabs (*Experience*, *Projects*, *Skills*, *About*, *Pause*, *Guestbook*, *Contact*) reminiscent of handscroll title slips (*签条*).
* **Threshold Explorer**: The Credit Default project embeds an active policy slider to demonstrate real-world trade-offs across four cutoffs on a fixed classifier—illustrating precision, recall, and flagged portfolio share in real time.

---

## Sections

1. **Hero** — Name, positioning, cinnabar seal ("yw"), availability badge, and the interactive "Open the door" photo reveal.
2. **At a Glance** — Four headline metrics: professional experience, GPA, degree in progress (UBC BCS, expected 2028), and PR status.
3. **Experience** — Interactive multi-track timeline spanning 2017 to 2028 with unified date formatting across banking risk roles and academic degrees.
4. **Projects** — Collapsible technical case studies showing trade-offs, architecture decisions, and live interactive data widgets.
5. **Skills** — Domain-categorized technical badges (Languages, Machine Learning, Data/Risk, Tools).
6. **About** — Hobbies, outdoor expeditions, guzheng music background, psychology, and volunteering.
7. **Guestbook** — Moderated community board powered by Google Sheets (safe by default).
8. **Contact** — Direct message form alongside GitHub, LinkedIn, and email links.
9. **Pause (木鱼)** — The interactive wooden fish de-stress Easter egg.

---

## Data Structure & Customization

Content is decoupled from the UI markup and organized cleanly into top-level JavaScript arrays:

| Target | Array / Variable |
|---|---|
| Work experience & bullets | `JOBS` |
| Academic history & degrees | `EDU` |
| Multi-track timeline bars | `TIMELINE` (decimal year coordinates, e.g. `2025.0` for Jan 2025) |
| Project deep dives & links | `PROJECTS` |
| Interactive policy metrics | `POLICIES` |
| Skill categories | `SKILLS` |
| Photography assets | `AVATAR`, `SOLO`, `MORAINE` (base64 data URIs) |
| Color palettes & scroll lines | CSS custom variables under `:root` and `[data-theme="light"]` |

---

## Design System & Accessibility

* **Artisanal Palette**: Mineral malachite and deep ink grounds paired with gamboge accents, azurite highlights, and authentic cinnabar red (`#C8503A`) for seals and emphasis markers.
* **Dual Themes**: Tested for WCAG AA contrast on both dark jade and light cream modes, toggleable from the navigation bar.
* **Print Stylesheet**: Strips out dark inks, expands all collapsed project accordions, reveals raw URLs, and formats content into a clean black-and-white resume layout optimized for PDF exports.
* **Accessible Foundation**: Full keyboard navigation support, skip link, polite screen reader updates (`role="status"`), explicit SVG chart semantics (`role="img"`), and a strict `prefers-reduced-motion` fallback that turns off pointer tracking and heavy transitions.

---

## Guestbook Architecture

Messages are dispatched to a serverless Google Apps Script connected to Google Sheets:

* **Moderated by Default**: Incoming submissions default to `approved = FALSE`. The API only retrieves approved rows, preventing unreviewed posts from being fetched.
* **Anti-Spam Controls**: Includes invisible honeypot trap fields, 1-hour duplicate content throttling, and strict string length boundaries (40 characters for names, 500 characters for messages).
* **Demo Sandbox**: Adding `?guestbook=demo` to the query string simulates active posts for design and development checks without needing live backend credentials.

---

## Local Development

No package manager or bundler required. Open `index.html` directly in any modern browser, or serve it locally via:

```bash
python3 -m http.server 8000
