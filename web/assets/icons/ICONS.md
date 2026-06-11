# CertSprints Icon Registry

**Canonical location:** `web/assets/icons/`

> **Before downloading any icon, check this file.** If the icon exists here, use it directly with the path `assets/icons/<filename>`. Only download new icons when they are genuinely absent from this list.

## Mock Exam

| File | viewBox | Intended render size | Usage |
|---|---|---|---|
| `mock-tv-orange.svg` | `0 0 14.3333 13.0001` | 16 × 16 px | Desktop-required badge |
| `mock-tv-blue.svg` | `0 0 22.4 20.1002` | 24 × 24 px | Exam in-progress status |
| `mock-mail-orange.svg` | `0 0 17.9167 15.4167` | 20 × 20 px | Sent email address |
| `mock-mail-white.svg` | `0 0 18.1667 15.6667` | 20 × 20 px | Primary email action |
| `mock-mail-blue.svg` | `0 0 18.1667 15.6667` | 20 × 20 px | Secondary email action |
| `mock-mail-block.svg` | `0 0 22.4 20.1` | 24 × 24 px | Link-send error |
| `mock-hourglass.svg` | `0 0 17.8 21.8` | 24 × 24 px | Waiting for desktop |
| `mock-checkmark-badge.svg` | `0 0 29.8667 29.8667` | 30 × 30 px | Results ready/completed |
| `mock-tick.svg` | `0 0 10.3333 8.33333` | 14–16 px | Correct status |
| `mock-cancel.svg` | `0 0 10.3333 10.3333` | 14–16 px | Incorrect status |
| `mock-minus-circle.svg` | `0 0 14.3333 14.3333` | 16 × 16 px | Unattempted total |
| `mock-eye.svg` | `0 0 18.1667 16.5` | 20 × 20 px | Detailed question review |
| `mock-certificate.svg` | `0 0 16.5 18.1669` | 20 × 20 px | View certificate |
| `mock-download.svg` | `0 0 13.1667 13.1667` | 20 × 20 px | Download certificate |
| `mock-share.svg` | `0 0 16.5 18.1667` | 20 × 20 px | Share certificate |
| `mock-book-open.svg` | `0 0 16.5 15.2702` | 18 × 18 px | Answer explanation |
| `mock-chevron-down.svg` | `0 0 13.5 7.29289` | 14 × 8 px | Review accordion |
| `mock-tick-small.svg` | `0 0 13.6669 11.1669` | 14 × 14 px | Correct answer label |
| `mock-info.svg` | `0 0 18.06 18.06` | 20 × 20 px | Certificate information |

When you add a new icon:
1. Download to `web/assets/icons/` (never to screen-specific folders).
2. Run `sed -i '' 's/preserveAspectRatio="none"/preserveAspectRatio="xMidYMid meet"/g' <file>.svg`
3. Read the `viewBox` from the SVG — that gives your glyph width × height.
4. Add a row to this table.

---

## Navigation & Arrows

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `arrow-left-01.svg` | 0 0 24 24 | 24 × 24 px | Standard left arrow |
| `arrow-left-02.svg` | 0 0 24 24 | 24 × 24 px | Round-cap left arrow — **use for all nav back buttons** |
| `arrow-left-figma-24.svg` | 0 0 11.5 17.293 | 11.5 × 17.293 px | Figma export (up-arrow, needs `rotate(-90deg)`) |
| `arrow-right-01.svg` | 0 0 24 24 | 24 × 24 px | Standard right arrow |
| `arrow-right-02.svg` | 0 0 24 24 | 24 × 24 px | Round-cap right arrow |
| `arrow-right-figma-20.svg` | 0 0 10.333 15.161 | 10.333 × 15.161 px | Figma export (up-arrow, needs `rotate(-90deg) scaleX(-1)` to point right) — used in CTA buttons |
| `arrow-up-right-16.svg` | 0 0 9.5 9.5 | 9.5 × 9.5 px | Diagonal arrow for delta/trend indicators |
| `arrow-down-double-blue-20.svg` | 0 0 10.8 11.6 | 10.8 × 11.6 px | Down arrow — blue variant |
| `arrow-down-double-orange-20.svg` | 0 0 17.333 19.834 | 17.333 × 19.834 px | Down arrow — orange variant |
| `arrow-down-double-teal-20.svg` | 0 0 10.8 11.6 | 10.8 × 11.6 px | Down arrow — teal variant |
| `square-arrow-expand-01.svg` | 0 0 24 24 | 24 × 24 px | Expand/fullscreen |

---

