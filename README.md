**Live:** [https://mmm1122.github.io/Yvette-Wu/](https://mmm1122.github.io/Yvette-Wu/)

# Yvette Wu · Personal Portfolio

A personal portfolio with a résumé at its heart, a lotus pond in the margins, and a few small discoveries along the way.

I'm Chenyu (Yvette) Wu, a computer science student at UBC with three years of credit risk and data experience at HSBC and RBC. This website brings together my experience, education, projects, and skills, with a little room for the person behind the résumé.

I wanted visitors to find the essentials easily: what I have worked on, what I am learning, and how I approach problems. Along the way, they can open a window, notice light moving across a project card, or tap a wooden fish before leaving. These details give the site a sense of personality while keeping the focus on my work.

## Design direction

The visual language draws from a Chinese handscroll: serif typography, a small vermilion name seal, fine dividing lines, and generous space. Pale blue-green lotus leaves and soft pink flowers frame the page.

Every fresh visit starts in **Light mode**, with a manual switch to dark mode. Experience, projects, and contact information remain easy to find. Motion stays at the edges or responds to a deliberate interaction, and visitors choose whether to turn on sound.

## Small details, deliberate choices

### Open a window to meet me

The portrait on the first screen sits behind a pair of shutters. Clicking opens them outward, brightens the photograph, and lets a sweep of warm light pass across it. Clicking again closes the window.

I wanted the portrait to feel like a small invitation. Opening it gives the visitor a part in the introduction, echoing the message on the window: **“Come say hello.”**

### Light that follows the cursor

On desktop, a soft highlight follows the cursor across each project card, accompanied by a slight perspective tilt. When the cursor leaves, the card returns to rest.

The effect gives the surface the feel of paper catching the light. It is enabled only on devices with a fine pointer and hover support, when reduced motion is not requested.

### A lotus pond in the margins

The background takes inspiration from Chinese ink wash and watercolor: translucent blue-green leaves, delicate veins, pale pink petals, and open water.

The artwork sits around the edges, leaving the center clear for reading. Its low opacity and slow movement give the pond a faint sense of life. The same setting connects the ripples, koi, and quieter interactions elsewhere on the page.

### One quiet koi and a little rain

A single small koi swims in the space outside the main content. Its muted color and low opacity keep it subtle, while sparse raindrops form slowly expanding ripples along the sides.

The koi becomes slightly active when the visitor scrolls, then gradually settles as they stop to read. It becomes a little livelier near the wooden fish section at the bottom. Its drawing area is clipped to the outer margin, and the decorative layers do not intercept clicks.

This restraint is intentional: the fish is a companion to discover occasionally. In the current version, it does **not** chase the cursor through the résumé. The **Pause pond / Resume pond** button lets visitors stop or resume the pond animation.

### A wooden fish before you go

At the bottom of the page, **“A little pause.”** invites visitors to tap a wooden fish, or *muyu* (木鱼), a traditional wooden percussion instrument.

Each tap brings the mallet down, gives the wooden fish a small bounce, and produces a ripple with **“功德（updated to Offer) +1 / Merit +1.”** The knock is synthesized in the browser, with its own sound toggle. Keyboard users can focus the instrument with Tab and tap with Space or Enter.

I placed this Easter egg after the résumé content as a lighthearted way to end the visit, and as a small reference to my cultural background.

<details>
<summary>One more Easter egg, for a little patience</summary>

A plant beside the wooden fish gradually appears as the tap count grows:

- **10 taps:** a small leaf begins to emerge.
- **30 taps:** more of the plant is revealed.
- **50 taps:** the full illustration appears, completing its little bloom.

The count lasts for the current page visit and resets on refresh.

</details>

### A soundtrack you can choose

The background track is **《氤氲之森》 by CMJ**, chosen to accompany the quiet atmosphere of the pond.

Music is **off by default**. The **Play music / Pause music** button starts or pauses the track. Playback begins at 18% volume, loops, and resumes from the same position after a pause.

The current version embeds the MP3 directly in the page, so there is no external video player to open. Background music and wooden fish sounds have separate controls.

## Reading and interaction

- **Résumé first:** experience, projects, skills, and contact information form the main structure.
- **Responsive layout:** content and navigation adapt to the screen; cursor effects run only on suitable devices.
- **Motion preferences:** the site responds to `prefers-reduced-motion`, reducing or disabling relevant animations and leaving the koi still.
- **Keyboard support:** the portrait window, wooden fish, theme switch, and music controls use buttons with focus indicators and accessible labels.
- **Print styles:** decorative pond layers, music controls, and the wooden fish section are hidden when printing, keeping the main content in focus.

## Implementation

The current site is a standalone **`index.html`**. It can be opened directly without installing dependencies or running a build.

- **React** organizes the portfolio content, portrait window, and wooden fish interactions.
- **CSS** provides the light and dark themes, handscroll styling, shutter perspective, lighting effects, and responsive layout.
- **Canvas 2D** renders the koi and rain ripples. Small offsets between image slices give the fish its gentle tail movement.
- **Web Animations API and Web Audio API** coordinate the mallet, wooden fish bounce, and synthesized percussion sound.
- **HTML Audio** handles the embedded MP3, including playback, pause, and looping.
- **IntersectionObserver** supports navigation indicators and section reveal effects.

Images, illustrations, music, and the React runtime are embedded in the HTML, making the site convenient to save and share as one file. The tradeoff is a larger file size. Fonts load through Google Fonts, with system font fallbacks when unavailable.

## View locally

Download the repository and open `index.html` in a browser. The page starts in Light mode with music off.

## Credits

- **Background music:** **CMJ —《氤氲之森》**. [Listen on YouTube Music](https://music.youtube.com/watch?v=0Sx-55iSBzg).
- **Pond artwork:** AI-assisted illustrations inspired by supplied lotus and koi references, integrated with the page layout and animation.
- **Fonts:** Public Sans and Zen Old Mincho.

## Contact

[Email](mailto:yvettewu2017@gmail.com) · [LinkedIn](https://www.linkedin.com/in/chenyu-yvette-wu/) · [GitHub](https://github.com/MMM1122)
