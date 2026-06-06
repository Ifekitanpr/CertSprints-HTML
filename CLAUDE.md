# CertSprints HTML Prototype — Project Rules

## Stack
Plain HTML + CSS + vanilla JS. No build step, no frameworks, no Tailwind.
All screens live in `web/`. Shared styles in `web/css/app.css`. Per-screen CSS in `web/css/<screen>.css`.

---

## Icon library — check before downloading (MANDATORY, no exceptions)

All project icons live in `web/assets/icons/`. The registry `web/assets/icons/ICONS.md` lists every icon with its viewBox and glyph dimensions.

### Workflow for every new icon needed

1. **Check `ICONS.md` first.** Search by icon name. If it exists → use `assets/icons/<file>` directly. Done.
2. **Only download if absent.** If the icon is genuinely new, download it to `web/assets/icons/` (never into screen-specific sub-folders).
3. **Fix and document.** After download:
   - Run `sed -i '' 's/preserveAspectRatio="none"/preserveAspectRatio="xMidYMid meet"/g' <file>.svg`
   - Read the `viewBox` and add a row to `ICONS.md`.

### Do NOT
- Download an icon that already exists in `ICONS.md` — even if you are working on a new screen.
- Save icons to screen-specific folders (`blurting-canvas/icons/`, `retrieval-sprint/icons/`, etc.). Those are legacy locations from before this rule existed.
- Download multiple variants of the same icon (e.g. `arrow-right-active.svg`, `arrow-right-disabled.svg`) — one file, drive state with CSS.

### Referencing icons in HTML
Always reference from the shared library:
```html
<span class="sc-icon-slot sc-icon-slot--24">
  <img class="sc-glyph sc-glyph--help-circle-24"
       src="assets/icons/help-circle-24.svg" alt=""/>
</span>
```

---

## Figma icons — frame vs glyph (MANDATORY, no exceptions)

When implementing icons from Figma exports, **never force the `<img>` to the frame/slot dimension**. Figma filenames like `close-24.svg` name the *container*, not the drawable artwork.

### The rule

| Concept | What it is | How to size it |
|---|---|---|
| **Frame / slot** | The button, pill, or icon-slot div | CSS `width`/`height` on the wrapper |
| **Glyph / artwork** | The actual SVG paths | Read `viewBox` → use those px values on the `<img>` |

Figma-exported SVGs commonly ship with `preserveAspectRatio="none"` and `width="100%" height="100%"`. Forcing them into a square slot stretches the artwork. **Always fix `preserveAspectRatio` to `xMidYMid meet` when downloading Figma assets.**

### Pattern (copy this every new screen)

```html
<!-- slot wrapper -->
<span class="sc-icon-slot sc-icon-slot--24">
  <img class="sc-glyph sc-glyph--arrow-left-24"
       src="assets/screen/icon-arrow-left.svg" alt=""/>
</span>
```

```css
/* slot — matches Figma frame size */
.sc-icon-slot        { display: grid; place-items: center; flex-shrink: 0; }
.sc-icon-slot--16    { width: 16px;  height: 16px;  }
.sc-icon-slot--20    { width: 20px;  height: 20px;  }
.sc-icon-slot--24    { width: 24px;  height: 24px;  }

/* glyph — all Figma glyphs share these base rules */
.sc-glyph {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  max-width: none;   /* never let global img rules crush glyphs */
  max-height: none;
}

/* glyph dimensions = viewBox w × h, e.g. viewBox="0 0 13.5 7.29" */
.sc-glyph--arrow-left-24 { width: 11.5px; height: 17.3px; }
```

### Checklist for every new icon

1. `cat` the SVG → read `viewBox="0 0 W H"` → that's the glyph size.
2. Add `.sc-glyph--<name> { width: Wpx; height: Hpx; }` in the screen CSS.
3. Run `sed -i '' 's/preserveAspectRatio="none"/preserveAspectRatio="xMidYMid meet"/g'` on every downloaded Figma SVG.
4. Never put `width: 24px; height: 24px` directly on the `<img>` for a Figma icon.
5. Never rely on `img { max-width: 100% }` for glyphs — it breaks non-square slots.

### Do NOT
- Use `width="24" height="24"` on `<img>` for Figma exports (stretches non-square glyphs).
- Skip the slot wrapper — centering requires it.
- Assume the filename suffix (`-24`, `-16`) is the rendered glyph size.

### Reference implementations
`web/css/practice-exam.css`, `web/css/community.css`, `web/css/scenario-sorting.css`, `web/css/risk-cycle-sequencer.css` — all follow the `<screen>-icon-slot` + `<screen>-glyph` + `<screen>-glyph--<name>` pattern.

---

## Bottom sheets / overlays

- **Never use the `hidden` HTML attribute** to toggle a bottom sheet — it sets `display:none` which kills CSS transitions.
- Use `aria-hidden="true/false"` toggled via JS, and drive visibility with CSS selectors:
  ```css
  .sheet { transform: translateY(100%); transition: transform 360ms cubic-bezier(.22,1,.36,1); pointer-events: none; }
  .sheet[aria-hidden="false"] { transform: translateY(0); pointer-events: auto; }
  ```
- Always give the shell wrapper a white `background` and `padding-bottom: 24px` to fill the home-indicator gap at the bottom of the screen.
- Use the brand gradient border (not solid blue):
  ```css
  background: linear-gradient(#fff,#fff) padding-box,
              linear-gradient(135deg,#007bff 0%,#ffbba2 56%,#133f75 100%) border-box;
  border: 1.5px solid transparent;
  ```

---

## Screen shell pattern

Every screen uses this outer wrapper (matches the 390×844 phone frame):

```html
<main class="phone-case" aria-label="CertSprints — Screen Name">
  <div class="case-shell">
    <div class="sc" id="sc">          <!-- sc = screen prefix -->
      <div class="cert-bg" aria-hidden="true"></div>
      <div class="sb"></div>          <!-- 40–44px status bar spacer -->
      <!-- views / content -->
      <div class="home-ind"><div class="home-bar"></div></div>
    </div>
  </div>
</main>
```

Status bar spacer: `.sb { flex-shrink: 0; height: 44px; }` (lesson-player style) or `40px` (dashboard style).

---

## Top padding on sub-screens (settings, community, etc.)

Sub-screens that don't use the standard injected header need `padding-top: 48px` on their nav bar (= 40px status bar + 8px nav padding). Without it, content collides with the notch area.

---

## Navigation patterns

- Back button: always `assets/icons/arrow-left-02.svg` (20×20 glyph in a 40×40 pill).
- Never use `position: sticky` on a nav bar inside `dashboard-scroll` — it floats visually.
- For sub-screens (settings pages, etc.): nav = `[back pill] [centered title] [phantom 40px spacer]`.

---

## Brands colors (quick ref)

| Token | Hex |
|---|---|
| Primary Blue | `#007bff` |
| Trust Navy | `#133f75` |
| Brand Orange | `#ffbba2` |
| Gray 90 | `#0f172a` |
| Gray 70 | `#334155` |
| Gray 50 | `#64748b` |
| Gray 20 | `#e2e8f0` |
| Gray 10 | `#f1f5f9` |
