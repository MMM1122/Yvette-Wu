# Portfolio — Chenyu (Yvette) Wu

A one-page portfolio for a data and software job search in Vancouver, BC. The whole
site is a single HTML file with no build step and no external asset hosting: React,
styles, photos and all content live inside `index.html`.

**Live:** https://mmm1122.github.io/Yvette-Wu/

---

## Why one file

The site has to be easy to hand over, easy to open offline, and impossible to break
by a missing asset. Everything is inlined:

| | |
|---|---|
| React 18 + ReactDOM | inlined production builds, no CDN |
| Styles | one `<style>` block, CSS custom properties for theming |
| Photos | three JPEGs as base64 data URIs (~700 KB total, recompressed from 6 MB) |
| Components | plain `React.createElement`, no JSX, so no Babel or bundler |
| Total | ~880 KB, one HTTP request |

The only external dependencies are Google Fonts (Fraunces + Public Sans) and, if the
guestbook is switched on, a Google Apps Script endpoint.

## Sections

1. **Hero** — name, one-line positioning, and an availability card stating permanent
   resident status, what roles are wanted, and location. This is the part written for
   a recruiter's first ten seconds.
2. **At a glance** — four facts: years of experience, GPA, degree in progress, PR status.
3. **Experience** — an interactive study/work timeline (2017–2028); selecting a bar
   scrolls to that entry and highlights it. Work and education entries below.
4. **Projects** — three projects, each collapsed to a title, three headline figures and
   links. Expanding one shows the technical decisions and their trade-offs. The credit
   default project includes a threshold explorer: four decision cutoffs on one fixed
   classifier, showing how recall, precision and share-of-book flagged move together.
5. **Skills** — four groups as scannable chips.
6. **About** — travel, psychology, guzheng, detective stories, plus volunteer work.
7. **Guestbook** — public messages, hidden until connected (see below).
8. **Contact** — a private message form, plus email, LinkedIn and GitHub.

## Editing content

All copy lives in data arrays at the top of the script block, not in markup. Find the
array, edit the strings, save.

| What to change | Where |
|---|---|
| Jobs and bullets | `JOBS` |
| Degrees | `EDU` |
| Timeline bars | `TIMELINE` (`start` / `end` are decimal years, e.g. `2024.17` = March 2024) |
| Projects, figures, tags, links | `PROJECTS` |
| Skill groups | `SKILLS` |
| Threshold explorer data | `POLICIES` |
| Photos | `AVATAR`, `SOLO`, `MORAINE` (base64 data URIs) |
| Colours, spacing, type | CSS custom properties under `:root` and `[data-theme="light"]` |

## Themes and printing

Dark green by default, with a toggle in the top bar for a light green theme. Both
palettes were checked against WCAG AA: body text is 16.4:1 on dark and 15.2:1 on
light; the faintest supporting text is 5.9:1 and 4.4:1.

A print stylesheet turns either theme into black on white, hides the navigation and
photos, expands every collapsed project so nothing is lost, and appends full URLs
after the contact links. Recruiters who save the page as a PDF get a readable
document rather than a page of dark ink.

## Guestbook

Public messages, stored in a Google Sheet through a Google Apps Script web app. No
server, no database, and visitors do not need an account to post.

While `GUESTBOOK_API` is an empty string the entire section and its nav link stay
hidden, so the page never shows an empty board. To preview the layout before
connecting anything, open the page with `?guestbook=demo`.

Setup instructions are in the header of [`guestbook-apps-script.gs`](guestbook-apps-script.gs).
In short: create a sheet with `date | name | message | approved` columns, paste the
script into Extensions > Apps Script, deploy it as a web app with access set to
*Anyone*, and paste the `/exec` URL into `GUESTBOOK_API`.

Protections in place:

- **Moderation by default.** New messages arrive with `approved = FALSE` and stay
  invisible. The endpoint only ever returns approved rows, so unapproved messages
  cannot be read even by calling it directly.
- **Honeypot field** — hidden from people, filled in by bots; those submissions are
  silently dropped and reported as successful so the bot does not retry.
- **Duplicate guard** — an identical message within an hour is rejected, which covers
  double-clicks and the simplest flooding.
- **Length caps** — 40 characters for a name, 500 for a message, enforced on both the
  client and the server.
- **Email notification** on each new post, so moderation does not depend on
  remembering to check the sheet.

Loading, empty, and failed states are all written out; the failure state offers a
retry rather than leaving a blank space.

## Accessibility

- Skip link, visible keyboard focus rings, and `aria-current` on the active nav item.
- The timeline is a keyboard-reachable group of buttons with descriptive labels.
- Chart bars carry `role="img"` and a text label, so their values are not conveyed by
  colour and width alone.
- Form status messages use `role="status"` and `aria-live="polite"`.
- `prefers-reduced-motion` disables all animation and smooth scrolling.
- Responsive to 390 px; the timeline scrolls horizontally rather than compressing.

## Local development

No toolchain. Open `index.html` in a browser and edit it in any text editor.

One caveat: some browsers block network requests from `file://` pages, so the
guestbook may not load locally even when correctly configured. Test it on GitHub
Pages.

## Credits

Layout and structure inspired by [Soumyajit's Portfolio](https://github.com/soumyajit4419/Portfolio).
Type is [Fraunces](https://fonts.google.com/specimen/Fraunces) and
[Public Sans](https://fonts.google.com/specimen/Public+Sans). The GitHub mark comes
from [Simple Icons](https://simpleicons.org) (CC0).

Photos are my own.
