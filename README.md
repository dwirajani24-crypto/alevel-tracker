# A-Level Topic Tracker

A single-page, installable web app for tracking A-Level revision progress across **Computer Science**, **Maths**, **Further Maths**, and **Economics**.

No build tools, no dependencies to install — it's plain HTML, CSS (via Tailwind's CDN build) and vanilla JavaScript in one file, designed to be hosted for free on GitHub Pages and installed as a full-screen app on iPad and iPhone.

## What it does

- **Full UK A-Level spec topic lists** for all four subjects, pre-loaded and organised by year and term (or by week block, for Economics).
- **Four-stage status tracking** per topic: `Not Started` (grey) → `Learning` (orange) → `Revising` (yellow) → `Confident` (green).
  - Tap anywhere on a topic row to cycle to the next status.
  - Or use the coloured dropdown pill directly on the row to jump straight to a specific status.
- **Progress bars & percentages** for each subject, plus an overall progress ring and breakdown at the top of the app.
- **Notes per topic** — tap the note icon to expand a small text box (e.g. "redo past paper Q4") that saves as you type.
- **Search bar** that filters topics live across the current subject, auto-expanding any term/week block that contains a match.
- **Swipe between subjects** on touch devices, or use the tab strip at the top.
- **Everything saves automatically** to your device via `localStorage` — close the app or lock your iPad and your progress is exactly as you left it.
- **Works offline** once it's been opened once, via a service worker that caches the app shell.

## Files in this project

```
alevel-tracker/
├── index.html               # The entire app: markup, styles, topic data, and logic
├── manifest.json             # PWA manifest (app name, colours, icons)
├── sw.js                     # Service worker for offline caching
├── icons/
│   ├── icon-192.png          # App icon, 192×192
│   ├── icon-512.png          # App icon, 512×512
│   └── icon-512-maskable.png # Maskable icon (512×512) for Android adaptive icons
└── README.md
```

## Hosting it on GitHub Pages

1. Create a new GitHub repository (public or private both work with GitHub Pages on a paid plan; public is required on the free plan).
2. Add all the files above to the repository, keeping the `icons/` folder structure intact, and push to the `main` branch.
3. In your repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then click **Save**.
6. GitHub will give you a URL that looks like:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```
   It can take a minute or two to go live the first time.

That's it — no build step, no `npm install`, nothing else to configure.

> **Note on paths:** the app uses relative paths (`./manifest.json`, `./icons/...`, `./sw.js`), so it works whether it's hosted at the root of a domain or in a subfolder like `/your-repo-name/` on GitHub Pages.

## Installing on iPad / iPhone ("Add to Home Screen")

1. Open your GitHub Pages URL in **Safari** on the iPad or iPhone (it must be Safari — other browsers on iOS can't install PWAs to the Home Screen).
2. Tap the **Share** icon (the square with an arrow pointing up) in the toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm the name (defaults to "Topic Tracker") and tap **Add**.
5. The app icon now appears on your Home Screen. Opening it launches the tracker **full-screen**, with no browser address bar, exactly like a native app.

Because the service worker caches the app shell the first time you visit, it will keep working even with no signal — handy for revising on the train or somewhere with patchy Wi-Fi.

## Installing on Android

Open the site in Chrome, tap the **⋮** menu, then **Add to Home screen** (or look for the automatic "Install app" prompt/banner).

## Editing the topics later

All topic data lives in one place near the top of the `<script>` block in `index.html`, in a `SUBJECTS` array. Each subject looks like this:

```js
{
  id: 'economics',
  name: 'Economics',
  short: 'Economics',
  color: '#F59E0B',
  colorSoft: '#FDF3E3',
  sections: [
    { label: 'Weeks 1 – 15', groups: [ { label: null, items: [
      '1.1 Nature of Economics',
      // ...add or remove topic strings here
    ] } ] },
    // ...add or remove whole sections here
  ],
}
```

- To **rename or add a topic**, edit or add a string inside an `items` array.
- To **add a new term/week block**, copy a `{ label: ..., groups: [...] }` entry inside `sections`.
- To **add a whole new subject**, copy a whole subject object into the `SUBJECTS` array and give it a unique `id`.
- To **re-theme the status colours**, edit the four `--status-*` CSS variables near the top of the `<style>` block.

⚠️ One thing to know: each topic's saved progress is keyed off its position in the data (subject index, section index, group index, item index), not its text. If you **reorder or delete** topics/sections rather than only adding to the end, previously-saved statuses can end up attached to the wrong topic. Renaming a topic's text in place, or adding new topics at the end of a list, is always safe.

## Resetting your progress

There's no in-app reset button by design (to avoid an accidental wipe before an exam). If you ever want a clean slate, open your browser's developer tools on the page and run:

```js
localStorage.removeItem('alevel-tracker-data-v1');
```

then reload the page.