## UI Controls & Interaction

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `menu-01.svg` | 0 0 17.5 15.5 | 17.5 × 15.5 px | Hamburger menu — module quiz nav |
| `flag-03.svg` | 0 0 12.168 13.5004 | 12.168 × 13.5004 px | Flag / bookmark — question flag state |
| `reload-16.svg` | 0 0 13.667 15.667 | 13.667 × 15.667 px | Reload / refresh — 16 slot |
| `reload-20.svg` | 0 0 17.333 19.834 | 17.333 × 19.834 px | Reload / refresh — 20 slot |
| `drag-left-03-20.svg` | 0 0 16.4 17.2 | 16.4 × 17.2 px | Drag handle — horizontal |
| `horizontal-drag-drop-24.svg` | 0 0 14.5 10.5 | 14.5 × 10.5 px | Drag-drop icon |
| `touchpad-02-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Tap / swipe gesture hint |
| `divider-16.svg` | 0 0 16.834 1 | 16.834 × 1 px | Thin horizontal rule |
| `camera-02.svg` | 0 0 21.5 21.5 | 21.5 × 21.5 px | Camera |
| `camera-rotated-01.svg` | 0 0 17.9676 17.9678 | 17.9676 × 17.9678 px | Switch camera |
| `stop.svg` | 0 0 17.5 17.5 | 17.5 × 17.5 px | Stop recording |
| `pause.svg` | 0 0 14.625 14.625 | 14.625 × 14.625 px | Pause recording |

---

## Status & Feedback

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `checkmark-circle-02-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Filled checkmark — completed state |
| `checkmark-circle-03-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Outlined checkmark — answer revealed |
| `tick-02-20.svg` | 0 0 13.167 10.667 | 13.167 × 10.667 px | Small tick — dark |
| `tick-01-20-white.svg` | 0 0 13.667 11.167 | 13.667 × 11.167 px | Small tick — white |
| `tick-02-17.svg` | 0 0 10.764 8.681 | 10.764 × 8.681 px | Extra-small tick |
| `tick-double-01-20.svg` | 0 0 16.4 10 | 16.4 × 10 px | Double tick |
| `task-done-02-20.svg` | 0 0 16.4 17.2 | 16.4 × 17.2 px | Task complete icon |
| `checkbox-checked-20.svg` | 0 0 18.333 18.333 | 18.333 × 18.333 px | Checkbox — checked |
| `thumbs-up-20.svg` | 0 0 18.167 15.667 | 18.167 × 15.667 px | Thumbs-up positive feedback |
| `feedback-ring-outer.svg` | 0 0 32 32 | 32 × 32 px | Feedback ring — outer ring |
| `feedback-ring-inner.svg` | 0 0 32 32 | 32 × 32 px | Feedback ring — inner indicator |
| `star.svg` | 0 0 17.9191 17.9179 | 17.9191 × 17.9179 px | Rating star |
| `comment-01.svg` | 0 0 17.9167 17.0833 | 17.9167 × 17.0833 px | Comment / written feedback |

---

## Learning & Content

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `ai-brain-03-20.svg` | 0 0 18.167 18.167 | 18.167 × 18.167 px | AI / brain icon |
| `bulb-charging-16.svg` | 0 0 11.667 14.333 | 11.667 × 14.333 px | Hint / lamp icon — 16 slot |
| `bulb.svg` | 0 0 24 24 | 24 × 24 px | Lightbulb — 24 slot |
| `sparkles-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Sparkles / tip — 16 slot |
| `sparkles.svg` | 0 0 24 24 | 24 × 24 px | Sparkles — 24 slot |
| `flash-16.svg` | 0 0 10.333 14.333 | 10.333 × 14.333 px | Flash / lightning bolt — 16 slot |
| `figma-flash.svg` | 0 0 12.916 17.916 | 12.916 × 17.916 px | Flash — Figma variant |
| `figma-start-up.svg` | 0 0 16.503 16.503 | 16.503 × 16.503 px | Start-up / rocket |
| `book-open-01.svg` | 0 0 24 24 | 24 × 24 px | Open book |
| `waterfall-down-03-16.svg` | 0 0 14.333 13 | 14.333 × 13 px | Waterfall — listening/detection |
| `cards-01-16.svg` | 0 0 13 14.333 | 13 × 14.333 px | Flashcard stack — 16 slot |
| `check-list-16.svg` | 0 0 13.0001 11.6667 | 13.0001 × 11.6667 px | Checklist — recall-check item count |
| `peer-to-peer-02.svg` | 0 0 14.3336 13 | 14.3336 × 13 px | Peer learning |
| `mic-02.svg` | 0 0 14.8333 18.1667 | 14.8333 × 18.1667 px | Microphone / recording |

---

## Progress & Analytics

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `gauge-outer.svg` | 0 0 168 168 | 168 × 168 px | Readiness gauge — outer ring (full circle) |
| `gauge-progress.svg` | 0 0 84 164.342 | 84 × 164.342 px | Readiness gauge — blue arc (right half) |
| `target-02-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Target / accuracy icon — 16 slot |
| `chart-relationship-16.svg` | 0 0 10.8 11.6 | 10.8 × 11.6 px | Relationship chart |
| `chart-increase.svg` | 0 0 24 24 | 24 × 24 px | Chart — increase trend |
| `list-view-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | List view |

---

