# Kohinoor Caterer

Website for **Kohinoor Caterer** (Indian Kohinoor Food Ltd), an Asian caterer for weddings, private events and corporate functions across Leicester and the Midlands.

It is a static site: plain HTML, CSS and JavaScript with no build step or framework.

## Pages

| Page | File | What it is |
|---|---|---|
| Home | `index.html` | Holding page with the brand film, contact details and a link to the About page |
| About | `about.html` | How an event comes together, told in three acts named after the logo's tagline: **Inspire**, **Create** and **Deliver** |

## Project structure

```
index.html              Home page
about.html              About page
assets/
  css/style.css         Home page styles
  css/about.css         About page styles (design tokens at the top)
  js/script.js          Home page animation (GSAP + Splitting, loaded from CDN)
  js/about.js           About page behaviour (no libraries)
  fonts/                Self-hosted Cormorant Garamond and Jost (variable WOFF2, Latin subset)
  images/               Logo, favicon and source photos
  images/about/r/       Resized AVIF/WebP images used by the About page
  video/                Brand film (used on both pages)
```

## Running locally

Serve the folder over HTTP. Opening the files directly (`file://`) blocks the self-hosted fonts.

```bash
npx http-server -c-1
```

Then open `http://localhost:8080/about.html`.

`python3 -m http.server` also works, but it doesn't support range requests, so the About page video can't jump to its start point.

## About page notes

### Design system
- All colours, type sizes, spacing and motion timings are CSS custom properties at the top of `assets/css/about.css`.
- Colours are written as a hex fallback followed by an OKLCH value.
- The layout uses a 4 / 8 / 12-column grid at 360 / 768 / 1024px and up.

### Behaviour (`assets/js/about.js`)
- **Cue light:** on screens 1024px and wider, a small gold diamond in the left margin counts through the six steps as you scroll. At the end it moves into the call button.
- **Video:** the Deliver section loads the brand film only when you reach it, plays only its 17–34 second segment, and pauses when off-screen. It never autoplays for visitors who have asked their device to reduce motion, or who have data saver on.
- **Reduced motion:** visitors who have asked their device to reduce motion see every state change instantly, with nothing moving or fading.

### Hidden content waiting for real facts
Some content is in the HTML but hidden until the real information is available. Each item has a `hidden` attribute and a comment explaining it:

- **Interval:** the largest number of guests served at one event.

To show an item, replace its `[NEEDED: …]` text with the real content, then delete `hidden` from that element.

### Replacing or adding photos
The page uses responsive images from `assets/images/about/r/` in AVIF and WebP at two or three widths each. To add a photo:
1. Generate the same formats and widths (for example with [sharp](https://sharp.pixelplumbing.com/)).
2. Update the `srcset`, `width` and `height` in `about.html`.

Keep the `width` and `height` attributes, because they prevent the layout from shifting while images load.

## Browser support

The site works in all current browsers. Two About page features only apply where the browser supports them, and the page works fully without them:
- the spring easing on the final cue-light move (CSS `linear()`)
- `text-wrap: pretty`

## Contact

61 London Road, Leicester LE2 0PE · 07777 246 444 · 0116 255 1300 · sales@kohinoorcaterer.com

© 2026 Indian Kohinoor Food Ltd (09070285), trading as Kohinoor Caterer.
