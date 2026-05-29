# CertSprints Prototype

Static HTML/CSS/JS prototype for the CertSprints onboarding and app experience.

## Structure

- `web/` - Static HTML/CSS/JS prototype. Open `web/index.html` or serve this folder locally.
- `web/assets/` - Images, icons, and Figma exports.
- `web/css/` - Shared web styles.
- `web/js/` - Shared web behavior and navigation.
- `docs/reference/` - Reference screenshots and design captures used during implementation.

## Local development

Run from `web/`:

```sh
node --check js/app.js
python3 -m http.server 4176
```

Then open `http://127.0.0.1:4176/index.html`.