## Time & Scheduling

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `alarm-clock.svg` | 0 0 24 24 | 24 × 24 px | Alarm clock |
| `clock-01-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | Clock — 16 slot |
| `clock-03.svg` | 0 0 24 24 | 24 × 24 px | Clock — 24 slot |
| `hourglass.svg` | 0 0 24 24 | 24 × 24 px | Hourglass |
| `time-quarter-pass.svg` | 0 0 24 24 | 24 × 24 px | Quarter-past clock |

---

## General UI

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `help-circle-24.svg` | 0 0 21.5 21.5 | 21.5 × 21.5 px | Help / question icon — used in all screen navbars |
| `lock-01.svg` | 0 0 24 24 | 24 × 24 px | Padlock — hint/locked state indicator |
| `information-circle.svg` | 0 0 24 24 | 24 × 24 px | Info icon — 24 slot |
| `information-circle-20.svg` | 0 0 17.2 17.2 | 17.2 × 17.2 px | Info icon — 20 slot |
| `information-diamond-20.svg` | 0 0 18.6667 18.6667 | 18.6667 × 18.6667 px | Diamond information — incorrect answer |
| `search-01.svg` | 0 0 24 24 | 24 × 24 px | Search / magnifying glass |
| `cancel-01.svg` | 0 0 24 24 | 24 × 24 px | Cancel / close |
| `delete-02.svg` | 0 0 24 24 | 24 × 24 px | Delete / trash |
| `edit-02.svg` | 0 0 24 24 | 24 × 24 px | Edit / pencil |
| `share-01.svg` | 0 0 24 24 | 24 × 24 px | Share |
| `link-circle-02.svg` | 0 0 24 24 | 24 × 24 px | Link |
| `subtitle.svg` | 0 0 24 24 | 24 × 24 px | Subtitle / caption |
| `play.svg` | 0 0 24 24 | 24 × 24 px | Play button |
| `sleeping.svg` | 0 0 24 24 | 24 × 24 px | Sleep / rest |
| `flower-pot.svg` | 0 0 24 24 | 24 × 24 px | Wellness / habit |
| `laptop-performance.svg` | 0 0 24 24 | 24 × 24 px | Performance |
| `square-arrow-expand-01.svg` | 0 0 24 24 | 24 × 24 px | Expand |
| `tv-01-16.svg` | 0 0 14.333 14.333 | 14.333 × 14.333 px | TV / video — 16 slot |
| `smart-phone-01-16.svg` | 0 0 10.333 14.333 | 10.333 × 14.333 px | Mobile phone — 16 slot |

---

## Calendar & Planning

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `calendar-01.svg` | 0 0 24 24 | 24 × 24 px | Calendar |
| `calendar-02.svg` | 0 0 24 24 | 24 × 24 px | Calendar (alternate) |

---

## Standard Evolution — specific icons

| File | viewBox | Glyph w × h | Notes |
|---|---|---|---|
| `puzzle-24.svg` | 0 0 21.499 21.499 | 21.499 × 21.499 px | Puzzle piece — PRE-2014 era icon |
| `bank-24.svg` | 0 0 21.5003 21.5 | 21.5 × 21.5 px | Bank / institution building — 2014 RELEASE icon |
| `alert-02-24.svg` | 0 0 21.5 20.5 | 21.5 × 20.5 px | Alert triangle — warning/problem icon |
| `tap-05-16.svg` | 0 0 16.5 21.5001 | 16.5 × 21.5 px | Tap/finger gesture hint |
| `zoom-in-area-16.svg` | 0 0 14.3334 14.3334 | 14.3334 × 14.3334 px | Gradient zoom-area lens — Definition Matrix rows |
| `information-square-20.svg` | 0 0 17.0833 17.0833 | 17.0833 × 17.0833 px | Information square — case study reference |
| `lock-sync-02-20.svg` | 0 0 18.1667 18.1667 | 18.1667 × 18.1667 px | Lock-sync — disabled Definition Matrix continue |
| `phase-user-multiple-16.svg` | Figma original | 16 px slot | Phase Controller stage 1 |
| `phase-target-16.svg` | Figma original | 16 px slot | Phase Controller stage 2 |
| `phase-map-16.svg` | Figma original | 16 px slot | Phase Controller stage 3 |
| `phase-user-check-16.svg` | Figma original | 16 px slot | Phase Controller stage 4 |
| `phase-security-16.svg` | Figma original | 16 px slot | Phase Controller stage 5 |
| `phase-clock-16.svg` | Figma original | 16 px slot | Phase Controller stage 6 |
| `phase-pen-16.svg` | Figma original | 16 px slot | Phase Controller stage 7 |
| `phase-check-list-16.svg` | Figma original | 16 px slot | Phase Controller stage 8 |
| `phase-check-circle-16.svg` | Figma original | 16 px slot | Phase Controller stage 9 |
| `phase-locked-16.svg` | Figma original | 16 px slot | Phase Controller stage 10 |
| `swipe-left-20.svg` | Figma original | 20 px slot | Swipe-left guidance |
| `chevron-down-20.svg` | 0 0 11.2501 6.25004 | 11.25 × 6.25 px | Down chevron — accordion toggle |
