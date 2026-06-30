# A Little Place For You

A handcrafted, animated digital gift website — letters, a gallery, and a final cinematic message.

## How to use

Open `index.html` in any browser (or upload the whole folder to any static host — Netlify, GitHub Pages, Vercel, etc).

## How to edit

**Letters** — edit `js/letters-data.js`. Each entry has:
- `title` — envelope label
- `body` — the letter text (separate paragraphs with a blank line)
- `image` — optional, path/URL to an image (currently filled with placeholder photos from picsum.photos — replace with paths into `assets/images/`)
- `video` — optional, path/URL to a video file (currently empty — point at a file in `assets/images/` or `assets/audio/` once you have one)
- `audio` — optional, path/URL to an mp3 voice note (the "hug" letter currently has a placeholder sample track — replace with your own in `assets/audio/`)
- `spotify` — optional, paste a Spotify embed URL (Share → Embed)

> **Note:** all images/audio right now are temporary placeholders (picsum.photos photos + a sample track) just so the site is fully functional out of the box. Swap them out for your real photos, voice notes, and videos whenever you're ready — just replace the URL/path in `letters-data.js` and `gallery-data.js` with a file from your `assets/` folder, e.g. `"assets/images/photo-01.jpg"`.

**Gallery** — edit `js/gallery-data.js`. Add/remove entries, point `src` at files in `assets/images/`, and set an optional handwritten `caption`.

**Final message** — the last entry in `js/letters-data.js` (id: "last") powers the cinematic closing screen. Edit `body` and `signature` there.

## Folders

```
index.html
gallery.html
assets/
  images/   <- photos & envelope images
  audio/    <- voice note mp3s
  spotify/  <- (optional) keep embed links/notes here
css/
  style.css
js/
  letters-data.js   <- edit letter content here
  gallery-data.js   <- edit gallery photos here
  main.js
  gallery.js
```

No build step, no backend, no database — just static files you can keep editing forever.
