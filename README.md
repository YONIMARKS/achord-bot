# Achord Bot — Custom Webchat Injection

Custom design layer for the Achord webchat (Botpress v3.6 + Framer + Heebo Hebrew RTL).

## Usage in Framer

Replace the 4-5 custom code blocks (`aChord v7 base`, `aChord v7 messages`, `aChord v7 behaviors`, `aChord v7 patches`, `aChord fix`) with **one** code block containing:

```html
<script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/inject.js"></script>
```

Replace `USERNAME` and `REPO` with the GitHub path.

## Cache busting during development

jsDelivr caches `@main` for up to 7 days. To force a refresh after a `git push`, hit:

```
https://purge.jsdelivr.net/gh/USERNAME/REPO@main/inject.js
```

Then hard-reload the page (`Cmd+Shift+R`).

For production stability, tag releases (`git tag v22.0.0 && git push --tags`) and use `@v22.0.0` instead of `@main`.

## What it injects

| Layer | Purpose |
|---|---|
| BASE_CSS | Chat container, header, FAB, expand button, sizing 420×636 |
| MSG_CSS | Message bubbles (10px radius), composer (no inner border, full-width input, send always visible), scroll-to-bottom on left |
| WELCOME_CSS | Welcome panel styling above the message list |
| FIX_CSS | Dropzone overlay hide, pointer-events restore |
| AVATAR_SVG | Brand bot icon (Asset 1) in header — 41×38, opacity 0.54, no circle |
| CLOSE_PATH | Figma ✕ glyph (ib.svg) |
| RESTART_PATH | Figma ⟲ icon (ib-1.svg) |
| SEND_ARROW | Figma ← arrow inside send button |
| Welcome panel JS | Title + paragraph + 5 chips ordered per Figma. Removes on first user message, rebuilds after restart. |
| Localization | Botpress dialog strings → Hebrew |

## Version

22.0.0 — first GitHub-hosted release. Replaces the v18-v21 series.

## Structure

```
inject.js         Single entry point loaded by jsDelivr
README.md         This file
```

Keep this minimal — one file per release is the simplest cache story.
